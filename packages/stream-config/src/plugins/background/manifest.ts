import type { PersonSegmenter } from "../background-filter/segmenter"
import { resolveBackgroundConfig } from "../background-filter/types"
import type { PluginManifest } from "../types"
import { BACKGROUND_PLUGIN_ID, createBackgroundPlugin } from "./plugin"

export { BACKGROUND_PLUGIN_ID }

export const backgroundManifest: PluginManifest = {
  id: BACKGROUND_PLUGIN_ID,
  label: "Background",
  createPlugin: ({ adapter }) =>
    createBackgroundPlugin(adapter as PersonSegmenter),
  configMapper: (config) =>
    resolveBackgroundConfig({
      mode: config.backgroundMode,
      blurAmount: config.blurStrength,
      imageId: config.backgroundImage,
    }),
  isActive: (config) =>
    !!config.backgroundMode && config.backgroundMode !== "none",
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
}
