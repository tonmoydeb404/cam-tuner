// Main exports
export { useTheme, ThemeAnimationType } from "./use-theme";
export type { UseThemeAnimationProps } from "./use-theme";

// Animation helpers (for advanced usage)
export {
  isHighResolution,
  createBlurCircleMask,
  calculateMaxRadius,
  calculateOptimalMaskSize,
  getElementCenter,
  canUseViewTransition,
  applyCircleAnimation,
  applyQRScanAnimation,
  applyBlurCircleAnimation,
  applyAnimation,
  cleanupAnimationStyles,
} from "./animation-helpers";

// Provider
export { default as ThemeProvider } from "./provider";
