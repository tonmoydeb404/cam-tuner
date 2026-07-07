import type { StreamPlugin } from "../../types"
import {
  createBackgroundFilterPlugin,
  type BackgroundFilterOptions,
} from "../background-filter/plugin"
import type { PersonSegmenter } from "../background-filter/segmenter"
import type { BackgroundFilterConfig } from "../background-filter/types"
import type { BackgroundPluginOptions } from "./types"

export const BACKGROUND_PLUGIN_ID = "core:background"

/**
 * Creates the background plugin instance with the canonical ID "core:background".
 * Wraps the existing background-filter implementation.
 */
export function createBackgroundPlugin(
  segmenter: PersonSegmenter,
  implOptions?: BackgroundFilterOptions,
  pluginOptions?: BackgroundPluginOptions
): StreamPlugin<BackgroundFilterConfig> {
  const mergedOptions: BackgroundFilterOptions = {
    ...implOptions,
    ...(pluginOptions?.maskFeather !== undefined && {
      maskFeather: pluginOptions.maskFeather,
    }),
    ...(pluginOptions?.thresholdLow !== undefined && {
      thresholdLow: pluginOptions.thresholdLow,
    }),
    ...(pluginOptions?.thresholdHigh !== undefined && {
      thresholdHigh: pluginOptions.thresholdHigh,
    }),
    ...(pluginOptions?.lightWrapAlpha !== undefined && {
      lightWrapAlpha: pluginOptions.lightWrapAlpha,
    }),
  }
  const inner = createBackgroundFilterPlugin(segmenter, mergedOptions)
  const plugin: StreamPlugin<BackgroundFilterConfig> = {
    ...inner,
    id: BACKGROUND_PLUGIN_ID,
  }

  if (!pluginOptions?.enableDebug || !inner.prepareSource) return plugin

  const originalPrepareSource = inner.prepareSource.bind(inner)
  return {
    ...plugin,
    prepareSource(source, config) {
      console.debug(
        "[core:background] prepareSource mode=%s blurAmount=%s",
        config.mode,
        config.blurAmount
      )
      return originalPrepareSource(source, config)
    },
  }
}
