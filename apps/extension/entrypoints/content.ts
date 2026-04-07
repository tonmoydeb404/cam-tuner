import {
  getTunerConfig,
  setTunerConfig,
  tunerConfig,
  virtualCamEnabled,
} from "../lib/storage"

const CAMTUNER_EVENT = "camtuner:config-update"
const CAMTUNER_REQUEST = "camtuner:request-config"

function sendToPage(config: any, enabled: boolean) {
  window.postMessage({ type: CAMTUNER_EVENT, config, enabled }, "*")
}

export default defineContentScript({
  matches: ["*://*/*"],
  main() {
    // Bridge: when the MAIN world requests initial config
    window.addEventListener(CAMTUNER_REQUEST, async () => {
      const [config, enabled] = await Promise.all([
        getTunerConfig(),
        virtualCamEnabled.getValue(),
      ])
      sendToPage(config, enabled)
    })

    // Bridge: sync config from web preview page to storage
    window.addEventListener("message", handleMessage)

    // Bridge: watch storage changes and forward to MAIN world
    tunerConfig.watch((config) => {
      virtualCamEnabled.getValue().then((enabled) => {
        sendToPage(config, enabled)
      })
    })

    virtualCamEnabled.watch((enabled) => {
      getTunerConfig().then((config) => {
        sendToPage(config, enabled)
      })
    })
  },
})

async function handleMessage(event: MessageEvent) {
  if (event.data.type === "syncConfig" && event.data.config) {
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
  }
}
