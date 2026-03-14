import { StreamPlugin } from "../types";
import { 
  calculateCropBox, 
  calculateDestinationBox, 
  CropConfig,
  AlignX,
  AlignY,
} from "../utils/math";

export const CROP_ZOOM_ALIGN_PLUGIN_ID = "core:crop-zoom-align";

/**
 * Ensures the config is always valid and falls back to safe defaults.
 */
function normalizeConfig(config: Partial<CropConfig>): CropConfig {
  return {
    aspectRatio: config.aspectRatio || 16 / 9,
    zoom: Math.max(1, config.zoom || 1),
    alignX: config.alignX || "center",
    alignY: config.alignY || "center",
  };
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
      
      const normalized = normalizeConfig(config);
      const originalSize = { 
        width: frame.displayWidth, 
        height: frame.displayHeight 
      };

      const cropBox = calculateCropBox(originalSize, normalized);
      
      // VideoFrame constructor allows us to clone a frame with a new visible rectangle
      // This is a zero-copy metadata change! Incredibly fast.
      // @ts-ignore
      return new VideoFrame(frame, {
        visibleRect: cropBox
      });
    },

    // OffscreenCanvas fallback pipeline (The True Letterbox)
    drawCanvas(ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D, videoConfig: HTMLVideoElement, canvasWidth: number, canvasHeight: number, config: Partial<CropConfig>) {
      const normalized = normalizeConfig(config);
      const originalSize = { width: canvasWidth, height: canvasHeight };

      // 1. Find the crop box in the source video
      const cropBox = calculateCropBox(originalSize, normalized);
      
      // 2. Find where to safely draw it on the destination canvas to be centered
      const destBox = calculateDestinationBox(originalSize, cropBox);

      // (The canvas is already cleared to black by the CanvasEngine)
      
      // 3. Draw only the cropped portion onto the center of the destination
      ctx.drawImage(
        videoConfig,
        cropBox.x, cropBox.y, cropBox.width, cropBox.height,     // Source crop
        destBox.x, destBox.y, destBox.width, destBox.height      // Destination position
      );
    }
  };
}
