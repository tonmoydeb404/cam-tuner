import type { PluginManifest } from "../types"
import type { PersonSegmenter } from "./segmenter"
import {
  BACKGROUND_FILTER_PLUGIN_ID,
  createBackgroundFilterPlugin,
} from "./plugin"
import { resolveBackgroundConfig } from "./types"

export const backgroundFilterManifest: PluginManifest = {
  id: BACKGROUND_FILTER_PLUGIN_ID,
  label: "Background",
  createPlugin: ({ adapter }) =>
    createBackgroundFilterPlugin(adapter as PersonSegmenter),
  configMapper: (config) =>
    resolveBackgroundConfig({
      mode: config.backgroundMode,
      blurAmount: config.blurStrength,
      imageId: config.backgroundImage,
    }),
  isActive: (config) =>
    !!config.backgroundMode && config.backgroundMode !== "none",
  configFields: ["backgroundMode", "blurStrength", "backgroundImage"],
  order: 5,
}
