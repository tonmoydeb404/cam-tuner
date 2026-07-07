import { StreamPlugin } from "../types"
import type { Size } from "../utils/math"

export interface ProcessorEngine {
  start(): MediaStream
  stop(): void
  addPlugin(plugin: StreamPlugin<unknown>, config: unknown): void
  updatePluginConfig(pluginId: string, config: unknown): void
  removePlugin(pluginId: string): void
}

export class CanvasEngine implements ProcessorEngine {
  private outputStream: MediaStream | null = null
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private video: HTMLVideoElement
  private plugins: { plugin: StreamPlugin<unknown>; config: unknown }[] = []
  private isProcessing = false
  private requestVideoFrameCallbackId = 0
  private canvasTrack: CanvasCaptureMediaStreamTrack | null = null

  constructor(private inputStream: MediaStream) {
    this.video = document.createElement("video")
    this.video.srcObject = inputStream
    this.video.muted = true
    this.video.playsInline = true

    this.canvas = document.createElement("canvas")
    this.canvas.width = 640
    this.canvas.height = 480
    const context = this.canvas.getContext("2d", { alpha: false })
    if (!context) throw new Error("Could not get 2D context")
    this.ctx = context
  }

  start(): MediaStream {
    this.video.play().catch(console.error)
    this.isProcessing = true

    if ("requestVideoFrameCallback" in this.video) {
      this.frameLoop()
    } else {
      const polyfillLoop = () => {
        if (!this.isProcessing) return
        this.processFrame()
        requestAnimationFrame(polyfillLoop)
      }
      polyfillLoop()
    }

    this.outputStream = this.canvas.captureStream(0)
    this.canvasTrack =
      (this.outputStream.getVideoTracks()[0] as CanvasCaptureMediaStreamTrack | null) ??
      null
    return this.outputStream
  }

  private frameLoop = () => {
    if (!this.isProcessing) return
    this.processFrame()
    this.requestVideoFrameCallbackId = this.video.requestVideoFrameCallback(
      this.frameLoop
    )
  }

  private processFrame() {
    if (this.video.readyState < 2) return
    const sourceWidth = this.video.videoWidth
    const sourceHeight = this.video.videoHeight
    if (sourceWidth === 0 || sourceHeight === 0) return

    const sourceSize: Size = { width: sourceWidth, height: sourceHeight }

    // Let any plugin (e.g. background-filter) replace the raw <video> with a
    // composited source. prepareSource runs for ALL plugins first, chained in
    // insertion order, so the result is available to every drawCanvas call
    // regardless of plugin order.
    let effectiveSource: CanvasImageSource = this.video
    for (const { plugin, config } of this.plugins) {
      const next: CanvasImageSource | null | undefined = plugin.prepareSource?.(
        effectiveSource,
        config
      )
      if (next) effectiveSource = next
    }

    // Determine the desired output size. A plugin may declare a custom output
    // size (e.g. crop-zoom-align in non-letterbox mode resizing the canvas to
    // exactly the cropped region). The first plugin to return a non-null size
    // wins; otherwise we keep the output at the source resolution.
    let desired = sourceSize
    for (const { plugin, config } of this.plugins) {
      const size = plugin.getOutputSize?.(sourceSize, config)
      if (size) {
        desired = size
        break
      }
    }

    if (
      this.canvas.width !== desired.width ||
      this.canvas.height !== desired.height
    ) {
      this.canvas.width = desired.width
      this.canvas.height = desired.height
    }
    for (const { plugin, config } of this.plugins) {
      plugin.drawCanvas?.(
        this.ctx,
        effectiveSource,
        this.canvas.width,
        this.canvas.height,
        config
      )
    }
    this.canvasTrack?.requestFrame()
  }

  addPlugin(plugin: StreamPlugin<unknown>, config: unknown): void {
    this.plugins.push({ plugin, config })
  }

  updatePluginConfig(pluginId: string, diffConfig: unknown): void {
    const entry = this.plugins.find((p) => p.plugin.id === pluginId)
    if (entry) {
      entry.config = { ...(entry.config as object), ...(diffConfig as object) }
      entry.plugin.updateConfig?.(entry.config)
    }
  }

  removePlugin(pluginId: string): void {
    const index = this.plugins.findIndex((p) => p.plugin.id === pluginId)
    if (index !== -1) {
      this.plugins[index]?.plugin.destroy?.()
      this.plugins.splice(index, 1)
    }
  }

  stop(): void {
    this.isProcessing = false
    if (
      "cancelVideoFrameCallback" in this.video &&
      this.requestVideoFrameCallbackId
    ) {
      this.video.cancelVideoFrameCallback(this.requestVideoFrameCallbackId)
    }
    this.plugins.forEach(({ plugin }) => plugin.destroy?.())
    this.plugins = []
    if (this.outputStream) {
      this.outputStream.getTracks().forEach((t) => t.stop())
      this.outputStream = null
    }
    this.inputStream.getTracks().forEach((t) => t.stop())
    this.video.pause()
    this.video.srcObject = null
    this.video.remove()
  }
}
