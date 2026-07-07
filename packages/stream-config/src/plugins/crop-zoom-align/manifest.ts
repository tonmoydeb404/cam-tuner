import type { PluginManifest } from "../types"
import { tunerConfigToCropConfig } from "../../utils/config"
import { CROP_ZOOM_ALIGN_PLUGIN_ID, createCropZoomAlignPlugin } from "./plugin"

export const cropZoomAlignManifest: PluginManifest = {
  id: CROP_ZOOM_ALIGN_PLUGIN_ID,
  label: "Crop & Zoom",
  createPlugin: () => createCropZoomAlignPlugin(),
  configMapper: (config) => tunerConfigToCropConfig(config),
  isActive: (config) =>
    !config.backgroundMode || config.backgroundMode === "none",
  configFields: [
    "aspectRatio",
    "zoom",
    "align",
    "barColor",
    "mirror",
    "letterbox",
  ],
  order: 10,
}
