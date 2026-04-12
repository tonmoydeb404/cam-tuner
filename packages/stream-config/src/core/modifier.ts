import { CanvasEngine, ProcessorEngine } from "../engines/canvas"
import { WebCodecsEngine, isWebCodecsSupported } from "../engines/webcodecs"
import { StreamModifier, StreamPlugin } from "../types"

export class CoreStreamModifier implements StreamModifier {
  private engine: ProcessorEngine
  public outputStream: MediaStream

  constructor(originalStream: MediaStream, preferCanvas: boolean = false) {
    // 1. Choose engine based on support and preference
    if (isWebCodecsSupported() && !preferCanvas) {
      this.engine = new WebCodecsEngine(originalStream)
    } else {
      this.engine = new CanvasEngine(originalStream)
    }

    // 2. Start the engine and get the piped output stream
    this.outputStream = this.engine.start()
  }

  updatePluginConfig<T>(pluginId: string, config: Partial<T>): void {
    this.engine.updatePluginConfig(pluginId, config)
  }

  addPlugin<C>(plugin: StreamPlugin<C>, initialConfig?: C): void {
    this.engine.addPlugin(plugin as StreamPlugin<unknown>, initialConfig)
  }

  removePlugin(pluginId: string): void {
    this.engine.removePlugin(pluginId)
  }

  destroy(): void {
    this.engine.stop()
  }
}

/**
 * Creates a stream modifier instance that natively edits the stream using plugins.
 *
 * @param originalStream The original MediaStream from getUserMedia
 * @param preferCanvas Force the canvas fallback instead of using WebCodecs
 * @returns An instance of StreamModifier
 */
export function createStreamModifier(
  originalStream: MediaStream,
  preferCanvas: boolean = false
): StreamModifier {
  return new CoreStreamModifier(originalStream, preferCanvas)
}
