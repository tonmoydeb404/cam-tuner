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
import { CROP_ZOOM_ALIGN_PLUGIN_ID } from "../crop-zoom-align"
import type { CropConfig } from "../../utils/math"
import type { AlignCenter } from "../../utils/math"
import type { Size } from "../../utils/math"
import { computeFramingCenter, computeFramingZoom } from "../../framing/framing"
import type { FramingZoomOptions } from "../../framing/framing"
import { createZoomSmoother, smoothCenter } from "../../framing/smoothing"
import type { SmoothingOptions } from "../../framing/smoothing"
import type { FaceDetector } from "../../tracking/types"
import type { StreamModifier, StreamPlugin } from "../../types"
import type { CenterStageConfig } from "./types"
import { DEFAULT_CENTER_STAGE_CONFIG } from "./types"

export { type CenterStageConfig } from "./types"
export { DEFAULT_CENTER_STAGE_CONFIG } from "./types"

export const CENTER_STAGE_PLUGIN_ID = "core:center-stage"

const DEFAULT_DETECT_INTERVAL_MS = 120
const DEFAULT_TARGET_STABILIZATION = 0.18
/**
 * Zoom stabilization. Detector face-boxes are noisy (±5–10% size), which maps
 * directly to a noisy computed zoom and was the root cause of the visible
 * zoom-in/zoom-out "pump". Two stages kill it:
 *
 *  1. ZOOM_SMOOTH_ALPHA — an EMA takes the edge off single-frame spikes while
 *     still tracking real motion quickly.
 *  2. ZOOM_HYSTERESIS — a deadband on the stabilised target: the target only
 *     commits to a new value once the smoothed signal has moved beyond the
 *     band. All sub-band detector noise is ignored, so a still (or lightly
 *     moving) face holds a rock-steady zoom. The spring then glides to each
 *     committed target and parks — no oscillation.
 */
const ZOOM_SMOOTH_ALPHA = 0.3
const ZOOM_HYSTERESIS = 0.1
const CENTER: AlignCenter = { x: 0.5, y: 0.5 }

function now(): number {
  return typeof performance !== "undefined"
    ? performance.now()
    : Date.now()
}

/**
 * Extracts the intrinsic pixel dimensions of any CanvasImageSource the engine
 * may hand a plugin: a raw `<video>`, an ImageBitmap, or a VideoFrame. Returns
 * null when the dimensions aren't available yet (e.g. a video before metadata
 * has loaded).
 *
 * Order matters: `videoWidth`/`displayWidth` are intrinsic sizes, whereas
 * `width`/`height` are the element/layout size for images but the intrinsic
 * size for canvas-like sources.
 */
