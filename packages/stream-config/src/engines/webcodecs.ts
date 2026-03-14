import { StreamPlugin } from "../types";
import { ProcessorEngine } from "./canvas";

export class WebCodecsEngine implements ProcessorEngine {
  private inputStream: MediaStream;
  private outputStream: MediaStream | null = null;
  private plugins: { plugin: StreamPlugin; config: any }[] = [];
  
  private trackProcessor: any | null = null;
  private trackGenerator: any | null = null;
  private abortController: AbortController | null = null;

  constructor(inputStream: MediaStream) {
    this.inputStream = inputStream;
  }

  start(): MediaStream {
    const videoTrack = this.inputStream.getVideoTracks()[0];
    if (!videoTrack) throw new Error("No video track found");

    // Initialize WebCodecs Insertable Streams
    // @ts-ignore
    this.trackProcessor = new MediaStreamTrackProcessor({ track: videoTrack });
    // @ts-ignore
    this.trackGenerator = new MediaStreamTrackGenerator({ kind: "video" });
    this.abortController = new AbortController();

    // Pipe the processor to the generator through a transformer
    const transformer = new TransformStream<any, any>({
      transform: (frame, controller) => {
        let currentFrame = frame;

        // Pass frame through all plugins
        try {
          for (const { plugin, config } of this.plugins) {
            if (plugin.transformFrame) {
              const newFrame = plugin.transformFrame(currentFrame, config);
              // if it returned a new frame, close the old one to free memory.
              if (newFrame !== currentFrame) {
                currentFrame.close();
                currentFrame = newFrame;
              }
            }
          }
          controller.enqueue(currentFrame);
        } catch (e) {
          console.error("Error in WebCodecs transform pipeline:", e);
          try {
             // Try to just emit the original frame if transform failed
             const fallbackFrame = new (globalThis as any).VideoFrame(currentFrame);
             controller.enqueue(fallbackFrame);
          } catch(e2) {
             controller.enqueue(currentFrame);
          }
        }
      }
    });

    this.trackProcessor.readable
      .pipeThrough(transformer, { signal: this.abortController.signal })
      .pipeTo(this.trackGenerator.writable)
      .catch((e: any) => {
        if (e.name !== 'AbortError') {
          console.error("WebCodecs Pipeline Error", e);
        }
      });

    this.outputStream = new MediaStream([this.trackGenerator]);
    return this.outputStream;
  }

  addPlugin(plugin: StreamPlugin<any>, config: any): void {
    this.plugins.push({ plugin, config });
  }

  updatePluginConfig(pluginId: string, diffConfig: any): void {
    const entry = this.plugins.find(p => p.plugin.id === pluginId);
    if (entry) {
      entry.config = { ...entry.config, ...diffConfig };
      if (entry.plugin.updateConfig) {
        entry.plugin.updateConfig(entry.config);
      }
    }
  }

  removePlugin(pluginId: string): void {
    const index = this.plugins.findIndex(p => p.plugin.id === pluginId);
    if (index !== -1) {
      const entry = this.plugins[index];
      if (entry && entry.plugin.destroy) entry.plugin.destroy();
      this.plugins.splice(index, 1);
    }
  }

  stop(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
    
    this.plugins.forEach(({ plugin }) => {
      if (plugin.destroy) plugin.destroy();
    });
    this.plugins = [];

    if (this.outputStream) {
      this.outputStream.getTracks().forEach(t => t.stop());
      this.outputStream = null;
    }
  }
}

/**
 * Checks if the browser natively supports the WebCodecs Insertable Streams API.
 */
export function isWebCodecsSupported(): boolean {
  return typeof (globalThis as any).MediaStreamTrackProcessor !== "undefined" && typeof (globalThis as any).MediaStreamTrackGenerator !== "undefined";
}
