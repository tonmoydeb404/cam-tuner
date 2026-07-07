import type { BackgroundMode } from "../../tuner-types"
import type { PersonSegmenter } from "../background-filter/segmenter"
import { resolveBackgroundConfig } from "../background-filter/types"
import type { PluginManifest } from "../types"
import { BACKGROUND_PLUGIN_ID, createBackgroundPlugin } from "./plugin"
import type { BackgroundPluginOptions } from "./types"

export { BACKGROUND_PLUGIN_ID }

function applyModeOptions(
  mode: BackgroundMode | undefined,
  options: BackgroundPluginOptions
): BackgroundMode | undefined {
  if (mode === "blur" && options.disableBlur) return "none"
  if (mode === "image" && options.disableImage) return "none"
  return mode
}

export function createBackgroundManifest(
  options: BackgroundPluginOptions = {}
): PluginManifest {
  return {
    id: BACKGROUND_PLUGIN_ID,
    label: "Background",
    createPlugin: ({ adapter }) =>
      createBackgroundPlugin(adapter as PersonSegmenter, undefined, options),
    configMapper: (config) =>
      resolveBackgroundConfig({
        mode: applyModeOptions(config.backgroundMode, options),
        blurAmount: config.blurStrength,
        imageId: config.backgroundImage,
      }),
    isActive: (config) => {
      const mode = applyModeOptions(config.backgroundMode, options)
      return !!mode && mode !== "none"
    },
    configFields: ["backgroundMode", "blurStrength", "backgroundImage"],
    // Background requires an externally-provided segmenter loaded on demand by
    // useBackgroundFilter / reconcileBackground.  The adapter field signals that
    // this plugin must NOT be auto-created from the registry — it is managed
    // dynamically by its own hook.
    adapter: {
      load: async () => undefined,
    },
    executionOrder: 5,
    uiOrder: 5,
    options,
  }
}

export const backgroundManifest = createBackgroundManifest()
