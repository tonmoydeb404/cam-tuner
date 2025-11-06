import { ThemeAnimationType } from "./use-theme";

/**
 * Check if the current device is high resolution
 */
export const isHighResolution = () => {
  if (typeof window === "undefined") return false;
  return window.innerWidth >= 3000 || window.innerHeight >= 2000;
};

/**
 * Create a blur circle mask for the theme transition
 */
export const createBlurCircleMask = (blur: number) => {
  const isHighRes = isHighResolution();

  const blurFilter = `<filter id="blur"><feGaussianBlur stdDeviation="${blur}" /></filter>`;
  const circleRadius = isHighRes ? 20 : 25;

  return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 100 100"><defs>${blurFilter}</defs><circle cx="0" cy="0" r="${circleRadius}" fill="white" filter="url(%23blur)"/></svg>')`;
};

/**
 * Calculate the maximum radius needed to cover the entire viewport from a point
 */
export const calculateMaxRadius = (x: number, y: number) => {
  const topLeft = Math.hypot(x, y);
  const topRight = Math.hypot(window.innerWidth - x, y);
  const bottomLeft = Math.hypot(x, window.innerHeight - y);
  const bottomRight = Math.hypot(
    window.innerWidth - x,
    window.innerHeight - y
  );

  return Math.max(topLeft, topRight, bottomLeft, bottomRight);
};

/**
 * Calculate optimal mask size for the animation
 */
export const calculateOptimalMaskSize = () => {
  const viewportSize = Math.max(window.innerWidth, window.innerHeight) + 200;
  const isHighRes = isHighResolution();
  const scaleFactor = isHighRes ? 2.5 : 4;

  return isHighRes
    ? Math.min(viewportSize * scaleFactor, 5000)
    : viewportSize * scaleFactor;
};

/**
 * Get the center point of an element
 */
export const getElementCenter = (element: HTMLElement) => {
  const { top, left, width, height } = element.getBoundingClientRect();
  return {
    x: left + width / 2,
    y: top + height / 2,
  };
};

/**
 * Check if view transitions are supported and enabled
 */
export const canUseViewTransition = () => {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return false;
  }

  return (
    "startViewTransition" in document &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
};

interface AnimationConfig {
  x: number;
  y: number;
  maxRadius: number;
  duration: number;
  easing: string;
  pseudoElement: string;
}

/**
 * Apply circle animation to the theme transition
 */
export const applyCircleAnimation = (config: AnimationConfig) => {
  const { x, y, maxRadius, duration, easing, pseudoElement } = config;

  document.documentElement.animate(
    {
      clipPath: [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${maxRadius}px at ${x}px ${y}px)`,
      ],
    },
    {
      duration,
      easing,
      pseudoElement,
    }
  );
};

/**
 * Apply QR scan animation to the theme transition
 */
export const applyQRScanAnimation = (config: AnimationConfig) => {
  const { duration, easing, pseudoElement } = config;
  const scanLineWidth = isHighResolution() ? 8 : 4;

  document.documentElement.animate(
    {
      clipPath: [
        `polygon(0% 0%, ${scanLineWidth}px 0%, ${scanLineWidth}px 100%, 0% 100%)`,
        `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)`,
      ],
    },
    {
      duration,
      easing,
      pseudoElement,
    }
  );
};

interface BlurCircleConfig {
  x: number;
  y: number;
  duration: number;
  easing: string;
  blurAmount: number;
  optimalMaskSize: number;
  maxRadius: number;
  styleId: string;
}

/**
 * Apply blur circle animation to the theme transition
 */
export const applyBlurCircleAnimation = (config: BlurCircleConfig) => {
  const {
    x,
    y,
    duration,
    easing,
    blurAmount,
    optimalMaskSize,
    maxRadius,
    styleId,
  } = config;

  const styleElement = document.createElement("style");
  styleElement.id = styleId;

  const isHighRes = isHighResolution();
  const blurFactor = isHighRes ? 1.5 : 1.2;
  const finalMaskSize = Math.max(optimalMaskSize, maxRadius * 2.5);

  styleElement.textContent = `
    ::view-transition-group(root) {
      animation-duration: ${duration}ms;
      animation-timing-function: ${
        isHighRes
          ? "cubic-bezier(0.2, 0, 0.2, 1)"
          : "linear(" +
            "0 0%, 0.2342 12.49%, 0.4374 24.99%," +
            "0.6093 37.49%, 0.6835 43.74%," +
            "0.7499 49.99%, 0.8086 56.25%," +
            "0.8593 62.5%, 0.9023 68.75%, 0.9375 75%," +
            "0.9648 81.25%, 0.9844 87.5%," +
            "0.9961 93.75%, 1 100%" +
            ")"
      };
      will-change: transform;
    }

    ::view-transition-new(root) {
      mask: ${createBlurCircleMask(
        blurAmount * blurFactor
      )} 0 0 / 100% 100% no-repeat;
      mask-position: ${x}px ${y}px;
      animation: maskScale ${duration}ms ${easing};
      transform-origin: ${x}px ${y}px;
      will-change: mask-size, mask-position;
    }

    ::view-transition-old(root),
    .dark::view-transition-old(root) {
      animation: maskScale ${duration}ms ${easing};
      transform-origin: ${x}px ${y}px;
      z-index: -1;
      will-change: mask-size, mask-position;
    }

    @keyframes maskScale {
      0% {
        mask-size: 0px;
        mask-position: ${x}px ${y}px;
      }
      100% {
        mask-size: ${finalMaskSize}px;
        mask-position: ${x - finalMaskSize / 2}px ${y - finalMaskSize / 2}px;
      }
    }
  `;

  document.head.appendChild(styleElement);

  // Schedule cleanup
  setTimeout(() => {
    const element = document.getElementById(styleId);
    if (element) {
      element.remove();
    }
  }, duration);
};

/**
 * Apply the appropriate animation based on type
 */
export const applyAnimation = (
  animationType: ThemeAnimationType,
  config: AnimationConfig & {
    blurAmount: number;
    optimalMaskSize: number;
    styleId: string;
  }
) => {
  switch (animationType) {
    case ThemeAnimationType.CIRCLE:
      applyCircleAnimation(config);
      break;

    case ThemeAnimationType.QR_SCAN:
      applyQRScanAnimation(config);
      break;

    case ThemeAnimationType.BLUR_CIRCLE:
      applyBlurCircleAnimation(config);
      break;
  }
};

/**
 * Clean up any existing animation styles
 */
export const cleanupAnimationStyles = (styleId: string) => {
  const existingStyle = document.getElementById(styleId);
  if (existingStyle) {
    existingStyle.remove();
  }
};
