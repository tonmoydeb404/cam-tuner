/**
 * A detected face, expressed in PIXEL coordinates relative to the analysed
 * frame (width x height). Confidence is optional because not every detector
 * exposes one (e.g. the native FaceDetector API).
 */
export type FaceBox = {
  x: number
  y: number
  width: number
  height: number
  confidence?: number
}

/**
 * Backend-agnostic face detector. Implementations include a deterministic
 * mock (tests), the native FaceDetector API fast-path, and MediaPipe.
 *
 * Detection is intentionally async: it is too slow to run synchronously per
 * frame, so callers run it on a detached loop and read the latest result.
 */
export interface FaceDetector {
  /**
   * Detects faces in the given frame. Returns bounding boxes in pixel
   * coordinates relative to (width, height).
   */
  detect(
    source: CanvasImageSource,
    width: number,
    height: number
  ): Promise<FaceBox[]>
  /** Whether the detector has finished initializing and can detect. */
  isReady(): boolean
  /** Releases detector resources (models, WASM, etc.). */
  destroy(): void
}
