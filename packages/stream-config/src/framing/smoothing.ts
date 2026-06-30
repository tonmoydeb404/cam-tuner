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
 * Unlike `smoothZoom` (a lerp + hard deadzone that stutters when the target
 * wobbles across the deadzone edge), the spring glides in and out with zero
 * overshoot and parks exactly when settled — eliminating sub-pixel crop-box
 * flicker during zoom transitions.
 */
export type SpringZoomOptions = {
  /** Time constant in seconds. Lower = snappier. Default ~0.22. */
  timeConstant?: number
  /** Park to rest once within this zoom delta of the target. Default 0.008. */
  settleEpsilon?: number
  /** Park to rest once speed (zoom/sec) drops below this. Default 0.02. */
  settleVelocity?: number
  /** Re-engage from rest only once the target drifts beyond this. Default 0.03. */
  reengageThreshold?: number
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
 *  - While parked (settled), the value is returned *exactly* unchanged so the
 *    caller can push it every frame without triggering downstream rounding.
 *  - It re-engages only once the target drifts past `reengageThreshold`, then
 *    glides toward it without overshoot and re-parks on arrival.
 */
export function createZoomSmoother(
  initial: number,
  options?: SpringZoomOptions
): ZoomSmoother {
  const tau = options?.timeConstant ?? 0.22
  const settleEpsilon = options?.settleEpsilon ?? 0.008
  const settleVelocity = options?.settleVelocity ?? 0.02
  const reengageThreshold = options?.reengageThreshold ?? 0.03

  const w0 = 1 / tau // natural angular frequency; critical damping => dampingRatio = 1

  let value = initial
  let velocity = 0
  let parked = Math.abs(velocity) < settleVelocity

  return {
    step(target, dt) {
      // Frozen at rest: hold the exact value until the target meaningfully moves.
      if (parked && Math.abs(target - value) <= reengageThreshold) {
        return { value, settled: true }
      }
      parked = false

      // Semi-implicit Euler integration of a critically-damped spring.
      // a = w0^2 * (target - value) - 2*w0*velocity
      const accel = w0 * w0 * (target - value) - 2 * w0 * velocity
      velocity += accel * dt
      value += velocity * dt

      // Park exactly on arrival to kill residual sub-pixel drift (rest flicker).
      if (
        Math.abs(value - target) < settleEpsilon &&
        Math.abs(velocity) < settleVelocity
      ) {
        velocity = 0
        parked = true
        return { value, settled: true }
      }
      return { value, settled: false }
    },
  }
}
