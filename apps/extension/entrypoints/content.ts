import {
  getTunerConfig,
  selectedCameraLabel,
  setTunerConfig,
  tunerConfig,
  virtualCamEnabled,
} from "../lib/storage"

const CAMTUNER_EVENT = "camtuner:config-update"
const CAMTUNER_REQUEST = "camtuner:request-config"

function sendToPage(config: any, enabled: boolean, cameraLabel: string | null) {
  window.postMessage(
    { type: CAMTUNER_EVENT, config, enabled, cameraLabel },
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
  }
}
