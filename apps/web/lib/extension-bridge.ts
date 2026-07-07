/**
 * Bridge helpers for the web preview page to store/fetch background images
 * in extension storage via the ISOLATED-world content script.
 *
 * These are no-ops when the extension is not installed (the messages simply
 * go unanswered and the promises resolve with null/timeout fallbacks).
 */

function postAndWait(
  sendType: string,
  resultType: string,
  payload: Record<string, unknown>,
  timeoutMs = 5000
): Promise<Record<string, unknown> | null> {
  return new Promise((resolve) => {
    const reqId = `web-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const handler = (event: MessageEvent) => {
      if (
        event.data?.type === resultType &&
        event.data?.reqId === reqId
      ) {
        window.removeEventListener("message", handler)
        resolve(event.data as Record<string, unknown>)
      }
    }
    window.addEventListener("message", handler)
    window.postMessage(
      { type: sendType, reqId, ...payload },
      window.location.origin
    )
    setTimeout(() => {
      window.removeEventListener("message", handler)
      resolve(null)
    }, timeoutMs)
  })
}

export function fetchBgImage(id: string): Promise<string | null> {
  return postAndWait(
    "camtuner:fetch-bg",
    "camtuner:fetch-bg-result",
    { id }
  ).then((res) => (res?.dataUrl as string) ?? null)
}

export function storeBgImage(
  name: string,
  dataUrl: string,
  id?: string
): Promise<string | null> {
  return postAndWait("camtuner:store-bg", "camtuner:store-bg-result", {
    name,
    dataUrl,
    id,
  }).then((res) => (res?.id as string) ?? null)
}

export async function removeBgImage(id: string): Promise<void> {
  window.postMessage(
    { type: "camtuner:remove-bg", id },
    window.location.origin
  )
}
