import { getFaceTrackingService } from "../../tracking/face-tracking-service"
import type { StreamPlugin } from "../../types"
import type { CropConfig } from "../../utils/math"
import {
  calculateCropBox,
  calculateDestinationBox,
  getSourceSize,
} from "../../utils/math"
import type { DebugOverlayOptions } from "./types"

export const DEBUG_OVERLAY_PLUGIN_ID = "core:debug-overlay"

/**
 * Debug overlay plugin — draws face bounding boxes, the smoothed alignment
 * center, and the effective zoom level on top of the final crop output.
 *
 * Runs at executionOrder 11, after crop (10), so overlays land on the
 * already-rendered letterboxed frame.
 *
 * Coordinate mapping: face boxes arrive in source-pixel space. The plugin
 * recomputes the same crop/dest boxes that the crop plugin uses (pulling
 * zoomOverride and alignCenter directly from the tracking service) so the
 * rectangles align with faces in the output.
 */
export function createDebugOverlayPlugin(
  options: DebugOverlayOptions = {}
): StreamPlugin<CropConfig> {
  const showFaceBox = options.showFaceBox ?? true
  const showAlignCenter = options.showAlignCenter ?? true
  const showZoom = options.showZoom ?? true

  return {
    id: DEBUG_OVERLAY_PLUGIN_ID,

    drawCanvas(
      ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
      source: CanvasImageSource,
      _width: number,
      _height: number,
      config: Partial<CropConfig>
    ) {
      const service = getFaceTrackingService()
      if (!service.hasDetector()) return

      const srcSize = getSourceSize(source)
      if (!srcSize.width || !srcSize.height) return

      // Build an effective crop config: override zoom/alignCenter from the
      // tracking service (which is what the crop plugin actually used).
      const zoomOverride = service.getZoomResult()
      const alignCenter = service.getAlignResult()
      const effectiveConfig: CropConfig = {
        aspectRatio: config.aspectRatio ?? 16 / 9,
        zoom: config.zoom ?? 1,
        alignX: config.alignX ?? "center",
        alignY: config.alignY ?? "center",
        barColor: config.barColor ?? "#000000",
        mirror: config.mirror ?? false,
        letterbox: config.letterbox ?? true,
        zoomOverride,
        alignCenter,
      }

      const cropBox = calculateCropBox(srcSize, effectiveConfig)
      // In non-letterbox mode the canvas has been resized to the crop dimensions
      // (see getOutputSize in crop-zoom-align), so the dest region IS the full
      // canvas. calculateDestinationBox would use srcSize as the container and
      // produce the wrong box, so we short-circuit it here.
      const destBox = effectiveConfig.letterbox
        ? calculateDestinationBox(srcSize, cropBox)
        : { x: 0, y: 0, width: _width, height: _height }

      const mirrored = effectiveConfig.mirror ?? false
      const scaleX = destBox.width / cropBox.width
      const scaleY = destBox.height / cropBox.height

      // Content's actual left edge on the canvas (affected by mirror transform).
      const contentLeft = mirrored
        ? _width - destBox.x - destBox.width
        : destBox.x

      ctx.save()
      // Clip all overlays to the visible content area so nothing bleeds into bars.
      ctx.beginPath()
      ctx.rect(contentLeft, destBox.y, destBox.width, destBox.height)
      ctx.clip()

      // Apply the same affine transform the crop plugin uses so that anything
      // drawn at source-pixel coordinates maps to the correct canvas position.
      //
      // Non-mirrored: canvas = scale(scaleX, scaleY) + translate(destBox - cropBox * scale)
      // Mirrored:     as above but with a horizontal flip: scaleX → -scaleX, and the
      //               x-origin shifts to the mirror axis (canvasWidth - destBox.x).
      if (mirrored) {
        ctx.setTransform(
          -scaleX,
          0,
          0,
          scaleY,
          _width - destBox.x + cropBox.x * scaleX,
          destBox.y - cropBox.y * scaleY
        )
      } else {
        ctx.setTransform(
          scaleX,
          0,
          0,
          scaleY,
          destBox.x - cropBox.x * scaleX,
          destBox.y - cropBox.y * scaleY
        )
      }

      // Helper: convert source-px line width / font size to a canvas-px equivalent
      // so visuals appear at a fixed canvas size regardless of zoom.
      const invScale = 1 / scaleX

      // --- Face bounding boxes ---
      // Drawn in source-pixel coordinates; the transform maps them to canvas.
      if (showFaceBox) {
        const faces = service.getLastFaces()
        ctx.strokeStyle = "#00ff41"
        ctx.lineWidth = 2 * invScale
        for (const face of faces) {
          ctx.strokeRect(face.x, face.y, face.width, face.height)
          if (face.confidence !== undefined) {
            ctx.save()
            // Reset transform for readable text, then position at face top-left.
            const labelX = mirrored
              ? _width - destBox.x + (cropBox.x - face.x) * scaleX
              : destBox.x + (face.x - cropBox.x) * scaleX
            const labelY = destBox.y + (face.y - cropBox.y) * scaleY - 4
            ctx.setTransform(1, 0, 0, 1, 0, 0)
            ctx.font = "bold 13px monospace"
            ctx.fillStyle = "#00ff41"
            ctx.fillText(
              `${Math.round(face.confidence * 100)}%`,
              labelX,
              labelY
            )
            ctx.restore()
          }
        }
      }

      // --- Smoothed alignment center dot ---
      // alignCenter is 0..1 normalized, convert to source pixels.
      if (showAlignCenter && alignCenter) {
        const dotSrcX = alignCenter.x * srcSize.width
        const dotSrcY = alignCenter.y * srcSize.height
        ctx.beginPath()
        ctx.arc(dotSrcX, dotSrcY, 6 * invScale, 0, Math.PI * 2)
        ctx.fillStyle = "#ff4400"
        ctx.fill()
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 1.5 * invScale
        ctx.stroke()

        // Crosshair lines
        ctx.beginPath()
        ctx.strokeStyle = "rgba(255, 68, 0, 0.7)"
        ctx.lineWidth = invScale
        ctx.moveTo(dotSrcX - 14 * invScale, dotSrcY)
        ctx.lineTo(dotSrcX + 14 * invScale, dotSrcY)
        ctx.moveTo(dotSrcX, dotSrcY - 14 * invScale)
        ctx.lineTo(dotSrcX, dotSrcY + 14 * invScale)
        ctx.stroke()
      }

      // --- Zoom level label (canvas coords — reset transform first) ---
      if (showZoom) {
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        const effectiveZoom = zoomOverride ?? config.zoom ?? 1
        const label = `zoom ${effectiveZoom.toFixed(2)}×`
        const padding = 6
        ctx.font = "bold 13px monospace"
        const textW = ctx.measureText(label).width
        const bx = contentLeft + padding
        const by = destBox.y + destBox.height - padding - 16

        ctx.fillStyle = "rgba(0, 0, 0, 0.55)"
        ctx.fillRect(bx - 3, by - 1, textW + 6, 18)
        ctx.fillStyle = "#00ff41"
        ctx.fillText(label, bx, by + 13)
      }

      ctx.restore()
    },
  }
}
