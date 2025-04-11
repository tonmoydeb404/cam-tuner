/**
 * Logs messages during development.
 */
function devLog(...args: unknown[]) {
  if (process.env.NODE_ENV === "development") {
    console.log("[CropStream]", ...args);
  }
}

/**
 * Calculates the cropped width and height based on a target aspect ratio.
 */
function calculateCroppedDimensions(
  originalWidth: number,
  originalHeight: number,
  aspectRatio?: number
): { cropWidth: number; cropHeight: number } {
  if (typeof aspectRatio !== "number") {
    return { cropWidth: originalWidth, cropHeight: originalHeight };
  }

  const originalAspectRatio = originalWidth / originalHeight;

  let cropWidth: number, cropHeight: number;

  if (originalAspectRatio > aspectRatio) {
    cropWidth = Math.floor(originalHeight * aspectRatio);
    cropHeight = originalHeight;
  } else {
    cropWidth = originalWidth;
    cropHeight = Math.floor(originalWidth / aspectRatio);
  }

  devLog(
    `Cropping video to ${aspectRatio} aspect ratio: ${cropWidth}x${cropHeight} from ${originalWidth}x${originalHeight}`
  );

  return { cropWidth, cropHeight };
}

/**
 * Crops a video MediaStream to a given aspect ratio and returns a new MediaStream.
 */
function cropStreamAspectRatio(
  stream: MediaStream,
  originalWidth: number,
  originalHeight: number,
  aspectRatio?: number
): MediaStream {
  const { cropWidth, cropHeight } = calculateCroppedDimensions(
    originalWidth,
    originalHeight,
    aspectRatio
  );

  const cropX = Math.floor((originalWidth - cropWidth) / 2);
  const cropY = Math.floor((originalHeight - cropHeight) / 2);

  const videoTrack = stream.getVideoTracks()[0];
  const video = document.createElement("video");
  video.srcObject = new MediaStream([videoTrack]);
  video.muted = true;
  video.play();

  const canvas = document.createElement("canvas");
  canvas.width = cropWidth;
  canvas.height = cropHeight;
  const ctx = canvas.getContext("2d");

  function drawFrame() {
    if (ctx) {
      ctx.drawImage(
        video,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );
    }
    requestAnimationFrame(drawFrame);
  }

  drawFrame();

  const outputStream = canvas.captureStream();

  // Stop original stream when outputStream is stopped
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

  return outputStream;
}

export default cropStreamAspectRatio;
