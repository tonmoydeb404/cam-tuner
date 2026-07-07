import type { PluginManifest } from "../types"
import { ZOOM_PLUGIN_ID, createZoomPlugin } from "./plugin"

export const zoomManifest: PluginManifest = {
  id: ZOOM_PLUGIN_ID,
  label: "Zoom",
  createPlugin: ({ modifier }) => createZoomPlugin(modifier),
  configMapper: (config) => ({
    zoom: config.zoom,
    zoomMode: config.zoomMode ?? "fixed",
    autoZoomMin: config.autoZoomMin ?? 1.0,
    autoZoomMax: config.autoZoomMax ?? 2.5,
  }),
  isActive: () => true,
  configFields: ["zoom", "zoomMode", "autoZoomMin", "autoZoomMax"],
  executionOrder: 8,
  uiOrder: 3,
}
