/**
 * A person alpha matte.
 *
 * `data` is a row-major Float32Array of length `width * height`, where each
 * value is the foreground (person) opacity in 0..1 — 1 means fully person,
 * 0 means fully background. The matte is returned at whatever resolution the
 * backend ran the model at (often lower than the source); callers upscale it
 * when compositing (canvas `drawImage` handles this, keeping edges soft).
 */
export type Matte = {
  width: number
  height: number
  data: Float32Array
}

/**
 * Backend-agnostic person matting provider.
 *
 * The mirror of {@link FaceDetector}: segmentation is intentionally async
 * because it is too slow to run synchronously per frame, so the background
 * plugin runs it on a throttled loop and composites with the latest result.
 *
 * Known implementations: a deterministic mock (tests), MediaPipe
 * selfie_segmenter (always-smooth fallback), and RVM via ONNX Runtime Web
 * (macOS-grade quality on WebGPU).
 */
export interface MatteProvider {
  /**
   * Segments `source` (a video frame or canvas). `width`/`height` are the
   * source pixel dimensions so the backend can pick a sensible downsample
   * ratio. Returns a matte whose own width/height reflect the model's run
   * resolution (may be smaller than the source).
   */
  segment(
    source: CanvasImageSource,
    width: number,
    height: number
  ): Promise<Matte>
  /** Whether the model has finished initializing and can segment. */
  isReady(): boolean
  /** Releases model / WASM / session resources. */
  destroy(): void
}
