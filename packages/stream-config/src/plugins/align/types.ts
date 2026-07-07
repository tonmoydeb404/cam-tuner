import type { AlignPosition } from "../../tuner-types"

export interface AlignPluginOptions {
  /** Disable Center Stage auto-framing; centerStageEnabled is always treated as false. */
  disableAuto?: boolean
  /** Emit per-frame debug logs via console.debug. */
  enableDebug?: boolean
  [key: string]: boolean | undefined
}

export type AlignPluginConfig = {
  align: AlignPosition
  centerStageEnabled: boolean
}

export const DEFAULT_ALIGN_PLUGIN_CONFIG: AlignPluginConfig = {
  align: "center",
  centerStageEnabled: false,
}
