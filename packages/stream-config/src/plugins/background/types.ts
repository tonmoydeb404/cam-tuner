export interface BackgroundPluginOptions {
  /** Hide/disable the blur mode entirely. */
  disableBlur?: boolean
  /** Hide/disable the image replacement mode entirely. */
  disableImage?: boolean
  /** Emit per-frame debug logs via console.debug. */
  enableDebug?: boolean
  /**
   * Pixels of blur applied to the segmentation mask before compositing.
   * Lower = harder, crisper edges. Default 5. Set to 0 for fully hard edges.
   */
  maskFeather?: number
  /**
   * Lower confidence bound for the smoothstep edge ramp (default 0.12).
   * Raise toward `thresholdHigh` to narrow the transition band.
   */
  thresholdLow?: number
  /**
   * Upper confidence bound for the smoothstep edge ramp (default 0.55).
   * Lower toward `thresholdLow` to narrow the transition band for sharper edges.
   */
  thresholdHigh?: number
  /**
   * Opacity of the light-wrap bleed layer (default 0.35).
   * Set to 0 to disable light wrap entirely for the hardest edges.
   */
  lightWrapAlpha?: number
  [key: string]: boolean | number | undefined
}
