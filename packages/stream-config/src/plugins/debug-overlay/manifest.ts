import { parseAlignPosition, parseAspectRatio } from "../../utils/config"
import type { PluginManifest } from "../types"
import { DEBUG_OVERLAY_PLUGIN_ID, createDebugOverlayPlugin } from "./plugin"
import type { DebugOverlayOptions } from "./types"

export function createDebugOverlayManifest(
  options: DebugOverlayOptions = {}
): PluginManifest {
  return {
    id: DEBUG_OVERLAY_PLUGIN_ID,
    label: "Debug Overlay",
    createPlugin: () => createDebugOverlayPlugin(options),
    configMapper: (config) => {
      const { alignX, alignY } = parseAlignPosition(config.align)
      return {
        aspectRatio: parseAspectRatio(config.aspectRatio),
        zoom: config.zoom,
        alignX,
        alignY,
        barColor: config.barColor || "#000000",
        mirror: config.mirror,
        letterbox: config.letterbox ?? true,
      }
    },
    isActive: () => true,
    configFields: [
      "aspectRatio",
      "zoom",
      "align",
      "barColor",
      "mirror",
      "letterbox",
    ],
    executionOrder: 11,
    uiOrder: 0,
    options,
  }
}
