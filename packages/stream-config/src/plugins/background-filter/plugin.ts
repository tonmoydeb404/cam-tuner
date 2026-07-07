/**
 * Background-filter plugin (blur / image replacement).
 *
 * Unlike crop-zoom-align (which draws to the OUTPUT canvas), this plugin
 * implements `prepareSource`: it produces a *composited source frame* at full
 * source resolution — background replaced or blurred, with the person kept
 * sharp — and hands it back to the engine. Crop-zoom-align then crops/zooms
 * that composited frame as usual.
 *
 * Person separation uses an injected {@link PersonSegmenter}. Segmentation is
 * async, so we run it on a throttled, non-reentrant loop and composite with
 * the latest matte (a one-frame-stale mask is imperceptible, especially with
 * temporal smoothing and edge feathering).
 *
 * Quality pipeline:
 * 1. Temporal EMA — blends each new mask with the previous to eliminate flicker
 * 2. Smoothstep threshold — cleans up noisy/uncertain edge pixels
 * 3. High-quality mask scaling — model-res mask upscaled with smoothing
 * 4. Edge feathering — soft blend at person/background boundary
 * 5. Light wrap — bleeds person edge colors into background for natural transition
 *
 * When `mode === "none"` prepareSource returns null → zero cost.
 */
import type { StreamPlugin } from "../../types"
import type { Size } from "../../utils/math"
import { getSourceSize } from "../../utils/math"
import type { PersonSegmenter } from "./segmenter"
import type { BackgroundFilterConfig } from "./types"
import { clampBlur, resolveBackgroundConfig } from "./types"

export const BACKGROUND_FILTER_PLUGIN_ID = "core:background-filter"

export type BackgroundFilterOptions = {
  resolveImage?: (imageId: string) => Promise<CanvasImageSource | null>
  segmentIntervalMs?: number
  maskFeather?: number
  temporalAlpha?: number
  /** Lower confidence threshold for the smoothstep edge ramp (default 0.12). Lower = more inclusive mask. */
  thresholdLow?: number
  /** Upper confidence threshold for the smoothstep edge ramp (default 0.55). Raise to tighten/narrow the transition band. */
  thresholdHigh?: number
  /** Opacity of the light-wrap bleed layer (default 0.35). 0 disables it entirely for hard edges. */
  lightWrapAlpha?: number
}

const DEFAULT_SEGMENT_INTERVAL_MS = 0
const DEFAULT_MASK_FEATHER = 5
const DEFAULT_TEMPORAL_ALPHA = 0.6

const THRESHOLD_LOW = 0.12
const THRESHOLD_HIGH = 0.55

const LIGHT_WRAP_ALPHA = 0.35
const LIGHT_WRAP_BLUR_MIN = 8

