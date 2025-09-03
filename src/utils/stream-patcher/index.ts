import { Logger } from "@/utils/log";
import {
  StreamCropConfig,
  StreamFilterConfig,
  StreamPatcherSettings,
} from "@/utils/stream-patcher/types";
import { CanvasManager } from "./canvas-manager";
import {
  GlobalConfettiManager,
  GlobalCropManager,
  GlobalFilterManager,
  GlobalMediaOverlayManager,
} from "./global-managers";
import { StreamProcessor } from "./stream-processor";

function applyCanvasProcessing(settings: {
  video: HTMLVideoElement;
  crop: { width: number; height: number; offsetX: number; offsetY: number };
  filterConfig: StreamFilterConfig;
  cropConfig: StreamCropConfig;
}): { canvas: HTMLCanvasElement; processor: StreamProcessor } {
  const { video, crop, filterConfig, cropConfig } = settings;

  const processor = new StreamProcessor(video, crop, filterConfig, cropConfig);
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
 * Stream processors registry for cleanup management
 */
const activeProcessors = new WeakMap<MediaStream, StreamProcessor>();

export function streamPatcher(
  settings: StreamPatcherSettings,
  stopOriginalStream = false
): MediaStream {
  const { cropConfig, filterConfig, size, stream } = settings;

  try {
    const videoTrack = stream.getVideoTracks()[0];
    if (!videoTrack) throw new Error("No video track found in stream.");

    const video = setupVideoElement(videoTrack);

    // Use GlobalCropManager for initialization
    const cropManager = GlobalCropManager.getInstance();
    const { crop } = cropManager.initProcessor(size, cropConfig);

    // Use GlobalFilterManager for initialization
    const filterManager = GlobalFilterManager.getInstance();
    filterManager.initProcessor(filterConfig);

    const { canvas, processor } = applyCanvasProcessing({
      video,
      crop,
      filterConfig,
      cropConfig,
    });

    // Create output stream with explicit framerate for better performance
    const targetFps = Math.min(30, (filterConfig as any).maxFps || 30);
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

/**
 * Function to trigger media overlay across all active video streams
 */
export function triggerGlobalMediaOverlay(config: {
  mediaUrl: string;
  mediaType: "video" | "image";
  position: { x: number; y: number };
  scale: number;
  duration: number;
  opacity: number;
  delay: number;
}): void {
  GlobalMediaOverlayManager.getInstance().triggerMediaOverlay(config);
}

/**
 * Function to apply crop settings across all active video streams
 */
export function applyGlobalCrop(config: StreamCropConfig): void {
  GlobalCropManager.getInstance().applyCrop(config);
}

/**
 * Function to apply filter settings across all active video streams
 */
export function applyGlobalFilters(config: StreamFilterConfig): void {
  GlobalFilterManager.getInstance().applyFilters(config);
}
