import type { PluginManifest } from "../types"
import { MIRROR_PLUGIN_ID, createMirrorPlugin } from "./plugin"

export const mirrorManifest: PluginManifest = {
  id: MIRROR_PLUGIN_ID,
  label: "Mirror",
  createPlugin: ({ modifier }) => createMirrorPlugin(modifier),
  configMapper: (config) => ({ mirror: config.mirror }),
  isActive: () => true,
  configFields: ["mirror"],
  executionOrder: 7,
  uiOrder: 4,
}
