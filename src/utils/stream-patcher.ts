import {
  StreamPatcherConfig,
  StreamPatcherOverlay,
  StreamPatcherSize,
} from "@/types/stream-patcher";
import { CanvasManager, type CanvasResource } from "./canvas-manager";
import { ConfettiOverlayManager } from "./confetti-overlay";
import { Logger } from "./log";
import { GlobalPerformanceMonitor } from "./performance-monitor";

function normalizeFilterValue(value?: number): number {
  if (typeof value !== "number") return 1;
  return Math.max(0, value) / 100;
}

/**
 * Performance Monitor for tracking rendering metrics
 */
class PerformanceMonitor {
  private frameCount = 0;
  private lastFpsTime = performance.now();
  private currentFps = 0;
  private dropCount = 0;
  private renderTimes: number[] = [];

  startFrame(): number {
    return performance.now();
  }

  endFrame(startTime: number): void {
    const renderTime = performance.now() - startTime;
    this.renderTimes.push(renderTime);

    // Keep only last 60 samples
    if (this.renderTimes.length > 60) {
      this.renderTimes.shift();
    }

    this.frameCount++;
    const now = performance.now();

    if (now - this.lastFpsTime >= 1000) {
      this.currentFps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsTime = now;
    }
  }

  recordDrop(): void {
    this.dropCount++;
  }

  getStats() {
    const avgRenderTime =
      this.renderTimes.length > 0
        ? this.renderTimes.reduce((a, b) => a + b, 0) / this.renderTimes.length
        : 0;

    return {
      fps: this.currentFps,
      avgRenderTime: Math.round(avgRenderTime * 100) / 100,
      droppedFrames: this.dropCount,
      maxRenderTime: Math.max(...this.renderTimes, 0),
    };
  }
}

/**
 * Smart Frame Rate Controller
 * Synchronizes rendering with video source and manages performance
 */
class FrameRateController {
  private targetFps: number = 30;
  private frameInterval: number;
  private lastFrameTime = 0;
  private animationId: number | null = null;
  private isActive = false;
  private monitor = new PerformanceMonitor();

  constructor(private video: HTMLVideoElement, private onFrame: () => void) {
    this.frameInterval = 1000 / this.targetFps;
    this.detectVideoFps();
  }

  private async detectVideoFps(): Promise<void> {
    try {
      // Try to get actual video framerate
      const track =
        this.video.srcObject instanceof MediaStream
          ? this.video.srcObject.getVideoTracks()[0]
          : null;

      if (track) {
        const settings = track.getSettings();
        if (settings.frameRate && settings.frameRate > 0) {
          this.targetFps = Math.min(settings.frameRate, 60); // Cap at 60fps
          this.frameInterval = 1000 / this.targetFps;
          Logger.dev(`Detected video FPS: ${this.targetFps}`);
        }
      }
    } catch (error) {
      Logger.dev("FPS detection failed, using default:", error);
    }
  }

  start(): void {
    if (this.isActive) return;
    this.isActive = true;
    this.lastFrameTime = performance.now();
    this.scheduleFrame();
  }

  stop(): void {
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private scheduleFrame = (): void => {
    if (!this.isActive) return;

    const now = performance.now();
    const elapsed = now - this.lastFrameTime;

    if (elapsed >= this.frameInterval) {
      const frameStart = this.monitor.startFrame();

      try {
        // Check if video is actually playing and has new frame
        if (this.video.readyState >= 2 && !this.video.paused) {
          this.onFrame();
          this.monitor.endFrame(frameStart);
        } else {
          this.monitor.recordDrop();
        }
      } catch (error) {
        Logger.dev("Frame render error:", error);
        this.monitor.recordDrop();
      }

      this.lastFrameTime = now;
    }

    this.animationId = requestAnimationFrame(this.scheduleFrame);
  };

  getStats() {
    return {
      targetFps: this.targetFps,
      ...this.monitor.getStats(),
    };
  }
}

/**
 * Configuration Cache for avoiding redundant calculations
 */
class ConfigCache {
  private cache = new Map<string, any>();

