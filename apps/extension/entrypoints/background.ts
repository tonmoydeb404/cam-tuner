import { migrateFromV1 } from "../lib/migration"

export default defineBackground(() => {
  // Adapter injection: content scripts running in the MAIN world cannot use
  // dynamic import() on chrome-extension:// URLs when the host page enforces a
  // strict CSP (e.g. Google Meet).  chrome.scripting.executeScript() with
  // `world: "MAIN"` always bypasses the host page's CSP, so we handle these
  // requests from the ISOLATED-world bridge.
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (
      typeof message !== "object" ||
      message === null ||
      (message as Record<string, unknown>).type !== "inject-adapter"
    )
      return

    const { file } = message as { file: string }
    const tabId = sender.tab?.id

    if (typeof tabId !== "number") {
      sendResponse({ ok: false, error: "no tab id" })
      return
    }

    // browser.scripting.executeScript() with world:"MAIN" bypasses the host
    // page's CSP — unlike dynamic import() from the MAIN-world content script.
    ;(browser as any).scripting
      .executeScript({
        target: { tabId },
        files: [file],
        world: "MAIN",
      })
      .then(() => sendResponse({ ok: true }))
      .catch((err: unknown) => sendResponse({ ok: false, error: String(err) }))

    return true // keep message channel open for async response
  })

  browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === "install") {
      console.debug("CamTuner extension installed")
      const webUrl = import.meta.env.VITE_WEB_URL
      if (!webUrl) throw new Error("VITE_WEB_URL is not set")
      await browser.tabs.create({ url: `${webUrl}/preview?welcome=true` })
    } else if (details.reason === "update") {
      console.debug("CamTuner extension updated")
      await migrateFromV1()
      if (import.meta.env.DEV) return
      const webUrl = import.meta.env.VITE_WEB_URL
      if (!webUrl) throw new Error("VITE_WEB_URL is not set")
      const { version } = browser.runtime.getManifest()
      await browser.tabs.create({
        url: `${webUrl}/whats-new?version=${version}`,
      })
    }
  })
})
