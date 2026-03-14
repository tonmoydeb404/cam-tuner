export interface StreamPlugin<ConfigType = any> {
  id: string;
  updateConfig?: (config: ConfigType) => void;
  /**
   * Called per frame when using WebCodecs (Insertable Streams)
   */
  transformFrame?: (frame: any, config: any) => any;
  /**
   * Called per frame when using OffscreenCanvas fallback
   */
  drawCanvas?: (
    ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D,
    videoElement: HTMLVideoElement,
    width: number,
    height: number,
    config: any
  ) => void;
  /**
   * Clean up any internal resources when plugin is removed or modifier is destroyed.
   */
  destroy?: () => void;
}

export type StreamModifier = {
  outputStream: MediaStream;
  updatePluginConfig: <T>(pluginId: string, config: Partial<T>) => void;
  addPlugin: (plugin: StreamPlugin<any>, initialConfig?: any) => void;
  removePlugin: (pluginId: string) => void;
  destroy: () => void;
};
