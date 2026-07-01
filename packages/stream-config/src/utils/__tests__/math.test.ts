import { describe, expect, it } from "vitest"
import {
  calculateAlignOffset,
  calculateCenteredOffset,
  calculateCropBox,
  calculateDestinationBox,
  clamp01,
  getSourceSize,
} from "../math"
import type { Box, CropConfig, Size } from "../math"

const HD: Size = { width: 1920, height: 1080 }
const SD: Size = { width: 640, height: 480 }

const CENTER: CropConfig = {
  aspectRatio: 16 / 9,
  zoom: 1,
  alignX: "center",
  alignY: "center",
  barColor: "#000000",
}

describe("calculateCropBox", () => {
  it("returns full dimensions when aspect matches and zoom is 1", () => {
    const box = calculateCropBox(HD, CENTER)
    expect(box.width).toBe(1920)
    expect(box.height).toBe(1080)
    expect(box.x).toBe(0)
    expect(box.y).toBe(0)
  })

  it("crops width when original is wider than target ratio (16:9 → 4:3)", () => {
    const config: CropConfig = { ...CENTER, aspectRatio: 4 / 3 }
    const box = calculateCropBox(HD, config)
    // 1080 * 4/3 = 1440
    expect(box.width).toBe(1440)
    expect(box.height).toBe(1080)
    // Centered: (1920 - 1440) / 2 = 240
    expect(box.x).toBe(240)
    expect(box.y).toBe(0)
  })

  it("crops height when original is taller than target ratio (16:9 → 21:9)", () => {
    const config: CropConfig = { ...CENTER, aspectRatio: 21 / 9 }
    const box = calculateCropBox(HD, config)
    // 1920 / (21/9) = 1920 * 9/21 ≈ 823
    expect(box.height).toBe(Math.round(1920 / (21 / 9)))
    expect(box.width).toBe(1920)
  })

  it("applies zoom by shrinking the crop box", () => {
    const config: CropConfig = { ...CENTER, zoom: 2 }
    const box = calculateCropBox(HD, config)
    expect(box.width).toBe(1920 / 2)
    expect(box.height).toBe(1080 / 2)
    // Centered: (1920 - 960) / 2 = 480
    expect(box.x).toBe(480)
    expect(box.y).toBe(270)
  })

  it("aligns crop box to top-left", () => {
    const config: CropConfig = {
      ...CENTER,
      zoom: 2,
      alignX: "left",
      alignY: "top",
    }
    const box = calculateCropBox(HD, config)
    expect(box.x).toBe(0)
    expect(box.y).toBe(0)
  })

  it("aligns crop box to bottom-right", () => {
    const config: CropConfig = {
      ...CENTER,
      zoom: 2,
      alignX: "right",
      alignY: "bottom",
    }
    const box = calculateCropBox(HD, config)
    expect(box.x).toBe(1920 - box.width)
    expect(box.y).toBe(1080 - box.height)
  })

  it("handles 1:1 square ratio", () => {
    const config: CropConfig = { ...CENTER, aspectRatio: 1 }
    const box = calculateCropBox(HD, config)
    expect(box.width).toBe(1080)
    expect(box.height).toBe(1080)
    expect(box.x).toBe((1920 - 1080) / 2)
  })

  it("handles 9:16 portrait ratio", () => {
    const config: CropConfig = { ...CENTER, aspectRatio: 9 / 16 }
    const box = calculateCropBox(HD, config)
    // 1920 / (9/16) = 1920 * 16/9 ≈ 3413 > 1080, so width-based
    // Actually 1920 / (9/16) = 3413 > 1080 height → crop width
    // Wait: aspectRatio 9/16 = 0.5625. originalAspect = 1920/1080 = 1.777
    // 1.777 > 0.5625 → original is wider → cropWidth = 1080 * 0.5625 = 607.5 ≈ 608
    expect(box.height).toBe(1080)
    expect(box.width).toBe(Math.round(1080 * (9 / 16)))
  })

  it("clamps zoom at minimum 1", () => {
    const config: CropConfig = { ...CENTER, zoom: 0.5 }
    const box = calculateCropBox(HD, config)
    // zoom 0.5 is clamped to 1 by Math.max(1, zoom)
    expect(box.width).toBe(1920)
    expect(box.height).toBe(1080)
  })

  it("works with SD resolution (4:3)", () => {
    // 640x480 is 4:3, target 16:9 → crops height
    const box = calculateCropBox(SD, CENTER)
    expect(box.width).toBe(640)
    // 640 / (16/9) = 360
    expect(box.height).toBe(360)
  })
})

