export interface DebugOverlayOptions {
  /** Draw face bounding boxes as rectangles. Default: true. */
  showFaceBox?: boolean
  /** Draw the smoothed face-center dot used for alignment. Default: true. */
  showAlignCenter?: boolean
  /** Show current zoom level as a text label. Default: true. */
  showZoom?: boolean
  [key: string]: boolean | undefined
}
