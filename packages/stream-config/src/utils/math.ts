/**
 * mathematical utilities for calculating crop coordinates mapping to maintaining original sizing
 */

export type Size = { width: number; height: number };

export type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type AlignX = "left" | "center" | "right";
export type AlignY = "top" | "center" | "bottom";

export type CropConfig = {
  aspectRatio: number; // e.g. 16/9 for wide, 1 for square
  zoom: number; // 1.0 to 3.0+
  alignX: AlignX;
  alignY: AlignY;
};

/**
 * Calculates the crop box within the original stream size so that the box matches
 * the desired aspectRatio, zoomed in by zoom factor, and aligned accordingly.
 * The crop box coordinates are relative to the original video dimensions.
 */
export function calculateCropBox(
  originalSize: Size,
  cropConfig: CropConfig,
): Box {
  const { aspectRatio, zoom, alignX, alignY } = cropConfig;
  const originalAspect = originalSize.width / originalSize.height;

  // 1. Calculate the base crop dimensions (zoom = 1) that fit inside the original size
  // maintaining the requested aspectRatio
  let cropWidth = originalSize.width;
  let cropHeight = originalSize.height;

  if (originalAspect > aspectRatio) {
    // The original video is wider than the requested aspect ratio.
    // e.g. Original is 16:9, requested is 4:3. We must crop left/right. Limit height to 100%.
    cropWidth = Math.round(originalSize.height * aspectRatio);
  } else {
    // The original video is taller than the requested aspect ratio.
    // e.g. Original is 4:3, requested is 16:9. We must crop top/bottom. Limit width to 100%.
    cropHeight = Math.round(originalSize.width / aspectRatio);
  }

  // 2. Apply digital zoom (zoom > 1 makes the viewing box smaller, "zooming in")
  const actualZoom = Math.max(1, zoom);
  const zoomWidth = Math.round(cropWidth / actualZoom);
  const zoomHeight = Math.round(cropHeight / actualZoom);

  // 3. Calculate horizontal alignment offset
  let offsetX = 0;
  if (alignX === "left") {
    offsetX = 0;
  } else if (alignX === "right") {
    offsetX = originalSize.width - zoomWidth;
  } else {
    offsetX = Math.round((originalSize.width - zoomWidth) / 2);
  }

  // 4. Calculate vertical alignment offset
  let offsetY = 0;
  if (alignY === "top") {
    offsetY = 0;
  } else if (alignY === "bottom") {
    offsetY = originalSize.height - zoomHeight;
  } else {
    offsetY = Math.round((originalSize.height - zoomHeight) / 2);
  }

  // Validate to perfectly ensure bounds aren't broken by NaN or floating points
  const safeX = isNaN(offsetX) ? 0 : Math.max(0, Math.min(offsetX, originalSize.width - 1));
  const safeY = isNaN(offsetY) ? 0 : Math.max(0, Math.min(offsetY, originalSize.height - 1));
  const safeWidth = isNaN(zoomWidth) ? originalSize.width : Math.max(1, Math.min(zoomWidth, originalSize.width - safeX));
  const safeHeight = isNaN(zoomHeight) ? originalSize.height : Math.max(1, Math.min(zoomHeight, originalSize.height - safeY));

  return {
    x: safeX,
    y: safeY,
    width: safeWidth,
    height: safeHeight,
  };
}

/**
 * Calculates how the cropped box should be painted onto the destination canvas
 * so that it acts as a "letterbox" (centered, touching edges of destination canvas).
 * In this architecture, destination size is always equal to originalSize.
 */
export function calculateDestinationBox(
  destinationSize: Size,
  cropBox: Box
): Box {
  const destAspect = destinationSize.width / destinationSize.height;
  const cropAspect = cropBox.width / cropBox.height;

  let drawWidth = destinationSize.width;
  let drawHeight = destinationSize.height;

  if (cropAspect > destAspect) {
    // Cropped video is wider than destination. Fit to width.
    drawHeight = Math.round(destinationSize.width / cropAspect);
  } else {
    // Cropped video is taller. Fit to height.
    drawWidth = Math.round(destinationSize.height * cropAspect);
  }

  // Center exactly in the middle of destination
  const destX = Math.round((destinationSize.width - drawWidth) / 2);
  const destY = Math.round((destinationSize.height - drawHeight) / 2);

  return {
    x: destX,
    y: destY,
    width: drawWidth,
    height: drawHeight,
  };
}
