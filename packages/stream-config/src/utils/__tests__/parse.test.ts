import { describe, expect, it } from "vitest"
import { parseAspectRatio, parseAlignPosition } from "../config"

describe("parseAspectRatio", () => {
  it("parses 16:9", () => {
    expect(parseAspectRatio("16:9")).toBeCloseTo(16 / 9)
  })

  it("parses 4:3", () => {
    expect(parseAspectRatio("4:3")).toBeCloseTo(4 / 3)
  })

  it("parses 1:1", () => {
    expect(parseAspectRatio("1:1")).toBe(1)
  })

  it("parses 9:16", () => {
    expect(parseAspectRatio("9:16")).toBeCloseTo(9 / 16)
  })

  it("falls back to 16:9 for unknown ratios", () => {
    expect(parseAspectRatio("21:9")).toBeCloseTo(16 / 9)
    expect(parseAspectRatio("")).toBeCloseTo(16 / 9)
  })
})

describe("parseAlignPosition", () => {
  it("parses center", () => {
    expect(parseAlignPosition("center")).toEqual({
      alignX: "center",
      alignY: "center",
    })
  })

  it("parses top-left", () => {
    expect(parseAlignPosition("top-left")).toEqual({
      alignX: "left",
      alignY: "top",
    })
  })

  it("parses bottom-right", () => {
    expect(parseAlignPosition("bottom-right")).toEqual({
      alignX: "right",
      alignY: "bottom",
    })
  })

  it("parses top-center", () => {
    expect(parseAlignPosition("top-center")).toEqual({
      alignX: "center",
      alignY: "top",
    })
  })

  it("parses center-left", () => {
    expect(parseAlignPosition("center-left")).toEqual({
      alignX: "left",
      alignY: "center",
    })
  })

  it("parses all 9 positions", () => {
    const positions = [
      "top-left",
      "top-center",
      "top-right",
      "center-left",
      "center",
      "center-right",
      "bottom-left",
      "bottom-center",
      "bottom-right",
    ] as const

    for (const pos of positions) {
      const result = parseAlignPosition(pos)
      expect(result).toHaveProperty("alignX")
      expect(result).toHaveProperty("alignY")
    }
  })
})
