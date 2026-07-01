/**
 * Pure smoothing utilities that keep the framing stable (no jitter) while
 * still tracking motion smoothly — the feel of macOS Center Stage.
 */
import type { AlignCenter } from "../utils/math"
import { clamp01 } from "../utils/math"

export type SmoothingOptions = {
  /** Per-frame lerp factor toward the target, 0..1. Higher = snappier. */
  factor?: number
  /** Movement below this (normalized) is ignored per-axis. Prevents jitter. */
  deadzone?: number
}

const DEFAULT_FACTOR = 0.15
const DEFAULT_DEADZONE = 0.01

/**
 * Linear interpolation between a and b by t (clamped to 0..1).
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp01(t)
}

/**
 * Hysteresis: returns `current` when the target hasn't moved further than
 * `deadzone`, otherwise returns `target`. Stops sub-threshold jitter.
 */
export function applyDeadzone(
  current: number,
  target: number,
  deadzone: number
): number {
  return Math.abs(target - current) < deadzone ? current : target
}

/**
 * Smoothly moves a scalar `current` toward `target` using lerp + deadzone.
 * Used for zoom (a single value, unlike AlignCenter which has two axes).
 */
export function smoothZoom(
  current: number,
  target: number,
  options?: SmoothingOptions
): number {
  const factor = options?.factor ?? DEFAULT_FACTOR
  const deadzone = options?.deadzone ?? DEFAULT_DEADZONE
  if (applyDeadzone(current, target, deadzone) === current) return current
  return lerp(current, target, factor)
}

/**
 * Smoothly moves `current` toward `target` on each axis using lerp + deadzone.
 * Axes are treated independently so horizontal motion can track while vertical
 * stays rock-steady (and vice-versa).
 */
export function smoothCenter(
  current: AlignCenter,
  target: AlignCenter,
  options?: SmoothingOptions
): AlignCenter {
  const factor = options?.factor ?? DEFAULT_FACTOR
  const deadzone = options?.deadzone ?? DEFAULT_DEADZONE

  const smoothAxis = (c: number, t: number): number => {
    if (applyDeadzone(c, t, deadzone) === c) return c
    return clamp01(lerp(c, t, factor))
  }

  return {
    x: smoothAxis(current.x, target.x),
    y: smoothAxis(current.y, target.y),
  }
}

/**
 * Options for the critically-damped zoom spring.
 *
 * The spring glides toward its target with zero overshoot and snaps exactly to
 * rest on arrival — eliminating sub-pixel crop-box flicker. Unlike a hard
 * deadzone it tracks moving targets smoothly instead of freezing and then
 * jumping once a threshold is crossed (which caused visible "pumping").
 */
export type SpringZoomOptions = {
  /** Time constant in seconds. Lower = snappier. Default ~0.22. */
  timeConstant?: number
  /** Snap to rest once within this zoom delta of the target. Default 0.006. */
  settleEpsilon?: number
  /** Snap to rest once speed (zoom/sec) drops below this. Default 0.015. */
  settleVelocity?: number
  /** Max integration step (seconds). Larger frame deltas are sub-stepped so an
   *  uneven / throttled rAF cadence can't make the spring ring. Default 1/60. */
  maxStep?: number
}

export type ZoomStepResult = { value: number; settled: boolean }

export type ZoomSmoother = {
  /** Advance one frame. `dt` is elapsed seconds (frame-rate independent). */
  step: (target: number, dt: number) => ZoomStepResult
}

/**
 * Creates a frame-rate-independent, critically-damped spring smoother for a
 * single scalar (zoom). Holds internal position + velocity, so it must live
 * across frames (keep the returned object).
 *
 * Behaviour:
 *  - Always integrates toward the target (sub-stepped for large `dt`), so a
 *    moving target glides smoothly without overshoot.
 *  - Snaps to rest exactly (value := target, velocity := 0) once settled, so a
 *    steady target yields a perfectly stable, drift-free value frame to frame.
 */
export function createZoomSmoother(
  initial: number,
  options?: SpringZoomOptions
): ZoomSmoother {
  const tau = options?.timeConstant ?? 0.22
  const settleEpsilon = options?.settleEpsilon ?? 0.006
  const settleVelocity = options?.settleVelocity ?? 0.015
  const maxStep = options?.maxStep ?? 1 / 60

  const w0 = 1 / tau // natural angular frequency; critical damping => dampingRatio = 1

  let value = initial
  let velocity = 0

  return {
    step(target, dt) {
      // Sub-step large frame deltas. Semi-implicit Euler is only accurate while
      // w0·dt stays small; without this, a throttled tab (dt up to ~0.1s) would
      // push w0·dt to ~0.45 and the "critically-damped" spring would ring.
      let remaining = Math.max(0, dt)
      while (remaining > 1e-6) {
        const step = Math.min(remaining, maxStep)
        // a = w0^2 * (target - value) - 2*w0*velocity
        const accel = w0 * w0 * (target - value) - 2 * w0 * velocity
        velocity += accel * step
        value += velocity * step
        remaining -= step
      }

      // Snap to rest exactly on arrival to kill residual sub-pixel drift.
      if (
        Math.abs(value - target) < settleEpsilon &&
        Math.abs(velocity) < settleVelocity
      ) {
        velocity = 0
        value = target
        return { value, settled: true }
      }
      return { value, settled: false }
    },
  }
}
