import type { ZoomMode } from "../../tuner-types"

export interface ZoomPluginOptions {
  /** Disable the automatic zoom mode; zoomMode is always treated as "fixed". */
  disableAuto?: boolean
  /** Emit per-frame debug logs via console.debug. */
  enableDebug?: boolean
  [key: string]: boolean | undefined
}

export type ZoomPluginConfig = {
  zoom: number
  zoomMode: ZoomMode
  autoZoomMin: number
  autoZoomMax: number
}

export const DEFAULT_ZOOM_PLUGIN_CONFIG: ZoomPluginConfig = {
  zoom: 1,
  zoomMode: "fixed",
  autoZoomMin: 1.0,
  autoZoomMax: 2.5,
}
