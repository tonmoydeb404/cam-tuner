/**
 * FaceTrackingService — shared face-detection state used by the align and
 * zoom plugins.  Both plugins run from the same per-modifier singleton so a
 * single throttled detection pass drives both channels simultaneously.
 *
 * The service mirrors the two-stage smoothing pipeline that used to live
 * exclusively in the center-stage plugin:
 *
 *   Stage 1 — Target stabilisation: EMA blends each raw detection into a
 *     stable target, absorbing per-detection jitter before it reaches motion.
 *
 *   Stage 2 — Movement smoothing: lerp + deadzone (pan) and a
 *     critically-damped spring (zoom) ease the output toward the stable
 *     target, producing cinematic, deliberate movement.
 */
import type { FramingZoomOptions } from "../framing/framing"
import { computeFramingCenter, computeFramingZoom } from "../framing/framing"
import type { SmoothingOptions } from "../framing/smoothing"
import { createZoomSmoother, smoothCenter } from "../framing/smoothing"
import type { AlignCenter, Size } from "../utils/math"
import { getSourceSize } from "../utils/math"
import type { FaceBox, FaceDetector } from "./types"

const DEFAULT_DETECT_INTERVAL_MS = 120
const DEFAULT_TARGET_STABILIZATION = 0.18
const ZOOM_SMOOTH_ALPHA = 0.3
const ZOOM_HYSTERESIS = 0.1
const CENTER: AlignCenter = { x: 0.5, y: 0.5 }

function now(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now()
}

export type TrackingFrameOptions = {
  centerActive: boolean
  zoomActive: boolean
  detectIntervalMs?: number
  targetStabilization?: number
  smoothingFactor?: number
  deadzone?: number
  targetFill?: number
  padding?: number
  minZoom?: number
  maxZoom?: number
}

export class FaceTrackingService {
  private detector: FaceDetector | null = null
  private current: AlignCenter = { ...CENTER }
  private currentZoom = 1
  private zoomSmoother = createZoomSmoother(1)
  private stableTarget: AlignCenter | null = null
  private stableZoomTarget: number | null = null
  private smoothedZoom: number | null = null
  private frameSize: Size = { width: 0, height: 0 }
  private lastDetectTime = 0
  private lastFrameTime = 0
  private detecting = false
  private lastAlignResult: AlignCenter | undefined = undefined
  private lastZoomResult: number | undefined = undefined
  private lastFaces: FaceBox[] = []

  init(detector: FaceDetector): void {
    if (this.detector) {
      this.detector.destroy()
    }
    this.detector = detector
    // Reset smoothing state so a stale previous-stream target doesn't
    // immediately steer the new stream.
    this.current = { ...CENTER }
    this.currentZoom = 1
    this.zoomSmoother = createZoomSmoother(1)
    this.stableTarget = null
    this.stableZoomTarget = null
    this.smoothedZoom = null
    this.lastDetectTime = 0
    this.lastFrameTime = 0
    this.detecting = false
    this.lastAlignResult = undefined
    this.lastZoomResult = undefined
    this.lastFaces = []
  }

  hasDetector(): boolean {
    return this.detector !== null
  }

