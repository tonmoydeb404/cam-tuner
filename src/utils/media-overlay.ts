import { Logger } from "./log";

interface MediaOverlayConfig {
  mediaUrl: string;
  mediaType: "video" | "image";
  position: { x: number; y: number };
  scale: number;
  duration: number;
  opacity: number;
  delay: number;
}

/**
 * Media Overlay Manager
 * Displays images or videos on the video stream
 */
export class MediaOverlayManager {
  private mediaElement: HTMLImageElement | HTMLVideoElement | null = null;
  private startTime = 0;
  private delayStartTime = 0;
  private isActive = false;
  private isDelaying = true;
  private config: MediaOverlayConfig;

  constructor(
    config: MediaOverlayConfig,
    private canvasSize: { width: number; height: number }
  ) {
    this.config = config;
    this.loadMedia();
  }

  private async loadMedia(): Promise<void> {
    try {
      if (this.config.mediaType === "image") {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          Logger.dev(`Image loaded successfully: ${this.config.mediaUrl}`);
        };
        img.onerror = (error) => {
          Logger.dev(`Failed to load image: ${this.config.mediaUrl}`, error);
        };
        img.src = this.config.mediaUrl;
        this.mediaElement = img;
      } else {
        const video = document.createElement("video");
        video.crossOrigin = "anonymous";
        video.muted = true;
        video.loop = true;
        video.onloadeddata = () => {
          Logger.dev(`Video loaded successfully: ${this.config.mediaUrl}`);
        };
        video.onerror = (error) => {
          Logger.dev(`Failed to load video: ${this.config.mediaUrl}`, error);
        };
        video.src = this.config.mediaUrl;
        this.mediaElement = video;
      }
    } catch (error) {
      Logger.dev(`Failed to load media: ${this.config.mediaUrl}`, error);
    }
  }

  start(): void {
    if (this.isActive) return;

    this.isActive = true;
    this.isDelaying = this.config.delay > 0;
    this.delayStartTime = performance.now();
    this.startTime = performance.now();
    
    if (this.config.mediaType === "video" && this.mediaElement instanceof HTMLVideoElement) {
      this.mediaElement.play().catch((error) => {
        Logger.dev("Failed to play video:", error);
      });
    }

    Logger.dev(`Media overlay started: ${this.config.mediaUrl}`);
  }

  shouldRender(currentTime: number): boolean {
    if (!this.isActive || !this.mediaElement) return false;

    // Handle delay
    if (this.isDelaying) {
      const delayElapsed = (currentTime - this.delayStartTime) / 1000;
      if (delayElapsed < this.config.delay) {
        return false;
      }
      this.isDelaying = false;
      this.startTime = currentTime; // Reset start time after delay
    }

    // Check if within duration
    const elapsed = (currentTime - this.startTime) / 1000;
    return elapsed < this.config.duration;
  }

  render(ctx: CanvasRenderingContext2D, currentTime: number): void {
    if (!this.shouldRender(currentTime) || !this.mediaElement) {
      if (this.isActive && !this.isDelaying) {
        const elapsed = (currentTime - this.startTime) / 1000;
        if (elapsed >= this.config.duration) {
          this.stop();
        }
      }
      return;
    }

    // Only render if media is loaded
    if (this.config.mediaType === "image" && !(this.mediaElement as HTMLImageElement).complete) {
      return;
    }
    if (this.config.mediaType === "video" && (this.mediaElement as HTMLVideoElement).readyState < 2) {
      return;
    }

    ctx.save();

    // Apply opacity (convert from percentage to decimal)
    ctx.globalAlpha = this.config.opacity / 100;

    // Get original media dimensions
    const mediaWidth = this.config.mediaType === "image" 
      ? (this.mediaElement as HTMLImageElement).naturalWidth 
      : (this.mediaElement as HTMLVideoElement).videoWidth;
    const mediaHeight = this.config.mediaType === "image" 
      ? (this.mediaElement as HTMLImageElement).naturalHeight 
      : (this.mediaElement as HTMLVideoElement).videoHeight;

    if (mediaWidth === 0 || mediaHeight === 0) {
      ctx.restore();
      return;
    }

    // Calculate size based on stream dimensions, similar to position-picker
    // Use a base size relative to the smaller dimension of the canvas (like position-picker)
    const baseSize = Math.min(this.canvasSize.width, this.canvasSize.height) * 0.2; // 20% of smaller dimension
    
    // Maintain aspect ratio while scaling
    const aspectRatio = mediaWidth / mediaHeight;
    let scaledWidth: number;
    let scaledHeight: number;
    
    if (aspectRatio >= 1) {
      // Landscape or square
      scaledWidth = baseSize * this.config.scale * aspectRatio;
      scaledHeight = baseSize * this.config.scale;
    } else {
      // Portrait
      scaledWidth = baseSize * this.config.scale;
      scaledHeight = baseSize * this.config.scale / aspectRatio;
    }

    // Convert percentage position to canvas coordinates (centered)
    const x = (this.config.position.x / 100) * this.canvasSize.width - scaledWidth / 2;
    const y = (this.config.position.y / 100) * this.canvasSize.height - scaledHeight / 2;

    // Draw the media
    ctx.drawImage(this.mediaElement, x, y, scaledWidth, scaledHeight);

    ctx.restore();
  }

  stop(): void {
    this.isActive = false;
    if (this.config.mediaType === "video" && this.mediaElement instanceof HTMLVideoElement) {
      this.mediaElement.pause();
    }
    Logger.dev(`Media overlay stopped: ${this.config.mediaUrl}`);
  }

  cleanup(): void {
    this.stop();
    if (this.mediaElement) {
      if (this.config.mediaType === "video" && this.mediaElement instanceof HTMLVideoElement) {
        this.mediaElement.pause();
        this.mediaElement.src = "";
      }
      this.mediaElement = null;
    }
  }

  updateConfig(config: Partial<MediaOverlayConfig>): void {
    this.config = { ...this.config, ...config };
  }
}