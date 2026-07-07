import { getFaceTrackingService } from "../../tracking/face-tracking-service"
import type { StreamModifier, StreamPlugin } from "../../types"
import { CROP_PLUGIN_ID } from "../crop/manifest"
import {
  DEFAULT_ZOOM_PLUGIN_CONFIG,
  type ZoomPluginConfig,
  type ZoomPluginOptions,
} from "./types"

export const ZOOM_PLUGIN_ID = "core:zoom"

const DEFAULT_TARGET_FILL = 0.4
const DEFAULT_PADDING = 0.3

/**
 * Zoom controller plugin.
 *
 * A "controller" plugin — it draws nothing.  Each frame it resolves the
 * effective zoom value (manual or auto via face tracking) and forwards it
 * into the crop plugin via the shared modifier.
 *
 * Auto-zoom reads the latest zoom result from the shared FaceTrackingService
 * singleton.  The zoom plugin runs at executionOrder 3, before align (4) and
 * background (5), so its prepareSource captures the raw video frame before any
 * compositing, and its drawCanvas calls processFrame first; align will re-use
 * the cached detection result within the same frame interval.
 */
export function createZoomPlugin(
  modifier: StreamModifier,
  options?: ZoomPluginOptions
): StreamPlugin<ZoomPluginConfig> {
  let lastZoom: number | undefined = undefined
  let lastZoomOverride: number | undefined = undefined
  // Capture the raw (pre-background-composite) source so face detection always
  // runs on the unprocessed video frame.  prepareSource runs before any plugin
  // has modified the source (executionOrder 4, before background at 5), so the
  // reference stored here is always the raw <video> element.
  let rawSource: CanvasImageSource | null = null

  return {
    id: ZOOM_PLUGIN_ID,

    prepareSource(source) {
      rawSource = source
      return null
    },

    drawCanvas(_ctx, source, width, height, config: Partial<ZoomPluginConfig>) {
      const zoom = config.zoom ?? DEFAULT_ZOOM_PLUGIN_CONFIG.zoom
      const zoomMode = options?.disableAuto
        ? "fixed"
        : (config.zoomMode ?? DEFAULT_ZOOM_PLUGIN_CONFIG.zoomMode)
      const autoZoomMin =
        config.autoZoomMin ?? DEFAULT_ZOOM_PLUGIN_CONFIG.autoZoomMin
      const autoZoomMax =
        config.autoZoomMax ?? DEFAULT_ZOOM_PLUGIN_CONFIG.autoZoomMax
      const zoomActive = zoomMode === "auto"

      let zoomOverride: number | undefined = undefined

      if (zoomActive) {
        const service = getFaceTrackingService()
        if (service.hasDetector()) {
          // Prefer the raw source captured in prepareSource over the
          // (potentially composited/blurred) effectiveSource so that face
          // detection always sees an unmodified video frame.
          const detectionSource = rawSource ?? source
          service.processFrame(detectionSource, width, height, {
            centerActive: false,
            zoomActive: true,
            minZoom: autoZoomMin,
            maxZoom: autoZoomMax,
            targetFill: DEFAULT_TARGET_FILL,
            padding: DEFAULT_PADDING,
          })
          zoomOverride = service.getZoomResult()
        }
      }

      const zoomChanged = zoom !== lastZoom || zoomOverride !== lastZoomOverride
      if (!zoomChanged) return
      lastZoom = zoom
      lastZoomOverride = zoomOverride

      if (options?.enableDebug) {
        console.debug(
          "[core:zoom] zoom=%s zoomMode=%s zoomOverride=%s",
          zoom,
          zoomMode,
          zoomOverride
        )
      }

      try {
        modifier.updatePluginConfig(CROP_PLUGIN_ID, { zoom, zoomOverride })
      } catch {
        // Modifier may be tearing down.
      }
    },

    destroy() {
      try {
        modifier.updatePluginConfig(CROP_PLUGIN_ID, {
          zoom: DEFAULT_ZOOM_PLUGIN_CONFIG.zoom,
          zoomOverride: undefined,
        })
      } catch {
        // Ignore teardown errors.
      }
    },
  }
}
