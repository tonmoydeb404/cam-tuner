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
    const trackToModifier = new WeakMap<MediaStreamTrack, StreamModifier>()

    let resolveInitialState!: () => void
    const initialStateReady = new Promise<void>((resolve) => {
      resolveInitialState = resolve
      setTimeout(resolve, 1000)
    })

    function cleanupModifier(modifier: StreamModifier) {
      // Remove all tracks from mapping first to prevent re-entrancy
      for (const track of modifier.outputStream.getTracks()) {
        trackToModifier.delete(track)
      }
      modifier.destroy()
      const idx = activeModifiers.indexOf(modifier)
      if (idx !== -1) activeModifiers.splice(idx, 1)
    }

    function processStream(original: MediaStream): MediaStream {
      const modifier = createStreamModifier(original, true)
      modifier.addPlugin(
        createCropZoomAlignPlugin(),
        tunerConfigToCropConfig(currentConfig)
      )

      for (const track of modifier.outputStream.getTracks()) {
        trackToModifier.set(track, modifier)
      }

      activeModifiers.push(modifier)
      return modifier.outputStream
    }

    // Intercept track.stop() so we can release the raw camera stream
    // when a site (e.g. Google Meet) stops the tracks we gave it.
    const originalTrackStop = MediaStreamTrack.prototype.stop
    MediaStreamTrack.prototype.stop = function () {
      const modifier = trackToModifier.get(this)
      originalTrackStop.call(this)

      if (modifier) {
        const allEnded = modifier.outputStream
          .getTracks()
          .every((t) => t.readyState === "ended")
        if (allEnded) {
          cleanupModifier(modifier)
        }
      }
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
