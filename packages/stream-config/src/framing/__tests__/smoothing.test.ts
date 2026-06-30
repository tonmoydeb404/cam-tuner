import { describe, expect, it } from "vitest"
import {
  applyDeadzone,
  createZoomSmoother,
  lerp,
  smoothCenter,
  smoothZoom,
} from "../smoothing"

describe("lerp", () => {
  it("interpolates between two values", () => {
    expect(lerp(0, 100, 0.25)).toBe(25)
  })

  it("returns a when t is 0", () => {
    expect(lerp(10, 20, 0)).toBe(10)
  })

  it("returns b when t is 1", () => {
    expect(lerp(10, 20, 1)).toBe(20)
  })

  it("clamps t above 1", () => {
    expect(lerp(10, 20, 2)).toBe(20)
  })
})

describe("applyDeadzone", () => {
  it("holds current when movement is below deadzone", () => {
    expect(applyDeadzone(0.5, 0.505, 0.01)).toBe(0.5)
  })

  it("returns target when movement exceeds deadzone", () => {
    expect(applyDeadzone(0.5, 0.6, 0.01)).toBe(0.6)
  })
})

describe("smoothCenter", () => {
  it("holds position when target is within deadzone", () => {
    const current = { x: 0.5, y: 0.5 }
    const result = smoothCenter(current, { x: 0.505, y: 0.495 })
    expect(result).toEqual(current)
  })

  it("moves a fraction toward the target when outside deadzone", () => {
    const current = { x: 0.5, y: 0.5 }
    const result = smoothCenter(current, { x: 0.6, y: 0.5 }, {
      factor: 0.5,
      deadzone: 0,
    })
    // x: 0.5 + (0.6 - 0.5) * 0.5 = 0.55
    expect(result.x).toBeCloseTo(0.55)
    expect(result.y).toBe(0.5)
  })

  it("treats axes independently", () => {
    const current = { x: 0.5, y: 0.5 }
    const result = smoothCenter(current, { x: 0.9, y: 0.501 }, {
      factor: 0.5,
      deadzone: 0.01,
    })
    // x moves toward 0.9, y is within deadzone and holds
    expect(result.x).toBeCloseTo(0.7)
    expect(result.y).toBe(0.5)
  })

  it("clamps the result to 0..1", () => {
    const result = smoothCenter({ x: 0.95, y: 0.05 }, { x: 2, y: -1 }, {
      factor: 1,
      deadzone: 0,
    })
    expect(result.x).toBe(1)
    expect(result.y).toBe(0)
  })
})

describe("smoothZoom", () => {
  it("holds current when within deadzone", () => {
    expect(smoothZoom(1.5, 1.505, { deadzone: 0.01 })).toBe(1.5)
  })

  it("moves a fraction toward the target", () => {
    const result = smoothZoom(1.0, 2.0, { factor: 0.3, deadzone: 0 })
    expect(result).toBeCloseTo(1.3)
  })

  it("returns target exactly when factor is 1", () => {
    expect(smoothZoom(1.0, 2.5, { factor: 1, deadzone: 0 })).toBe(2.5)
  })
})

describe("createZoomSmoother (critically-damped spring)", () => {
  const run = (
    smoother: ReturnType<typeof createZoomSmoother>,
    target: number,
    dt: number,
    steps: number
  ): number[] => {
    const out: number[] = []
    for (let i = 0; i < steps; i++) out.push(smoother.step(target, dt).value)
    return out
  }

  it("converges to the target without overshooting", () => {
    const smoother = createZoomSmoother(1.0)
    const values = run(smoother, 2.0, 1 / 60, 600) // ~10s of frames
    const final = values[values.length - 1]!
    // Converges to within the settle epsilon of the target.
    expect(Math.abs(final - 2.0)).toBeLessThan(0.01)
    // Never overshoots past the target (the flicker-free property).
    expect(Math.max(...values)).toBeLessThanOrEqual(2.0 + 1e-6)
    // Approaches smoothly: the midpoint is strictly between start and target.
    const mid = values[60]!
    expect(mid).toBeGreaterThan(1.0)
    expect(mid).toBeLessThan(2.0)
  })

  it("is frame-rate independent (same wall-clock time → same result)", () => {
    const at60 = createZoomSmoother(1.0)
    const at30 = createZoomSmoother(1.0)
    // 1.0s of wall-clock at two different frame rates.
    const v60 = run(at60, 2.5, 1 / 60, 60).at(-1)!
    const v30 = run(at30, 2.5, 1 / 30, 30).at(-1)!
    expect(v60).toBeCloseTo(v30, 2)
  })

  it("parks exactly when settled and keeps returning the identical value", () => {
    const smoother = createZoomSmoother(1.0)
    // Run to a settled state against a fixed target.
    let settled = false
    for (let i = 0; i < 600 && !settled; i++) {
      settled = smoother.step(2.0, 1 / 60).settled
    }
    expect(settled).toBe(true)

    const parked = smoother.step(2.0, 1 / 60).value
    // Repeated calls with the same target return the exact same value (no drift).
    expect(smoother.step(2.0, 1 / 60).value).toBe(parked)
    expect(smoother.step(2.0, 1 / 60).settled).toBe(true)
  })

  it("re-engages only once the target drifts past the re-engage threshold", () => {
    const smoother = createZoomSmoother(1.0)
    // Park at 2.0.
    for (let i = 0; i < 600; i++) smoother.step(2.0, 1 / 60)
    const parked = smoother.step(2.0, 1 / 60).value

    // A sub-threshold nudge stays frozen.
    expect(smoother.step(2.01, 1 / 60).value).toBe(parked)
    // A larger move (beyond the 0.03 default threshold) re-engages and moves.
    expect(smoother.step(2.2, 1 / 60).value).not.toBe(parked)
  })
})
