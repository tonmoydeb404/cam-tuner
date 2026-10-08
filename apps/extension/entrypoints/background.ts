import { migrateFromV1 } from "../lib/migration"

const BADGE_COLOR = "#16a34a"

// Scripts injected manually into already-open tabs on install/update, in
// order: the ISOLATED bridge first so it can answer the injector's
// config request as soon as it starts.
const EXISTING_TAB_SCRIPTS = [
  { file: "content-scripts/content.js", world: "ISOLATED" as const },
  { file: "content-scripts/injector.js", world: "MAIN" as const },
]

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

  // Per-tab camera stream state reported by the page bridge. The badge shows
  // "ON" only while a camera stream is actually flowing through CamTuner
  // (camera open AND tuning active) — not merely because settings say on.
  // Absent = no camera open (or unknown since the worker last restarted).
  type StreamInfo = {
    tuned?: boolean
    reason?: "disabled" | "camera"
    warning?: "tracking" | "background"
  }
  const streamStates = new Map<number, StreamInfo>()

  async function updateBadge(tabId: number) {
    const active = streamStates.get(tabId)?.tuned === true
    await browser.action
      .setBadgeText({ tabId, text: active ? "ON" : "" })
      .catch(() => {})
  }

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (typeof message !== "object" || message === null) return
    const msg = message as Record<string, unknown>

    if (msg.type === "camtuner:stream-state") {
      const tabId = sender.tab?.id
      if (typeof tabId !== "number") return
      if (msg.tuned === null) {
        // Camera closed — clear the tab's state and badge.
        streamStates.delete(tabId)
        void updateBadge(tabId)
        return
      }
      const info: StreamInfo = { ...(streamStates.get(tabId) ?? {}) }
      if (typeof msg.tuned === "boolean") {
        // A fresh stream resets any stale warning.
        info.tuned = msg.tuned
        info.reason =
          msg.reason === "disabled" || msg.reason === "camera"
            ? msg.reason
            : undefined
        info.warning = undefined
      }
      if (msg.warning === "tracking" || msg.warning === "background") {
        info.warning = msg.warning
      }
      if (info.tuned !== undefined || info.warning !== undefined) {
        streamStates.set(tabId, info)
        void updateBadge(tabId)
      }
      return
    }

    if (msg.type === "camtuner:get-stream-state") {
      const tabId = msg.tabId
      sendResponse({
        state:
          typeof tabId === "number" ? (streamStates.get(tabId) ?? null) : null,
      })
      return
    }
  })

  browser.tabs.onRemoved.addListener((tabId) => {
    streamStates.delete(tabId)
  })

  // Navigating away invalidates the previous page's camera state.
  browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (
      (changeInfo.url || changeInfo.status === "loading") &&
      streamStates.delete(tabId)
    ) {
      void updateBadge(tabId)
    }
  })

  browser.action.setBadgeBackgroundColor({ color: BADGE_COLOR })

  // MV3 only auto-injects content scripts into pages loaded after
  // install/update — open tabs (e.g. an ongoing call) would otherwise need a
  // manual refresh. Both scripts are idempotent (window flag guards), so
  // tabs that already have them are unaffected.
  async function injectIntoExistingTabs() {
    const tabs = await browser.tabs
      .query({ url: ["http://*/*", "https://*/*"] })
      .catch(() => [])
    for (const tab of tabs) {
      if (typeof tab.id !== "number") continue
      for (const script of EXISTING_TAB_SCRIPTS) {
        await (browser as any).scripting
          .executeScript({
            target: { tabId: tab.id },
            files: [script.file],
            world: script.world,
          })
          .catch(() => {
            // Restricted pages (Web Store, chrome://, etc.) — skip.
          })
      }
    }
  }

  browser.runtime.onInstalled.addListener(async (details) => {
    await injectIntoExistingTabs()

    if (details.reason === "install") {
      console.debug("CamTuner extension installed")
      const webUrl = import.meta.env.VITE_WEB_URL
      if (!webUrl) {
        console.warn("VITE_WEB_URL is not set — skipping welcome page")
        return
      }
      await browser.tabs.create({ url: `${webUrl}/preview?welcome=true` })
    } else if (details.reason === "update") {
      console.debug("CamTuner extension updated")
      await migrateFromV1()
      if (import.meta.env.DEV) return
      const webUrl = import.meta.env.VITE_WEB_URL
      if (!webUrl) {
        console.warn("VITE_WEB_URL is not set — skipping whats-new page")
        return
      }
      const { version } = browser.runtime.getManifest()
      await browser.tabs.create({
        url: `${webUrl}/whats-new?version=${version}`,
      })
    }
  })
})
