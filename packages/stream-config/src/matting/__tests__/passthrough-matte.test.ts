import { describe, expect, it } from "vitest"
import { createPassthroughMatteProvider } from "../passthrough-matte"
import type { Matte } from "../types"

const MATTE: Matte = {
  width: 4,
  height: 4,
  data: new Float32Array(16).fill(1),
}

describe("createPassthroughMatteProvider", () => {
  it("is ready immediately", () => {
    const provider = createPassthroughMatteProvider(() => null)
    expect(provider.isReady()).toBe(true)
  })

  it("returns the programmed matte", async () => {
    const provider = createPassthroughMatteProvider(() => MATTE)
    const result = await provider.segment({} as CanvasImageSource, 640, 480)
    expect(result).toBe(MATTE)
  })

  it("falls back to a fully-opaque 1×1 matte when source returns null", async () => {
    const provider = createPassthroughMatteProvider(() => null)
    const result = await provider.segment({} as CanvasImageSource, 640, 480)
    expect(result.width).toBe(1)
    expect(result.height).toBe(1)
    expect(result.data.length).toBe(1)
    expect(result.data[0]).toBe(1)
  })

  it("destroy is a no-op", () => {
    const provider = createPassthroughMatteProvider(() => MATTE)
    expect(() => provider.destroy()).not.toThrow()
  })
})
