/**
 * Converts a user-facing TunerConfig into the CropConfig consumed by the
 * crop-zoom-align plugin. Centralises the parsing that was previously
 * duplicated across the web hook and the extension injector.
 */

import type { AlignPosition, AspectRatio, TunerConfig } from "../tuner-types"
import type { AlignX, AlignY, CropConfig } from "./math"

/**
 * Parses a human-readable aspect-ratio string (e.g. "16:9") into its
 * numeric value (e.g. 1.777…).
 */
export function parseAspectRatio(ratio: string): number {
  if (ratio === "16:9") return 16 / 9
  if (ratio === "4:3") return 4 / 3
  if (ratio === "1:1") return 1
  if (ratio === "9:16") return 9 / 16
  return 16 / 9 // fallback
}

/**
 * Splits a compound AlignPosition (e.g. "top-left") into separate
 * horizontal and vertical alignment values.
 */
export function parseAlignPosition(align: AlignPosition): {
  alignX: AlignX
  alignY: AlignY
} {
  let alignX: AlignX = "center"
  if (align.includes("left")) alignX = "left"
  else if (align.includes("right")) alignX = "right"

  let alignY: AlignY = "center"
  if (align.includes("top")) alignY = "top"
  else if (align.includes("bottom")) alignY = "bottom"

  return { alignX, alignY }
}

/**
 * Converts a TunerConfig (user-facing) into a CropConfig (plugin-facing).
 * This is the single source of truth for the mapping.
 */
export function tunerConfigToCropConfig(
  config: TunerConfig
): Omit<CropConfig, never> {
  const { alignX, alignY } = parseAlignPosition(config.align)
  return {
    aspectRatio: parseAspectRatio(config.aspectRatio),
    zoom: config.zoom,
    alignX,
    alignY,
    barColor: config.barColor || "#000000",
  }
}

/**
 * Creates a partial CropConfig from a partial TunerConfig update,
 * only including fields that changed.
 */
export function tunerUpdateToCropUpdate(
  update: Partial<TunerConfig>
): Partial<CropConfig> {
  const result: Partial<CropConfig> = {}

  if (update.aspectRatio !== undefined) {
    result.aspectRatio = parseAspectRatio(update.aspectRatio)
  }
  if (update.zoom !== undefined) {
    result.zoom = update.zoom
  }
  if (update.align !== undefined) {
    const { alignX, alignY } = parseAlignPosition(update.align)
    result.alignX = alignX
    result.alignY = alignY
  }
  if (update.barColor !== undefined) {
    result.barColor = update.barColor
  }

  return result
}