  get<T>(key: string, factory: () => T): T {
    if (!this.cache.has(key)) {
      this.cache.set(key, factory());
    }
    return this.cache.get(key);
  }

  invalidate(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  size(): number {
    return this.cache.size;
  }
}

function generateFilterString(config: StreamPatcherConfig): string {
  const brightness = normalizeFilterValue(config.brightness);
  const saturation = normalizeFilterValue(config.saturation);
  const contrast = normalizeFilterValue(config.contrast);

  return `brightness(${brightness}) saturate(${saturation}) contrast(${contrast})`;
}

function calculateOffest(
  original: StreamPatcherSize,
  modified: StreamPatcherSize,
  align: StreamPatcherConfig["align"] = "center"
) {
  let x = 0;

  if (align === "left") {
    x = 0;
  } else if (align === "right") {
    x = original.width - modified.width;
  } else {
    x = Math.floor((original.width - modified.width) / 2);
  }

  const y = Math.floor((original.height - modified.height) / 2);

  return { x, y };
}

function calculateCrop(size: StreamPatcherSize, aspectRatio?: number) {
  const { width, height } = size;

  if (typeof aspectRatio !== "number") {
    return {
      width: width,
      height: height,
      offsetX: 0,
      offsetY: 0,
    };
  }

  const originalAspect = width / height;
  let cropWidth = width;
  let cropHeight = height;

  if (originalAspect > aspectRatio) {
    cropWidth = Math.floor(height * aspectRatio);
  } else {
    cropHeight = Math.floor(width / aspectRatio);
  }

  Logger.dev(`Crop: ${cropWidth}x${cropHeight}`);
  return { width: cropWidth, height: cropHeight };
}

function calculateZoomedSize(size: StreamPatcherSize, zoom?: number) {
  if (typeof zoom !== "number" || zoom <= 1) {
    return { ...size };
  }

  const zoomWidth = Math.floor(size.width / zoom);
  const zoomHeight = Math.floor(size.height / zoom);

  Logger.dev(`zoom: ${zoomWidth}x${zoomHeight}`);

  return {
    width: zoomWidth,
    height: zoomHeight,
  };
}

/**
 * Optimized GIF Overlay Manager
 * Pre-calculates positioning and manages GIF lifecycle efficiently
 */
class GifOverlayManager {
  private gifVideo: HTMLVideoElement | null = null;
  private startTime = 0;
  private isCompleted = false;
  private cachedDimensions: {
    width: number;
    height: number;
    x: number;
    y: number;
  } | null = null;

  constructor(
    private overlay: StreamPatcherOverlay,
    private canvasSize: { width: number; height: number }
  ) {
    this.initializeGif();
  }

  private async initializeGif(): Promise<void> {
    if (!this.overlay.enabled || !this.overlay.mp4Url) return;

    this.gifVideo = document.createElement("video");
    this.gifVideo.crossOrigin = "anonymous";
    this.gifVideo.loop = true;
    this.gifVideo.muted = true;
    this.gifVideo.playsInline = true;
    this.gifVideo.autoplay = true;
    this.gifVideo.src = this.overlay.mp4Url;

    try {
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(
          () => reject(new Error("GIF load timeout")),
          5000
        );

        this.gifVideo!.addEventListener(
          "loadeddata",
          () => {
            clearTimeout(timeout);
            this.preCalculateDimensions();
            this.gifVideo!.play().catch(Logger.dev);
            resolve();
          },
          { once: true }
        );

        this.gifVideo!.addEventListener(
          "error",
          () => {
            clearTimeout(timeout);
            reject(new Error("GIF load failed"));
          },
          { once: true }
        );
      });
    } catch (error) {
      Logger.dev("GIF initialization failed:", error);
      this.cleanup();
    }
  }

  private preCalculateDimensions(): void {
    if (!this.gifVideo || !this.overlay.enabled) return;

    const aspectRatio = this.gifVideo.videoWidth / this.gifVideo.videoHeight;
    const baseSize =
      Math.min(this.canvasSize.width, this.canvasSize.height) * 0.2;

    const width = baseSize * aspectRatio * this.overlay.scale;
    const height = baseSize * this.overlay.scale;
    const x =
      (this.overlay.position.x / 100) * this.canvasSize.width - width / 2;
    const y =
      (this.overlay.position.y / 100) * this.canvasSize.height - height / 2;

    this.cachedDimensions = { width, height, x, y };
  }

