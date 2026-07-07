export interface BackgroundPluginOptions {
  /** Hide/disable the blur mode entirely. */
  disableBlur?: boolean
  /** Hide/disable the image replacement mode entirely. */
  disableImage?: boolean
  /** Emit per-frame debug logs via console.debug. */
  enableDebug?: boolean
  [key: string]: boolean | undefined
}