describe("calculateDestinationBox", () => {
  it("centers a cropped box that is wider than destination", () => {
    const dest: Size = { width: 1920, height: 1080 }
    const cropBox: Box = { x: 0, y: 0, width: 1920, height: 800 }
    const result = calculateDestinationBox(dest, cropBox)
    // 1920/800 = 2.4, dest 1920/1080 = 1.78 → wider, fit to width
    expect(result.width).toBe(1920)
    expect(result.height).toBe(Math.round(1920 / (1920 / 800)))
    expect(result.x).toBe(0)
    expect(result.y).toBe(Math.round((1080 - result.height) / 2))
  })

  it("centers a cropped box that is taller than destination", () => {
    const dest: Size = { width: 1920, height: 1080 }
    const cropBox: Box = { x: 0, y: 0, width: 800, height: 1920 }
    const result = calculateDestinationBox(dest, cropBox)
    // 800/1920 = 0.417, dest 1.78 → taller, fit to height
    expect(result.height).toBe(1080)
    expect(result.width).toBe(Math.round(1080 * (800 / 1920)))
  })

  it("returns full dimensions when crop matches destination", () => {
    const dest: Size = { width: 1920, height: 1080 }
    const cropBox: Box = { x: 0, y: 0, width: 1920, height: 1080 }
    const result = calculateDestinationBox(dest, cropBox)
    expect(result.width).toBe(1920)
    expect(result.height).toBe(1080)
    expect(result.x).toBe(0)
    expect(result.y).toBe(0)
  })
})

describe("clamp01", () => {
  it("clamps values below 0 to 0", () => {
    expect(clamp01(-0.5)).toBe(0)
  })

  it("clamps values above 1 to 1", () => {
    expect(clamp01(1.5)).toBe(1)
  })

  it("passes through values within 0..1", () => {
    expect(clamp01(0.3)).toBe(0.3)
  })

  it("collapses NaN to 0", () => {
    expect(clamp01(NaN)).toBe(0)
  })
})

describe("calculateAlignOffset", () => {
  it("returns 0 for start (left/top) discrete alignment", () => {
    expect(calculateAlignOffset(400, "left")).toBe(0)
    expect(calculateAlignOffset(400, "top")).toBe(0)
  })

  it("returns full available for end (right/bottom) discrete alignment", () => {
    expect(calculateAlignOffset(400, "right")).toBe(400)
    expect(calculateAlignOffset(400, "bottom")).toBe(400)
  })

  it("returns half for center discrete alignment", () => {
    expect(calculateAlignOffset(400, "center")).toBe(200)
  })

  it("uses continuous value when provided (overrides discrete)", () => {
    // 0.25 of 400 = 100
    expect(calculateAlignOffset(400, "center", 0.25)).toBe(100)
    // discrete ignored when continuous present
    expect(calculateAlignOffset(400, "left", 0.75)).toBe(300)
  })

  it("clamps continuous values outside 0..1", () => {
    expect(calculateAlignOffset(400, "center", 1.5)).toBe(400)
    expect(calculateAlignOffset(400, "center", -0.2)).toBe(0)
  })
})

