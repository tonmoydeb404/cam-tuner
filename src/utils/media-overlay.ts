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

    // Apply opacity
    ctx.globalAlpha = this.config.opacity;

    // Calculate position and size
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

    const scaledWidth = mediaWidth * this.config.scale;
    const scaledHeight = mediaHeight * this.config.scale;

    // Convert percentage position to canvas coordinates
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