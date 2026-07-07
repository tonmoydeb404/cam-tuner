import { getFaceTrackingService } from "../../tracking/face-tracking-service"
import type { StreamModifier, StreamPlugin } from "../../types"
import { parseAlignPosition } from "../../utils/config"
import type { AlignCenter } from "../../utils/math"
import { CROP_PLUGIN_ID } from "../crop/manifest"
import { DEFAULT_ALIGN_PLUGIN_CONFIG, type AlignPluginConfig } from "./types"

export const ALIGN_PLUGIN_ID = "core:align"

const DEFAULT_SMOOTHING_FACTOR = 0.05
const DEFAULT_DEADZONE = 0.03
const DEFAULT_TARGET_STABILIZATION = 0.18
const DEFAULT_TARGET_FILL = 0.4
const DEFAULT_PADDING = 0.3

/**
 * Align controller plugin.
 *
 * A "controller" plugin — it draws nothing.  Each frame it resolves the
 * effective alignment (manual grid position or auto-tracking via Center Stage)
 * and forwards the result into the crop plugin via the shared modifier.
 *
 * Auto-align reads from the shared FaceTrackingService singleton.  The align
 * plugin runs at executionOrder 9, after the zoom plugin (8).  If auto-zoom is
 * also active the zoom plugin will have already called processFrame; the align
 * plugin's call is then a no-op for detection (within-interval) but still
 * advances the smoothing tick for the pan channel.
 */
export function createAlignPlugin(
  modifier: StreamModifier
): StreamPlugin<AlignPluginConfig> {
  let lastAlignX: string | undefined = undefined
  let lastAlignY: string | undefined = undefined
  let lastAlignCenter: AlignCenter | undefined = undefined
  let wasActive = false

  return {
    id: ALIGN_PLUGIN_ID,

    drawCanvas(
      _ctx,
      source,
      width,
      height,
      config: Partial<AlignPluginConfig>
    ) {
      const align = config.align ?? DEFAULT_ALIGN_PLUGIN_CONFIG.align
      const centerStageEnabled =
        config.centerStageEnabled ??
        DEFAULT_ALIGN_PLUGIN_CONFIG.centerStageEnabled
      const { alignX, alignY } = parseAlignPosition(align)

      let alignCenter: AlignCenter | undefined = undefined

      if (centerStageEnabled) {
        const service = getFaceTrackingService()
        if (service.hasDetector()) {
          service.processFrame(source, width, height, {
            centerActive: true,
            zoomActive: false,
            smoothingFactor: DEFAULT_SMOOTHING_FACTOR,
            deadzone: DEFAULT_DEADZONE,
            targetStabilization: DEFAULT_TARGET_STABILIZATION,
            targetFill: DEFAULT_TARGET_FILL,
            padding: DEFAULT_PADDING,
          })
          alignCenter = service.getAlignResult()
        }
      }

      // When center stage deactivates, clear the override once so the manual
      // align takes over cleanly.
      const becameInactive = wasActive && !centerStageEnabled
      wasActive = centerStageEnabled

      const alignXChanged = alignX !== lastAlignX
      const alignYChanged = alignY !== lastAlignY
      const alignCenterChanged =
        alignCenter?.x !== lastAlignCenter?.x ||
        alignCenter?.y !== lastAlignCenter?.y ||
        (alignCenter === undefined) !== (lastAlignCenter === undefined)

      if (
        !alignXChanged &&
        !alignYChanged &&
        !alignCenterChanged &&
        !becameInactive
      ) {
        return
      }

      lastAlignX = alignX
      lastAlignY = alignY
      lastAlignCenter = alignCenter

      try {
        modifier.updatePluginConfig(CROP_PLUGIN_ID, {
          alignX,
          alignY,
          alignCenter,
        })
      } catch {
        // Modifier may be tearing down.
      }
    },

    destroy() {
      try {
        modifier.updatePluginConfig(CROP_PLUGIN_ID, {
          alignCenter: undefined,
        })
      } catch {
        // Ignore teardown errors.
      }
    },
  }
}