describe("calculateCropBox with alignCenter", () => {
  it("centers crop on alignCenter 0.5 (matches discrete center)", () => {
    const config: CropConfig = { ...CENTER, zoom: 2, alignCenter: { x: 0.5, y: 0.5 } }
    const discrete = calculateCropBox(HD, { ...CENTER, zoom: 2 })
    const continuous = calculateCropBox(HD, config)
    expect(continuous).toEqual(discrete)
  })

  it("shifts crop horizontally toward the right for high x", () => {
    const left = calculateCropBox(HD, { ...CENTER, zoom: 2, alignCenter: { x: 0, y: 0.5 } })
    const right = calculateCropBox(HD, { ...CENTER, zoom: 2, alignCenter: { x: 1, y: 0.5 } })
    // higher x shifts the crop box further right
    expect(right.x).toBeGreaterThan(left.x)
    expect(right.x + right.width).toBeLessThanOrEqual(1920)
  })

  it("places crop at far right for alignCenter x = 1", () => {
    const box = calculateCropBox(HD, { ...CENTER, zoom: 2, alignCenter: { x: 1, y: 0.5 } })
    expect(box.x).toBe(1920 - box.width)
  })

  it("shifts crop vertically toward the bottom for high y", () => {
    const top = calculateCropBox(HD, { ...CENTER, zoom: 2, alignCenter: { x: 0.5, y: 0 } })
    const bottom = calculateCropBox(HD, { ...CENTER, zoom: 2, alignCenter: { x: 0.5, y: 1 } })
    expect(bottom.y).toBeGreaterThan(top.y)
  })

  it("falls back to discrete align when alignCenter is undefined", () => {
    const box = calculateCropBox(HD, { ...CENTER, zoom: 2, alignX: "left", alignY: "top" })
    expect(box.x).toBe(0)
    expect(box.y).toBe(0)
  })

  it("centers an off-center subject while panning room exists", () => {
    // zoom 2 on 1920-wide → zoomWidth 960, panning range [0, 960].
    // Subject at x=0.6 (1152px) is centerable: crop start = 1152 - 480 = 672.
    const box = calculateCropBox(HD, { ...CENTER, zoom: 2, alignCenter: { x: 0.6, y: 0.5 } })
    expect(box.x).toBe(672)
    // The subject lands at the exact center of the crop (not at 0.6 of it).
    expect(0.6 * 1920 - box.x).toBe(box.width / 2)
  })

  it("pins to the frame edge (keeps subject in frame) when there is no room to center", () => {
    // Subject at x=0.9 (1728px) can't be centered; crop clamps to the right edge.
    const box = calculateCropBox(HD, { ...CENTER, zoom: 2, alignCenter: { x: 0.9, y: 0.5 } })
    expect(box.x).toBe(1920 - box.width)
    expect(box.x + box.width).toBe(1920)
  })
})

describe("calculateCenteredOffset", () => {
  it("centers a mid-frame subject", () => {
    // subject 0.5 of 1000 = 500; zoomSize 400 → start 500-200 = 300
    expect(calculateCenteredOffset(0.5, 400, 1000)).toBe(300)
  })

  it("clamps to the left edge", () => {
    expect(calculateCenteredOffset(0.1, 400, 1000)).toBe(0)
  })

  it("clamps to the right edge", () => {
    expect(calculateCenteredOffset(0.9, 400, 1000)).toBe(600)
  })

  it("returns 0 when the zoomed box is at least as large as the frame", () => {
    expect(calculateCenteredOffset(0.5, 1200, 1000)).toBe(0)
  })
})

describe("getSourceSize", () => {
  it("reads dimensions from an HTMLVideoElement-like source", () => {
    const source = { videoWidth: 1280, videoHeight: 720 } as CanvasImageSource
    expect(getSourceSize(source)).toEqual({ width: 1280, height: 720 })
  })

  it("reads dimensions from a canvas-like source (width/height)", () => {
    const source = { width: 1080, height: 1080 } as CanvasImageSource
    expect(getSourceSize(source)).toEqual({ width: 1080, height: 1080 })
  })

  it("reads dimensions from a VideoFrame-like source (displayWidth)", () => {
    const source = {
      displayWidth: 1920,
      displayHeight: 1080,
    } as CanvasImageSource
    expect(getSourceSize(source)).toEqual({ width: 1920, height: 1080 })
  })

  it("reads dimensions from an image-like source (naturalWidth)", () => {
    const source = {
      naturalWidth: 640,
      naturalHeight: 480,
    } as CanvasImageSource
    expect(getSourceSize(source)).toEqual({ width: 640, height: 480 })
  })

  it("falls back to {0,0} when no dimension fields are present", () => {
    const source = {} as CanvasImageSource
    expect(getSourceSize(source)).toEqual({ width: 0, height: 0 })
  })
})
