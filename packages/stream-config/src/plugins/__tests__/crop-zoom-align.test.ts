/**
 * Tests for the crop-zoom-align plugin.
 * Canvas-dependent drawCanvas tests are skipped in Node — they require
 * a real browser or canvas polyfill. We test the pure logic instead.
 */
import { describe, expect, it } from "vitest"
import { createCropZoomAlignPlugin } from "../crop-zoom-align"

describe("crop-zoom-align plugin", () => {
  it("has correct plugin id", () => {
    const plugin = createCropZoomAlignPlugin()
    expect(plugin.id).toBe("core:crop-zoom-align")
  })

  it("has a drawCanvas method", () => {
    const plugin = createCropZoomAlignPlugin()
    expect(typeof plugin.drawCanvas).toBe("function")
  })

  it("has a transformFrame method", () => {
    const plugin = createCropZoomAlignPlugin()
    expect(typeof plugin.transformFrame).toBe("function")
  })

  it("returns distinct plugin instances on each call", () => {
    const a = createCropZoomAlignPlugin()
    const b = createCropZoomAlignPlugin()
    // Each instance has its own cached values
    expect(a).not.toBe(b)
  })
})
