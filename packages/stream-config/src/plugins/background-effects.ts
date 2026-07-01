/**
 * Background-effects plugin (blur / image replacement).
 *
 * Unlike CropZoomAlign (which draws to the OUTPUT canvas), this plugin
 * implements `prepareSource`: it produces a *composited source frame* at full
 * source resolution — background replaced or blurred, with the person kept
 * sharp — and hands it back to the engine. CropZoomAlign then crops/zooms that
 * composited frame as usual. This keeps background logic fully decoupled from
 * framing logic.
 *
 * Person separation uses an injected {@link MatteProvider} (RVM for macOS-grade
 * quality, MediaPipe binary as the always-smooth fallback). Segmentation is
 * async, so like Center Stage we run it on a throttled, non-reentrant loop and
 * composite with the latest matte (a one-frame-stale mask is imperceptible,
 * especially with edge feathering).
 *
 * Must run on the Canvas engine (force it when enabled). When `mode === "none"`
 * prepareSource returns null and the plugin has zero cost.
 */
import type { MatteProvider } from "../matting/types"
import type { Matte } from "../matting/types"
import type { BackgroundConfig } from "../tuner-types"
import { resolveBackgroundConfig } from "../utils/config"
import { getSourceSize } from "../utils/math"
import type { Size } from "../utils/math"
import type { StreamPlugin } from "../types"

export const BACKGROUND_EFFECTS_PLUGIN_ID = "core:background-effects"

export type BackgroundEffectsOptions = {
  /**
   * Resolves an `imageId` to a drawable background image (preset URL or an
   * image hydrated from IndexedDB). Injected by the extension; when omitted,
   * image mode draws nothing behind the person.
   */
  resolveImage?: (
    imageId: string
  ) => Promise<CanvasImageSource | null>
  /** Minimum ms between segmentation passes (default 0 — every frame). */
  segmentIntervalMs?: number
  /** Soft edge feather applied to the matte, in source px (default 2). */
  maskFeather?: number
}

const DEFAULT_SEGMENT_INTERVAL_MS = 0
const DEFAULT_MASK_FEATHER = 2
const MIN_BLUR = 4
const MAX_BLUR = 40

function now(): number {
  return typeof performance !== "undefined"
    ? performance.now()
    : Date.now()
}

function clampBlur(px: number): number {
  if (isNaN(px)) return 14
  return Math.max(MIN_BLUR, Math.min(MAX_BLUR, px))
}

/**
 * Draws `image` into the ctx covering W×H without distortion (cover fit),
 * cropping the overflow. Used for the replacement background.
 */
