import type { ZoomMode } from "../../tuner-types"

export type CenterStageConfig = {
  enabled: boolean
  smoothingFactor?: number
  deadzone?: number
  detectIntervalMs?: number
  targetStabilization?: number
  targetFill?: number
  padding?: number
  minZoom?: number
  maxZoom?: number
  zoomMode?: ZoomMode
}

export const DEFAULT_CENTER_STAGE_CONFIG: CenterStageConfig = {
  enabled: true,
  smoothingFactor: 0.05,
  deadzone: 0.03,
  detectIntervalMs: 120,
  targetStabilization: 0.18,
  targetFill: 0.4,
  padding: 0.3,
  minZoom: 1.0,
  maxZoom: 2.5,
  zoomMode: "auto",
}
