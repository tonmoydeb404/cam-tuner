import { StreamPlugin } from "../types"
import { ProcessorEngine } from "./canvas"

export class WebCodecsEngine implements ProcessorEngine {
  private inputStream: MediaStream
  private outputStream: MediaStream | null = null
  private plugins: { plugin: StreamPlugin<unknown>; config: unknown }[] = []

  private trackProcessor: MediaStreamTrackProcessor | null = null
  private trackGenerator: MediaStreamTrackGenerator | null = null
  private abortController: AbortController | null = null

  constructor(inputStream: MediaStream) {
    this.inputStream = inputStream
  }

  start(): MediaStream {
    const videoTrack = this.inputStream.getVideoTracks()[0]
    if (!videoTrack) throw new Error("No video track found")

    // Initialize WebCodecs Insertable Streams
    this.trackProcessor = new MediaStreamTrackProcessor({ track: videoTrack })
    this.trackGenerator = new MediaStreamTrackGenerator({ kind: "video" })
    this.abortController = new AbortController()

    // Pipe the processor to the generator through a transformer
    const transformer = new TransformStream<VideoFrame, VideoFrame>({
      transform: (frame, controller) => {
        let currentFrame = frame

        // Pass frame through all plugins
        try {
          for (const { plugin, config } of this.plugins) {
            if (plugin.transformFrame) {
              const newFrame = plugin.transformFrame(currentFrame, config)
              // if it returned a new frame, close the old one to free memory.
              if (newFrame !== currentFrame) {
                currentFrame.close()
                currentFrame = newFrame
              }
            }
          }
          controller.enqueue(currentFrame)
        } catch (e) {
          console.error("Error in WebCodecs transform pipeline:", e)
          // Try to enqueue a clone; if the frame was already closed by the
          // failing plugin this will also throw and we silently drop the frame.
          try {
            const fallbackFrame = new VideoFrame(currentFrame)
            controller.enqueue(fallbackFrame)
          } catch {
            // Frame is unusable, drop it silently
          }
        }
      },
    })

    this.trackProcessor.readable
      .pipeThrough(transformer, { signal: this.abortController.signal })
      .pipeTo(this.trackGenerator.writable)
      .catch((e: unknown) => {
        if (e instanceof Error && e.name !== "AbortError") {
          console.error("WebCodecs Pipeline Error", e)
        }
      })

    this.outputStream = new MediaStream([this.trackGenerator])
    return this.outputStream
  }

  addPlugin(plugin: StreamPlugin<unknown>, config: unknown): void {
    this.plugins.push({ plugin, config })
  }

  updatePluginConfig(pluginId: string, diffConfig: unknown): void {
    const entry = this.plugins.find((p) => p.plugin.id === pluginId)
    if (entry) {
      entry.config = { ...(entry.config as object), ...(diffConfig as object) }
      if (entry.plugin.updateConfig) {
        entry.plugin.updateConfig(entry.config)
      }
    }
  }

  removePlugin(pluginId: string): void {
    const index = this.plugins.findIndex((p) => p.plugin.id === pluginId)
    if (index !== -1) {
      const entry = this.plugins[index]
      if (entry && entry.plugin.destroy) entry.plugin.destroy()
      this.plugins.splice(index, 1)
    }
  }

  stop(): void {
    if (this.abortController) {
      this.abortController.abort()
    }

    this.plugins.forEach(({ plugin }) => {
      if (plugin.destroy) plugin.destroy()
    })
    this.plugins = []

    if (this.outputStream) {
      this.outputStream.getTracks().forEach((t) => t.stop())
      this.outputStream = null
    }
  }
}

/**
 * Checks if the browser natively supports the WebCodecs Insertable Streams API.
 */
export function isWebCodecsSupported(): boolean {
  return (
    typeof MediaStreamTrackProcessor !== "undefined" &&
    typeof MediaStreamTrackGenerator !== "undefined"
  )
}
