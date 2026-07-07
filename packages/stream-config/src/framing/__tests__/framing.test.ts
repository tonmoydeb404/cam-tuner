import { describe, expect, it } from "vitest"
import {
  computeFramingCenter,
  computeFramingZoom,
  faceCenter,
  unionBox,
} from "../framing"
import type { FaceBox } from "../../tracking/types"
import type { Size } from "../../utils/math"

const FRAME: Size = { width: 1000, height: 1000 }

const face = (
  x: number,
  y: number,
  width: number,
  height: number
): FaceBox => ({ x, y, width, height })

describe("faceCenter", () => {
  it("returns the face centroid normalized to 0..1", () => {
    expect(faceCenter(face(100, 100, 200, 200), FRAME)).toEqual({
      x: 0.2,
      y: 0.2,
    })
  })

  it("clamps a face that extends past the frame edge", () => {
    // centroid x = 900 + 150 = 1050 → 1.05 → clamp to 1
    expect(faceCenter(face(900, 0, 300, 200), FRAME).x).toBe(1)
  })

  it("clamps a face with a negative origin", () => {
    expect(faceCenter(face(-100, 0, 200, 200), FRAME).x).toBe(0)
  })
})

describe("unionBox", () => {
  it("returns null for no faces", () => {
    expect(unionBox([])).toBeNull()
  })

  it("returns the box itself for a single face", () => {
    expect(unionBox([face(10, 20, 30, 40)])).toEqual(face(10, 20, 30, 40))
  })

  it("returns the tight bounding box of multiple faces", () => {
    const result = unionBox([
      face(100, 100, 200, 200),
      face(500, 500, 200, 200),
    ])
    expect(result).toEqual({ x: 100, y: 100, width: 600, height: 600 })
  })
})

describe("computeFramingCenter", () => {
  it("returns null when there are no faces", () => {
    expect(computeFramingCenter([], FRAME)).toBeNull()
  })

  it("uses the single face centroid", () => {
    expect(computeFramingCenter([face(100, 100, 200, 200)], FRAME)).toEqual({
      x: 0.2,
      y: 0.2,
    })
  })

  it("uses the union-box centroid for multiple faces", () => {
    const result = computeFramingCenter(
      [face(100, 100, 200, 200), face(500, 500, 200, 200)],
      FRAME
    )
    // union {100,100,600,600} → centroid (400,400) → 0.4
    expect(result).toEqual({ x: 0.4, y: 0.4 })
  })
})

describe("computeFramingZoom", () => {
  it("returns null when there are no faces", () => {
    expect(computeFramingZoom([], FRAME)).toBeNull()
  })

  it("zooms in subtly for a small face", () => {
    // face 200×200 in 1000×1000 frame, padding 30% → padded 260×260
    // targetFill 0.35: zoom = 0.35*1000/260 ≈ 1.35
    const zoom = computeFramingZoom([face(400, 400, 200, 200)], FRAME)
    expect(zoom).toBeCloseTo(1.346, 1)
  })

  it("returns 1 (min) for faces that fill most of the frame", () => {
    // face 800×800 → padded 1040×1040 → zoom = 0.35*1000/1040 ≈ 0.34 → clamped to 1
    const zoom = computeFramingZoom([face(100, 100, 800, 800)], FRAME)
    expect(zoom).toBe(1)
  })

  it("uses the more constraining dimension", () => {
    // wide face 500×100 → padded 650×130
    // zoomW = 0.35*1000/650 ≈ 0.54, zoomH = 0.35*1000/130 ≈ 2.69 → min = 0.54 → clamped 1
    const zoom = computeFramingZoom([face(250, 450, 500, 100)], FRAME)
    expect(zoom).toBe(1)
  })

  it("respects maxZoom option", () => {
    // very small face would produce high zoom, clamp to maxZoom
    const zoom = computeFramingZoom([face(490, 490, 20, 20)], FRAME, {
      maxZoom: 2,
    })
    expect(zoom).toBe(2)
  })

  it("accounts for multiple faces via union box", () => {
    // two faces: union {100,400,800,200} → padded {1040,260}
    // zoomW = 0.35*1000/1040 ≈ 0.34, zoomH = 0.35*1000/260 ≈ 1.35 → min = 0.34 → clamped 1
    const zoom = computeFramingZoom(
      [face(100, 400, 200, 200), face(700, 400, 200, 200)],
      FRAME
    )
    expect(zoom).toBe(1)
  })

  describe("production framing (center-stage defaults)", () => {
    // Mirrors DEFAULT_CENTER_STAGE_CONFIG: targetFill 0.4, padding 0.3,
    // minZoom 1.0, maxZoom 2.5 — close faces stay unzoomed (more area),
    // far faces zoom in up to the ceiling.
    const PROD = { targetFill: 0.4, padding: 0.3, minZoom: 1.0, maxZoom: 2.5 }

    it("does not zoom a close face (more visible area)", () => {
      // 800×800 → padded 1040 → zoom = 0.4*1000/1040 ≈ 0.38 → clamped to 1
      expect(computeFramingZoom([face(100, 100, 800, 800)], FRAME, PROD)).toBe(1)
    })

    it("applies a moderate zoom to a mid-distance face", () => {
      // 200×200 → padded 260 → zoom = 0.4*1000/260 ≈ 1.54
      expect(computeFramingZoom([face(400, 400, 200, 200)], FRAME, PROD)).toBeCloseTo(
        1.538,
        1
      )
    })

    it("zooms a far face all the way to maxZoom", () => {
      // 40×40 → padded 52 → zoom = 0.4*1000/52 ≈ 7.7 → clamped to 2.5
      expect(computeFramingZoom([face(480, 480, 40, 40)], FRAME, PROD)).toBe(2.5)
    })
  })
})
