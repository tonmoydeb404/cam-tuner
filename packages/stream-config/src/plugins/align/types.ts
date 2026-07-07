import type { AlignPosition } from "../../tuner-types"

export type AlignPluginConfig = {
  align: AlignPosition
  centerStageEnabled: boolean
}

export const DEFAULT_ALIGN_PLUGIN_CONFIG: AlignPluginConfig = {
  align: "center",
  centerStageEnabled: false,
}
