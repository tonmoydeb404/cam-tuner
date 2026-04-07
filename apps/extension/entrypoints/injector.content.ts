import {
  createCropZoomAlignPlugin,
  createStreamModifier,
  CROP_ZOOM_ALIGN_PLUGIN_ID,
  DEFAULT_TUNER_CONFIG,
  type StreamModifier,
  type TunerConfig,
} from "@workspace/stream-config"

const CAMTUNER_EVENT = "camtuner:config-update"
const CAMTUNER_REQUEST = "camtuner:request-config"

export default defineContentScript({
  matches: ["*://*/*"],
  world: "MAIN",
  runAt: "document_start",
  main() {
    let enabled = false
    let currentConfig: TunerConfig = DEFAULT_TUNER_CONFIG
    const activeModifiers: StreamModifier[] = []

    // Promise that resolves once the isolated content script sends initial state.
    // getUserMedia calls are held until this resolves so we never miss a stream.
    let resolveInitialState!: () => void
    const initialStateReady = new Promise<void>((resolve) => {
      resolveInitialState = resolve
      // Safety timeout: if the content script never responds (e.g. not installed),
      // unblock getUserMedia after 1 second so the page still works.
      setTimeout(resolve, 1000)
    })

    function parseAspectRatio(ratio: string): number {
      if (ratio === "16:9") return 16 / 9
      if (ratio === "4:3") return 4 / 3
      if (ratio === "1:1") return 1
      if (ratio === "9:16") return 9 / 16
      return 16 / 9
    }

    function toPluginConfig(config: TunerConfig) {
      let alignX: "left" | "center" | "right" = "center"
      if (config.align.includes("left")) alignX = "left"
      else if (config.align.includes("right")) alignX = "right"

      let alignY: "top" | "center" | "bottom" = "center"
      if (config.align.includes("top")) alignY = "top"
      else if (config.align.includes("bottom")) alignY = "bottom"

      return {
        aspectRatio: parseAspectRatio(config.aspectRatio),
        zoom: config.zoom,
        alignX,
        alignY,
        barColor: config.barColor || "#000000",
      }
    }

    function processStream(original: MediaStream): MediaStream {
      const modifier = createStreamModifier(original, true)
      modifier.addPlugin(
        createCropZoomAlignPlugin(),
        toPluginConfig(currentConfig)
      )
      activeModifiers.push(modifier)
      return modifier.outputStream
    }

    // Override getUserMedia
    const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(
      navigator.mediaDevices
    )

    navigator.mediaDevices.getUserMedia = async function (
      constraints?: MediaStreamConstraints
    ) {
      // Wait for initial state from the isolated content script before deciding
      // whether to process the stream. Prevents missing streams on page load.
      await initialStateReady
      const stream = await originalGetUserMedia(constraints)
      if (!enabled || !constraints?.video) return stream
      return processStream(stream)
    }

    // Listen for config updates from the ISOLATED content script
    window.addEventListener("message", (event: MessageEvent) => {
      if (event.data?.type !== CAMTUNER_EVENT) return
      const { config, enabled: isEnabled } = event.data

      if (typeof isEnabled === "boolean") {
        enabled = isEnabled
      }

      if (config) {
        currentConfig = config
        for (const modifier of activeModifiers) {
          modifier.updatePluginConfig(
            CROP_ZOOM_ALIGN_PLUGIN_ID,
            toPluginConfig(currentConfig)
          )
        }
      }

      // Unblock any pending getUserMedia calls
      resolveInitialState()
    })

    // Request initial config from the ISOLATED content script
    window.dispatchEvent(new CustomEvent(CAMTUNER_REQUEST))
  },
})