  shouldRender(currentTime: number): boolean {
    if (!this.overlay.enabled || !this.gifVideo || this.isCompleted) {
      return false;
    }

    if (this.startTime === 0) {
      this.startTime = currentTime + this.overlay.delay * 1000;
    }

    const elapsed = (currentTime - this.startTime) / 1000;
    const isVisible = elapsed >= 0 && elapsed <= this.overlay.duration;

    if (elapsed > this.overlay.duration && !this.isCompleted) {
      this.isCompleted = true;
      this.gifVideo.pause();
      Logger.dev("GIF overlay completed");
    }

    return isVisible && this.gifVideo.readyState >= 2;
  }

  render(ctx: CanvasRenderingContext2D, currentTime: number): void {
    if (
      !this.shouldRender(currentTime) ||
      !this.cachedDimensions ||
      !this.gifVideo
    ) {
      return;
    }

    const previousAlpha = ctx.globalAlpha;
    ctx.globalAlpha = (this.overlay.opacity || 100) / 100;

    try {
      ctx.drawImage(
        this.gifVideo,
        this.cachedDimensions.x,
        this.cachedDimensions.y,
        this.cachedDimensions.width,
        this.cachedDimensions.height
      );
    } catch (error) {
      Logger.dev("GIF render error:", error);
    }

    ctx.globalAlpha = previousAlpha;
  }

  cleanup(): void {
    if (this.gifVideo) {
      this.gifVideo.pause();
      this.gifVideo.src = "";
      this.gifVideo = null;
    }
    this.cachedDimensions = null;
  }
}

/**
 * Stream Processing Context
 * Manages the complete lifecycle of stream processing
 */
class StreamProcessor {
  private canvasResource: CanvasResource;
  private frameController: FrameRateController;
  private gifManager: GifOverlayManager | null = null;
  private confettiManagers: Map<string, ConfettiOverlayManager> = new Map();
  private configCache = new ConfigCache();
  private isDisposed = false;
  private performanceMonitor = GlobalPerformanceMonitor.getInstance();
  private streamId: string;
  private errorCount = 0;
  private maxErrors = 10;
  private lastErrorTime = 0;
  private errorThrottleMs = 1000;

  constructor(
    private video: HTMLVideoElement,
    private crop: {
      width: number;
      height: number;
      offsetX: number;
      offsetY: number;
    },
    private config: StreamPatcherConfig,
    private overlay?: StreamPatcherOverlay
  ) {
    this.streamId = `stream_${Math.random().toString(36).substr(2, 9)}`;

    try {
      const canvasManager = CanvasManager.getInstance();
      this.canvasResource = canvasManager.getCanvas(crop.width, crop.height);

      this.setupCanvas();
      this.setupGifOverlay();

      this.frameController = new FrameRateController(video, this.renderFrame);

      // Register with performance monitor
      this.performanceMonitor.registerStream(this.streamId, {
        fps: 0,
        avgRenderTime: 0,
        droppedFrames: 0,
        maxRenderTime: 0,
        activeStreams: 1,
      });

      // Register with global confetti manager
      GlobalConfettiManager.getInstance().registerProcessor(this);

      Logger.dev(`StreamProcessor initialized: ${this.streamId}`);
    } catch (error) {
      Logger.dev("StreamProcessor construction failed:", error);
      throw error;
    }
  }

  private setupCanvas(): void {
    const { ctx } = this.canvasResource;

    // Apply cached filter string
    const filterKey = `filter_${JSON.stringify({
      b: this.config.brightness,
      s: this.config.saturation,
      c: this.config.contrast,
    })}`;

    ctx.filter = this.configCache.get(filterKey, () =>
      generateFilterString(this.config)
    );

    // Apply mirror transformation
    if (this.config.mirror) {
      ctx.scale(-1, 1);
      ctx.translate(-this.crop.width, 0);
    }
  }

