export type AspectRatio = "16:9" | "4:3" | "1:1" | "9:16"

/**
 * Zoom behaviour.
 * - "fixed" — the user's manual `zoom` value is used (default).
 * - "auto"  — face detection drives the zoom within [autoZoomMin, autoZoomMax].
 *   Independent of Center Stage: auto-zoom works with or without auto-framing.
 */
export type ZoomMode = "auto" | "fixed"

export type AlignPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"

/**
 * Background effect mode.
 * - "none"  — no effect (the plugin is a no-op, zero cost).
 * - "blur"  — blur the background behind the person.
 * - "image" — replace the background with a selected image.
 */
export type BackgroundMode = "none" | "blur" | "image"

/**
 * Quality / performance strategy for the matting backend.
 * - "auto"        — macOS-grade RVM on WebGPU, MediaPipe binary elsewhere.
 * - "high"        — force RVM (WebGPU preferred, WebGL fallback).
 * - "performance" — force MediaPipe binary (always smooth).
 */
export type BackgroundQuality = "auto" | "high" | "performance"

export interface BackgroundConfig {
  mode: BackgroundMode
  /** Gaussian blur radius in px (blur mode only). Clamped to 4–40. */
  blurAmount: number
  /** Preset id or uploaded-image id (image mode only). */
  imageId: string | null
  /** Which matting backend to prefer. */
  quality: BackgroundQuality
}

export const DEFAULT_BACKGROUND_CONFIG: BackgroundConfig = {
  mode: "none",
  blurAmount: 14,
  imageId: null,
  quality: "auto",
}

export interface TunerConfig {
  aspectRatio: AspectRatio
  zoom: number
  align: AlignPosition
  barColor: string
  mirror: boolean
  /**
   * Whether Center Stage (face-tracking auto-framing) is on.
   * Optional for backward compatibility with configs persisted before
   * the feature existed (treated as false when undefined).
   */
  centerStageEnabled?: boolean
  /**
   * Whether to pad the cropped region with bars to keep the original
   * resolution (true, default) or output exactly the cropped region with
   * no bars (false). Optional for backward compatibility (defaults to true).
   */
  letterbox?: boolean
  /**
   * Background blur / image-replacement settings. Optional for backward
   * compatibility with configs persisted before the feature existed
   * (treated as "none" when undefined).
   */
  background?: BackgroundConfig
  /**
   * Whether face detection drives the zoom ("auto") or the manual `zoom`
   * value is used ("fixed"). Optional for backward compatibility (defaults
   * to "fixed"). Independent of `centerStageEnabled`.
   */
  zoomMode?: ZoomMode
  /**
   * Minimum auto-zoom (only used when `zoomMode === "auto"`). Default 1.0.
   */
  autoZoomMin?: number
  /**
   * Maximum auto-zoom ceiling (only used when `zoomMode === "auto"`).
   * Default 2.5.
   */
  autoZoomMax?: number
}

export const ASPECT_RATIO_OPTIONS: AspectRatio[] = [
  "16:9",
  "4:3",
  "1:1",
  "9:16",
]

export const ASPECT_RATIO_CLASS: Record<AspectRatio, string> = {
  "16:9": "aspect-video",
  "4:3": "aspect-[4/3]",
  "1:1": "aspect-square",
  "9:16": "aspect-[9/16]",
}

export const ALIGN_OBJECT_POSITION: Record<AlignPosition, string> = {
  "top-left": "top left",
  "top-center": "top center",
  "top-right": "top right",
  "center-left": "center left",
  center: "center",
  "center-right": "center right",
  "bottom-left": "bottom left",
  "bottom-center": "bottom center",
  "bottom-right": "bottom right",
}

export const DEFAULT_TUNER_CONFIG: TunerConfig = {
  aspectRatio: "16:9",
  zoom: 1,
  align: "center",
  mirror: false,
  barColor: "#000000",
  centerStageEnabled: false,
  letterbox: true,
  background: { ...DEFAULT_BACKGROUND_CONFIG },
  zoomMode: "fixed",
  autoZoomMin: 1.0,
  autoZoomMax: 2.5,
}
