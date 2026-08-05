import type { PluginManifest } from "../types"
import { createFlipVerticalPlugin, FLIP_VERTICAL_PLUGIN_ID } from "./plugin"

export const flipVerticalManifest: PluginManifest = {
  id: FLIP_VERTICAL_PLUGIN_ID,
  label: "Flip Vertical",
  createPlugin: ({ modifier }) => createFlipVerticalPlugin(modifier),
  configMapper: (config) => ({ flipVertical: config.flipVertical ?? false }),
  isActive: () => true,
  configFields: ["flipVertical"],
  executionOrder: 6,
  uiOrder: 4.5,
}
