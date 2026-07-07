import type { BackgroundMode } from "../../tuner-types"

export interface BackgroundFilterConfig {
  mode: BackgroundMode
  blurAmount: number
  imageId: string | null
}

export const DEFAULT_BACKGROUND_FILTER_CONFIG: BackgroundFilterConfig = {
  mode: "none",
  blurAmount: 14,
  imageId: null,
}

const MIN_BLUR = 4
const MAX_BLUR = 40

export function resolveBackgroundConfig(
  config: Partial<BackgroundFilterConfig> | undefined
): BackgroundFilterConfig {
  if (!config) return { ...DEFAULT_BACKGROUND_FILTER_CONFIG }
  return {
    mode: config.mode ?? DEFAULT_BACKGROUND_FILTER_CONFIG.mode,
    blurAmount: config.blurAmount ?? DEFAULT_BACKGROUND_FILTER_CONFIG.blurAmount,
    imageId: config.imageId ?? DEFAULT_BACKGROUND_FILTER_CONFIG.imageId,
  }
}

export function clampBlur(px: number): number {
  if (isNaN(px)) return DEFAULT_BACKGROUND_FILTER_CONFIG.blurAmount
  return Math.max(MIN_BLUR, Math.min(MAX_BLUR, px))
}
