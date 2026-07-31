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
const CAMTUNER_INJECT_ADAPTER = "camtuner:inject-adapter"
const CAMTUNER_ADAPTER_INJECTED = "camtuner:adapter-injected"

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
    // Some pages (e.g. Google Meet) enforce `require-trusted-types-for 'script'`
    // which blocks any plain string passed to a script-loading sink: Worker(),
    // importScripts(), script.src, etc.
    //
    // @mediapipe/tasks-vision bundles Google's Closure Library.  Closure wraps
    // script URLs in Xi(), a helper that produces a plain JS object:
    //   { g: <string | TrustedScriptURL>, toString() { return this.g + "" } }
    // When that object hits a TT sink, the browser calls toString() → gets a
    // plain string → enforcement blocks it.
    //
    // The Worker constructor runs in the main thread AND MediaPipe's Emscripten
    // runtime calls importScripts() *inside* the spawned Worker — both inherit
    // the page's TT enforcement.
    //
    // Fix A — "default" Trusted Types policy (broadest fix)
    // The "default" policy is the browser's last-resort fallback invoked
    // automatically whenever any TT sink (Worker(), importScripts(), script.src,
    // eval(), etc.) receives a plain string — including inside Workers that
    // inherit the page's enforcement.  We install it at document_start, before
    // any page script, so the slot is guaranteed empty.
    //
    // createScriptURL: allow any URL — the WASM runtime loads scripts from
    //   blob:, https://, and chrome-extension:// origins at runtime.
    // createScript:    allow any script string — chrome.scripting.executeScript
    //   with world:"MAIN" internally evaluates scripts; without this, the
    //   injection would be blocked and our adapters could never load.
    // createHTML:      intentionally absent → stays blocked, preserving the
    //   page's innerHTML/template-injection protections.
    ;(function installTrustedTypesDefaultPolicy() {
      const tt = (self as any).trustedTypes
      if (!tt?.createPolicy) return
      try {
        tt.createPolicy("default", {
          createScriptURL: (url: string) => url,
          createScript: (script: string) => script,
        })
      } catch {
        // "default" may already exist or be forbidden by the page's
        // trusted-types CSP directive.  The Worker patch below is the fallback.
      }
    })()

    // Fix B — duplicate createPolicy caching
    // If the page creates "goog#html" before MediaPipe runs (which Meet does),
    // MediaPipe's own createPolicy("goog#html") call throws and Xi() falls back
    // to raw strings.  Caching lets MediaPipe reuse the already-created policy
    // and produce proper TrustedScriptURL objects.
    ;(function patchTrustedTypesForDuplicatePolicies() {
      const tt = (self as any).trustedTypes
      if (!tt?.createPolicy) return
      const cache = new Map<string, unknown>()
      const original: (name: string, rules: unknown) => unknown =
        tt.createPolicy.bind(tt)
      try {
        tt.createPolicy = function (name: string, rules: unknown) {
          if (cache.has(name)) return cache.get(name)
          const policy = original(name, rules)
          cache.set(name, policy)
          return policy
        }
      } catch {
        // trustedTypes.createPolicy may be non-writable on some pages; ignore
      }
    })()

    // Fix C — Worker constructor patch
    // Secondary fallback for pages where the "default" policy slot is already
    // taken.  Unwraps Closure Library TrustedScriptURL wrappers (.g property)
    // and converts chrome-extension:// strings through a named policy so the
    // native Worker constructor receives a proper TrustedScriptURL.
    // Note: this does NOT cover importScripts() inside spawned Workers —
    // Fix A (default policy) is required for that case.
    ;(function patchWorkerForExtensionUrls() {
      const tt = (self as any).trustedTypes
      const NativeWorker = (self as any).Worker
      if (!tt || !NativeWorker) return

      let policy: { createScriptURL: (u: string) => unknown } | null = null
      for (const name of ["camtuner-wasm", "camtuner"]) {
        try {
          policy = tt.createPolicy(name, {
            createScriptURL: (url: string) => url,
          })
          break
        } catch {
          // Policy name forbidden by CSP or already taken — try next.
        }
      }
      if (!policy) return

      function resolveUrl(raw: unknown): unknown {
        // Closure Library wrapper: { g: <TrustedScriptURL | string> }
        if (raw != null && typeof raw === "object") {
          const inner = (raw as any).g
          if (inner != null) {
            if (tt.isScriptURL(inner)) return inner // native TrustedScriptURL
            if (
              typeof inner === "string" &&
              inner.startsWith("chrome-extension://")
            )
              return policy!.createScriptURL(inner)
          }
          return raw
        }
        if (typeof raw === "string" && raw.startsWith("chrome-extension://"))
          return policy!.createScriptURL(raw)
        return raw
      }

      function PatchedWorker(this: Worker, url: unknown, options?: unknown) {
        return new NativeWorker(resolveUrl(url), options)
      }
      PatchedWorker.prototype = NativeWorker.prototype
      Object.setPrototypeOf(PatchedWorker, NativeWorker)
      try {
        ;(self as any).Worker = PatchedWorker
      } catch {
        // Worker may be non-writable on some pages; ignore.
      }
    })()

    let enabled = true
    let currentConfig: TunerConfig = DEFAULT_TUNER_CONFIG
    let wasmUrl: string | null = null
    const activeModifiers: StreamModifier[] = []
    const trackToModifier = new WeakMap<MediaStreamTrack, StreamModifier>()
    let faceDetectorLoaded = false
    const backgroundAttached = new WeakSet<StreamModifier>()

    // Pending requests waiting for camtuner:adapter-injected responses.
    const pendingAdapterRequests = new Map<
      string,
      (ok: boolean, error?: string) => void
    >()
    let adapterReqCounter = 0

    // Request the ISOLATED-world bridge to inject an adapter file via
    // chrome.scripting.executeScript(), which bypasses the host page's CSP.
    // If the adapter's global is already present (injected earlier this
    // session) we resolve immediately without a round-trip.
    function injectAdapter(file: string): Promise<void> {
      const globalKeys: Record<string, string> = {
        "mediapipe-adapter.js": "__camtunerMediaPipeAdapter",
        "mediapipe-segmenter-adapter.js": "__camtunerSegmenterAdapter",
        "rvm-segmenter-adapter.js": "__camtunerRVMAdapter",
      }
      if ((self as any)[globalKeys[file]]) return Promise.resolve()

      const reqId = `adapter-${++adapterReqCounter}`
      return new Promise((resolve, reject) => {
        pendingAdapterRequests.set(reqId, (ok, error) => {
          if (ok) resolve()
          else
            reject(
              new Error(
                `Adapter injection failed: ${file}${error ? ` (${error})` : ""}`
              )
            )
        })
        window.postMessage(
          { type: CAMTUNER_INJECT_ADAPTER, file, reqId },
          window.location.origin
        )
        setTimeout(() => {
          if (pendingAdapterRequests.has(reqId)) {
            pendingAdapterRequests.delete(reqId)
            reject(new Error(`Adapter injection timed out: ${file}`))
          }
        }, 10_000)
      })
    }

    let factoryPromise: Promise<DetectorFactory> | null = null
    function loadDetectorFactory(): Promise<DetectorFactory> {
      if (!factoryPromise) {
        factoryPromise = injectAdapter("mediapipe-adapter.js").then(() => {
          const g = (self as any).__camtunerMediaPipeAdapter
          if (!g?.createMediaPipeFaceDetector)
            throw new Error(
              "__camtunerMediaPipeAdapter not set after injection"
            )
          return g.createMediaPipeFaceDetector as DetectorFactory
        })
      }
      return factoryPromise
    }

    let segmenterFactoryPromise: Promise<SegmenterFactory> | null = null
    function loadSegmenterFactory(): Promise<SegmenterFactory> {
      if (!segmenterFactoryPromise) {
        segmenterFactoryPromise = injectAdapter(
          "mediapipe-segmenter-adapter.js"
        ).then(() => {
          const g = (self as any).__camtunerSegmenterAdapter
          if (!g?.createMediaPipeSegmenter)
            throw new Error(
              "__camtunerSegmenterAdapter not set after injection"
            )
          return g.createMediaPipeSegmenter as SegmenterFactory
        })
      }
      return segmenterFactoryPromise
    }

    let rvmFactoryPromise: Promise<RVMSegmenterFactory> | null = null
    function loadRVMFactory(): Promise<RVMSegmenterFactory> {
      if (!rvmFactoryPromise) {
        rvmFactoryPromise = injectAdapter("rvm-segmenter-adapter.js").then(
          () => {
            const g = (self as any).__camtunerRVMAdapter
            if (!g?.createRVMSegmenter)
              throw new Error("__camtunerRVMAdapter not set after injection")
            return g.createRVMSegmenter as RVMSegmenterFactory
          }
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

      // Preserve audio tracks from the original stream — the modifier only
      // produces video output.
      for (const audioTrack of original.getAudioTracks()) {
        modifier.outputStream.addTrack(audioTrack)
        trackToModifier.set(audioTrack, modifier)
      }

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
      if (event.data?.type === CAMTUNER_ADAPTER_INJECTED) {
        const { reqId, ok, error } = event.data
        const resolver = pendingAdapterRequests.get(reqId)
        if (resolver) {
          pendingAdapterRequests.delete(reqId)
          resolver(ok === true, error)
        }
        return
      }

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
