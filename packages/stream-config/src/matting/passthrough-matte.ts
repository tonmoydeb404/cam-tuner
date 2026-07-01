import type { Matte, MatteProvider } from "./types"

/**
 * A source function that yields the matte the provider should "produce".
 * Lets tests (and a deterministic dev mode) script segmentation results.
 */
export type PassthroughMatteSource = () => Matte | null

/**
 * Deterministic matte provider that returns a programmed matte.
 *
 * Performs no real segmentation — it simply forwards whatever `source`
 * returns. Ideal for unit-testing the background-effects compositing logic
 * without a model or browser. When `source` returns null, no matte is
 * available yet (simulating "still initializing").
 */
export function createPassthroughMatteProvider(
  source: PassthroughMatteSource
): MatteProvider {
  return {
    async segment(): Promise<Matte> {
      const matte = source()
      // Fall back to a fully-opaque matte (everything is "person") so tests
      // that don't care about masking still get a valid composite.
      if (!matte) {
        return { width: 1, height: 1, data: new Float32Array([1]) }
      }
      return matte
    },
    isReady(): boolean {
      return true
    },
    destroy(): void {
      /* nothing to release */
    },
  }
}
