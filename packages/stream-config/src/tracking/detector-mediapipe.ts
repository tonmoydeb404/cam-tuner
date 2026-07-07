/**
 * Pure mapping from MediaPipe face-detection results to our backend-agnostic
 * FaceBox[]. Kept in the shared package (no MediaPipe dependency) so it can be
 * unit-tested in isolation and reused by any detector host.
 *
 * NOTE: MediaPipe's boundingBox uses {originX, originY} in PIXEL coordinates.
 */
import type { FaceBox } from "./types"

/** The subset of a MediaPipe detection we consume. */
export type MediaPipeDetection = {
  boundingBox?: {
    originX: number
    originY: number
    width: number
    height: number
  }
  categories?: Array<{ score?: number }>
}

/**
 * Maps MediaPipe detections to FaceBox[] (pixel coordinates).
 * boundingBox is already in pixels — this is a field rename plus an optional
 * confidence lift from categories[0].score.
 */
export function toFaceBoxes(detections: MediaPipeDetection[]): FaceBox[] {
  const faces: FaceBox[] = []
  for (const detection of detections) {
    const box = detection.boundingBox
    if (!box) continue
    const face: FaceBox = {
      x: box.originX,
      y: box.originY,
      width: box.width,
      height: box.height,
    }
    const score = detection.categories?.[0]?.score
    if (typeof score === "number") face.confidence = score
    faces.push(face)
  }
  return faces
}
