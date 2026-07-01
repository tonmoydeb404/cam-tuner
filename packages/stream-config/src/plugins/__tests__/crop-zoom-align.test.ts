/**
 * Tests for the crop-zoom-align plugin.
 * Canvas-dependent drawCanvas tests are skipped in Node — they require
 * a real browser or canvas polyfill. We test the pure logic instead.
 */
import { describe, expect, it } from "vitest"
import { createCropZoomAlignPlugin } from "../crop-zoom-align"
import type { CropConfig } from "../../utils/math"

const HD = { width: 1920, height: 1080 }

const BASE_CONFIG: CropConfig = {
  aspectRatio: 4 / 3,
  zoom: 1,
  alignX: "center",
  alignY: "center",
  barColor: "#000000",
}

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

  it("has a getOutputSize method", () => {
    const plugin = createCropZoomAlignPlugin()
    expect(typeof plugin.getOutputSize).toBe("function")
  })

  it("returns distinct plugin instances on each call", () => {
    const a = createCropZoomAlignPlugin()
    const b = createCropZoomAlignPlugin()
    // Each instance has its own cached values
    expect(a).not.toBe(b)
  })
})

describe("crop-zoom-align getOutputSize", () => {
  it("returns null when letterbox is enabled (keep source resolution)", () => {
    const plugin = createCropZoomAlignPlugin()
    const size = plugin.getOutputSize!(HD, { ...BASE_CONFIG, letterbox: true })
    expect(size).toBeNull()
  })

  it("defaults to null when letterbox is unspecified", () => {
    const plugin = createCropZoomAlignPlugin()
    const size = plugin.getOutputSize!(HD, BASE_CONFIG)
    expect(size).toBeNull()
  })

  it("returns the crop-box dimensions when letterbox is off (4:3 of 16:9)", () => {
    const plugin = createCropZoomAlignPlugin()
    const size = plugin.getOutputSize!(HD, {
      ...BASE_CONFIG,
      aspectRatio: 4 / 3,
      letterbox: false,
    })
    // 1080 * 4/3 = 1440 wide, full height
    expect(size).toEqual({ width: 1440, height: 1080 })
  })

  it("returns a square output for 1:1 crop when letterbox is off", () => {
    const plugin = createCropZoomAlignPlugin()
    const size = plugin.getOutputSize!(HD, {
      ...BASE_CONFIG,
      aspectRatio: 1,
      letterbox: false,
    })
    expect(size).toEqual({ width: 1080, height: 1080 })
  })

  it("keeps a stable output size when zoomed in and letterbox is off", () => {
    const plugin = createCropZoomAlignPlugin()
    const size = plugin.getOutputSize!(HD, {
      ...BASE_CONFIG,
      zoom: 2,
      letterbox: false,
    })
    // Output is the zoom=1 crop box (1440x1080) held stable as zoom changes, so
    // the canvas backing store is never re-dimensioned mid-transition.
    expect(size).toEqual({ width: 1440, height: 1080 })
  })
})