function now(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now()
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function drawCover(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  image: CanvasImageSource,
  w: number,
  h: number
): void {
  const srcW =
    (image as { videoWidth?: number }).videoWidth ??
    (image as { width?: number }).width ??
    0
  const srcH =
    (image as { videoHeight?: number }).videoHeight ??
    (image as { height?: number }).height ??
    0
  if (!srcW || !srcH) {
    ctx.drawImage(image, 0, 0, w, h)
    return
  }
  const scale = Math.max(w / srcW, h / srcH)
  const dw = srcW * scale
  const dh = srcH * scale
  ctx.drawImage(image, 0, 0, srcW, srcH, (w - dw) / 2, (h - dh) / 2, dw, dh)
}

export function createBackgroundFilterPlugin(
  segmenter: PersonSegmenter,
  options?: BackgroundFilterOptions
): StreamPlugin<BackgroundFilterConfig> {
  const segmentInterval =
    options?.segmentIntervalMs ?? DEFAULT_SEGMENT_INTERVAL_MS
  const maskFeather = options?.maskFeather ?? DEFAULT_MASK_FEATHER
  const temporalAlpha = options?.temporalAlpha ?? DEFAULT_TEMPORAL_ALPHA
  const thresholdLow = options?.thresholdLow ?? THRESHOLD_LOW
  const thresholdHigh = options?.thresholdHigh ?? THRESHOLD_HIGH
  const lightWrapAlpha = options?.lightWrapAlpha ?? LIGHT_WRAP_ALPHA
  const resolveImage = options?.resolveImage

  let compositeCanvas: HTMLCanvasElement | null = null
  let compositeCtx: CanvasRenderingContext2D | null = null
  let personCanvas: HTMLCanvasElement | null = null
  let personCtx: CanvasRenderingContext2D | null = null
  let maskCanvas: HTMLCanvasElement | null = null
  let maskCtx: CanvasRenderingContext2D | null = null

  let lastSize: Size = { width: 0, height: 0 }

  // Phase 1: Temporal smoothing — EMA-blended mask data
  let smoothedMatte: Float32Array | null = null

  let lastSegmentTime = 0
  let segmenting = false

  let currentImageId: string | null = null
  let cachedImage: CanvasImageSource | null = null
  let imageLoading = false

  let destroyed = false

  function ensureCanvas(
    name: "composite" | "person" | "mask",
    alpha: boolean
  ): {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
  } {
    const w = lastSize.width
    const h = lastSize.height
    const existing =
      name === "composite"
        ? compositeCanvas
        : name === "person"
          ? personCanvas
          : maskCanvas
    const existingCtx =
      name === "composite"
        ? compositeCtx
        : name === "person"
          ? personCtx
          : maskCtx
    if (
      existing &&
      existing.width === w &&
      existing.height === h &&
      existingCtx
    ) {
      return { canvas: existing, ctx: existingCtx }
    }
    const canvas = existing ?? document.createElement("canvas")
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d", { alpha })
    if (!ctx) throw new Error(`Could not get 2D context for ${name} canvas`)
    if (name === "composite") {
      compositeCanvas = canvas
      compositeCtx = ctx
    } else if (name === "person") {
      personCanvas = canvas
      personCtx = ctx
    } else {
      maskCanvas = canvas
      maskCtx = ctx
    }
    return { canvas, ctx }
  }

  function runSegment(
    source: CanvasImageSource,
    width: number,
    height: number
  ): void {
    if (segmenting) return
    if (now() - lastSegmentTime < segmentInterval) return
    segmenting = true
    lastSegmentTime = now()
    segmenter
      .segment(source, width, height)
      .then((data) => {
        if (!data || data.length === 0) return
        let sum = 0
        for (let i = 0; i < data.length; i++) sum += data[i] ?? 0
        if (sum <= 0) return

        // Phase 1: Temporal EMA — smooth frame-to-frame jitter
        if (smoothedMatte && smoothedMatte.length === data.length) {
          const a = temporalAlpha
          const inv = 1 - a
          for (let i = 0; i < data.length; i++) {
            smoothedMatte[i] =
              a * (data[i] ?? 0) + inv * (smoothedMatte[i] ?? 0)
          }
        } else {
          smoothedMatte = new Float32Array(data)
        }
      })
      .catch(() => {})
      .finally(() => {
        segmenting = false
      })
  }

  function ensureImage(imageId: string): void {
    if (imageId === currentImageId) return
    currentImageId = imageId
    cachedImage = null
    if (!resolveImage || imageLoading) return
    imageLoading = true
    resolveImage(imageId)
      .then((img) => {
        cachedImage = img
      })
      .catch(() => {
        cachedImage = null
      })
      .finally(() => {
        imageLoading = false
      })
  }

  /**
   * Phase 2: Writes the smoothed matte to the mask canvas with a smoothstep
   * confidence threshold. MediaPipe returns confidence masks at the input
   * image resolution, so we write directly at source dimensions.
   */
  function writeMask(ctx: CanvasRenderingContext2D): void {
    if (!smoothedMatte) return

    const mw = lastSize.width
    const mh = lastSize.height
    if (maskCanvas!.width !== mw || maskCanvas!.height !== mh) {
      maskCanvas!.width = mw
      maskCanvas!.height = mh
    }

    const imageData = ctx.createImageData(mw, mh)
    const dst = imageData.data
    const src = smoothedMatte
    for (let i = 0; i < src.length; i++) {
      const o = i * 4
      dst[o] = 255
      dst[o + 1] = 255
      dst[o + 2] = 255
      dst[o + 3] = smoothstep(thresholdLow, thresholdHigh, src[i] ?? 0) * 255
    }
    ctx.putImageData(imageData, 0, 0)
  }

  return {
    id: BACKGROUND_FILTER_PLUGIN_ID,

    prepareSource(
      source: CanvasImageSource,
      config: Partial<BackgroundFilterConfig>
    ): CanvasImageSource | null {
      if (destroyed) return null
      const cfg = resolveBackgroundConfig(config)
      if (cfg.mode === "none") return null

      const size = getSourceSize(source)
      if (size.width === 0 || size.height === 0) return null
      lastSize = size
      const W = size.width
      const H = size.height

      runSegment(source, W, H)

      if (!smoothedMatte) return null

      if (cfg.mode === "image") {
        if (cfg.imageId) ensureImage(cfg.imageId)
        if (!cachedImage) return null
      }

      const comp = ensureCanvas("composite", false)
      const person = ensureCanvas("person", true)
      const mask = ensureCanvas("mask", true)

      // Phase 2+3: Write thresholded mask at model resolution
      writeMask(mask.ctx)

      // --- Build person cutout: source frame masked to silhouette ---
      person.ctx.clearRect(0, 0, W, H)
      person.ctx.globalCompositeOperation = "source-over"
      person.ctx.drawImage(source, 0, 0, W, H)
      person.ctx.globalCompositeOperation = "destination-in"
      // Phase 3: High-quality scaling from model-res mask → full-res
      person.ctx.imageSmoothingEnabled = true
      person.ctx.imageSmoothingQuality = "high"
      if (maskFeather > 0) {
        person.ctx.filter = `blur(${maskFeather}px)`
      }
      person.ctx.drawImage(mask.canvas, 0, 0, W, H)
      person.ctx.filter = "none"
      person.ctx.globalCompositeOperation = "source-over"

      // --- Composite: background + light wrap + sharp person ---
      comp.ctx.clearRect(0, 0, W, H)
      comp.ctx.globalCompositeOperation = "source-over"

      // Background layer
      if (cfg.mode === "blur") {
        const blur = clampBlur(cfg.blurAmount)
        comp.ctx.filter = `blur(${blur}px)`
        comp.ctx.drawImage(source, 0, 0, W, H)
        comp.ctx.filter = "none"
      } else if (cfg.mode === "image" && cachedImage) {
        drawCover(comp.ctx, cachedImage, W, H)
      }

      // Phase 5: Light wrap — blurred semi-transparent person fringe
      // Bleeds person edge colors into background for natural transition
      const wrapBlur = Math.max(LIGHT_WRAP_BLUR_MIN, maskFeather * 2)
      comp.ctx.globalAlpha = lightWrapAlpha
      comp.ctx.filter = `blur(${wrapBlur}px)`
      comp.ctx.drawImage(person.canvas, 0, 0, W, H)
      comp.ctx.globalAlpha = 1
      comp.ctx.filter = "none"

      // Sharp person on top
      comp.ctx.drawImage(person.canvas, 0, 0, W, H)

      return comp.canvas
    },

    destroy(): void {
      if (destroyed) return
      destroyed = true
      segmenter.destroy()
      compositeCanvas = null
      compositeCtx = null
      personCanvas = null
      personCtx = null
      maskCanvas = null
      maskCtx = null
      smoothedMatte = null
      cachedImage = null
    },
  }
}