function drawCover(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  image: CanvasImageSource,
  w: number,
  h: number
): void {
  const iw = (image as { width?: number; videoWidth?: number }).width
  const ih = (image as { height?: number; videoHeight?: number }).height
  // videoWidth/Height are preferred for video sources.
  const srcW =
    (image as { videoWidth?: number }).videoWidth ??
    iw ??
    0
  const srcH =
    (image as { videoHeight?: number }).videoHeight ??
    ih ??
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

/**
 * Creates a background-effects plugin.
 *
 * @param matte The matte provider backend (RVM, MediaPipe, or passthrough).
 * @param options Resolution + timing knobs.
 */
export function createBackgroundEffectsPlugin(
  matte: MatteProvider,
  options?: BackgroundEffectsOptions
): StreamPlugin<BackgroundConfig> {
  const segmentInterval = options?.segmentIntervalMs ?? DEFAULT_SEGMENT_INTERVAL_MS
  const maskFeather = options?.maskFeather ?? DEFAULT_MASK_FEATHER
  const resolveImage = options?.resolveImage

  // Reusable offscreen canvases, lazily allocated and resized to the source.
  let compositeCanvas: HTMLCanvasElement | null = null
  let compositeCtx: CanvasRenderingContext2D | null = null
  let personCanvas: HTMLCanvasElement | null = null
  let personCtx: CanvasRenderingContext2D | null = null
  let maskCanvas: HTMLCanvasElement | null = null
  let maskCtx: CanvasRenderingContext2D | null = null

  let lastSize: Size = { width: 0, height: 0 }

  // Latest segmentation result (cached, consumed synchronously per frame).
  let cachedMatte: Matte | null = null

  // Throttle bookkeeping.
  let lastSegmentTime = 0
  let segmenting = false

  // Background image cache (image mode).
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
    if (existing && existing.width === w && existing.height === h && existingCtx) {
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
    matte
      .segment(source, width, height)
      .then((m) => {
        // Reject degenerate (all-background) masks: a backend that fails to
        // detect a person would otherwise produce an empty person cutout and
        // blur the entire frame. Holding the last good matte (or staying null
        // until a valid one arrives) shows the raw frame instead — a far better
        // failure mode than blurring the user.
        let sum = 0
        for (let i = 0; i < m.data.length; i++) sum += m.data[i] ?? 0
        if (sum > 0) cachedMatte = m
      })
      .catch(() => {
        /* keep the last matte on failure */
      })
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

  /** Writes the matte alpha into the mask canvas as an RGBA image. */
  function writeMask(ctx: CanvasRenderingContext2D): void {
    if (!cachedMatte) return
    const mw = cachedMatte.width
    const mh = cachedMatte.height
    if (maskCanvas!.width !== mw || maskCanvas!.height !== mh) {
      maskCanvas!.width = mw
      maskCanvas!.height = mh
    }
    const imageData = ctx.createImageData(mw, mh)
    const dst = imageData.data
    const src = cachedMatte.data
    for (let i = 0; i < src.length; i++) {
      const o = i * 4
      dst[o] = 255
      dst[o + 1] = 255
      dst[o + 2] = 255
      const a = src[i] ?? 0
      dst[o + 3] = Math.min(255, Math.max(0, a * 255))
    }
    ctx.putImageData(imageData, 0, 0)
  }

  return {
    id: BACKGROUND_EFFECTS_PLUGIN_ID,

    prepareSource(
      source: CanvasImageSource,
      config: Partial<BackgroundConfig>
    ): CanvasImageSource | null {
      if (destroyed) return null
      const cfg = resolveBackgroundConfig(config)
      if (cfg.mode === "none") return null

      const size = getSourceSize(source)
      if (size.width === 0 || size.height === 0) return null
      lastSize = size
      const W = size.width
      const H = size.height

      // Kick off (throttled) segmentation; composite with whatever we have.
      runSegment(source, W, H)

      // No matte yet (model still warming up) → show raw frame for now.
      if (!cachedMatte) return null

      // Image mode requires a loaded background image.
      if (cfg.mode === "image") {
        if (cfg.imageId) ensureImage(cfg.imageId)
        if (!cachedImage) return null
      }

      const comp = ensureCanvas("composite", false)
      const person = ensureCanvas("person", true)
      const mask = ensureCanvas("mask", true)

      // 1. Build the feathered mask canvas.
      writeMask(mask.ctx)

      // 2. Cut the person out of the source frame using the mask.
      person.ctx.clearRect(0, 0, W, H)
      person.ctx.globalCompositeOperation = "source-over"
      person.ctx.drawImage(source, 0, 0, W, H)
      person.ctx.globalCompositeOperation = "destination-in"
      if (maskFeather > 0) {
        person.ctx.filter = `blur(${maskFeather}px)`
      }
      person.ctx.drawImage(mask.canvas, 0, 0, W, H)
      person.ctx.filter = "none"
      person.ctx.globalCompositeOperation = "source-over"

      // 3. Paint the new background, then overlay the sharp person.
      comp.ctx.clearRect(0, 0, W, H)
      comp.ctx.globalCompositeOperation = "source-over"
      if (cfg.mode === "blur") {
        const blur = clampBlur(cfg.blurAmount)
        comp.ctx.filter = `blur(${blur}px)`
        comp.ctx.drawImage(source, 0, 0, W, H)
        comp.ctx.filter = "none"
      } else if (cfg.mode === "image" && cachedImage) {
        drawCover(comp.ctx, cachedImage, W, H)
      }
      comp.ctx.drawImage(person.canvas, 0, 0, W, H)

      return comp.canvas
    },

    destroy(): void {
      if (destroyed) return
      destroyed = true
      matte.destroy()
      compositeCanvas = null
      compositeCtx = null
      personCanvas = null
      personCtx = null
      maskCanvas = null
      maskCtx = null
      cachedMatte = null
      cachedImage = null
    },
  }
}
