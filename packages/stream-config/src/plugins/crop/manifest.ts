import { parseAspectRatio } from "../../utils/config"
import type { PluginManifest } from "../types"
import { CROP_PLUGIN_ID, createCropPlugin } from "./plugin"
import type { CropPluginOptions } from "./types"

export { CROP_PLUGIN_ID }

export function createCropManifest(
  options: CropPluginOptions = {}
): PluginManifest {
  return {
    id: CROP_PLUGIN_ID,
    label: "Crop",
    createPlugin: () => createCropPlugin(options),
    // Only maps the three fields this plugin owns from TunerConfig.
    // zoom, align, and mirror are injected each frame by their
    // respective controller plugins via modifier.updatePluginConfig.
    configMapper: (config) => ({
      aspectRatio: parseAspectRatio(config.aspectRatio),
      barColor: config.barColor || "#000000",
      letterbox: options.disableLetterbox ? false : (config.letterbox ?? true),
    }),
    isActive: () => true,
    configFields: ["aspectRatio", "barColor", "letterbox"],
    executionOrder: 10,
    uiOrder: 1,
    options,
  }
}

export const cropManifest = createCropManifest()
