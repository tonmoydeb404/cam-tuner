import type { PluginManifest } from "../types"
import { ALIGN_PLUGIN_ID, createAlignPlugin } from "./plugin"
import type { AlignPluginOptions } from "./types"

export function createAlignManifest(
  options: AlignPluginOptions = {}
): PluginManifest {
  return {
    id: ALIGN_PLUGIN_ID,
    label: "Align",
    createPlugin: ({ modifier }) => createAlignPlugin(modifier, options),
    configMapper: (config) => ({
      align: config.align,
      centerStageEnabled: options.disableAuto
        ? false
        : (config.centerStageEnabled ?? false),
    }),
    isActive: () => true,
    configFields: ["align", "centerStageEnabled"],
    executionOrder: 4,
    uiOrder: 2,
    options,
  }
}

export const alignManifest = createAlignManifest()
