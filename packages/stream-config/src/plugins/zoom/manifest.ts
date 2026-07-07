import type { PluginManifest } from "../types"
import { ZOOM_PLUGIN_ID, createZoomPlugin } from "./plugin"
import type { ZoomPluginOptions } from "./types"

export function createZoomManifest(
  options: ZoomPluginOptions = {}
): PluginManifest {
  return {
    id: ZOOM_PLUGIN_ID,
    label: "Zoom",
    createPlugin: ({ modifier }) => createZoomPlugin(modifier, options),
    configMapper: (config) => ({
      zoom: config.zoom,
      zoomMode: options.disableAuto ? "fixed" : (config.zoomMode ?? "fixed"),
      autoZoomMin: config.autoZoomMin ?? 1.0,
      autoZoomMax: config.autoZoomMax ?? 2.5,
    }),
    isActive: () => true,
    configFields: ["zoom", "zoomMode", "autoZoomMin", "autoZoomMax"],
    executionOrder: 8,
    uiOrder: 3,
    options,
  }
}

export const zoomManifest = createZoomManifest()
