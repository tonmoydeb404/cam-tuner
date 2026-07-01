import {
  BACKGROUND_EFFECTS_PLUGIN_ID,
  CENTER_STAGE_PLUGIN_ID,
  createBackgroundEffectsPlugin,
  createCenterStagePlugin,
  createCropZoomAlignPlugin,
  createStreamModifier,
  CROP_ZOOM_ALIGN_PLUGIN_ID,
  DEFAULT_BACKGROUND_CONFIG,
  DEFAULT_TUNER_CONFIG,
  resolveBackgroundConfig,
  tunerConfigToCropConfig,
  type BackgroundConfig,
  type BackgroundQuality,
  type FaceDetector,
  type MatteProvider,
  type StreamModifier,
  type TunerConfig,
} from "@workspace/stream-config"

const CAMTUNER_EVENT = "camtuner:config-update"
const CAMTUNER_REQUEST = "camtuner:request-config"
const CAMTUNER_FETCH_BG = "camtuner:fetch-bg"
const CAMTUNER_FETCH_BG_RESULT = "camtuner:fetch-bg-result"

// BlazeFace short-range model (data file — fetched at runtime; CDN has open CORS).
const FACE_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite"

// Selfie segmenter (MediaPipe binary fallback matte). Open-CORS CDN.
const SELFIE_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite"

