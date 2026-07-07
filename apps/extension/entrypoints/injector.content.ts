import {
  BACKGROUND_PLUGIN_ID,
  BACKGROUND_PRESETS,
  createBackgroundPlugin,
  createStreamModifier,
  CROP_PLUGIN_ID,
  DEFAULT_TUNER_CONFIG,
  getFaceTrackingService,
  PLUGIN_REGISTRY,
  resolveBackgroundConfig,
  tunerConfigToCropConfig,
  type FaceDetector,
  type PersonSegmenter,
  type PluginContext,
  type StreamModifier,
  type TunerConfig,
} from "@workspace/stream-config"

const CAMTUNER_EVENT = "camtuner:config-update"
const CAMTUNER_REQUEST = "camtuner:request-config"
const CAMTUNER_FETCH_BG = "camtuner:fetch-bg"
const CAMTUNER_FETCH_BG_RESULT = "camtuner:fetch-bg-result"

const FACE_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite"

const SELFIE_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite"

type DetectorFactory = (options: {
  filesetUrl: string
  modelAssetPath: string
  delegate?: "CPU" | "GPU"
  minDetectionConfidence?: number
  minSuppressionThreshold?: number
}) => FaceDetector

type SegmenterFactory = (options: {
  filesetUrl: string
  modelAssetPath: string
  delegate?: "CPU" | "GPU"
}) => PersonSegmenter

