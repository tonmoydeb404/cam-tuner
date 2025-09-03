import { Logger } from "@/utils/log";

export class PerformanceMonitor {
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

export class FrameRateController {
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
