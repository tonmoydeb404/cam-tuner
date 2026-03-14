import { StreamPlugin } from "../types";

export interface ProcessorEngine {
  start(): MediaStream;
  stop(): void;
  addPlugin(plugin: StreamPlugin<any>, config: any): void;
  updatePluginConfig(pluginId: string, config: any): void;
  removePlugin(pluginId: string): void;
}

export class CanvasEngine implements ProcessorEngine {
  private outputStream: MediaStream | null = null;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private video: HTMLVideoElement;
  private plugins: { plugin: StreamPlugin; config: any }[] = [];
  private isProcessing = false;
  private requestVideoFrameCallbackId = 0;

  constructor(private inputStream: MediaStream) {
    // Setup invisible video tag to read stream frames
    this.video = document.createElement("video");
    this.video.srcObject = inputStream;
    this.video.muted = true;
    this.video.playsInline = true;
    
    // Default size, will be updated when metadata loads
    this.canvas = document.createElement("canvas");
    this.canvas.width = 640;
    this.canvas.height = 480;
    
    const context = this.canvas.getContext("2d", { alpha: false });
    if (!context) throw new Error("Could not get 2D context");
    this.ctx = context;
  }

  start(): MediaStream {
    this.video.play().catch(console.error);

    // Update canvas size to match original video exactly
    this.video.addEventListener("loadedmetadata", () => {
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;
    });

    // Start processing loop
    this.isProcessing = true;
    
    // We try to use requestVideoFrameCallback for maximum performance and power savings
    if ('requestVideoFrameCallback' in this.video) {
        this.frameLoop();
    } else {
        // Fallback for browsers that don't support requestVideoFrameCallback (e.g. old versions)
        const polyfillLoop = () => {
            if (!this.isProcessing) return;
            this.processFrame();
            requestAnimationFrame(polyfillLoop);
        };
        polyfillLoop();
    }
    
    // Capture stream at 30 fps
    this.outputStream = this.canvas.captureStream(30);
    return this.outputStream;
  }

  private frameLoop = () => {
    if (!this.isProcessing) return;
    this.processFrame();
    this.requestVideoFrameCallbackId = (this.video as any).requestVideoFrameCallback(this.frameLoop);
  }

  private processFrame() {
    if (this.video.readyState < 2 || this.canvas.width === 0) return;

    // Reset canvas (black background for letterbox)
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Apply all plugins in sequence
    // The crop-zoom plugin should draw the video element onto the canvas.
    for (const { plugin, config } of this.plugins) {
      if (plugin.drawCanvas) {
        plugin.drawCanvas(this.ctx, this.video, this.canvas.width, this.canvas.height, config);
      }
    }
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
    this.isProcessing = false;
    if ('requestVideoFrameCallback' in this.video && this.requestVideoFrameCallbackId) {
        // Attempt cancellation if possible (not strictly necessary since we check isProcessing)
    }

    this.plugins.forEach(({ plugin }) => {
      if (plugin.destroy) plugin.destroy();
    });
    this.plugins = [];

    if (this.outputStream) {
      this.outputStream.getTracks().forEach(t => t.stop());
      this.outputStream = null;
    }

    this.video.pause();
    this.video.srcObject = null;
    this.video.remove();
  }
}