  private setupGifOverlay(): void {
    if (this.overlay?.enabled) {
      this.gifManager = new GifOverlayManager(this.overlay, {
        width: this.crop.width,
        height: this.crop.height,
      });
    }
  }

  private renderFrame = (): void => {
    if (this.isDisposed) return;

    const { ctx } = this.canvasResource;
    const currentTime = performance.now();

    try {
      // Clear previous frame efficiently
      ctx.clearRect(0, 0, this.crop.width, this.crop.height);

      // Draw main video
      ctx.drawImage(
        this.video,
        this.crop.offsetX,
        this.crop.offsetY,
        this.crop.width,
        this.crop.height,
        0,
        0,
        this.crop.width,
        this.crop.height
      );

      // Draw GIF overlay if applicable
      if (this.gifManager) {
        this.gifManager.render(ctx, currentTime);
      }

      // Optimized confetti rendering - batch all confetti operations
      if (this.confettiManagers.size > 0) {
        const finishedConfetti: string[] = [];
        
        // Render all active confetti in one batch
        ctx.save(); // Single save for all confetti
        
        for (const [confettiId, confettiManager] of this.confettiManagers) {
          if (confettiManager.shouldRender(currentTime)) {
            confettiManager.render(ctx, currentTime);
          } else {
            finishedConfetti.push(confettiId);
          }
        }
        
        ctx.restore(); // Single restore for all confetti
        
        // Clean up finished confetti
        for (const confettiId of finishedConfetti) {
          const confettiManager = this.confettiManagers.get(confettiId);
          if (confettiManager) {
            confettiManager.cleanup();
            this.confettiManagers.delete(confettiId);
          }
        }
      }

      // Reset error count on successful render
      this.errorCount = 0;
    } catch (error) {
      this.handleRenderError(error);
    }
  };

