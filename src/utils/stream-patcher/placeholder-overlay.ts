import { Logger } from "@/utils/log";
import { StreamPlaceholderConfig } from "./types";

/**
 * Placeholder Overlay Manager
 * Replaces video stream with static content when enabled
 */
export class PlaceholderOverlayManager {
  private backgroundElement: HTMLImageElement | HTMLVideoElement | null = null;
  private foregroundElement: HTMLImageElement | HTMLVideoElement | null = null;
  private isActive = false;
  private config: StreamPlaceholderConfig;

  constructor(
    config: StreamPlaceholderConfig,
    private canvasSize: { width: number; height: number }
  ) {
    this.config = config;
    if (config.enabled) {
      this.loadMedia();
    }
  }

  private async loadMedia(): Promise<void> {
    try {
      // Load background media
      if (this.config.background.mode === "image" && this.config.background.imageUrl) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          Logger.dev(`Background image loaded: ${this.config.background.imageUrl}`);
        };
        img.onerror = (error) => {
          Logger.dev(`Failed to load background image: ${this.config.background.imageUrl}`, error);
        };
        img.src = this.config.background.imageUrl;
        this.backgroundElement = img;
      } else if (this.config.background.mode === "video" && this.config.background.videoUrl) {
        const video = document.createElement("video");
        video.crossOrigin = "anonymous";
        video.muted = true;
        video.loop = true;
        video.onloadeddata = () => {
          Logger.dev(`Background video loaded: ${this.config.background.videoUrl}`);
        };
        video.onerror = (error) => {
          Logger.dev(`Failed to load background video: ${this.config.background.videoUrl}`, error);
        };
        video.src = this.config.background.videoUrl;
        this.backgroundElement = video;
      }

