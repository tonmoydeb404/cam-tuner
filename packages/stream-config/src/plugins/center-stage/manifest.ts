import type { PluginManifest } from "../types"
import { CENTER_STAGE_PLUGIN_ID, createCenterStagePlugin } from "./plugin"

export const centerStageManifest: PluginManifest = {
  id: CENTER_STAGE_PLUGIN_ID,
  label: "Center Stage",
  createPlugin: ({ modifier, adapter }) =>
    createCenterStagePlugin(modifier, adapter as never),
  configMapper: (config) => ({
    enabled: config.centerStageEnabled === true,
    zoomMode: config.zoomMode ?? "fixed",
    minZoom: config.autoZoomMin ?? 1,
    maxZoom: config.autoZoomMax ?? 2.5,
  }),
  isActive: (config) =>
    config.centerStageEnabled === true || config.zoomMode === "auto",
  configFields: [
    "centerStageEnabled",
    "zoomMode",
    "autoZoomMin",
    "autoZoomMax",
  ],
  executionOrder: 20,
  uiOrder: 2,
}