  private handleRenderError(error: unknown): void {
    const now = performance.now();

    // Throttle error logging to prevent spam
    if (now - this.lastErrorTime > this.errorThrottleMs) {
      Logger.dev(`Render error in ${this.streamId}:`, error);
      this.lastErrorTime = now;
    }

    this.errorCount++;

    // If too many errors, dispose the processor to prevent resource waste
    if (this.errorCount >= this.maxErrors) {
      Logger.dev(`Too many errors in ${this.streamId}, disposing processor`);
      this.dispose();
      return;
    }

    // Try to recover from certain types of errors
    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase();

      // Handle canvas context loss
      if (errorMsg.includes("context") || errorMsg.includes("canvas")) {
        this.attemptCanvasRecovery();
      }

      // Handle video element issues
      if (errorMsg.includes("video") || errorMsg.includes("media")) {
        this.attemptVideoRecovery();
      }
    }
  }

  private attemptCanvasRecovery(): void {
    try {
      const canvasManager = CanvasManager.getInstance();
      const oldResource = this.canvasResource;

      // Try to get a new canvas resource
      this.canvasResource = canvasManager.getCanvas(
        this.crop.width,
        this.crop.height
      );
      this.setupCanvas();

      // Release the old resource
      canvasManager.releaseCanvas(oldResource);

      Logger.dev(`Canvas recovery successful for ${this.streamId}`);
    } catch (recoveryError) {
      Logger.dev(`Canvas recovery failed for ${this.streamId}:`, recoveryError);
    }
  }

  private attemptVideoRecovery(): void {
    try {
      // Check if video element is still valid
      if (this.video.readyState === 0) {
        // Video element lost its source, try to reload
        this.video.load();
      }

      Logger.dev(`Video recovery attempted for ${this.streamId}`);
    } catch (recoveryError) {
      Logger.dev(`Video recovery failed for ${this.streamId}:`, recoveryError);
    }
  }

  startConfetti(
    confettiId: string,
    config: {
      confettiType: string;
      colors: string[];
      intensity: number;
      duration: number;
    }
  ): void {
    if (this.isDisposed) return;

    const confettiManager = new ConfettiOverlayManager(config, {
      width: this.crop.width,
      height: this.crop.height,
    });

    confettiManager.start();
    this.confettiManagers.set(confettiId, confettiManager);

    Logger.dev(`Confetti started in ${this.streamId}: ${confettiId}`);
  }

  stopConfetti(confettiId: string): void {
    const confettiManager = this.confettiManagers.get(confettiId);
    if (confettiManager) {
      confettiManager.stop();
      confettiManager.cleanup();
      this.confettiManagers.delete(confettiId);
      Logger.dev(`Confetti stopped in ${this.streamId}: ${confettiId}`);
    }
  }

  clearAllConfetti(): void {
    this.confettiManagers.forEach((confettiManager) => {
      confettiManager.stop();
      confettiManager.cleanup();
    });
    this.confettiManagers.clear();
    Logger.dev(`All confetti cleared in ${this.streamId}`);
  }

  start(): HTMLCanvasElement {
    this.frameController.start();
    return this.canvasResource.canvas;
  }

  getStats() {
    const frameStats = this.frameController.getStats();
    const stats = {
      ...frameStats,
      cacheSize: this.configCache.size(),
      canvasStats: CanvasManager.getInstance().getStats(),
      errorCount: this.errorCount,
      streamId: this.streamId,
    };

    // Update global performance monitor
    this.performanceMonitor.updateMetrics(this.streamId, {
      fps: frameStats.fps,
      avgRenderTime: frameStats.avgRenderTime,
      droppedFrames: frameStats.droppedFrames,
      maxRenderTime: frameStats.maxRenderTime,
      activeStreams: 1,
    });

    return stats;
  }

  dispose(): void {
    if (this.isDisposed) return;
    this.isDisposed = true;

    try {
      // Stop frame controller
      this.frameController.stop();

      // Cleanup GIF overlay
      this.gifManager?.cleanup();

      // Cleanup all confetti overlays
      this.confettiManagers.forEach((confettiManager) => {
        confettiManager.cleanup();
      });
      this.confettiManagers.clear();

      // Unregister from global confetti manager
      GlobalConfettiManager.getInstance().unregisterProcessor(this);

      // Clear configuration cache
      this.configCache.invalidate();

      // Release canvas resource
      const canvasManager = CanvasManager.getInstance();
      canvasManager.releaseCanvas(this.canvasResource);

      // Unregister from performance monitor
      this.performanceMonitor.removeStream(this.streamId);

      Logger.dev(`StreamProcessor disposed: ${this.streamId}`);
    } catch (error) {
      Logger.dev(
        `Error during StreamProcessor disposal: ${this.streamId}`,
        error
      );
    }
  }
}

function applyCanvasProcessing({
  video,
  crop,
  config,
  overlay: gifOverlay,
}: {
  video: HTMLVideoElement;
  crop: { width: number; height: number; offsetX: number; offsetY: number };
  config: StreamPatcherConfig;
  overlay?: StreamPatcherOverlay;
}): { canvas: HTMLCanvasElement; processor: StreamProcessor } {
  const processor = new StreamProcessor(video, crop, config, gifOverlay);
  const canvas = processor.start();

  return { canvas, processor };
}

function setupVideoElement(track: MediaStreamTrack): HTMLVideoElement {
  const video = document.createElement("video");
  video.srcObject = new MediaStream([track]);
  video.muted = true;
  video.playsInline = true;
  video.autoplay = true;
  video.play().catch((err) => {
    Logger.dev("Video play error:", err);
  });
  return video;
}

/**
 * Global confetti manager for handling confetti triggers across all streams
 */
class GlobalConfettiManager {
  private static instance: GlobalConfettiManager;
  private processors: Set<StreamProcessor> = new Set();

  static getInstance(): GlobalConfettiManager {
    if (!GlobalConfettiManager.instance) {
      GlobalConfettiManager.instance = new GlobalConfettiManager();
    }
    return GlobalConfettiManager.instance;
  }

  registerProcessor(processor: StreamProcessor): void {
    this.processors.add(processor);
  }

  unregisterProcessor(processor: StreamProcessor): void {
    this.processors.delete(processor);
  }

