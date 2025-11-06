"use client";

import { useTheme as useNextTheme } from "next-themes";
import { useRef } from "react";
import { flushSync } from "react-dom";
import {
  applyAnimation,
  calculateMaxRadius,
  calculateOptimalMaskSize,
  canUseViewTransition,
  cleanupAnimationStyles,
  getElementCenter,
  isHighResolution,
} from "./animation-helpers";

export enum ThemeAnimationType {
  CIRCLE = "circle",
  BLUR_CIRCLE = "blur-circle",
  QR_SCAN = "qr-scan",
}

export interface UseThemeAnimationProps {
  duration?: number;
  easing?: string;
  pseudoElement?: string;
  animationType?: ThemeAnimationType;
  blurAmount?: number;
  styleId?: string;
}

export const useTheme = (props?: UseThemeAnimationProps) => {
  const {
    duration: propsDuration = 750,
    easing = "ease-in-out",
    pseudoElement = "::view-transition-new(root)",
    animationType = ThemeAnimationType.CIRCLE,
    blurAmount = 2,
    styleId = "theme-switch-style",
  } = props || {};

  // Use next-themes for state management
  const { theme, setTheme, systemTheme, resolvedTheme, themes, ...rest } =
    useNextTheme();

  const duration = isHighResolution()
    ? Math.max(propsDuration * 0.8, 500)
    : propsDuration;

  const ref = useRef<HTMLButtonElement>(null);

  const setThemeWithAnimation = async (newTheme: string) => {
    // Fallback to simple theme change if animations are not supported
    if (!ref.current || !canUseViewTransition()) {
      setTheme(newTheme);
      return;
    }

    // Clean up any existing animation styles
    cleanupAnimationStyles(styleId);

    // Get the center point of the button
    const { x, y } = getElementCenter(ref.current);

    // Calculate animation parameters
    const maxRadius = calculateMaxRadius(x, y);
    const optimalMaskSize = calculateOptimalMaskSize();

    // Start the view transition
    await document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme);
      });
    }).ready;

    // Apply the selected animation type
    applyAnimation(animationType, {
      x,
      y,
      maxRadius,
      duration,
      easing,
      pseudoElement,
      blurAmount,
      optimalMaskSize,
      styleId,
    });
  };

  // Return next-themes API with animation capabilities
  return {
    // next-themes core API
    theme,
    setTheme: setThemeWithAnimation,
    systemTheme,
    resolvedTheme,
    themes,
    ...rest,

    // Animation-specific API
    ref,
  };
};
