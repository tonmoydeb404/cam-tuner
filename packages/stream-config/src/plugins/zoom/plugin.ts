import { getFaceTrackingService } from "../../tracking/face-tracking-service"
import type { StreamModifier, StreamPlugin } from "../../types"
import { CROP_PLUGIN_ID } from "../crop/manifest"
import { DEFAULT_ZOOM_PLUGIN_CONFIG, type ZoomPluginConfig } from "./types"

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
 * singleton.  The zoom plugin runs at executionOrder 8, before the align
 * plugin (9), so it calls processFrame first; align will re-use the cached
 * detection result within the same frame interval.
 */
export function createZoomPlugin(
  modifier: StreamModifier
): StreamPlugin<ZoomPluginConfig> {
  let lastZoom: number | undefined = undefined
  let lastZoomOverride: number | undefined = undefined

  return {
    id: ZOOM_PLUGIN_ID,

    drawCanvas(_ctx, source, width, height, config: Partial<ZoomPluginConfig>) {
      const zoom = config.zoom ?? DEFAULT_ZOOM_PLUGIN_CONFIG.zoom
      const zoomMode = config.zoomMode ?? DEFAULT_ZOOM_PLUGIN_CONFIG.zoomMode
      const autoZoomMin =
        config.autoZoomMin ?? DEFAULT_ZOOM_PLUGIN_CONFIG.autoZoomMin
      const autoZoomMax =
        config.autoZoomMax ?? DEFAULT_ZOOM_PLUGIN_CONFIG.autoZoomMax
      const zoomActive = zoomMode === "auto"

      let zoomOverride: number | undefined = undefined

      if (zoomActive) {
        const service = getFaceTrackingService()
        if (service.hasDetector()) {
          service.processFrame(source, width, height, {
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