  triggerConfetti(config: {
    confettiType: string;
    colors: string[];
    intensity: number;
    duration: number;
  }): void {
    const confettiId = `confetti_${Date.now()}`;
    Logger.dev("Triggering confetti for all active streams:", config);

    // Clear all existing confetti first to prevent stacking
    this.processors.forEach((processor) => {
      processor.clearAllConfetti();
    });

    // Start new confetti
    this.processors.forEach((processor) => {
      processor.startConfetti(confettiId, config);
    });

    // Auto-cleanup after duration
    setTimeout(() => {
      this.processors.forEach((processor) => {
        processor.stopConfetti(confettiId);
      });
    }, config.duration * 1000 + 1000);
  }
}

/**
 * Stream processors registry for cleanup management
 */
const activeProcessors = new WeakMap<MediaStream, StreamProcessor>();

export function streamPatcher(
  stream: MediaStream,
  size: StreamPatcherSize,
  config: StreamPatcherConfig = {},
  overlay: StreamPatcherOverlay | undefined = undefined,
  stopOriginalStream = false
): MediaStream {
  try {
    const videoTrack = stream.getVideoTracks()[0];
    if (!videoTrack) throw new Error("No video track found in stream.");

    const video = setupVideoElement(videoTrack);
    const crop = calculateCrop(size, config.aspectRatio);
    const zoom = calculateZoomedSize(crop, config.zoom);
    const offset = calculateOffest(size, zoom, config.align);
    // Filters are applied during canvas setup

    const { canvas, processor } = applyCanvasProcessing({
      video,
      crop: {
        ...zoom,
        offsetX: offset.x,
        offsetY: offset.y,
      },
      config,
      overlay: overlay,
    });

    // Create output stream with explicit framerate for better performance
    const targetFps = Math.min(30, (config as any).maxFps || 30);
    const outputStream = canvas.captureStream(targetFps);

    // Store processor reference for cleanup
    activeProcessors.set(outputStream, processor);

    // Enhanced cleanup management
    if (stopOriginalStream) {
      outputStream.getTracks().forEach((track: MediaStreamTrack) => {
        const originalStop = track.stop.bind(track);
        track.stop = () => {
          try {
            // Clean up processor resources
            const processor = activeProcessors.get(outputStream);
            if (processor) {
              processor.dispose();
              activeProcessors.delete(outputStream);
            }

            // Stop original stream
            stream.getTracks().forEach((t) => t.stop());
            Logger.dev("Stream and processor cleaned up successfully");
          } catch (err) {
            Logger.dev("Error during cleanup:", err);
          } finally {
            originalStop();
          }
        };
      });
    } else {
      // Set up cleanup for when output stream is stopped
      outputStream.getTracks().forEach((track: MediaStreamTrack) => {
        const originalStop = track.stop.bind(track);
        track.stop = () => {
          const processor = activeProcessors.get(outputStream);
          if (processor) {
            processor.dispose();
            activeProcessors.delete(outputStream);
          }
          originalStop();
        };
      });
    }

    // Log performance stats in development
    if (
      typeof process !== "undefined" &&
      process.env?.NODE_ENV === "development"
    ) {
      setTimeout(() => {
        const stats = processor.getStats();
        Logger.dev("Stream processor stats:", stats);
      }, 5000);
    }

    return outputStream;
  } catch (err) {
    Logger.dev("streamPatcher error:", err);
    return stream; // Fallback to original stream if something fails
  }
}

/**
 * Utility function to cleanup all active processors
 * Useful for extension cleanup or page navigation
 */
export function cleanupAllProcessors(): void {
  // Note: WeakMap doesn't have iteration methods
  // Processors will be cleaned up automatically when streams are garbage collected
  const canvasManager = CanvasManager.getInstance();
  canvasManager.dispose();
  Logger.dev("All stream processors cleanup initiated");
}

/**
 * Function to trigger confetti across all active video streams
 */
export function triggerGlobalConfetti(config: {
  confettiType: string;
  colors: string[];
  intensity: number;
  duration: number;
}): void {
  GlobalConfettiManager.getInstance().triggerConfetti(config);
}
