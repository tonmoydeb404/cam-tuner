import { StreamPatcherConfig, StreamPatcherSize } from "@/types/stream-patcher";
import { Logger } from "./log";

function normalizeFilterValue(value?: number): number {
  if (typeof value !== "number") return 1;
  return Math.max(0, value) / 100;
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

function applyCanvasProcessing({
  video,
  crop,
  filters,
  config,
  gifOverlay,
}: {
  video: HTMLVideoElement;
  crop: { width: number; height: number; offsetX: number; offsetY: number };
  filters: string;
  config: StreamPatcherConfig;
  gifOverlay?: StreamPatcherConfig["gifOverlay"];
}): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get 2D context from canvas.");
  }
  ctx.filter = filters;

  // Apply mirror mode if enabled
  if (config.mirror) {
    ctx.scale(-1, 1); // Flip horizontally
    ctx.translate(-crop.width, 0); // Adjust the position to match the flip
  }

  // GIF overlay setup
  let gifVideo: HTMLVideoElement | null = null;
  let gifStartTime = 0;
  let gifVisible = false;
  let gifCompleted = false; // Track if GIF display period has completed

  if (gifOverlay?.enabled && gifOverlay.mp4Url) {
    // Create video element for animated GIF playback
    gifVideo = document.createElement("video");
    gifVideo.crossOrigin = "anonymous";
    gifVideo.loop = true;
    gifVideo.muted = true;
    gifVideo.playsInline = true;
    gifVideo.autoplay = true;
    gifVideo.src = gifOverlay.mp4Url;

    gifVideo.addEventListener("loadeddata", () => {
      Logger.dev("Animated GIF loaded for overlay");
      gifVideo?.play().catch((err) => {
        Logger.dev("GIF video play error:", err);
      });
    });
  }

  function drawGifOverlay(ctx: CanvasRenderingContext2D) {
    if (
      !gifOverlay?.enabled ||
      !gifVideo ||
      gifVideo.readyState < 2 || // HAVE_CURRENT_DATA or higher
      gifCompleted
    ) {
      return;
    }

    const currentTime = Date.now();

    // Initialize start time on first draw
    if (gifStartTime === 0) {
      gifStartTime = currentTime + gifOverlay.delay * 1000;
    }

    // Check if we're within the display duration
    const elapsedTime = (currentTime - gifStartTime) / 1000;
    gifVisible = elapsedTime >= 0 && elapsedTime <= gifOverlay.duration;

    if (gifVisible) {
      // Calculate GIF position and size
      const gifWidth = gifVideo.videoWidth * gifOverlay.scale;
      const gifHeight = gifVideo.videoHeight * gifOverlay.scale;
      const gifX = (crop.width * gifOverlay.position.x) / 100 - gifWidth / 2;
      const gifY = (crop.height * gifOverlay.position.y) / 100 - gifHeight / 2;

      // Apply opacity
      const previousAlpha = ctx.globalAlpha;
      ctx.globalAlpha = gifOverlay.opacity / 100;

      // Draw animated GIF (video element)
      ctx.drawImage(gifVideo, gifX, gifY, gifWidth, gifHeight);

      // Restore opacity
      ctx.globalAlpha = previousAlpha;
    }

    // Mark as completed after duration ends (no more looping)
    if (elapsedTime > gifOverlay.duration) {
      gifCompleted = true;
      gifVideo.pause(); // Stop playing the GIF
      Logger.dev("GIF overlay completed, hiding permanently");
    }
  }

  function draw(ctx: CanvasRenderingContext2D) {
    try {
      // Draw main video
      ctx?.drawImage(
        video,
        crop.offsetX,
        crop.offsetY,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      // Draw GIF overlay
      drawGifOverlay(ctx);
    } catch (err) {
      Logger.dev("Draw failed:", err);
    }
    requestAnimationFrame(() => {
      draw(ctx);
    });
  }

  draw(ctx);
  return canvas;
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

export function streamPatcher(
  stream: MediaStream,
  size: StreamPatcherSize,
  config: StreamPatcherConfig = {},
  stopOriginalStream = false
): MediaStream {
  try {
    const videoTrack = stream.getVideoTracks()[0];
    if (!videoTrack) throw new Error("No video track found in stream.");

    const video = setupVideoElement(videoTrack);
    const crop = calculateCrop(size, config.aspectRatio);
    const zoom = calculateZoomedSize(crop, config.zoom);
    const offset = calculateOffest(size, zoom, config.align);
    const filters = generateFilterString(config);
    const canvas = applyCanvasProcessing({
      video,
      crop: {
        ...zoom,
        offsetX: offset.x,
        offsetY: offset.y,
      },
      filters,
      config,
      gifOverlay: config.gifOverlay,
    });

    const outputStream = canvas.captureStream();

    if (stopOriginalStream) {
      outputStream.getTracks().forEach((track) => {
        const originalStop = track.stop.bind(track);
        track.stop = () => {
          try {
            stream.getTracks().forEach((t) => t.stop());
            Logger.dev("Original stream stopped.");
          } catch (err) {
            Logger.dev("Error stopping original stream:", err);
          } finally {
            originalStop();
          }
        };
      });
    }

    return outputStream;
  } catch (err) {
    Logger.dev("mediaPatcher error:", err);
    return stream; // Fallback to original stream if something fails
  }
}
