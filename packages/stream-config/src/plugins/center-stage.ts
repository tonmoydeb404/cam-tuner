/**
 * Center Stage controller plugin.
 *
 * Unlike CropZoomAlign (which draws), this plugin is a *controller*: it draws
 * nothing. Each frame it runs throttled, non-blocking face detection, computes
 * a framing center AND zoom level, smooths both, and pushes the results into
 * CropZoomAlign's `alignCenter` and `zoomOverride` fields via the injected
 * modifier.
 *
 * Stability is achieved via **two-stage smoothing**:
 *
 * 1. Target stabilisation — an EMA blends each new detection result into a
 *    stabilised target, absorbing per-detection jitter before it reaches the
 *    movement layer.
 *
 * 2. Movement smoothing — a slow lerp + deadzone eases the actual crop
 *    position/zoom toward the stabilised target, producing the deliberate,
 *    cinematic motion characteristic of macOS Center Stage.
 *
 * Must run on the Canvas engine (force it when enabled).
 */
import { CROP_ZOOM_ALIGN_PLUGIN_ID } from "./crop-zoom-align"
import type { CropConfig } from "../utils/math"
import type { AlignCenter } from "../utils/math"
import type { Size } from "../utils/math"
import { computeFramingCenter, computeFramingZoom } from "../framing/framing"
import type { FramingZoomOptions } from "../framing/framing"
import { createZoomSmoother, smoothCenter } from "../framing/smoothing"
import type { SmoothingOptions } from "../framing/smoothing"
import type { FaceDetector } from "../tracking/types"
import type { StreamModifier, StreamPlugin } from "../types"

export const CENTER_STAGE_PLUGIN_ID = "core:center-stage"

export type CenterStageConfig = {
  enabled: boolean
  /** Per-frame lerp toward target (default 0.05 — slow & cinematic). */
  smoothingFactor?: number
  /** Movement below this is ignored per-axis (default 0.03). */
  deadzone?: number
  /** Minimum ms between detections (default 120). */
  detectIntervalMs?: number
  /** EMA weight for blending raw detection into stabilised target (default 0.3). */
  targetStabilization?: number
  /** Fraction of the frame the padded face box should fill (default 0.4). Lower = see more of the room, but far faces zoom less. */
  targetFill?: number
  /** Padding around the face union box as a fraction of box size (default 0.3). */
  padding?: number
  /** Minimum zoom (default 1.0 — never zoom out beyond the sensor). */
  minZoom?: number
  /** Maximum zoom ceiling, reached for far / small faces (default 2.5). */
  maxZoom?: number
}

export const DEFAULT_CENTER_STAGE_CONFIG: CenterStageConfig = {
  enabled: true,
  smoothingFactor: 0.05,
  deadzone: 0.03,
  detectIntervalMs: 120,
  targetStabilization: 0.3,
  targetFill: 0.4,
  padding: 0.3,
  minZoom: 1.0,
  maxZoom: 2.5,
}

const DEFAULT_DETECT_INTERVAL_MS = 120
const CENTER: AlignCenter = { x: 0.5, y: 0.5 }

function now(): number {
  return typeof performance !== "undefined"
    ? performance.now()
    : Date.now()
}

/**
 * Resolves the effective per-frame config by layering the runtime values
 * (from the engine) over the factory-supplied defaults. Runtime wins, but
 * anything omitted falls back to the factory config.
 */
function resolveConfig(
  defaults: CenterStageConfig,
  runtime: Partial<CenterStageConfig> | undefined
): CenterStageConfig {
  if (!runtime) return { ...defaults }
  return {
    enabled: runtime.enabled ?? defaults.enabled,
    smoothingFactor: runtime.smoothingFactor ?? defaults.smoothingFactor,
    deadzone: runtime.deadzone ?? defaults.deadzone,
    detectIntervalMs: runtime.detectIntervalMs ?? defaults.detectIntervalMs,
    targetStabilization:
      runtime.targetStabilization ?? defaults.targetStabilization,
    targetFill: runtime.targetFill ?? defaults.targetFill,
    padding: runtime.padding ?? defaults.padding,
    minZoom: runtime.minZoom ?? defaults.minZoom,
    maxZoom: runtime.maxZoom ?? defaults.maxZoom,
  }
}

/**
 * Creates a Center Stage controller plugin.
 *
 * @param modifier The stream modifier (used to push overrides into CropZoomAlign).
 * @param detector The face detector backend (e.g. passthrough, native, MediaPipe).
 * @param initialConfig Optional defaults for smoothing / detection rate.
 */
