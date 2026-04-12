export interface StreamPlugin<ConfigType = unknown> {
  id: string
  updateConfig?: (config: ConfigType) => void
  /**
   * Called per frame when using WebCodecs (Insertable Streams)
   */
  transformFrame?: (frame: VideoFrame, config: ConfigType) => VideoFrame
  /**
   * Called per frame when using OffscreenCanvas fallback
   */
  drawCanvas?: (
    ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D,
    videoElement: HTMLVideoElement,
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