  /**
   * Advance one frame of tracking.  Call this from whichever controller plugin
   * runs first (zoom at executionOrder 8, before align at 9).  The throttle
   * prevents double-detection when both plugins call it in the same frame.
   */
  processFrame(
    source: CanvasImageSource,
    canvasWidth: number,
    canvasHeight: number,
    options: TrackingFrameOptions
  ): void {
    if (!this.detector) return

    const srcSize = getSourceSize(source)
    const srcWidth = srcSize.width || canvasWidth
    const srcHeight = srcSize.height || canvasHeight
    this.frameSize = { width: srcWidth, height: srcHeight }

    const interval = options.detectIntervalMs ?? DEFAULT_DETECT_INTERVAL_MS
    const stabFactor =
      options.targetStabilization ?? DEFAULT_TARGET_STABILIZATION
    const zoomOptions: FramingZoomOptions = {
      targetFill: options.targetFill,
      padding: options.padding,
      minZoom: options.minZoom,
      maxZoom: options.maxZoom,
    }

    this.scheduleDetection(
      source,
      srcWidth,
      srcHeight,
      interval,
      stabFactor,
      zoomOptions
    )

    const t = now()
    const dt = this.lastFrameTime
      ? Math.min((t - this.lastFrameTime) / 1000, 0.1)
      : 1 / 60
    this.lastFrameTime = t

    const smoothing: SmoothingOptions = {
      factor: options.smoothingFactor,
      deadzone: options.deadzone,
    }

    if (options.centerActive && this.stableTarget) {
      this.current = smoothCenter(this.current, this.stableTarget, smoothing)
    }

    const centerDeadzone = smoothing.deadzone ?? 0.03
    const centerSettled =
      !options.centerActive ||
      this.stableTarget === null ||
      (Math.abs(this.stableTarget.x - this.current.x) <= centerDeadzone &&
        Math.abs(this.stableTarget.y - this.current.y) <= centerDeadzone)

    if (options.zoomActive && this.stableZoomTarget !== null && centerSettled) {
      this.currentZoom = this.zoomSmoother.step(this.stableZoomTarget, dt).value
    }

    this.lastAlignResult = options.centerActive ? this.current : undefined
    this.lastZoomResult =
      options.zoomActive && this.stableZoomTarget !== null
        ? this.currentZoom
        : undefined
  }

  getAlignResult(): AlignCenter | undefined {
    return this.lastAlignResult
  }

  getZoomResult(): number | undefined {
    return this.lastZoomResult
  }

  /** Raw face bounding boxes (pixel coords in source frame) from the last detection pass. */
  getLastFaces(): FaceBox[] {
    return this.lastFaces
  }

  destroy(): void {
    this.detector?.destroy()
    this.detector = null
    this.stableTarget = null
    this.stableZoomTarget = null
    this.smoothedZoom = null
    this.lastAlignResult = undefined
    this.lastZoomResult = undefined
    this.detecting = false
  }

  private scheduleDetection(
    source: CanvasImageSource,
    width: number,
    height: number,
    interval: number,
    stabFactor: number,
    zoomOptions: FramingZoomOptions
  ): void {
    if (this.detecting) return
    if (now() - this.lastDetectTime < interval) return
    this.detecting = true
    this.lastDetectTime = now()

    const frameSize = { ...this.frameSize }
    this.detector!.detect(source, width, height)
      .then((faces) => {
        this.lastFaces = faces
        const rawCenter = computeFramingCenter(faces, frameSize)
        const rawZoom = computeFramingZoom(faces, frameSize, zoomOptions)

        if (rawCenter) {
          this.stableTarget = this.stableTarget
            ? {
                x:
                  this.stableTarget.x * (1 - stabFactor) +
                  rawCenter.x * stabFactor,
                y:
                  this.stableTarget.y * (1 - stabFactor) +
                  rawCenter.y * stabFactor,
              }
            : rawCenter
        }

        if (rawZoom !== null) {
          this.smoothedZoom =
            this.smoothedZoom === null
              ? rawZoom
              : this.smoothedZoom * (1 - ZOOM_SMOOTH_ALPHA) +
                rawZoom * ZOOM_SMOOTH_ALPHA
          if (
            this.stableZoomTarget === null ||
            Math.abs(this.smoothedZoom - this.stableZoomTarget) >
              ZOOM_HYSTERESIS
          ) {
            this.stableZoomTarget = this.smoothedZoom
          }
        }
      })
      .catch(() => {
        /* hold last known targets on failure */
      })
      .finally(() => {
        this.detecting = false
      })
  }
}

// Module-level singleton — one tracking service per browser context.
// The extension and web app only ever run one active stream at a time.
let serviceInstance: FaceTrackingService | null = null

export function getFaceTrackingService(): FaceTrackingService {
  if (!serviceInstance) {
    serviceInstance = new FaceTrackingService()
  }
  return serviceInstance
}
