import { StreamPlugin } from "../types"
import {
  Box,
  calculateCropBox,
  calculateDestinationBox,
  CropConfig,
} from "../utils/math"

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

    // WebCodecs / Insertable Streams pipeline
    transformFrame(frame: any, config: Partial<CropConfig>): any {
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
      // @ts-ignore
      return new VideoFrame(frame, {
        visibleRect: cropBox,
      })
    },

    // Canvas pipeline — keeps the output at the original source resolution.
    // The cropped/zoomed region is drawn centered; remaining space gets a background fill.
    drawCanvas(
      ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D,
      videoEl: HTMLVideoElement,
      canvasWidth: number,
      canvasHeight: number,
      config: Partial<CropConfig>
    ) {
      const normalized = normalizeConfig(config)
      const srcWidth = videoEl.videoWidth || canvasWidth
      const srcHeight = videoEl.videoHeight || canvasHeight

      // Recompute boxes only when config or source dimensions change
      if (
        cachedConfig === null ||
        cachedSrcWidth !== srcWidth ||
        cachedSrcHeight !== srcHeight ||
        cachedConfig.aspectRatio !== normalized.aspectRatio ||
        cachedConfig.zoom !== normalized.zoom ||
        cachedConfig.alignX !== normalized.alignX ||
        cachedConfig.alignY !== normalized.alignY ||
        cachedConfig.barColor !== normalized.barColor
      ) {
        recompute(normalized, srcWidth, srcHeight)
      }

      // Fill background only when there are actual bars to draw
      if (cachedNeedsBars) {
        ctx.fillStyle = normalized.barColor
        ctx.fillRect(0, 0, srcWidth, srcHeight)
      }

      ctx.drawImage(
        videoEl,
        cachedCropBox.x,
        cachedCropBox.y,
        cachedCropBox.width,
        cachedCropBox.height,
        cachedDestBox.x,
        cachedDestBox.y,
        cachedDestBox.width,
        cachedDestBox.height
      )
    },
  }
}
