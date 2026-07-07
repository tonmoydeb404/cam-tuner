import type { PluginManifest } from "../types"
import { ALIGN_PLUGIN_ID, createAlignPlugin } from "./plugin"

export const alignManifest: PluginManifest = {
  id: ALIGN_PLUGIN_ID,
  label: "Align",
  createPlugin: ({ modifier }) => createAlignPlugin(modifier),
  configMapper: (config) => ({
    align: config.align,
    centerStageEnabled: config.centerStageEnabled ?? false,
  }),
  isActive: () => true,
  configFields: ["align", "centerStageEnabled"],
  executionOrder: 9,
  uiOrder: 2,
}
