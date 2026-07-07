import type { StreamPlugin } from "../../types"
import {
  createBackgroundFilterPlugin,
  type BackgroundFilterOptions,
} from "../background-filter/plugin"
import type { PersonSegmenter } from "../background-filter/segmenter"
import type { BackgroundFilterConfig } from "../background-filter/types"

export const BACKGROUND_PLUGIN_ID = "core:background"

/**
 * Creates the background plugin instance with the canonical ID "core:background".
 * Wraps the existing background-filter implementation.
 */
export function createBackgroundPlugin(
  segmenter: PersonSegmenter,
  options?: BackgroundFilterOptions
): StreamPlugin<BackgroundFilterConfig> {
  const inner = createBackgroundFilterPlugin(segmenter, options)
  return { ...inner, id: BACKGROUND_PLUGIN_ID }
}
