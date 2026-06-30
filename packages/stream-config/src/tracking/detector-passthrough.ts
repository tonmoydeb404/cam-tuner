import type { FaceBox, FaceDetector } from "./types"

/**
 * A source function that yields the faces the detector should "find".
 * Lets tests (and a deterministic dev mode) script detection results.
 */
export type PassthroughSource = () => FaceBox[]

/**
 * Deterministic detector that returns a programmed set of faces.
 *
 * Performs no real detection — it simply forwards whatever `source` returns.
 * Ideal for unit-testing framing/smoothing logic without a model or browser.
 */
export function createPassthroughDetector(
  source: PassthroughSource
): FaceDetector {
  return {
    async detect(): Promise<FaceBox[]> {
      return source()
    },
    isReady(): boolean {
      return true
    },
    destroy(): void {
      /* nothing to release */
    },
  }
}
