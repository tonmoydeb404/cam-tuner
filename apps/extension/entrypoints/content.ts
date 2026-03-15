import { setTunerConfig } from "../lib/storage"

export default defineContentScript({
  matches: ["*://*/*"],
  main(ctx) {
    window.addEventListener("message", handleMessage)
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