function intrinsicSourceSize(source: CanvasImageSource): Size | null {
  const s = source as unknown as {
    videoWidth?: number
    videoHeight?: number
    displayWidth?: number
    displayHeight?: number
    width?: number
    height?: number
  }
  if (s.videoWidth && s.videoWidth > 0) {
    return { width: s.videoWidth, height: s.videoHeight ?? 0 }
  }
  if (s.displayWidth && s.displayWidth > 0) {
    return { width: s.displayWidth, height: s.displayHeight ?? 0 }
  }
  if (s.width && s.width > 0) {
    return { width: s.width, height: s.height ?? 0 }
  }
  return null
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
    zoomMode: runtime.zoomMode ?? defaults.zoomMode,
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
    zoomMode: initialConfig?.zoomMode ?? DEFAULT_CENTER_STAGE_CONFIG.zoomMode,
  }

  let current: AlignCenter = { ...CENTER }
  let currentZoom = 1
  const zoomSmoother = createZoomSmoother(currentZoom)
  let stableTarget: AlignCenter | null = null
  let stableZoomTarget: number | null = null
  let smoothedZoom: number | null = null
  let frameSize: Size = { width: 0, height: 0 }
  let lastDetectTime = 0
  let lastFrameTime = 0
  let detecting = false
  let wasActive = false
  let lastPushedAlign: AlignCenter | undefined = undefined
  let lastPushedZoom: number | undefined = undefined
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
    videoEl: CanvasImageSource,
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
          // Stage 1a: light EMA to take the edge off single-frame spikes.
          smoothedZoom =
            smoothedZoom === null
              ? rawZoom
              : smoothedZoom * (1 - ZOOM_SMOOTH_ALPHA) + rawZoom * ZOOM_SMOOTH_ALPHA
          // Stage 1b: hysteresis deadband on the target. Only commit a new
          // target once the smoothed signal has moved beyond the band, so
          // sub-band detector noise can never move the zoom (the pump). Real
          // distance changes break out immediately and the spring glides there.
          if (
            stableZoomTarget === null ||
            Math.abs(smoothedZoom - stableZoomTarget) > ZOOM_HYSTERESIS
          ) {
            stableZoomTarget = smoothedZoom
          }
          // else: hold the existing target — zoom stays rock-steady.
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
      videoEl: CanvasImageSource,
      width: number,
      height: number,
      config: Partial<CenterStageConfig>
    ) {
      if (destroyed) return
      const cfg = resolveConfig(defaults, config)
      // Face boxes are returned in the SOURCE's intrinsic pixel space — every
      // detector ignores the passed width/height and analyzes the source at its
      // native resolution. The width/height here are the OUTPUT canvas dims,
      // which in letterbox-off mode are the (smaller) crop-box, so normalizing
      // by them would frame against the wrong reference. Resolve the source's
      // real dimensions instead, falling back to the canvas dims only when they
      // aren't available yet (tests / pre-metadata frames).
      const sourceSize = intrinsicSourceSize(videoEl)
      const srcWidth = sourceSize?.width ?? width
      const srcHeight = sourceSize?.height ?? height
      frameSize = { width: srcWidth, height: srcHeight }

      // Framing (panning) and zoom are independent channels sharing one
      // detector. The controller is "active" while either is needed.
      const centerActive = cfg.enabled
      const zoomActive = cfg.zoomMode === "auto"
      const active = centerActive || zoomActive

      if (!active) {
        if (wasActive) {
          wasActive = false
          pushOverride(undefined, undefined)
          lastPushedAlign = undefined
          lastPushedZoom = undefined
        }
        return
      }
      wasActive = true

      const interval = cfg.detectIntervalMs ?? DEFAULT_DETECT_INTERVAL_MS
      const stabFactor = cfg.targetStabilization ?? DEFAULT_TARGET_STABILIZATION
      const zoomOptions: FramingZoomOptions = {
        targetFill: cfg.targetFill,
        padding: cfg.padding,
        minZoom: cfg.minZoom,
        maxZoom: cfg.maxZoom,
      }
      runDetection(
        videoEl,
        srcWidth,
        srcHeight,
        interval,
        stabFactor,
        zoomOptions
      )

      // Frame-rate-independent delta (seconds), clamped so background-tab
      // throttling can't produce a giant spring leap on resume.
      const t = now()
      const dt = lastFrameTime ? Math.min((t - lastFrameTime) / 1000, 0.1) : 1 / 60
      lastFrameTime = t

      // Stage 2: ease the actual crop position/zoom toward the stabilised
      // target. Center uses lerp + deadzone; zoom uses a critically-damped
      // spring that glides without overshoot and snaps exactly when settled.
      const smoothing: SmoothingOptions = {
        factor: cfg.smoothingFactor,
        deadzone: cfg.deadzone,
      }

      // Advance framing (pan) first.
      if (centerActive && stableTarget) {
        current = smoothCenter(current, stableTarget, smoothing)
      }

      // "Position first, then zoom." The crop origin downstream is a function
      // of BOTH the framing center and the zoomed window size; easing them
      // simultaneously on independent curves made the window drift left/right
      // during a zoom transition — the subject stayed put, but the whole frame
      // shifted sideways as the slower pan caught up with the faster zoom. We
      // therefore let the pan reach its target (within its deadzone) before
      // easing the zoom, so by the time the window scales the framing point is
      // already stable and the image zooms straight toward a fixed point.
      const centerDeadzone = smoothing.deadzone ?? 0.03
      const centerSettled =
        !centerActive ||
        stableTarget === null ||
        (Math.abs(stableTarget.x - current.x) <= centerDeadzone &&
          Math.abs(stableTarget.y - current.y) <= centerDeadzone)
      if (zoomActive && stableZoomTarget !== null && centerSettled) {
        currentZoom = zoomSmoother.step(stableZoomTarget, dt).value
      }

      // Each channel only drives its own override; the other is cleared so the
      // manual crop-zoom value (or align) takes over.
      const alignToPush = centerActive ? current : undefined
      const zoomToPush =
        zoomActive && stableZoomTarget !== null ? currentZoom : undefined

      // Only push when something meaningfully changed — avoids needless
      // crop-box recomputation downstream every frame.
      const alignChanged =
        alignToPush?.x !== lastPushedAlign?.x ||
        alignToPush?.y !== lastPushedAlign?.y
      const zoomChanged =
        zoomToPush === undefined
          ? lastPushedZoom !== undefined
          : lastPushedZoom === undefined ||
            Math.abs(zoomToPush - lastPushedZoom) > 1e-4
      if (alignChanged || zoomChanged) {
        pushOverride(alignToPush, zoomToPush)
        lastPushedAlign = alignToPush
        lastPushedZoom = zoomToPush
      }
    },

    destroy() {
      if (destroyed) return
      destroyed = true
      detector.destroy()
      pushOverride(undefined, undefined)
    },
  }
}
