import type { StreamPlugin } from "../../types"
import type { CropConfig } from "../../utils/math"
import { createCropZoomAlignPlugin } from "../crop-zoom-align/plugin"
import type { CropPluginOptions } from "./types"

export const CROP_PLUGIN_ID = "core:crop"

/**
 * Creates the crop plugin instance with the canonical ID "core:crop".
 * Wraps the existing crop-zoom-align implementation, which is the sole
 * geometric renderer in the pipeline.
 */
export function createCropPlugin(
  _options?: CropPluginOptions
): StreamPlugin<CropConfig> {
  const inner = createCropZoomAlignPlugin()
  return { ...inner, id: CROP_PLUGIN_ID }
}
