import {
  addBackgroundImage,
  backgroundImages,
  findBackgroundImage,
  getTunerConfig,
  removeBackgroundImage,
  selectedCameraLabel,
  setTunerConfig,
  tunerConfig,
  virtualCamEnabled,
} from "../lib/storage"

const CAMTUNER_EVENT = "camtuner:config-update"
const CAMTUNER_REQUEST = "camtuner:request-config"
const CAMTUNER_FETCH_BG = "camtuner:fetch-bg"
const CAMTUNER_FETCH_BG_RESULT = "camtuner:fetch-bg-result"
const CAMTUNER_REQUEST_BG_IMAGES = "camtuner:request-background-images"
const CAMTUNER_BG_IMAGES = "camtuner:background-images"

// Computed in the ISOLATED world (where browser.runtime is available) and
// forwarded to the MAIN world injector, which needs the local WASM / adapter /
// asset URLs for MediaPipe + matting + background presets but cannot access
// chrome.runtime itself.
const getURL = browser.runtime.getURL as (path: string) => string
const WASM_URL = getURL("wasm")
const MATTING_ADAPTER_URL = getURL("matting-adapter.js")
const ORT_WASM_URL = getURL("ort-wasm")
const BACKGROUNDS_URL = getURL("backgrounds")

function sendToPage(config: any, enabled: boolean, cameraLabel: string | null) {
  window.postMessage(
    {
      type: CAMTUNER_EVENT,
      config,
      enabled,
      cameraLabel,
      wasmUrl: WASM_URL,
      mattingAdapterUrl: MATTING_ADAPTER_URL,
      ortWasmUrl: ORT_WASM_URL,
      backgroundsUrl: BACKGROUNDS_URL,
    },
    window.location.origin
  )
}

export default defineContentScript({
  matches: ["*://*/*"],
  runAt: "document_start",
  main() {
    // Immediately push state so the MAIN world injector has it before getUserMedia fires
    Promise.all([
      getTunerConfig(),
      virtualCamEnabled.getValue(),
      selectedCameraLabel.getValue(),
    ]).then(([config, enabled, cameraLabel]) =>
      sendToPage(config, enabled, cameraLabel)
    )

    // Bridge: when the MAIN world requests initial config
    window.addEventListener(CAMTUNER_REQUEST, async () => {
      const [config, enabled, cameraLabel] = await Promise.all([
        getTunerConfig(),
        virtualCamEnabled.getValue(),
        selectedCameraLabel.getValue(),
      ])
      sendToPage(config, enabled, cameraLabel)
    })

    // Bridge: sync config from web preview page to storage
    window.addEventListener("message", (e) => handleMessage(e))

    // Bridge: web preview requests the background-image list
    window.addEventListener(CAMTUNER_REQUEST_BG_IMAGES, async () => {
      const images = await backgroundImages.getValue()
      sendBackgroundImagesToPage(images ?? [])
    })

    // Bridge: watch storage changes and forward to MAIN world
    tunerConfig.watch((config) => {
      Promise.all([
        virtualCamEnabled.getValue(),
        selectedCameraLabel.getValue(),
      ]).then(([enabled, cameraLabel]) =>
        sendToPage(config, enabled, cameraLabel)
      )
    })

    virtualCamEnabled.watch((enabled) => {
      Promise.all([getTunerConfig(), selectedCameraLabel.getValue()]).then(
        ([config, cameraLabel]) => sendToPage(config, enabled, cameraLabel)
      )
    })

    // Bridge: push background-image list to web preview whenever it changes
    // (covers popup additions/removals while the preview is open).
    backgroundImages.watch((images) => {
      sendBackgroundImagesToPage(images ?? [])
    })
  },
})

function sendBackgroundImagesToPage(images: unknown[]) {
  window.postMessage(
    { type: CAMTUNER_BG_IMAGES, images },
    window.location.origin
  )
}

async function handleMessage(event: MessageEvent) {
  // Only accept messages from the same origin to prevent XSS via rogue iframes
  if (event.origin !== window.location.origin) return

  // MAIN-world injector requesting an uploaded background image (it can't read
  // extension storage directly). Resolve from storage.local and reply.
  if (event.data?.type === CAMTUNER_FETCH_BG) {
    const { id, reqId } = event.data as { id: string; reqId: string }
    let dataUrl: string | null = null
    try {
      const stored = await findBackgroundImage(id)
      if (stored) dataUrl = stored.dataUrl
    } catch (error) {
      console.error("[CamTuner] Failed to resolve background image:", error)
    }
    window.postMessage(
      { type: CAMTUNER_FETCH_BG_RESULT, reqId, dataUrl },
      event.origin
    )
    return
  }

  if (event.data?.type === "syncConfig" && event.data.config) {
    try {
      await setTunerConfig(event.data.config)
      window.postMessage({ type: "syncConfigSuccess" }, event.origin)
    } catch (error) {
      console.error("Failed to sync config:", error)
      window.postMessage(
        { type: "syncConfigError", error: "Failed to save config" },
        event.origin
      )
    }
    return
  }

  if (event.data?.type === "syncCameraLabel") {
    try {
      await selectedCameraLabel.setValue(event.data.label ?? null)
    } catch (error) {
      console.error("Failed to sync camera label:", error)
    }
    return
  }

  // Web preview adding a background image → store. The backgroundImages.watch()
  // listener will push the updated list back to the page automatically.
  if (event.data?.type === "camtuner:add-background-image") {
    const { name, dataUrl, tempId } = event.data as {
      name: string
      dataUrl: string
      tempId?: string
    }
    try {
      await addBackgroundImage(name, dataUrl, tempId)
    } catch (error) {
      console.error("[CamTuner] Failed to add background image:", error)
    }
    return
  }

  // Web preview removing a background image → delete from storage.
  if (event.data?.type === "camtuner:remove-background-image") {
    const { id } = event.data as { id: string }
    try {
      await removeBackgroundImage(id)
    } catch (error) {
      console.error("[CamTuner] Failed to remove background image:", error)
    }
  }
}
