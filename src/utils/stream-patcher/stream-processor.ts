import {
  StreamConfettiConfig,
  StreamCropConfig,
  StreamFilterConfig,
  StreamMediaOverlayConfig,
  StreamPlaceholderConfig,
} from "@/utils/stream-patcher/types";
import { Logger } from "../log";
import { CanvasManager, type CanvasResource } from "./canvas-manager";
import { ConfettiOverlayManager } from "./confetti-overlay";
import { ConfigCache } from "./config-cache";
import { FrameRateController } from "./frame-rate-controller";
import {
  GlobalConfettiManager,
  GlobalCropManager,
  GlobalFilterManager,
  GlobalMediaOverlayManager,
  GlobalPlaceholderManager,
} from "./global-managers";
import { MediaOverlayManager } from "./media-overlay";
import { PlaceholderOverlayManager } from "./placeholder-overlay";
import { GlobalPerformanceMonitor } from "./performance-monitor";

export class StreamProcessor {
  private canvasResource: CanvasResource;
  private frameController: FrameRateController;
  private confettiManagers: Map<string, ConfettiOverlayManager> = new Map();
  private mediaOverlayManagers: Map<string, MediaOverlayManager> = new Map();
  private placeholderManager: PlaceholderOverlayManager | null = null;
  private configCache = new ConfigCache();
  private isDisposed = false;
  private performanceMonitor = GlobalPerformanceMonitor.getInstance();
  private streamId: string;
  private errorCount = 0;
  private maxErrors = 10;
  private lastErrorTime = 0;
  private errorThrottleMs = 1000;

  // Letterbox scaling cache
  private letterboxScale: number = 1;
  private letterboxCenterX: number = 0;
  private letterboxCenterY: number = 0;
  private letterboxScaledWidth: number = 0;
  private letterboxScaledHeight: number = 0;

  constructor(
    private video: HTMLVideoElement,
    private originalStreamSize: {
      width: number;
      height: number;
    },
    private cropArea: {
      width: number;
      height: number;
      offsetX: number;
      offsetY: number;
    },
    private filterConfig: StreamFilterConfig,
    private cropConfig: StreamCropConfig
  ) {
    this.streamId = `stream_${Math.random().toString(36).substr(2, 9)}`;

    try {
      const canvasManager = CanvasManager.getInstance();

      // Use different canvas dimensions based on letterbox setting
      const canvasWidth = cropConfig.enableLetterbox
        ? originalStreamSize.width
        : cropArea.width;
      const canvasHeight = cropConfig.enableLetterbox
        ? originalStreamSize.height
        : cropArea.height;

      this.canvasResource = canvasManager.getCanvas(canvasWidth, canvasHeight);

      this.setupCanvas();
      this.updateLetterboxCache();

      this.frameController = new FrameRateController(video, this.renderFrame);

      // Register with performance monitor
      this.performanceMonitor.registerStream(this.streamId, {
        fps: 0,
        avgRenderTime: 0,
        droppedFrames: 0,
        maxRenderTime: 0,
        activeStreams: 1,
      });

      // Register with global managers
      GlobalConfettiManager.getInstance().registerProcessor(this);
      GlobalMediaOverlayManager.getInstance().registerProcessor(this);
      GlobalCropManager.getInstance().registerProcessor(this);
      GlobalFilterManager.getInstance().registerProcessor(this);
      GlobalPlaceholderManager.getInstance().registerProcessor(this);

      Logger.dev(`StreamProcessor initialized: ${this.streamId}`);
    } catch (error) {
      Logger.dev("StreamProcessor construction failed:", error);
      throw error;
    }
  }

  private setupCanvas(): void {
    const { ctx } = this.canvasResource;

    // Apply cached filter string using GlobalFilterManager
    const filterManager = GlobalFilterManager.getInstance();
    const filterKey = `filter_${JSON.stringify({
      b: this.filterConfig.brightness,
      s: this.filterConfig.saturation,
      c: this.filterConfig.contrast,
    })}`;

    ctx.filter = this.configCache.get(filterKey, () =>
      filterManager.generateFilterString(this.filterConfig)
    );

    // Apply mirror transformation using GlobalCropManager
    const cropManager = GlobalCropManager.getInstance();
    cropManager.applyMirrorTransform(
      ctx,
      this.originalStreamSize.width,
      this.cropConfig.mirror
    );
  }