type RVMSegmenterFactory = (options: { modelUrl: string }) => PersonSegmenter

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
    let faceDetectorLoaded = false
    const backgroundAttached = new WeakSet<StreamModifier>()

    let factoryPromise: Promise<DetectorFactory> | null = null
    function loadDetectorFactory(): Promise<DetectorFactory> {
      if (!factoryPromise) {
        if (!wasmUrl) {
          return Promise.reject(new Error("Extension URL not available"))
        }
        const adapterUrl = wasmUrl.replace("/wasm", "/mediapipe-adapter.js")
        factoryPromise = import(/* @vite-ignore */ adapterUrl).then(
          (m: any) => m.createMediaPipeFaceDetector as DetectorFactory
        )
      }
      return factoryPromise
    }

    let segmenterFactoryPromise: Promise<SegmenterFactory> | null = null
    function loadSegmenterFactory(): Promise<SegmenterFactory> {
      if (!segmenterFactoryPromise) {
        if (!wasmUrl) {
          return Promise.reject(new Error("Extension URL not available"))
        }
        const adapterUrl = wasmUrl.replace(
          "/wasm",
          "/mediapipe-segmenter-adapter.js"
        )
        segmenterFactoryPromise = import(/* @vite-ignore */ adapterUrl).then(
          (m: any) => m.createMediaPipeSegmenter as SegmenterFactory
        )
      }
      return segmenterFactoryPromise
    }

    let rvmFactoryPromise: Promise<RVMSegmenterFactory> | null = null
    function loadRVMFactory(): Promise<RVMSegmenterFactory> {
      if (!rvmFactoryPromise) {
        if (!wasmUrl) {
          return Promise.reject(new Error("Extension URL not available"))
        }
        const adapterUrl = wasmUrl.replace("/wasm", "/rvm-segmenter-adapter.js")
        rvmFactoryPromise = import(/* @vite-ignore */ adapterUrl).then(
          (m: any) => m.createRVMSegmenter as RVMSegmenterFactory
        )
      }
      return rvmFactoryPromise
    }

    // --- Background image resolution (presets load via data URLs; uploads
    // via a MAIN→ISOLATED round-trip since the MAIN world can't read extension
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
      // Presets are SVG data URLs bundled via BACKGROUND_PRESETS.
      if (imageId.startsWith("preset:")) {
        const preset = BACKGROUND_PRESETS.find((p) => p.id === imageId)
        if (!preset) return null
        return loadImage(preset.full)
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
      for (const track of modifier.outputStream.getTracks()) {
        trackToModifier.delete(track)
      }
      modifier.destroy()
      const idx = activeModifiers.indexOf(modifier)
      if (idx !== -1) activeModifiers.splice(idx, 1)
    }

    function faceTrackingActive(): boolean {
      return (
        currentConfig.centerStageEnabled === true ||
        currentConfig.zoomMode === "auto"
      )
    }

    async function reconcileFaceDetector(): Promise<void> {
      const want = faceTrackingActive()

      if (!want) {
        if (faceDetectorLoaded) {
          getFaceTrackingService().destroy()
          faceDetectorLoaded = false
        }
        return
      }

      if (faceDetectorLoaded || !wasmUrl) return
      faceDetectorLoaded = true

      try {
        const factory = await loadDetectorFactory()
        const detector = factory({
          filesetUrl: wasmUrl,
          modelAssetPath: FACE_MODEL_URL,
        })
        if (!faceTrackingActive()) {
          detector.destroy()
          faceDetectorLoaded = false
          return
        }
        getFaceTrackingService().init(detector)
      } catch (error) {
        faceDetectorLoaded = false
        console.error("[CamTuner] Face tracking failed to initialise:", error)
      }
    }

    function backgroundActive(): boolean {
      return (
        !!currentConfig.backgroundMode &&
        currentConfig.backgroundMode !== "none"
      )
    }

    async function reconcileBackground(
      modifier: StreamModifier
    ): Promise<void> {
      const want = backgroundActive()

      if (!want) {
        if (backgroundAttached.has(modifier)) {
          modifier.removePlugin(BACKGROUND_PLUGIN_ID)
          backgroundAttached.delete(modifier)
        }
        return
      }

      if (backgroundAttached.has(modifier) || !wasmUrl) return
      backgroundAttached.add(modifier)

      try {
        const rvmFactory = await loadRVMFactory()
        const modelUrl = wasmUrl!.replace("/wasm", "/rvm-mobilenetv3-fp32.onnx")
        const segmenter = rvmFactory({ modelUrl })
        if (
          !activeModifiers.includes(modifier) ||
          resolveBackgroundConfig({
            mode: currentConfig.backgroundMode,
            blurAmount: currentConfig.blurStrength,
            imageId: currentConfig.backgroundImage,
          }).mode === "none"
        ) {
          segmenter.destroy()
          backgroundAttached.delete(modifier)
          return
        }
        modifier.addPlugin(
          createBackgroundPlugin(segmenter, {
            resolveImage: resolveBackgroundImage,
          }),
          resolveBackgroundConfig({
            mode: currentConfig.backgroundMode,
            blurAmount: currentConfig.blurStrength,
            imageId: currentConfig.backgroundImage,
          })
        )
      } catch (error) {
        backgroundAttached.delete(modifier)
        console.error(
          "[CamTuner] Background effects failed to initialise:",
          error
        )
      }
    }

    function processStream(original: MediaStream): MediaStream {
      const modifier = createStreamModifier(original, true)
      const context: PluginContext = { modifier, wasmUrl: null }

      // Derive active plugins from the registry — removing a manifest here
      // immediately disables that plugin for all new streams.
      const sortedManifests = [...PLUGIN_REGISTRY]
        .filter((m) => !m.adapter)
        .sort((a, b) => a.executionOrder - b.executionOrder)

      for (const manifest of sortedManifests) {
        const plugin = manifest.createPlugin(context)
        const initialConfig =
          manifest.id === CROP_PLUGIN_ID
            ? tunerConfigToCropConfig(currentConfig)
            : manifest.configMapper(currentConfig)
        modifier.addPlugin(plugin, initialConfig)
      }

      for (const track of modifier.outputStream.getTracks()) {
        trackToModifier.set(track, modifier)
      }

      activeModifiers.push(modifier)
      void reconcileFaceDetector()
      void reconcileBackground(modifier)
      return modifier.outputStream
    }

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
      const { config, enabled: isEnabled, wasmUrl: url } = event.data

      if (typeof url === "string") wasmUrl = url

      if (typeof isEnabled === "boolean") {
        enabled = isEnabled
      }

      if (config) {
        currentConfig = config
        void reconcileFaceDetector()
        for (const modifier of activeModifiers) {
          void reconcileBackground(modifier)
          modifier.updatePluginConfig(
            "core:crop",
            tunerConfigToCropConfig(currentConfig)
          )
          modifier.updatePluginConfig("core:mirror", {
            mirror: currentConfig.mirror,
          })
          modifier.updatePluginConfig("core:zoom", {
            zoom: currentConfig.zoom,
            zoomMode: currentConfig.zoomMode ?? "fixed",
            autoZoomMin: currentConfig.autoZoomMin ?? 1,
            autoZoomMax: currentConfig.autoZoomMax ?? 2.5,
          })
          modifier.updatePluginConfig("core:align", {
            align: currentConfig.align,
            centerStageEnabled: currentConfig.centerStageEnabled ?? false,
          })
          modifier.updatePluginConfig(
            BACKGROUND_PLUGIN_ID,
            resolveBackgroundConfig({
              mode: currentConfig.backgroundMode,
              blurAmount: currentConfig.blurStrength,
              imageId: currentConfig.backgroundImage,
            })
          )
        }
      }

      resolveInitialState()
    })

    window.dispatchEvent(new CustomEvent(CAMTUNER_REQUEST))
  },
})
