import {
  ALIGN_PLUGIN_ID,
  BACKGROUND_PLUGIN_ID,
  CROP_PLUGIN_ID,
  MIRROR_PLUGIN_ID,
  ZOOM_PLUGIN_ID,
  type PluginUIProps,
} from "@workspace/stream-config"
import { AlignPluginControl } from "@workspace/ui/components/tuner/align-plugin-control"
import type { BackgroundFilterControlProps } from "@workspace/ui/components/tuner/background-filter-control"
import { BackgroundFilterControl } from "@workspace/ui/components/tuner/background-filter-control"
import { CropControl } from "@workspace/ui/components/tuner/crop-control"
import { MirrorPluginControl } from "@workspace/ui/components/tuner/mirror-plugin-control"
import { ZoomPluginControl } from "@workspace/ui/components/tuner/zoom-plugin-control"
import type { ComponentType } from "react"

export const PLUGIN_UI_REGISTRY: Record<
  string,
  ComponentType<PluginUIProps>
> = {
  [CROP_PLUGIN_ID]: CropControl,
  [ALIGN_PLUGIN_ID]: AlignPluginControl,
  [ZOOM_PLUGIN_ID]: ZoomPluginControl,
  [MIRROR_PLUGIN_ID]: MirrorPluginControl,
  [BACKGROUND_PLUGIN_ID]: BackgroundFilterControl,
}

export { BackgroundFilterControl }
export type { BackgroundFilterControlProps }