  private updateLetterboxCache(): void {
    if (!this.cropConfig.enableLetterbox) return;

    const canvasWidth = this.canvasResource.canvas.width;
    const canvasHeight = this.canvasResource.canvas.height;

    // Calculate scaling to fit video while maintaining aspect ratio
    const scaleX = canvasWidth / this.cropArea.width;
    const scaleY = canvasHeight / this.cropArea.height;
    this.letterboxScale = Math.min(scaleX, scaleY);

    this.letterboxScaledWidth = this.cropArea.width * this.letterboxScale;
    this.letterboxScaledHeight = this.cropArea.height * this.letterboxScale;

    // Center the scaled video
    this.letterboxCenterX = (canvasWidth - this.letterboxScaledWidth) / 2;
    this.letterboxCenterY = (canvasHeight - this.letterboxScaledHeight) / 2;
  }

  private renderFrame = (): void => {
    if (this.isDisposed) return;

    const { ctx } = this.canvasResource;
    const currentTime = performance.now();

    try {
      const canvasWidth = this.canvasResource.canvas.width;
      const canvasHeight = this.canvasResource.canvas.height;

      // Clear previous frame efficiently
      ctx.clearRect(
        0,
        0,
        this.canvasResource.prevWidth,
        this.canvasResource.prevHeight
      );

      // Check if placeholder should be rendered (replaces video stream entirely)
      if (this.placeholderManager && this.placeholderManager.shouldRender()) {
        this.placeholderManager.render(ctx);
        // Skip video rendering when placeholder is active
      } else if (this.cropConfig.enableLetterbox) {
        // Letterbox mode: maintain original stream dimensions with background fill

        // Fill background with letterbox color
        if (this.cropConfig.letterboxBgColor) {
          ctx.fillStyle = this.cropConfig.letterboxBgColor;
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        }

        // Use cached letterbox values
        ctx.drawImage(
          this.video,
          this.cropArea.offsetX,
          this.cropArea.offsetY,
          this.cropArea.width,
          this.cropArea.height,
          this.letterboxCenterX,
          this.letterboxCenterY,
          this.letterboxScaledWidth,
          this.letterboxScaledHeight
        );
      } else {
        // Non-letterbox mode: canvas size matches crop area, no centering needed
        ctx.drawImage(
          this.video,
          this.cropArea.offsetX,
          this.cropArea.offsetY,
          this.cropArea.width,
          this.cropArea.height,
          0,
          0,
          canvasWidth,
          canvasHeight
        );
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

      // Media overlay rendering
      if (this.mediaOverlayManagers.size > 0) {
        const finishedOverlays: string[] = [];

        for (const [overlayId, overlayManager] of this.mediaOverlayManagers) {
          if (overlayManager.shouldRender(currentTime)) {
            overlayManager.render(ctx, currentTime);
          } else {
            finishedOverlays.push(overlayId);
          }
        }

        // Clean up finished overlays
        for (const overlayId of finishedOverlays) {
          const overlayManager = this.mediaOverlayManagers.get(overlayId);
          if (overlayManager) {
            overlayManager.cleanup();
            this.mediaOverlayManagers.delete(overlayId);
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

      // Try to get a new canvas resource with correct dimensions
      const canvasWidth = this.cropConfig.enableLetterbox
        ? this.originalStreamSize.width
        : this.cropArea.width;
      const canvasHeight = this.cropConfig.enableLetterbox
        ? this.originalStreamSize.height
        : this.cropArea.height;

      this.canvasResource = canvasManager.getCanvas(canvasWidth, canvasHeight);
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

  startConfetti(confettiId: string, config: StreamConfettiConfig): void {
    if (this.isDisposed) return;

    const confettiManager = new ConfettiOverlayManager(config, {
      width: this.originalStreamSize.width,
      height: this.originalStreamSize.height,
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

  startMediaOverlay(overlayId: string, config: StreamMediaOverlayConfig): void {
    if (this.isDisposed) return;

    const mediaOverlayManager = new MediaOverlayManager(config, {
      width: this.originalStreamSize.width,
      height: this.originalStreamSize.height,
    });

    mediaOverlayManager.start();
    this.mediaOverlayManagers.set(overlayId, mediaOverlayManager);

    Logger.dev(`Media overlay started in ${this.streamId}: ${overlayId}`);
  }

  stopMediaOverlay(overlayId: string): void {
    const mediaOverlayManager = this.mediaOverlayManagers.get(overlayId);
    if (mediaOverlayManager) {
      mediaOverlayManager.stop();
      mediaOverlayManager.cleanup();
      this.mediaOverlayManagers.delete(overlayId);
      Logger.dev(`Media overlay stopped in ${this.streamId}: ${overlayId}`);
    }
  }

  clearAllMediaOverlays(): void {
    this.mediaOverlayManagers.forEach((mediaOverlayManager) => {
      mediaOverlayManager.stop();
      mediaOverlayManager.cleanup();
    });
    this.mediaOverlayManagers.clear();
    Logger.dev(`All media overlays cleared in ${this.streamId}`);
  }

  updateCropSettings(config: StreamCropConfig): void {
    if (this.isDisposed) return;

    // Update config with new crop settings
    this.cropConfig = { ...this.cropConfig, ...config };

    // Recalculate crop dimensions based on original video dimensions
    const cropManager = GlobalCropManager.getInstance();
    const newCrop = cropManager.calculateCrop(
      {
        width: this.video.videoWidth,
        height: this.video.videoHeight,
      },
      config.aspectRatio
    );
    const newZoom = cropManager.calculateZoomedSize(newCrop, config.zoom);
    const newOffset = cropManager.calculateOffset(
      {
        width: this.video.videoWidth,
        height: this.video.videoHeight,
      },
      newZoom,
      config.align
    );

    // Update crop area settings
    this.cropArea = {
      ...newZoom,
      offsetX: newOffset.x,
      offsetY: newOffset.y,
    };

    // Use different canvas dimensions based on letterbox setting
    const canvasWidth = this.cropConfig.enableLetterbox
      ? this.originalStreamSize.width
      : this.cropArea.width;
    const canvasHeight = this.cropConfig.enableLetterbox
      ? this.originalStreamSize.height
      : this.cropArea.height;

    this.canvasResource.prevHeight = this.canvasResource.height;
    this.canvasResource.prevWidth = this.canvasResource.width;
    this.canvasResource.canvas.width = canvasWidth;
    this.canvasResource.canvas.height = canvasHeight;
    this.canvasResource.width = canvasWidth;
    this.canvasResource.height = canvasHeight;

    // Update letterbox cache with new dimensions
    this.updateLetterboxCache();

    // Clear configuration cache to force recalculation
    this.configCache.invalidate();

    // If mirror setting changed, we need to reset the canvas transform
    if (config.mirror !== undefined) {
      const { ctx } = this.canvasResource;
      ctx.resetTransform(); // Reset all transforms
      this.setupCanvas(); // Reapply all canvas settings including mirror
    }

    Logger.dev(`Crop settings updated for ${this.streamId}:`, this.cropArea);
  }

  updateFilterSettings(config: StreamFilterConfig): void {
    if (this.isDisposed) return;

    // Update filter config with new settings
    this.filterConfig = { ...this.filterConfig, ...config };

    // Clear configuration cache to force recalculation
    this.configCache.invalidate();

    // Reapply canvas filters
    const { ctx } = this.canvasResource;
    const filterManager = GlobalFilterManager.getInstance();
    ctx.filter = filterManager.generateFilterString(this.filterConfig);

    Logger.dev(
      `Filter settings updated for ${this.streamId}:`,
      this.filterConfig
    );
  }

  enablePlaceholder(config: StreamPlaceholderConfig): void {
    if (this.isDisposed) return;

    // Clean up existing placeholder manager if any
    if (this.placeholderManager) {
      this.placeholderManager.cleanup();
    }

    // Create new placeholder manager
    this.placeholderManager = new PlaceholderOverlayManager(config, {
      width: this.originalStreamSize.width,
      height: this.originalStreamSize.height,
    });

    this.placeholderManager.start();
    Logger.dev(`Placeholder enabled for ${this.streamId}:`, config);
  }

  disablePlaceholder(): void {
    if (this.placeholderManager) {
      this.placeholderManager.stop();
      this.placeholderManager.cleanup();
      this.placeholderManager = null;
      Logger.dev(`Placeholder disabled for ${this.streamId}`);
    }
  }

  updatePlaceholderSettings(config: Partial<StreamPlaceholderConfig>): void {
    if (this.placeholderManager) {
      this.placeholderManager.updateConfig(config);
      Logger.dev(`Placeholder settings updated for ${this.streamId}:`, config);
    }
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

      // Cleanup all confetti overlays
      this.confettiManagers.forEach((confettiManager) => {
        confettiManager.cleanup();
      });
      this.confettiManagers.clear();

      // Cleanup all media overlays
      this.mediaOverlayManagers.forEach((mediaOverlayManager) => {
        mediaOverlayManager.cleanup();
      });
      this.mediaOverlayManagers.clear();

      // Cleanup placeholder manager
      if (this.placeholderManager) {
        this.placeholderManager.cleanup();
        this.placeholderManager = null;
      }

      // Unregister from global managers
      GlobalConfettiManager.getInstance().unregisterProcessor(this);
      GlobalMediaOverlayManager.getInstance().unregisterProcessor(this);
      GlobalCropManager.getInstance().unregisterProcessor(this);
      GlobalFilterManager.getInstance().unregisterProcessor(this);
      GlobalPlaceholderManager.getInstance().unregisterProcessor(this);

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
