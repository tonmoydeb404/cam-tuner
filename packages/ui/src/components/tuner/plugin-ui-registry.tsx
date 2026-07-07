import {
  BACKGROUND_FILTER_PLUGIN_ID,
  CENTER_STAGE_PLUGIN_ID,
  CROP_ZOOM_ALIGN_PLUGIN_ID,
  type PluginUIProps,
} from "@workspace/stream-config"
import type { ComponentType } from "react"
import { BackgroundFilterControl } from "@workspace/ui/components/tuner/background-filter-control"
import type { BackgroundFilterControlProps } from "@workspace/ui/components/tuner/background-filter-control"
import { CenterStageControl } from "@workspace/ui/components/tuner/center-stage-control"
import { CropZoomAlignControl } from "@workspace/ui/components/tuner/crop-zoom-align-control"

export const PLUGIN_UI_REGISTRY: Record<
  string,
  ComponentType<PluginUIProps>
> = {
  [CROP_ZOOM_ALIGN_PLUGIN_ID]: CropZoomAlignControl,
  [CENTER_STAGE_PLUGIN_ID]: CenterStageControl,
  [BACKGROUND_FILTER_PLUGIN_ID]: BackgroundFilterControl,
}

export { BackgroundFilterControl }
export type { BackgroundFilterControlProps }
