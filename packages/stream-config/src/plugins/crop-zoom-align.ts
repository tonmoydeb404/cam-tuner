import { StreamPlugin } from "../types"
import {
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
  }
}

/**
 * A plugin that acts as a letterbox: it crops, zooms, and aligns the feed,
 * and centers it on a black background maintaining the original canvas resolution.
 */
export function createCropZoomAlignPlugin(): StreamPlugin<CropConfig> {
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

      // Always use actual video dimensions as the source, not the canvas size
      // (they're the same after loadedmetadata, but this is safer for early frames)
      const srcWidth = videoEl.videoWidth || canvasWidth
      const srcHeight = videoEl.videoHeight || canvasHeight
      const originalSize = { width: srcWidth, height: srcHeight }

      // Canvas stays at original source dimensions — never resized
      if (ctx.canvas.width !== srcWidth || ctx.canvas.height !== srcHeight) {
        ctx.canvas.width = srcWidth
        ctx.canvas.height = srcHeight
      }

      // 1. Fill background (letterbox bars)
      ctx.fillStyle = "red"
      ctx.fillRect(0, 0, srcWidth, srcHeight)

      // 2. Calculate the crop box in source coordinates
      const cropBox = calculateCropBox(originalSize, normalized)

      // 3. Calculate where to draw it centered on the same-size canvas
      const destBox = calculateDestinationBox(originalSize, cropBox)

      // 4. Draw the cropped region, scaled to fill the destination box
      ctx.drawImage(
        videoEl,
        cropBox.x,
        cropBox.y,
        cropBox.width,
        cropBox.height,
        destBox.x,
        destBox.y,
        destBox.width,
        destBox.height
      )
    },
  }
}
