export type Scope = "global" | "site"

export type StreamInfo = {
  tuned?: boolean
  reason?: "disabled" | "camera"
  warning?: "tracking" | "background"
}

export type ActiveTab = { tabId: number; origin: string } | null

export async function getActiveTab(): Promise<ActiveTab> {
  try {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    })
    if (!tab?.url || typeof tab.id !== "number") return null
    const url = new URL(tab.url)
    if (url.protocol !== "https:" && url.protocol !== "http:") return null
    return { tabId: tab.id, origin: url.origin }
  } catch {
    return null
  }
}

export function hostnameOf(origin: string): string {
  try {
    return new URL(origin).hostname
  } catch {
    return origin
  }
}
