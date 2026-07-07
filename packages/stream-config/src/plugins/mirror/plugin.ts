import type { StreamModifier, StreamPlugin } from "../../types"
import { CROP_PLUGIN_ID } from "../crop/manifest"
import type { MirrorPluginConfig } from "./types"

export const MIRROR_PLUGIN_ID = "core:mirror"

/**
 * Mirror controller plugin.
 *
 * A "controller" plugin — it draws nothing.  Each frame it forwards its
 * mirror flag into the crop plugin's config via the shared modifier, keeping
 * the mirror toggle decoupled from the rendering logic.
 */
export function createMirrorPlugin(
  modifier: StreamModifier
): StreamPlugin<MirrorPluginConfig> {
  let lastMirror: boolean | undefined = undefined

  return {
    id: MIRROR_PLUGIN_ID,

    drawCanvas(_ctx, _source, _w, _h, config: Partial<MirrorPluginConfig>) {
      const mirror = config.mirror ?? false
      if (mirror === lastMirror) return
      lastMirror = mirror
      try {
        modifier.updatePluginConfig(CROP_PLUGIN_ID, { mirror })
      } catch {
        // Modifier may be tearing down.
      }
    },

    destroy() {
      try {
        modifier.updatePluginConfig(CROP_PLUGIN_ID, { mirror: false })
      } catch {
        // Ignore teardown errors.
      }
    },
  }
}
