import type { PluginManifest } from "./types"
import { cropZoomAlignManifest } from "./crop-zoom-align/manifest"
import { centerStageManifest } from "./center-stage/manifest"
import { backgroundFilterManifest } from "./background-filter/manifest"

export const PLUGIN_REGISTRY: PluginManifest[] = [
  cropZoomAlignManifest,
  centerStageManifest,
  backgroundFilterManifest,
]
