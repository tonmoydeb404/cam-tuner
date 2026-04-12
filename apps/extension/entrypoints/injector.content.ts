import {
  createCropZoomAlignPlugin,
  createStreamModifier,
  CROP_ZOOM_ALIGN_PLUGIN_ID,
  DEFAULT_TUNER_CONFIG,
  tunerConfigToCropConfig,
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
    let enabled = true
    let currentConfig: TunerConfig = DEFAULT_TUNER_CONFIG
    const activeModifiers: StreamModifier[] = []

    let resolveInitialState!: () => void
    const initialStateReady = new Promise<void>((resolve) => {
      resolveInitialState = resolve
      setTimeout(resolve, 1000)
    })

    function processStream(original: MediaStream): MediaStream {
      const modifier = createStreamModifier(original, true)
      modifier.addPlugin(
        createCropZoomAlignPlugin(),
        tunerConfigToCropConfig(currentConfig)
      )
      activeModifiers.push(modifier)
      return modifier.outputStream
    }

    const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(
      navigator.mediaDevices
    )

    // Expose on window so the cam-tuner web app can bypass the patch
    // and access the truly raw camera stream when needed.
    ;(window as any).__camtuner_getUserMedia = originalGetUserMedia

    navigator.mediaDevices.getUserMedia = async function (
      constraints?: MediaStreamConstraints
    ) {
      await initialStateReady
      const stream = await originalGetUserMedia(constraints)
      if (!enabled || !constraints?.video) return stream
      return processStream(stream)
    }

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
            tunerConfigToCropConfig(currentConfig)
          )
        }
      }

      resolveInitialState()
    })

    window.dispatchEvent(new CustomEvent(CAMTUNER_REQUEST))
  },
})
