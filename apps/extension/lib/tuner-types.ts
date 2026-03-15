export type AspectRatio = "16:9" | "4:3" | "1:1" | "9:16"

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
  gridVisible: boolean
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
  gridVisible: false,
}
