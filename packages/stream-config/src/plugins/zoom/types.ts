import type { ZoomMode } from "../../tuner-types"

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
