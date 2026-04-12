import { describe, expect, it } from "vitest"
import { calculateCropBox, calculateDestinationBox } from "../math"
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
