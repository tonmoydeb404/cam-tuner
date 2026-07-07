import { describe, expect, it } from "vitest"
import { toFaceBoxes } from "../detector-mediapipe"

describe("toFaceBoxes", () => {
  it("maps originX/originY to x/y and lifts confidence", () => {
    const result = toFaceBoxes([
      {
        boundingBox: { originX: 10, originY: 20, width: 100, height: 120 },
        categories: [{ score: 0.9 }],
      },
    ])
    expect(result).toEqual([
      { x: 10, y: 20, width: 100, height: 120, confidence: 0.9 },
    ])
  })

  it("omits confidence when no category score is present", () => {
    const result = toFaceBoxes([
      { boundingBox: { originX: 0, originY: 0, width: 50, height: 50 } },
    ])
    expect(result).toEqual([{ x: 0, y: 0, width: 50, height: 50 }])
  })

  it("skips detections without a bounding box", () => {
    expect(toFaceBoxes([{ categories: [{ score: 0.5 }] }])).toEqual([])
  })

  it("maps multiple detections preserving order", () => {
    const result = toFaceBoxes([
      { boundingBox: { originX: 1, originY: 2, width: 3, height: 4 } },
      { boundingBox: { originX: 5, originY: 6, width: 7, height: 8 } },
    ])
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ x: 1, y: 2, width: 3, height: 4 })
    expect(result[1]).toEqual({ x: 5, y: 6, width: 7, height: 8 })
  })

  it("returns empty for no detections", () => {
    expect(toFaceBoxes([])).toEqual([])
  })
})
