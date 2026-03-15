import { getTunerConfig } from "../lib/storage"

let previewWrapper: HTMLDivElement | null = null

export default defineContentScript({
  matches: ["<all_urls>"],

  main(ctx) {
    browser.runtime.onMessage.addListener((message, sender) => {
      if (message.action === "showPreview") {
        showPreview(ctx)
      } else if (message.action === "hidePreview") {
        hidePreview()
      }
    })
  },
})

async function showPreview(ctx: any) {
  if (previewWrapper) {
    hidePreview()
    return
  }

  const config = await getTunerConfig()

  const configParams = new URLSearchParams({
    aspectRatio: config.aspectRatio,
    zoom: config.zoom.toString(),
    align: config.align,
    gridVisible: config.gridVisible.toString(),
  })

  const previewUrl = `http://localhost:3000/preview?${configParams.toString()}`

  previewWrapper = document.createElement("div")
  previewWrapper.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999998;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
  `

  const iframe = document.createElement("iframe")
  iframe.src = previewUrl
  iframe.allow = "camera"
  iframe.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1400px;
    height: 700px;
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
    z-index: 999999;
    border: 1px solid #e5e7eb;
  `

  previewWrapper.addEventListener("click", hidePreview)
  document.addEventListener("keydown", handleEscape)

  previewWrapper.appendChild(iframe)
  document.body.appendChild(previewWrapper)
}

function hidePreview() {
  if (previewWrapper) {
    previewWrapper.remove()
    previewWrapper = null
    document.removeEventListener("keydown", handleEscape)
  }
}

function handleEscape(e: KeyboardEvent) {
  if (e.key === "Escape") {
    hidePreview()
  }
}
