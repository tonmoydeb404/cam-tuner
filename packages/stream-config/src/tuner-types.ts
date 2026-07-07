export type AspectRatio = "16:9" | "4:3" | "1:1" | "9:16"

/**
 * Zoom behaviour.
 * - "fixed" — the user's manual `zoom` value is used (default).
 * - "auto"  — face detection drives the zoom within [autoZoomMin, autoZoomMax].
 *   Independent of Center Stage: auto-zoom works with or without auto-framing.
 */
export type ZoomMode = "auto" | "fixed"

export type BackgroundMode = "none" | "blur" | "image"

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
  backgroundMode?: BackgroundMode
  blurStrength?: number
  backgroundImage?: string | null
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
  zoomMode: "fixed",
  autoZoomMin: 1.0,
  autoZoomMax: 2.5,
  backgroundMode: "none",
  blurStrength: 14,
  backgroundImage: null,
}
