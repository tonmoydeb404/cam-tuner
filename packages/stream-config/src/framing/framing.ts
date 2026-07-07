/**
 * Pure framing logic: converts detected faces (pixel boxes) into a normalized
 * alignment center (0..1) that CropZoomAlign can consume via CropConfig.alignCenter.
 *
 * Kept fully decoupled from any detector so it can be unit-tested in isolation.
 */
import type { Size } from "../utils/math"
import { clamp01 } from "../utils/math"
import type { AlignCenter } from "../utils/math"
import type { FaceBox } from "../tracking/types"

/**
 * Computes the centroid of a single face box, normalized to 0..1.
 */
export function faceCenter(face: FaceBox, frameSize: Size): AlignCenter {
  return {
    x: clamp01((face.x + face.width / 2) / frameSize.width),
    y: clamp01((face.y + face.height / 2) / frameSize.height),
  }
}

/**
 * Computes the union bounding box of multiple faces (pixel space).
 * Returns null for an empty list.
 */
export function unionBox(faces: FaceBox[]): FaceBox | null {
  if (faces.length === 0) return null
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const f of faces) {
    minX = Math.min(minX, f.x)
    minY = Math.min(minY, f.y)
    maxX = Math.max(maxX, f.x + f.width)
    maxY = Math.max(maxY, f.y + f.height)
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY }
}

/**
 * Computes the target framing center from detected faces.
 *
 * - Single face  → that face's centroid.
 * - Multiple faces → centroid of their union box (keeps everyone centered).
 * - No faces     → null (caller decides the fallback, e.g. hold / re-center).
 *
 * The result is normalized 0..1 so it maps directly to CropConfig.alignCenter.
 */
export function computeFramingCenter(
  faces: FaceBox[],
  frameSize: Size
): AlignCenter | null {
  if (faces.length === 0) return null
  const first = faces[0]
  if (faces.length === 1 && first) return faceCenter(first, frameSize)
  const union = unionBox(faces)
  if (!union) return null
  return faceCenter(union, frameSize)
}

export type FramingZoomOptions = {
  /** Fraction of the frame the padded face box should fill (default 0.6). */
  targetFill?: number
  /** Padding around the face union box as a fraction of box size (default 0.2). */
  padding?: number
  minZoom?: number
  maxZoom?: number
}

const DEFAULT_TARGET_FILL = 0.35
const DEFAULT_PADDING = 0.3
const DEFAULT_MIN_ZOOM = 1.0
const DEFAULT_MAX_ZOOM = 1.5

/**
 * Computes the target zoom level so detected faces fill a target fraction of
 * the frame. Returns null when there are no faces.
 *
 * The zoom is derived from the union bounding box (with padding) in both
 * dimensions; the more constraining (smaller) zoom wins so faces always fit.
 */
export function computeFramingZoom(
  faces: FaceBox[],
  frameSize: Size,
  options?: FramingZoomOptions
): number | null {
  const box = unionBox(faces)
  if (!box) return null

  const targetFill = options?.targetFill ?? DEFAULT_TARGET_FILL
  const padding = options?.padding ?? DEFAULT_PADDING
  const minZoom = options?.minZoom ?? DEFAULT_MIN_ZOOM
  const maxZoom = options?.maxZoom ?? DEFAULT_MAX_ZOOM

  const paddedW = box.width * (1 + padding)
  const paddedH = box.height * (1 + padding)

  const zoomW = (targetFill * frameSize.width) / paddedW
  const zoomH = (targetFill * frameSize.height) / paddedH

  return Math.max(minZoom, Math.min(zoomW, zoomH, maxZoom))
}
