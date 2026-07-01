import type { Size } from "./math"

export interface StreamPlugin<ConfigType = unknown> {
  id: string
  updateConfig?: (config: ConfigType) => void
  /**
   * Declares the desired output canvas dimensions for a given source frame
   * size and config. Returning a non-null Size lets a plugin (e.g. the
   * crop-zoom-align plugin in non-letterbox mode) resize the output stream
   * to exactly the cropped region. Returning null/undefined keeps the output
   * at the source resolution.
   *
   * Only consumed by canvas-based engines.
   */
  getOutputSize?: (sourceSize: Size, config: ConfigType) => Size | null
  /**
   * Transforms the frame SOURCE before any plugin draws, letting a plugin
   * (e.g. background-effects) replace the raw `<video>` with a composited
   * canvas. The engine runs every plugin's `prepareSource` in insertion order,
   * chaining results (each receives the previous plugin's output), BEFORE
   * resolving the output size and calling `drawCanvas`.
   *
   * Return null/undefined to keep the current source unchanged (zero cost).
   * Only consumed by canvas-based engines.
   */
  prepareSource?: (
    source: CanvasImageSource,
    config: ConfigType
  ) => CanvasImageSource | null
  /**
   * Called per frame when using WebCodecs (Insertable Streams)
   */
  transformFrame?: (frame: VideoFrame, config: ConfigType) => VideoFrame
  /**
   * Called per frame when using OffscreenCanvas fallback. The `source` is the
   * effective frame to draw — normally the raw `<video>`, but if a plugin
   * returned a composited source via `prepareSource`, this is that source.
   */
  drawCanvas?: (
    ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D,
    source: CanvasImageSource,
    width: number,
    height: number,
    config: ConfigType
  ) => void
  /**
   * Clean up any internal resources when plugin is removed or modifier is destroyed.
   */
  destroy?: () => void
}

export type StreamModifier = {
  outputStream: MediaStream
  updatePluginConfig: <T>(pluginId: string, config: Partial<T>) => void
  addPlugin: <C>(plugin: StreamPlugin<C>, initialConfig?: C) => void
  removePlugin: (pluginId: string) => void
  destroy: () => void
}
