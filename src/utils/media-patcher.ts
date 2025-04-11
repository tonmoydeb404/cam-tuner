export type MediaPatcherConfig = {
  aspectRatio?: number;
  zoom?: number;
  brightness?: number;
  saturation?: number;
  contrast?: number;
};

export type Size = {
  width: number;
  height: number;
};

function devLog(...args: unknown[]) {
  if (process.env.NODE_ENV === "development") {
    console.log("[MediaPatcher]", ...args);
  }
}

function normalizeFilterValue(value?: number): number {
  if (typeof value !== "number") return 1;
  return Math.max(0, value) / 100;
}

function generateFilterString(config: MediaPatcherConfig): string {
  const brightness = normalizeFilterValue(config.brightness);
  const saturation = normalizeFilterValue(config.saturation);
  const contrast = normalizeFilterValue(config.contrast);

  return `brightness(${brightness}) saturate(${saturation}) contrast(${contrast})`;
}

function calculateCrop(
  { width, height }: Size,
  aspectRatio?: number,
  zoom: number = 1
) {
  const cropWidth = Math.floor(width / zoom);
  const cropHeight = Math.floor(height / zoom);

  let finalWidth = cropWidth;
  let finalHeight = cropHeight;

  if (typeof aspectRatio === "number") {
    const zoomedAspect = cropWidth / cropHeight;
    if (zoomedAspect > aspectRatio) {
      finalWidth = Math.floor(cropHeight * aspectRatio);
    } else {
      finalHeight = Math.floor(cropWidth / aspectRatio);
    }
  }

  const offsetX = Math.floor((width - finalWidth) / 2);
  const offsetY = Math.floor((height - finalHeight) / 2);

  devLog(`Crop: ${finalWidth}x${finalHeight} @ ${offsetX},${offsetY}`);
  return {
    width: finalWidth,
    height: finalHeight,
    offsetX,
    offsetY,
  };
}

function applyCanvasProcessing({
  video,
  crop,
  filters,
}: {
  video: HTMLVideoElement;
  crop: { width: number; height: number; offsetX: number; offsetY: number };
  filters: string;
}): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get 2D context from canvas.");
  }
  ctx.filter = filters;

  function draw() {
    if (!ctx) return;
    try {
      ctx.drawImage(
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

export function mediaPatcher(
  stream: MediaStream,
  size: Size,
  config: MediaPatcherConfig = {},
  stopOriginalStream = false
): MediaStream {
  try {
    const videoTrack = stream.getVideoTracks()[0];
    if (!videoTrack) throw new Error("No video track found in stream.");

    const video = setupVideoElement(videoTrack);
    const crop = calculateCrop(size, config.aspectRatio, config.zoom ?? 1);
    const filters = generateFilterString(config);
    const canvas = applyCanvasProcessing({
      video,
      crop,
      filters,
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
