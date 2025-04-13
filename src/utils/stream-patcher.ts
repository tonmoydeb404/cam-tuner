import { StreamPatcherConfig, StreamPatcherSize } from "@/types/stream-patcher";
import { devLog } from "./log";

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

  devLog(`Crop: ${cropWidth}x${cropHeight}`);
  return { width: cropWidth, height: cropHeight };
}

function calculateZoomedSize(size: StreamPatcherSize, zoom?: number) {
  if (typeof zoom !== "number" || zoom <= 1) {
    return { ...size };
  }

  const zoomWidth = Math.floor(size.width / zoom);
  const zoomHeight = Math.floor(size.height / zoom);

  devLog(`zoom: ${zoomWidth}x${zoomHeight}`);

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
}: {
  video: HTMLVideoElement;
  crop: { width: number; height: number; offsetX: number; offsetY: number };
  filters: string;
  config: StreamPatcherConfig;
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

  function draw() {
    try {
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
    } catch (err) {
      devLog("Draw failed:", err);
    }
    requestAnimationFrame(draw);
  }

  draw();
  return canvas;
}

function setupVideoElement(track: MediaStreamTrack): HTMLVideoElement {
  const video = document.createElement("video");
  video.srcObject = new MediaStream([track]);
  video.muted = true;
  video.playsInline = true;
  video.autoplay = true;
  video.play().catch((err) => {
    devLog("Video play error:", err);
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
    });

    const outputStream = canvas.captureStream();

    if (stopOriginalStream) {
      outputStream.getTracks().forEach((track) => {
        const originalStop = track.stop.bind(track);
        track.stop = () => {
          try {
            stream.getTracks().forEach((t) => t.stop());
            devLog("Original stream stopped.");
          } catch (err) {
            devLog("Error stopping original stream:", err);
          } finally {
            originalStop();
          }
        };
      });
    }

    return outputStream;
  } catch (err) {
    devLog("mediaPatcher error:", err);
    return stream; // Fallback to original stream if something fails
  }
}