      // Load foreground media
      if (this.config.foreground.mode === "image" && this.config.foreground.imageUrl) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          Logger.dev(`Foreground image loaded: ${this.config.foreground.imageUrl}`);
        };
        img.onerror = (error) => {
          Logger.dev(`Failed to load foreground image: ${this.config.foreground.imageUrl}`, error);
        };
        img.src = this.config.foreground.imageUrl;
        this.foregroundElement = img;
      } else if (this.config.foreground.mode === "video" && this.config.foreground.videoUrl) {
        const video = document.createElement("video");
        video.crossOrigin = "anonymous";
        video.muted = true;
        video.loop = true;
        video.onloadeddata = () => {
          Logger.dev(`Foreground video loaded: ${this.config.foreground.videoUrl}`);
        };
        video.onerror = (error) => {
          Logger.dev(`Failed to load foreground video: ${this.config.foreground.videoUrl}`, error);
        };
        video.src = this.config.foreground.videoUrl;
        this.foregroundElement = video;
      }
    } catch (error) {
      Logger.dev("Failed to load placeholder media:", error);
    }
  }

  start(): void {
    if (!this.config.enabled || this.isActive) return;

    this.isActive = true;

    // Start background video if it's a video
    if (
      this.config.background.mode === "video" &&
      this.backgroundElement instanceof HTMLVideoElement
    ) {
      this.backgroundElement.play().catch((error) => {
        Logger.dev("Failed to play background video:", error);
      });
    }

    // Start foreground video if it's a video
    if (
      this.config.foreground.mode === "video" &&
      this.foregroundElement instanceof HTMLVideoElement
    ) {
      this.foregroundElement.play().catch((error) => {
        Logger.dev("Failed to play foreground video:", error);
      });
    }

    Logger.dev("Placeholder overlay started");
  }

  shouldRender(): boolean {
    return this.isActive && this.config.enabled;
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.shouldRender()) return;

    ctx.save();

    // Clear the entire canvas first (this replaces the video stream)
    ctx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);

    // Render background
    this.renderBackground(ctx);

    // Render foreground
    this.renderForeground(ctx);

    ctx.restore();
  }

  private renderBackground(ctx: CanvasRenderingContext2D): void {
    if (this.config.background.mode === "color" && this.config.background.colorCode) {
      // Solid color background
      ctx.fillStyle = this.config.background.colorCode;
      ctx.fillRect(0, 0, this.canvasSize.width, this.canvasSize.height);
    } else if (this.backgroundElement) {
      // Image or video background
      const isReady = this.config.background.mode === "image" 
        ? (this.backgroundElement as HTMLImageElement).complete
        : (this.backgroundElement as HTMLVideoElement).readyState >= 2;

      if (isReady) {
        // Fill entire canvas with background media
        ctx.drawImage(
          this.backgroundElement,
          0, 0,
          this.canvasSize.width,
          this.canvasSize.height
        );
      }
    }
  }

  private renderForeground(ctx: CanvasRenderingContext2D): void {
    const centerX = (this.config.position.x / 100) * this.canvasSize.width;
    const centerY = (this.config.position.y / 100) * this.canvasSize.height;

    if (this.config.foreground.mode === "text" && this.config.foreground.text.content) {
      this.renderText(ctx, centerX, centerY);
    } else if (this.foregroundElement) {
      this.renderForegroundMedia(ctx, centerX, centerY);
    }
  }

  private renderText(ctx: CanvasRenderingContext2D, centerX: number, centerY: number): void {
    const textConfig = this.config.foreground.text;
    
    ctx.save();

    // Set font
    ctx.font = `${textConfig.fontSize}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Measure text for background
    const metrics = ctx.measureText(textConfig.content!);
    const textWidth = metrics.width;
    const textHeight = textConfig.fontSize;

    // Draw text background if specified
    if (textConfig.bgColorCode) {
      const padding = 10;
      const bgWidth = textWidth + padding * 2;
      const bgHeight = textHeight + padding * 2;
      
      ctx.fillStyle = textConfig.bgColorCode;
      
      if (this.config.foreground.radius > 0) {
        // Rounded background
        const radius = Math.min(this.config.foreground.radius, bgWidth / 2, bgHeight / 2);
        ctx.beginPath();
        ctx.roundRect(
          centerX - bgWidth / 2,
          centerY - bgHeight / 2,
          bgWidth,
          bgHeight,
          radius
        );
        ctx.fill();
      } else {
        // Rectangle background
        ctx.fillRect(
          centerX - bgWidth / 2,
          centerY - bgHeight / 2,
          bgWidth,
          bgHeight
        );
      }
    }

    // Draw text
    ctx.fillStyle = textConfig.fontColorCode || "#ffffff";
    ctx.fillText(textConfig.content!, centerX, centerY);

    ctx.restore();
  }

  private renderForegroundMedia(ctx: CanvasRenderingContext2D, centerX: number, centerY: number): void {
    if (!this.foregroundElement) return;

    const isReady = this.config.foreground.mode === "image"
      ? (this.foregroundElement as HTMLImageElement).complete
      : (this.foregroundElement as HTMLVideoElement).readyState >= 2;

    if (!isReady) return;

    // Get original media dimensions
    const mediaWidth = this.config.foreground.mode === "image"
      ? (this.foregroundElement as HTMLImageElement).naturalWidth
      : (this.foregroundElement as HTMLVideoElement).videoWidth;
    const mediaHeight = this.config.foreground.mode === "image"
      ? (this.foregroundElement as HTMLImageElement).naturalHeight
      : (this.foregroundElement as HTMLVideoElement).videoHeight;

    if (mediaWidth === 0 || mediaHeight === 0) return;

    // Calculate size based on scale and canvas dimensions
    const baseSize = Math.min(this.canvasSize.width, this.canvasSize.height) * 0.2;
    const aspectRatio = mediaWidth / mediaHeight;
    
    let scaledWidth: number;
    let scaledHeight: number;

    if (aspectRatio >= 1) {
      scaledWidth = baseSize * this.config.foreground.scale * aspectRatio;
      scaledHeight = baseSize * this.config.foreground.scale;
    } else {
      scaledWidth = baseSize * this.config.foreground.scale;
      scaledHeight = (baseSize * this.config.foreground.scale) / aspectRatio;
    }

    // Apply radius clipping if specified
    if (this.config.foreground.radius > 0) {
      ctx.save();
      const radius = Math.min(this.config.foreground.radius, scaledWidth / 2, scaledHeight / 2);
      ctx.beginPath();
      ctx.roundRect(
        centerX - scaledWidth / 2,
        centerY - scaledHeight / 2,
        scaledWidth,
        scaledHeight,
        radius
      );
      ctx.clip();
    }

    // Draw the media
    ctx.drawImage(
      this.foregroundElement,
      centerX - scaledWidth / 2,
      centerY - scaledHeight / 2,
      scaledWidth,
      scaledHeight
    );

    if (this.config.foreground.radius > 0) {
      ctx.restore();
    }
  }

  stop(): void {
    this.isActive = false;
    
    if (this.backgroundElement instanceof HTMLVideoElement) {
      this.backgroundElement.pause();
    }
    if (this.foregroundElement instanceof HTMLVideoElement) {
      this.foregroundElement.pause();
    }
    
    Logger.dev("Placeholder overlay stopped");
  }

  cleanup(): void {
    this.stop();
    
    if (this.backgroundElement) {
      if (this.backgroundElement instanceof HTMLVideoElement) {
        this.backgroundElement.pause();
        this.backgroundElement.src = "";
      }
      this.backgroundElement = null;
    }
    
    if (this.foregroundElement) {
      if (this.foregroundElement instanceof HTMLVideoElement) {
        this.foregroundElement.pause();
        this.foregroundElement.src = "";
      }
      this.foregroundElement = null;
    }
  }

  updateConfig(config: Partial<StreamPlaceholderConfig>): void {
    const oldEnabled = this.config.enabled;
    this.config = { ...this.config, ...config };
    
    // If enabled state changed, handle activation/deactivation
    if (config.enabled !== undefined && config.enabled !== oldEnabled) {
      if (config.enabled) {
        this.loadMedia();
        this.start();
      } else {
        this.stop();
      }
    }
    
    // If media URLs changed, reload media
    if (config.background?.imageUrl || config.background?.videoUrl || 
        config.foreground?.imageUrl || config.foreground?.videoUrl) {
      this.cleanup();
      if (this.config.enabled) {
        this.loadMedia();
      }
    }
  }
}