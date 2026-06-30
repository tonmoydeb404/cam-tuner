import {
  CENTER_STAGE_PLUGIN_ID,
  createCenterStagePlugin,
  createCropZoomAlignPlugin,
  createStreamModifier,
  CROP_ZOOM_ALIGN_PLUGIN_ID,
  DEFAULT_TUNER_CONFIG,
  tunerConfigToCropConfig,
  type FaceDetector,
  type StreamModifier,
  type TunerConfig,
} from "@workspace/stream-config"

const CAMTUNER_EVENT = "camtuner:config-update"
const CAMTUNER_REQUEST = "camtuner:request-config"

// BlazeFace short-range model (data file — fetched at runtime; CDN has open CORS).
const FACE_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite"

type DetectorFactory = (options: {
  filesetUrl: string
  modelAssetPath: string
  delegate?: "CPU" | "GPU"
  minDetectionConfidence?: number
  minSuppressionThreshold?: number
}) => FaceDetector

export default defineContentScript({
  matches: ["*://*/*"],
  world: "MAIN",
  runAt: "document_start",
  main() {
    let enabled = true
    let currentConfig: TunerConfig = DEFAULT_TUNER_CONFIG
    let wasmUrl: string | null = null
    const activeModifiers: StreamModifier[] = []
    const trackToModifier = new WeakMap<MediaStreamTrack, StreamModifier>()
    const centerStageAttached = new WeakSet<StreamModifier>()

    // Lazily-loaded MediaPipe adapter. WXT builds content scripts as IIFE,
    // which inlines dynamic imports — so we use @vite-ignore to prevent Vite
    // from bundling it, and load the pre-built standalone ESM adapter via its
    // extension URL at runtime. The ~146KB MediaPipe runtime is fetched ONLY
    // when Center Stage is first enabled.
    let factoryPromise: Promise<DetectorFactory> | null = null
    function loadDetectorFactory(): Promise<DetectorFactory> {
      if (!factoryPromise) {
        if (!wasmUrl) {
          return Promise.reject(new Error("Extension URL not available"))
        }
        const adapterUrl = wasmUrl.replace("/wasm", "/mediapipe-adapter.js")
        factoryPromise = import(
          /* @vite-ignore */ adapterUrl
        ).then((m: any) => m.createMediaPipeFaceDetector as DetectorFactory)
      }
      return factoryPromise
    }

    let resolveInitialState!: () => void
    const initialStateReady = new Promise<void>((resolve) => {
      resolveInitialState = resolve
      setTimeout(resolve, 1000)
    })

    function cleanupModifier(modifier: StreamModifier) {
      // Remove all tracks from mapping first to prevent re-entrancy
      for (const track of modifier.outputStream.getTracks()) {
        trackToModifier.delete(track)
      }
      modifier.destroy()
      const idx = activeModifiers.indexOf(modifier)
      if (idx !== -1) activeModifiers.splice(idx, 1)
    }

    // Attaches/detaches the Center Stage plugin to match currentConfig.
    // Async because the MediaPipe adapter chunk + WASM load on first enable.
    async function reconcileCenterStage(modifier: StreamModifier): Promise<void> {
      const want = currentConfig.centerStageEnabled === true

      if (!want) {
        if (centerStageAttached.has(modifier)) {
          modifier.removePlugin(CENTER_STAGE_PLUGIN_ID)
          centerStageAttached.delete(modifier)
        }
        return
      }

      if (centerStageAttached.has(modifier) || !wasmUrl) return
      centerStageAttached.add(modifier) // claim early to avoid duplicate loads

      try {
        const factory = await loadDetectorFactory()
        const detector = factory({
          filesetUrl: wasmUrl,
          modelAssetPath: FACE_MODEL_URL,
        })
        // Re-check after the async gap: stream may have ended or been toggled off.
        if (
          !activeModifiers.includes(modifier) ||
          currentConfig.centerStageEnabled !== true
        ) {
          detector.destroy()
          centerStageAttached.delete(modifier)
          return
        }
        modifier.addPlugin(
          createCenterStagePlugin(modifier, detector, { enabled: true }),
          { enabled: true }
        )
      } catch (error) {
        centerStageAttached.delete(modifier) // allow a later retry
        console.error("[CamTuner] Center Stage failed to initialise:", error)
      }
    }

    function processStream(original: MediaStream): MediaStream {
      const modifier = createStreamModifier(original, true)

      modifier.addPlugin(
        createCropZoomAlignPlugin(),
        tunerConfigToCropConfig(currentConfig)
      )

      for (const track of modifier.outputStream.getTracks()) {
        trackToModifier.set(track, modifier)
      }

      activeModifiers.push(modifier)
      void reconcileCenterStage(modifier)
      return modifier.outputStream
    }

    // Intercept track.stop() so we can release the raw camera stream
    // when a site (e.g. Google Meet) stops the tracks we gave it.
    const originalTrackStop = MediaStreamTrack.prototype.stop
    MediaStreamTrack.prototype.stop = function () {
      const modifier = trackToModifier.get(this)
      originalTrackStop.call(this)

      if (modifier) {
        const allEnded = modifier.outputStream
          .getTracks()
          .every((t) => t.readyState === "ended")
        if (allEnded) {
          cleanupModifier(modifier)
        }
      }
    }

    const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(
      navigator.mediaDevices
    )

    // Expose on window so the cam-tuner web app can bypass the patch
    // and access the truly raw camera stream when needed.
    ;(window as any).__camtuner_getUserMedia = originalGetUserMedia

    navigator.mediaDevices.getUserMedia = async function (
      constraints?: MediaStreamConstraints
    ) {
      await initialStateReady
      const stream = await originalGetUserMedia(constraints)
      if (!enabled || !constraints?.video) return stream
      return processStream(stream)
    }

    window.addEventListener("message", (event: MessageEvent) => {
      if (event.data?.type !== CAMTUNER_EVENT) return
      const { config, enabled: isEnabled, wasmUrl: url } = event.data

      if (typeof url === "string") wasmUrl = url

      if (typeof isEnabled === "boolean") {
        enabled = isEnabled
      }

      if (config) {
        currentConfig = config
        for (const modifier of activeModifiers) {
          void reconcileCenterStage(modifier)
          modifier.updatePluginConfig(
            CROP_ZOOM_ALIGN_PLUGIN_ID,
            tunerConfigToCropConfig(currentConfig)
          )
        }
      }

      resolveInitialState()
    })

    window.dispatchEvent(new CustomEvent(CAMTUNER_REQUEST))
  },
})
