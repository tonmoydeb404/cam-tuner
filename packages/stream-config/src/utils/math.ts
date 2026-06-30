/**
 * mathematical utilities for calculating crop coordinates mapping to maintaining original sizing
 */

export type Size = { width: number; height: number }

export type Box = {
  x: number
  y: number
  width: number
  height: number
}

export type AlignX = "left" | "center" | "right"
export type AlignY = "top" | "center" | "bottom"

/**
 * Continuous alignment point, normalized 0..1 on each axis (0.5 = true center).
 * When present on a CropConfig it overrides the discrete alignX/alignY grid,
 * enabling sub-pixel auto-framing such as Center Stage.
 */
export type AlignCenter = { x: number; y: number }

export type CropConfig = {
  aspectRatio: number // e.g. 16/9 for wide, 1 for square
  zoom: number // 1.0 to 3.0+
  alignX: AlignX
  alignY: AlignY
  barColor: string // CSS color for letterbox bars
  mirror?: boolean // horizontal flip
  alignCenter?: AlignCenter // overrides alignX/alignY for sub-pixel auto-framing
  zoomOverride?: number // overrides user zoom for auto-framing (Center Stage)
}

/**
 * Clamps a value into the 0..1 range. NaN collapses to 0 for safety.
 */
export function clamp01(value: number): number {
  if (isNaN(value)) return 0
  return Math.max(0, Math.min(1, value))
}

/**
 * Resolves a crop offset within `available` pixels.
 *
 * A continuous `continuous` value (normalized 0..1) takes precedence over the
 * discrete 9-point grid when provided — this is what lets Center Stage position
 * the crop with sub-pixel precision. Otherwise it falls back to start/center/end.
 */
export function calculateAlignOffset(
  available: number,
  discrete: AlignX | AlignY,
  continuous?: number
): number {
  if (continuous !== undefined) {
    return Math.round(available * clamp01(continuous))
  }
  if (discrete === "left" || discrete === "top") return 0
  if (discrete === "right" || discrete === "bottom") return available
  return Math.round(available / 2)
}

/**
 * Centers the crop on a source-normalized point (0..1) and clamps it to the
 * frame edges. This is the Center Stage positioning strategy: keep the subject
 * centered while there is panning room, and pin to the nearest edge (subject
 * still fully in frame) once that room runs out.
 *
 * `sourceNorm` is the subject's position as a fraction of the original frame
 * (e.g. a face centroid), `zoomSize` is the cropped dimension in source pixels.
 */
export function calculateCenteredOffset(
  sourceNorm: number,
  zoomSize: number,
  originalSize: number
): number {
  const available = originalSize - zoomSize
  if (available <= 0) return 0
  const desired = sourceNorm * originalSize - zoomSize / 2
  return Math.round(Math.max(0, Math.min(desired, available)))
}

/**
 * Calculates the crop box within the original stream size so that the box matches
 * the desired aspectRatio, zoomed in by zoom factor, and aligned accordingly.
 * The crop box coordinates are relative to the original video dimensions.
 */
export function calculateCropBox(
  originalSize: Size,
  cropConfig: CropConfig
): Box {
  const { aspectRatio, zoom, zoomOverride, alignX, alignY, alignCenter } = cropConfig
  const originalAspect = originalSize.width / originalSize.height

  // 1. Calculate the base crop dimensions (zoom = 1) that fit inside the original size
  // maintaining the requested aspectRatio
  let cropWidth = originalSize.width
  let cropHeight = originalSize.height

  if (originalAspect > aspectRatio) {
    // The original video is wider than the requested aspect ratio.
    // e.g. Original is 16:9, requested is 4:3. We must crop left/right. Limit height to 100%.
    cropWidth = Math.round(originalSize.height * aspectRatio)
  } else {
    // The original video is taller than the requested aspect ratio.
    // e.g. Original is 4:3, requested is 16:9. We must crop top/bottom. Limit width to 100%.
    cropHeight = Math.round(originalSize.width / aspectRatio)
  }

  // 2. Apply digital zoom (zoom > 1 makes the viewing box smaller, "zooming in")
  // zoomOverride (from Center Stage) takes precedence over the user's zoom.
  const effectiveZoom = zoomOverride ?? zoom
  const actualZoom = Math.max(1, effectiveZoom)
  const zoomWidth = Math.round(cropWidth / actualZoom)
  const zoomHeight = Math.round(cropHeight / actualZoom)

  // 3 & 4. Calculate alignment offsets.
  // alignCenter (continuous 0..1, the subject's source position) overrides the
  // discrete 9-point grid. It is interpreted as "center the subject here, then
  // clamp to the frame" — true Center Stage behavior — rather than a naive
  // proportional pan that would leave an off-center subject off-center.
  const offsetX = alignCenter
    ? calculateCenteredOffset(alignCenter.x, zoomWidth, originalSize.width)
    : calculateAlignOffset(originalSize.width - zoomWidth, alignX)
  const offsetY = alignCenter
    ? calculateCenteredOffset(alignCenter.y, zoomHeight, originalSize.height)
    : calculateAlignOffset(originalSize.height - zoomHeight, alignY)

  // Validate to perfectly ensure bounds aren't broken by NaN or floating points
  const safeX = isNaN(offsetX)
    ? 0
    : Math.max(0, Math.min(offsetX, originalSize.width - 1))
  const safeY = isNaN(offsetY)
    ? 0
    : Math.max(0, Math.min(offsetY, originalSize.height - 1))
  const safeWidth = isNaN(zoomWidth)
    ? originalSize.width
    : Math.max(1, Math.min(zoomWidth, originalSize.width - safeX))
  const safeHeight = isNaN(zoomHeight)
    ? originalSize.height
    : Math.max(1, Math.min(zoomHeight, originalSize.height - safeY))

  return {
    x: safeX,
    y: safeY,
    width: safeWidth,
    height: safeHeight,
  }
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
  const destAspect = destinationSize.width / destinationSize.height
  const cropAspect = cropBox.width / cropBox.height

  let drawWidth = destinationSize.width
  let drawHeight = destinationSize.height

  if (cropAspect > destAspect) {
    // Cropped video is wider than destination. Fit to width.
    drawHeight = Math.round(destinationSize.width / cropAspect)
  } else {
    // Cropped video is taller. Fit to height.
    drawWidth = Math.round(destinationSize.height * cropAspect)
  }

  // Center exactly in the middle of destination
  const destX = Math.round((destinationSize.width - drawWidth) / 2)
  const destY = Math.round((destinationSize.height - drawHeight) / 2)

  return {
    x: destX,
    y: destY,
    width: drawWidth,
    height: drawHeight,
  }
}
