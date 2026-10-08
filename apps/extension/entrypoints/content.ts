import {
  addBackgroundImage,
  findBackgroundImage,
  removeBackgroundImage,
  resolveEffectiveSettings,
  selectedCameraLabel,
  setTunerConfig,
  siteSettings,
  tunerConfig,
  virtualCamEnabled,
} from "../lib/storage"

const CAMTUNER_EVENT = "camtuner:config-update"
const CAMTUNER_REQUEST = "camtuner:request-config"
const CAMTUNER_FETCH_BG = "camtuner:fetch-bg"
const CAMTUNER_FETCH_BG_RESULT = "camtuner:fetch-bg-result"
const CAMTUNER_STORE_BG = "camtuner:store-bg"
const CAMTUNER_REMOVE_BG = "camtuner:remove-bg"
const CAMTUNER_STREAM_STATE = "camtuner:stream-state"

// Computed in the ISOLATED world (where browser.runtime is available) and
// forwarded to the MAIN world injector, which needs the local WASM / adapter
// URLs for MediaPipe (Center Stage) but cannot access chrome.runtime itself.
const getURL = browser.runtime.getURL as (path: string) => string
const WASM_URL = getURL("wasm")

function sendToPage(config: any, enabled: boolean, cameraLabel: string | null) {
  window.postMessage(
    {
      type: CAMTUNER_EVENT,
      config,
      enabled,
      cameraLabel,
      wasmUrl: WASM_URL,
    },
    window.location.origin
  )
}

// Resolve global ⊕ this origin's per-site settings and forward the result to
// the MAIN world injector (which is config-agnostic).
async function pushEffective() {
  const [{ config, enabled }, cameraLabel] = await Promise.all([
    resolveEffectiveSettings(window.location.origin),
    selectedCameraLabel.getValue(),
  ])
  sendToPage(config, enabled, cameraLabel)
}

export default defineContentScript({
  matches: ["*://*/*"],
  runAt: "document_start",
  main() {
    // Idempotency guard — this script is also injected manually into
    // already-open tabs on install/update (see background.ts).
    const w = window as any
    if (w.__camtunerBridgeInstalled) return
    w.__camtunerBridgeInstalled = true

    // Immediately push state so the MAIN world injector has it before getUserMedia fires
    pushEffective()

    // Bridge: when the MAIN world requests initial config
    window.addEventListener(CAMTUNER_REQUEST, () => {
      pushEffective()
    })

    // Bridge: sync config from web preview page to storage
    window.addEventListener("message", (e) => handleMessage(e))

    // Bridge: watch storage changes and forward to MAIN world
    tunerConfig.watch(() => pushEffective())
    virtualCamEnabled.watch(() => pushEffective())
    siteSettings.watch(() => pushEffective())
  },
})

async function handleMessage(event: MessageEvent) {
  // Only accept messages from the same origin to prevent XSS via rogue iframes
  if (event.origin !== window.location.origin) return

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

  // Bridge: forward the MAIN world's camera stream state to the background
  // so the popup can show whether the current page's camera is tuned.
  if (event.data?.type === CAMTUNER_STREAM_STATE) {
    const { tuned, reason, warning } = event.data
    if (
      tuned === null ||
      typeof tuned === "boolean" ||
      typeof warning === "string"
    ) {
      await browser.runtime
        .sendMessage({ type: "camtuner:stream-state", tuned, reason, warning })
        .catch(() => {})
    }
    return
  }

  // Bridge: MAIN-world injector requests adapter script injection via the
  // background service worker (which bypasses host-page CSP).
  if (event.data?.type === "camtuner:inject-adapter") {
    const { file, reqId } = event.data as { file: string; reqId: string }
    // Allowlist prevents a malicious page script from triggering injection of
    // arbitrary extension files.
    const ALLOWED_ADAPTERS = [
      "mediapipe-adapter.js",
      "mediapipe-segmenter-adapter.js",
      "rvm-segmenter-adapter.js",
    ]
    if (!ALLOWED_ADAPTERS.includes(file)) return
    browser.runtime
      .sendMessage({ type: "inject-adapter", file })
      .then((result: unknown) => {
        const ok = (result as Record<string, unknown>)?.ok === true
        const error = (result as Record<string, unknown>)?.error
        window.postMessage(
          { type: "camtuner:adapter-injected", reqId, ok, error },
          window.location.origin
        )
      })
      .catch((error: unknown) => {
        window.postMessage(
          {
            type: "camtuner:adapter-injected",
            reqId,
            ok: false,
            error: String(error),
          },
          window.location.origin
        )
      })
    return
  }

  if (event.data?.type === CAMTUNER_FETCH_BG) {
    const { id, reqId } = event.data
    try {
      const stored = await findBackgroundImage(id)
      window.postMessage(
        {
          type: CAMTUNER_FETCH_BG_RESULT,
          reqId,
          dataUrl: stored?.dataUrl ?? null,
        },
        window.location.origin
      )
    } catch (error) {
      console.error("Failed to fetch background image:", error)
      window.postMessage(
        {
          type: CAMTUNER_FETCH_BG_RESULT,
          reqId,
          dataUrl: null,
        },
        window.location.origin
      )
    }
    return
  }

  if (event.data?.type === CAMTUNER_STORE_BG) {
    const { name, dataUrl, id } = event.data
    try {
      const storedId = await addBackgroundImage(name, dataUrl, id)
      window.postMessage(
        { type: "camtuner:store-bg-result", id: storedId },
        window.location.origin
      )
    } catch (error) {
      console.error("Failed to store background image:", error)
    }
    return
  }

  if (event.data?.type === CAMTUNER_REMOVE_BG) {
    const { id } = event.data
    try {
      await removeBackgroundImage(id)
    } catch (error) {
      console.error("Failed to remove background image:", error)
    }
    return
  }
}