// Robust Video Matting (high-quality matte). Sourced from a community mirror;
// if unreachable, the resolver degrades to the MediaPipe backend.
const RVM_MODEL_URL =
  "https://huggingface.co/PengAB/robust-video-matting/resolve/main/rvm_mobilenetv3_fp32.onnx"

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
    let backgroundsUrl: string | null = null
    let mattingAdapterUrl: string | null = null
    let ortWasmUrl: string | null = null
    const activeModifiers: StreamModifier[] = []
    const trackToModifier = new WeakMap<MediaStreamTrack, StreamModifier>()
    const centerStageAttached = new WeakSet<StreamModifier>()
    const backgroundAttached = new WeakSet<StreamModifier>()

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

    // Lazily-loaded matting backend (RVM or MediaPipe). Bundled separately so
    // the heavy ONNX runtime is only fetched when a background effect is on.
    type CreateMatteProviderFn = (options: {
      quality: BackgroundQuality
      filesetUrl: string
      selfieModelUrl: string
      rvmModelUrl?: string
      ortWasmPaths?: string
    }) => Promise<{ provider: MatteProvider; backend: string }>
    let matteFactoryPromise: Promise<CreateMatteProviderFn> | null = null
    function loadMatteFactory(): Promise<CreateMatteProviderFn> {
      if (!matteFactoryPromise) {
        if (!mattingAdapterUrl || !wasmUrl) {
          return Promise.reject(new Error("Extension URL not available"))
        }
        matteFactoryPromise = import(
          /* @vite-ignore */ mattingAdapterUrl
        ).then((m: any) => m.createMatteProvider as CreateMatteProviderFn)
      }
      return matteFactoryPromise
    }

    // --- Background image resolution (presets load directly; uploads via
    // a MAIN→ISOLATED round-trip since the MAIN world can't read extension
    // storage). -----------------------------------------------------------
    const pendingBgRequests = new Map<
      string,
      (dataUrl: string | null) => void
    >()
    let bgReqCounter = 0
    function requestUploadedImage(id: string): Promise<string | null> {
      const reqId = `bg-${++bgReqCounter}`
      return new Promise((resolve) => {
        pendingBgRequests.set(reqId, resolve)
        window.postMessage(
          { type: CAMTUNER_FETCH_BG, id, reqId },
          window.location.origin
        )
        // Time out so a missing image never blocks compositing indefinitely.
        setTimeout(() => {
          if (pendingBgRequests.has(reqId)) {
            pendingBgRequests.delete(reqId)
            resolve(null)
          }
        }, 5000)
      })
    }
    function loadImage(src: string): Promise<HTMLImageElement | null> {
      return new Promise((resolve) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => resolve(img)
        img.onerror = () => resolve(null)
        img.src = src
      })
    }
    async function resolveBackgroundImage(
      imageId: string
    ): Promise<CanvasImageSource | null> {
      // Presets are bundled web_accessible_resources — load by direct URL.
      if (imageId.startsWith("preset:")) {
        if (!backgroundsUrl) return null
        return loadImage(`${backgroundsUrl}/${imageId.slice("preset:".length)}`)
      }
      // Uploads live in extension storage — fetch via the ISOLATED bridge.
      const dataUrl = await requestUploadedImage(imageId)
      if (!dataUrl) return null
      return loadImage(dataUrl)
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
    // Framing (centerStageEnabled) and auto-zoom (zoomMode === "auto") are
    // independent channels sharing one detector, so the plugin is wanted while
    // either is active. Async because the MediaPipe adapter chunk + WASM load
    // on first enable.
    function centerStageActive(): boolean {
      return (
        currentConfig.centerStageEnabled === true ||
        currentConfig.zoomMode === "auto"
      )
    }

    async function reconcileCenterStage(modifier: StreamModifier): Promise<void> {
      const want = centerStageActive()

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
        // Re-check after the async gap: stream may have ended or both channels
        // been toggled off.
        if (!activeModifiers.includes(modifier) || !centerStageActive()) {
          detector.destroy()
          centerStageAttached.delete(modifier)
          return
        }
        modifier.addPlugin(
          createCenterStagePlugin(modifier, detector, {
            enabled: currentConfig.centerStageEnabled === true,
            zoomMode: currentConfig.zoomMode ?? "fixed",
            minZoom: currentConfig.autoZoomMin ?? 1,
            maxZoom: currentConfig.autoZoomMax ?? 2.5,
          }),
          {
            enabled: currentConfig.centerStageEnabled === true,
            zoomMode: currentConfig.zoomMode ?? "fixed",
            minZoom: currentConfig.autoZoomMin ?? 1,
            maxZoom: currentConfig.autoZoomMax ?? 2.5,
          }
        )
      } catch (error) {
        centerStageAttached.delete(modifier) // allow a later retry
        console.error("[CamTuner] Center Stage failed to initialise:", error)
      }
    }

    // Attaches/detaches the background-effects plugin to match currentConfig.
    // Async because the matting adapter chunk + model load on first enable.
    async function reconcileBackground(modifier: StreamModifier): Promise<void> {
      const bg = resolveBackgroundConfig(currentConfig.background)
      const want = bg.mode !== "none"

      if (!want) {
        if (backgroundAttached.has(modifier)) {
          modifier.removePlugin(BACKGROUND_EFFECTS_PLUGIN_ID)
          backgroundAttached.delete(modifier)
        }
        return
      }

      if (backgroundAttached.has(modifier) || !mattingAdapterUrl) return
      backgroundAttached.add(modifier) // claim early to avoid duplicate loads

      try {
        const factory = await loadMatteFactory()
        const { provider } = await factory({
          quality: bg.quality,
          filesetUrl: wasmUrl!,
          selfieModelUrl: SELFIE_MODEL_URL,
          rvmModelUrl: RVM_MODEL_URL,
          ortWasmPaths: ortWasmUrl ?? undefined,
        })
        // Re-check after the async gap: stream may have ended or been toggled off.
        if (
          !activeModifiers.includes(modifier) ||
          resolveBackgroundConfig(currentConfig.background).mode === "none"
        ) {
          provider.destroy()
          backgroundAttached.delete(modifier)
          return
        }
        modifier.addPlugin(
          createBackgroundEffectsPlugin(provider, {
            resolveImage: resolveBackgroundImage,
          }),
          bg
        )
      } catch (error) {
        backgroundAttached.delete(modifier) // allow a later retry
        console.error("[CamTuner] Background effects failed to initialise:", error)
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
      void reconcileBackground(modifier)
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
      // Upload image round-trip responses arrive here from the ISOLATED bridge.
      if (event.data?.type === CAMTUNER_FETCH_BG_RESULT) {
        const { reqId, dataUrl } = event.data
        const resolve = pendingBgRequests.get(reqId)
        if (resolve) {
          pendingBgRequests.delete(reqId)
          resolve(typeof dataUrl === "string" ? dataUrl : null)
        }
        return
      }

      if (event.data?.type !== CAMTUNER_EVENT) return
      const {
        config,
        enabled: isEnabled,
        wasmUrl: url,
        backgroundsUrl: bgUrl,
        mattingAdapterUrl: mUrl,
        ortWasmUrl: oUrl,
      } = event.data

      if (typeof url === "string") wasmUrl = url
      if (typeof bgUrl === "string") backgroundsUrl = bgUrl
      if (typeof mUrl === "string") mattingAdapterUrl = mUrl
      if (typeof oUrl === "string") ortWasmUrl = oUrl

      if (typeof isEnabled === "boolean") {
        enabled = isEnabled
      }

      if (config) {
        currentConfig = config
        const bg = resolveBackgroundConfig(currentConfig.background)
        for (const modifier of activeModifiers) {
          void reconcileCenterStage(modifier)
          void reconcileBackground(modifier)
          modifier.updatePluginConfig(
            CROP_ZOOM_ALIGN_PLUGIN_ID,
            tunerConfigToCropConfig(currentConfig)
          )
          // Live-update background settings (mode, blur, image, quality).
          modifier.updatePluginConfig<BackgroundConfig>(
            BACKGROUND_EFFECTS_PLUGIN_ID,
            bg
          )
          // Live-update Center Stage channels (framing flag + auto-zoom mode/bounds).
          modifier.updatePluginConfig(CENTER_STAGE_PLUGIN_ID, {
            enabled: currentConfig.centerStageEnabled === true,
            zoomMode: currentConfig.zoomMode ?? "fixed",
            minZoom: currentConfig.autoZoomMin ?? 1,
            maxZoom: currentConfig.autoZoomMax ?? 2.5,
          })
        }
      }

      resolveInitialState()
    })

    window.dispatchEvent(new CustomEvent(CAMTUNER_REQUEST))
  },
})