export function createCenterStagePlugin(
  modifier: StreamModifier,
  detector: FaceDetector,
  initialConfig?: Partial<CenterStageConfig>
): StreamPlugin<CenterStageConfig> {
  const defaults: CenterStageConfig = {
    enabled: initialConfig?.enabled ?? DEFAULT_CENTER_STAGE_CONFIG.enabled,
    smoothingFactor:
      initialConfig?.smoothingFactor ??
      DEFAULT_CENTER_STAGE_CONFIG.smoothingFactor,
    deadzone: initialConfig?.deadzone ?? DEFAULT_CENTER_STAGE_CONFIG.deadzone,
    detectIntervalMs:
      initialConfig?.detectIntervalMs ??
      DEFAULT_CENTER_STAGE_CONFIG.detectIntervalMs,
    targetStabilization:
      initialConfig?.targetStabilization ??
      DEFAULT_CENTER_STAGE_CONFIG.targetStabilization,
    targetFill: initialConfig?.targetFill ?? DEFAULT_CENTER_STAGE_CONFIG.targetFill,
    padding: initialConfig?.padding ?? DEFAULT_CENTER_STAGE_CONFIG.padding,
    minZoom: initialConfig?.minZoom ?? DEFAULT_CENTER_STAGE_CONFIG.minZoom,
    maxZoom: initialConfig?.maxZoom ?? DEFAULT_CENTER_STAGE_CONFIG.maxZoom,
  }

  let current: AlignCenter = { ...CENTER }
  let currentZoom = 1
  const zoomSmoother = createZoomSmoother(currentZoom)
  let stableTarget: AlignCenter | null = null
  let stableZoomTarget: number | null = null
  let frameSize: Size = { width: 0, height: 0 }
  let lastDetectTime = 0
  let lastFrameTime = 0
  let detecting = false
  let wasEnabled = false
  let destroyed = false

  function pushOverride(
    align: AlignCenter | undefined,
    zoom: number | undefined
  ): void {
    try {
      modifier.updatePluginConfig<CropConfig>(CROP_ZOOM_ALIGN_PLUGIN_ID, {
        alignCenter: align,
        zoomOverride: zoom,
      })
    } catch {
      // Modifier may be tearing down — safe to ignore.
    }
  }

  function runDetection(
    videoEl: HTMLVideoElement,
    width: number,
    height: number,
    interval: number,
    stabFactor: number,
    zoomOptions: FramingZoomOptions
  ): void {
    // The `detecting` flag alone prevents overlapping calls. We intentionally
    // do NOT check isReady() here — detect() triggers lazy initialisation
    // internally, and gating on isReady() would deadlock (init never starts).
    if (detecting) return
    if (now() - lastDetectTime < interval) return
    detecting = true
    lastDetectTime = now()
    detector
      .detect(videoEl, width, height)
      .then((faces) => {
        // Stage 1: blend raw detection into stabilised targets via EMA.
        // This absorbs per-detection jitter before it reaches movement smoothing.
        const rawCenter = computeFramingCenter(faces, frameSize)
        const rawZoom = computeFramingZoom(faces, frameSize, zoomOptions)

        if (rawCenter) {
          stableTarget = stableTarget
            ? {
                x: stableTarget.x * (1 - stabFactor) + rawCenter.x * stabFactor,
                y: stableTarget.y * (1 - stabFactor) + rawCenter.y * stabFactor,
              }
            : rawCenter
        }
        // When no face is found, hold the last stabilised target rather
        // than snapping — matches macOS behaviour during brief dropouts.

        if (rawZoom !== null) {
          stableZoomTarget =
            stableZoomTarget !== null
              ? stableZoomTarget * (1 - stabFactor) + rawZoom * stabFactor
              : rawZoom
        }
      })
      .catch(() => {
        /* keep the last known target on failure */
      })
      .finally(() => {
        detecting = false
      })
  }

  return {
    id: CENTER_STAGE_PLUGIN_ID,

    drawCanvas(
      _ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D,
      videoEl: HTMLVideoElement,
      width: number,
      height: number,
      config: Partial<CenterStageConfig>
    ) {
      if (destroyed) return
      const cfg = resolveConfig(defaults, config)
      frameSize = { width, height }

      if (!cfg.enabled) {
        if (wasEnabled) {
          wasEnabled = false
          pushOverride(undefined, undefined)
        }
        return
      }
      wasEnabled = true

      const interval = cfg.detectIntervalMs ?? DEFAULT_DETECT_INTERVAL_MS
      const stabFactor = cfg.targetStabilization ?? 0.3
      const zoomOptions: FramingZoomOptions = {
        targetFill: cfg.targetFill,
        padding: cfg.padding,
        minZoom: cfg.minZoom,
        maxZoom: cfg.maxZoom,
      }
      runDetection(videoEl, width, height, interval, stabFactor, zoomOptions)

      // Frame-rate-independent delta (seconds), clamped so background-tab
      // throttling can't produce a giant spring leap on resume.
      const t = now()
      const dt = lastFrameTime ? Math.min((t - lastFrameTime) / 1000, 0.1) : 1 / 60
      lastFrameTime = t

      // Stage 2: ease the actual crop position/zoom toward the stabilised
      // target. Center uses lerp + deadzone; zoom uses a critically-damped
      // spring that glides without overshoot and parks exactly when settled.
      const smoothing: SmoothingOptions = {
        factor: cfg.smoothingFactor,
        deadzone: cfg.deadzone,
      }
      if (stableTarget) {
        current = smoothCenter(current, stableTarget, smoothing)
      }
      if (stableZoomTarget !== null) {
        currentZoom = zoomSmoother.step(stableZoomTarget, dt).value
      }

      pushOverride(current, currentZoom)
    },

    destroy() {
      if (destroyed) return
      destroyed = true
      detector.destroy()
      pushOverride(undefined, undefined)
    },
  }
}
