import type { StreamModifier, StreamPlugin } from "../../types"
import { CROP_PLUGIN_ID } from "../crop/manifest"
import type { FlipVerticalPluginConfig } from "./types"

export const FLIP_VERTICAL_PLUGIN_ID = "core:flip-vertical"

/**
 * Flip Vertical controller plugin.
 *
 * A "controller" plugin — it draws nothing.  Each frame it forwards its
 * flipVertical flag into the crop plugin's config via the shared modifier,
 * keeping the flip toggle decoupled from the rendering logic.
 */
export function createFlipVerticalPlugin(
  modifier: StreamModifier
): StreamPlugin<FlipVerticalPluginConfig> {
  let lastFlipVertical: boolean | undefined = undefined

  return {
    id: FLIP_VERTICAL_PLUGIN_ID,

    drawCanvas(
      _ctx,
      _source,
      _w,
      _h,
      config: Partial<FlipVerticalPluginConfig>
    ) {
      const flipVertical = config.flipVertical ?? false
      if (flipVertical === lastFlipVertical) return
      lastFlipVertical = flipVertical
      try {
        modifier.updatePluginConfig(CROP_PLUGIN_ID, { flipVertical })
      } catch {
        // Modifier may be tearing down.
      }
    },

    destroy() {
      try {
        modifier.updatePluginConfig(CROP_PLUGIN_ID, { flipVertical: false })
      } catch {
        // Ignore teardown errors.
      }
    },
  }
}
