import { StreamPlugin } from "../../types"
import {
  Box,
  calculateCropBox,
  calculateDestinationBox,
  CropConfig,
  getSourceSize,
  Size,
} from "../../utils/math"

export const CROP_ZOOM_ALIGN_PLUGIN_ID = "core:crop-zoom-align"

/**
 * Ensures the config is always valid and falls back to safe defaults.
 */
function normalizeConfig(config: Partial<CropConfig>): CropConfig {
  return {
    aspectRatio: config.aspectRatio || 16 / 9,
    zoom: Math.max(1, config.zoom || 1),
    alignX: config.alignX || "center",
    alignY: config.alignY || "center",
    barColor: config.barColor || "#000000",
    mirror: config.mirror ?? false,
    alignCenter: config.alignCenter,
    zoomOverride: config.zoomOverride,
    letterbox: config.letterbox ?? true,
  }
}

/**
 * A plugin that acts as a letterbox: it crops, zooms, and aligns the feed,
 * and centers it on a black background maintaining the original canvas resolution.
 */
export function createCropZoomAlignPlugin(): StreamPlugin<CropConfig> {
  // Cached computed values — only recalculated when config changes
  let cachedConfig: CropConfig | null = null
  let cachedSrcWidth = 0
  let cachedSrcHeight = 0
  let cachedCropBox: Box = { x: 0, y: 0, width: 0, height: 0 }
  let cachedDestBox: Box = { x: 0, y: 0, width: 0, height: 0 }
  let cachedNeedsBars = true

  function recompute(config: CropConfig, srcWidth: number, srcHeight: number) {
    const originalSize = { width: srcWidth, height: srcHeight }
    cachedCropBox = calculateCropBox(originalSize, config)
    cachedDestBox = calculateDestinationBox(originalSize, cachedCropBox)
    // Bars are needed only when the destination box doesn't fill the entire canvas
    cachedNeedsBars =
      cachedDestBox.x !== 0 ||
      cachedDestBox.y !== 0 ||
      cachedDestBox.width !== srcWidth ||
      cachedDestBox.height !== srcHeight
    cachedConfig = config
    cachedSrcWidth = srcWidth
    cachedSrcHeight = srcHeight
  }

  return {
    id: CROP_ZOOM_ALIGN_PLUGIN_ID,

    // Declares the output canvas size. In non-letterbox mode the output is the
    // cropped region with no bars. The backing store is sized to the zoom=1 crop
    // box — the largest the crop ever gets — and held STABLE as zoom changes, so
    // the engine never re-dimensions the canvas mid-transition (which caused
    // resolution stepping / clear-on-resize flicker). The zoomed crop is scaled
    // to fill this stable canvas each frame in drawCanvas.
    getOutputSize(sourceSize: Size, config: Partial<CropConfig>): Size | null {
      const normalized = normalizeConfig(config)
      if (normalized.letterbox) return null
      const baseCrop = calculateCropBox(sourceSize, {
        ...normalized,
        zoom: 1,
        zoomOverride: undefined,
      })
      return { width: baseCrop.width, height: baseCrop.height }
    },

    // WebCodecs / Insertable Streams pipeline
    transformFrame(frame: VideoFrame, config: Partial<CropConfig>): VideoFrame {
      // NOTE: For WebCodecs, full letterboxing natively onto the SAME frame is non-trivial
      // without drawing to an OffscreenCanvas because VideoFrame is immutable.
      // We can *crop* by changing the visible rect, but we can't pad black bars
      // around it inside the same un-copied VideoFrame easily.
      //
      // For a true letterbox without touching canvas, we would need to emit a frame with
      // a smaller visibleRect, and rely on the consuming <video> element's `object-fit: contain`
      // to paint the black bars.
      //
      // If the user strictly requires the output *stream itself* to have hardcoded black pixels,
      // we must use the Canvas fallback instead. The Canvas engine is written precisely for drawing!
      //
      // For the WebCodecs engine (if used), we will apply the crop via `visibleRect`.

      const normalized = normalizeConfig(config)
      const originalSize = {
        width: frame.displayWidth,
        height: frame.displayHeight,
      }

      const cropBox = calculateCropBox(originalSize, normalized)

      // VideoFrame constructor allows us to clone a frame with a new visible rectangle
      // This is a zero-copy metadata change! Incredibly fast.
      return new VideoFrame(frame, {
        visibleRect: cropBox,
      })
    },

    // Canvas pipeline — keeps the output at the original source resolution.
    // The cropped/zoomed region is drawn centered; remaining space gets a background fill.
    drawCanvas(
      ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D,
      source: CanvasImageSource,
      canvasWidth: number,
      canvasHeight: number,
      config: Partial<CropConfig>
    ) {
      const normalized = normalizeConfig(config)
      const size = getSourceSize(source)
      const srcWidth = size.width || canvasWidth
      const srcHeight = size.height || canvasHeight

      // Recompute boxes only when config or source dimensions change.
      // alignCenter and zoomOverride are compared separately because Center Stage
      // updates them every frame; without this check the cached crop box would
      // go stale.
      if (
        cachedConfig === null ||
        cachedSrcWidth !== srcWidth ||
        cachedSrcHeight !== srcHeight ||
        cachedConfig.aspectRatio !== normalized.aspectRatio ||
        cachedConfig.zoom !== normalized.zoom ||
        cachedConfig.alignX !== normalized.alignX ||
        cachedConfig.alignY !== normalized.alignY ||
        cachedConfig.barColor !== normalized.barColor ||
        cachedConfig.letterbox !== normalized.letterbox ||
        cachedConfig.alignCenter?.x !== normalized.alignCenter?.x ||
        cachedConfig.alignCenter?.y !== normalized.alignCenter?.y ||
        cachedConfig.zoomOverride !== normalized.zoomOverride
      ) {
        recompute(normalized, srcWidth, srcHeight)
      }

      // Non-letterbox mode: the canvas has already been resized to the crop-box
      // dimensions by the engine. Just draw the cropped region to fill it — no
      // bars, no centering, no stretching.
      if (!normalized.letterbox) {
        if (normalized.mirror) {
          ctx.save()
          ctx.translate(canvasWidth, 0)
          ctx.scale(-1, 1)
        }
        ctx.drawImage(
          source,
          cachedCropBox.x,
          cachedCropBox.y,
          cachedCropBox.width,
          cachedCropBox.height,
          0,
          0,
          canvasWidth,
          canvasHeight
        )
        if (normalized.mirror) {
          ctx.restore()
        }
        return
      }

      // Fill background only when there are actual bars to draw
      if (cachedNeedsBars) {
        ctx.fillStyle = normalized.barColor
        ctx.fillRect(0, 0, srcWidth, srcHeight)
      }

      if (normalized.mirror) {
        ctx.save()
        ctx.translate(canvasWidth, 0)
        ctx.scale(-1, 1)
      }

      ctx.drawImage(
        source,
        cachedCropBox.x,
        cachedCropBox.y,
        cachedCropBox.width,
        cachedCropBox.height,
        cachedDestBox.x,
        cachedDestBox.y,
        cachedDestBox.width,
        cachedDestBox.height
      )

      if (normalized.mirror) {
        ctx.restore()
      }
    },
  }
}
