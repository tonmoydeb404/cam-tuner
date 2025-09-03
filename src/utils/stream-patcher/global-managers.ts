import { Logger } from "@/utils/log";
import {
  StreamCropConfig,
  StreamFilterConfig,
  StreamPatcherSize,
} from "@/utils/stream-patcher/types";
import { normalizeFilterValue } from "./config-cache";

// Forward declaration for StreamProcessor to avoid circular dependency
interface IStreamProcessor {
  startConfetti(
    confettiId: string,
    config: {
      confettiType: string;
      colors: string[];
      intensity: number;
      duration: number;
    }
  ): void;
  stopConfetti(confettiId: string): void;
  clearAllConfetti(): void;
  startMediaOverlay(
    overlayId: string,
    config: {
      mediaUrl: string;
      mediaType: "video" | "image";
      position: { x: number; y: number };
      scale: number;
      duration: number;
      opacity: number;
      delay: number;
    }
  ): void;
  stopMediaOverlay(overlayId: string): void;
  clearAllMediaOverlays(): void;
  updateCropSettings(config: {
    aspectRatio?: number;
    zoom?: number;
    align?: "left" | "center" | "right";
    mirror?: boolean;
  }): void;
  updateFilterSettings(config: StreamFilterConfig): void;
}

export class GlobalConfettiManager {
  private static instance: GlobalConfettiManager;
  private processors: Set<IStreamProcessor> = new Set();

  static getInstance(): GlobalConfettiManager {
    if (!GlobalConfettiManager.instance) {
      GlobalConfettiManager.instance = new GlobalConfettiManager();
    }
    return GlobalConfettiManager.instance;
  }

  registerProcessor(processor: IStreamProcessor): void {
    this.processors.add(processor);
  }

  unregisterProcessor(processor: IStreamProcessor): void {
    this.processors.delete(processor);
  }

  triggerConfetti(config: {
    confettiType: string;
    colors: string[];
    intensity: number;
    duration: number;
  }): void {
    const confettiId = `confetti_${Date.now()}`;
    Logger.dev("Triggering confetti for all active streams:", config);

    // Clear all existing confetti first to prevent stacking
    this.processors.forEach((processor) => {
      processor.clearAllConfetti();
    });

    // Start new confetti
    this.processors.forEach((processor) => {
      processor.startConfetti(confettiId, config);
    });

    // Auto-cleanup after duration
    setTimeout(() => {
      this.processors.forEach((processor) => {
        processor.stopConfetti(confettiId);
      });
    }, config.duration * 1000 + 1000);
  }
}

export class GlobalMediaOverlayManager {
  private static instance: GlobalMediaOverlayManager;
  private processors: Set<IStreamProcessor> = new Set();

  static getInstance(): GlobalMediaOverlayManager {
    if (!GlobalMediaOverlayManager.instance) {
      GlobalMediaOverlayManager.instance = new GlobalMediaOverlayManager();
    }
    return GlobalMediaOverlayManager.instance;
  }

  registerProcessor(processor: IStreamProcessor): void {
    this.processors.add(processor);
  }

  unregisterProcessor(processor: IStreamProcessor): void {
    this.processors.delete(processor);
  }

  triggerMediaOverlay(config: {
    mediaUrl: string;
    mediaType: "video" | "image";
    position: { x: number; y: number };
    scale: number;
    duration: number;
    opacity: number;
    delay: number;
  }): void {
    const overlayId = `media_overlay_${Date.now()}`;
    Logger.dev("Triggering media overlay for all active streams:", config);

    // Clear all existing media overlays first to prevent stacking
    this.processors.forEach((processor) => {
      processor.clearAllMediaOverlays();
    });

    // Start new media overlay
    this.processors.forEach((processor) => {
      processor.startMediaOverlay(overlayId, config);
    });

    // Auto-cleanup after duration + delay
    setTimeout(() => {
      this.processors.forEach((processor) => {
        processor.stopMediaOverlay(overlayId);
      });
    }, (config.duration + config.delay) * 1000 + 1000);
  }
}

export class GlobalCropManager {
  private static instance: GlobalCropManager;
  private processors: Set<IStreamProcessor> = new Set();
  private currentCropConfig: {
    aspectRatio?: number;
    zoom?: number;
    align?: "left" | "center" | "right";
    mirror?: boolean;
  } = {};

  static getInstance(): GlobalCropManager {
    if (!GlobalCropManager.instance) {
      GlobalCropManager.instance = new GlobalCropManager();
    }
    return GlobalCropManager.instance;
  }

  registerProcessor(processor: IStreamProcessor): void {
    this.processors.add(processor);
  }

  unregisterProcessor(processor: IStreamProcessor): void {
    this.processors.delete(processor);
  }

  calculateCrop(size: StreamPatcherSize, aspectRatio?: number) {
    const { width, height } = size;

    if (typeof aspectRatio !== "number") {
      return {
        width: width,
        height: height,
        offsetX: 0,
        offsetY: 0,
      };
    }

    const originalAspect = width / height;
    let cropWidth = width;
    let cropHeight = height;

    if (originalAspect > aspectRatio) {
      cropWidth = Math.floor(height * aspectRatio);
    } else {
      cropHeight = Math.floor(width / aspectRatio);
    }

    Logger.dev(`Crop: ${cropWidth}x${cropHeight}`);
    return { width: cropWidth, height: cropHeight };
  }

  calculateZoomedSize(size: StreamPatcherSize, zoom?: number) {
    if (typeof zoom !== "number" || zoom <= 1) {
      return { ...size };
    }

    const zoomWidth = Math.floor(size.width / zoom);
    const zoomHeight = Math.floor(size.height / zoom);

    Logger.dev(`zoom: ${zoomWidth}x${zoomHeight}`);

    return {
      width: zoomWidth,
      height: zoomHeight,
    };
  }

  calculateOffset(
    original: StreamPatcherSize,
    modified: StreamPatcherSize,
    align: StreamCropConfig["align"] = "center"
  ) {
    let x = 0;

    if (align === "left") {
      x = 0;
    } else if (align === "right") {
      x = original.width - modified.width;
    } else {
      x = Math.floor((original.width - modified.width) / 2);
    }

    const y = Math.floor((original.height - modified.height) / 2);

    return { x, y };
  }

  applyMirrorTransform(
    ctx: CanvasRenderingContext2D,
    cropWidth: number,
    mirror?: boolean
  ): void {
    if (mirror) {
      ctx.scale(-1, 1);
      ctx.translate(-cropWidth, 0);
    }
  }

  initProcessor(
    size: StreamPatcherSize,
    config: StreamCropConfig = {}
  ): {
    crop: { width: number; height: number; offsetX: number; offsetY: number };
    cropConfig: StreamCropConfig;
  } {
    // Merge provided config with current state, giving precedence to provided values
    const mergedConfig = {
      aspectRatio: config.aspectRatio ?? this.currentCropConfig.aspectRatio,
      zoom: config.zoom ?? this.currentCropConfig.zoom,
      align: config.align ?? this.currentCropConfig.align,
      mirror: config.mirror ?? this.currentCropConfig.mirror,
    };

    const crop = this.calculateCrop(size, mergedConfig.aspectRatio);
    const zoom = this.calculateZoomedSize(crop, mergedConfig.zoom);
    const offset = this.calculateOffset(size, zoom, mergedConfig.align);

    // Update current config with merged values
    this.currentCropConfig = { ...mergedConfig };

    return {
      crop: {
        ...zoom,
        offsetX: offset.x,
        offsetY: offset.y,
      },
      cropConfig: mergedConfig,
    };
  }

  applyCrop(config: StreamCropConfig): void {
    this.currentCropConfig = { ...this.currentCropConfig, ...config };
    Logger.dev("Applying crop settings to all active streams:", config);

    // Apply crop settings to all processors
    this.processors.forEach((processor) => {
      processor.updateCropSettings(config);
    });
  }

  getCurrentCropConfig() {
    return { ...this.currentCropConfig };
  }
}

export class GlobalFilterManager {
  private static instance: GlobalFilterManager;
  private processors: Set<IStreamProcessor> = new Set();
  private currentFilterConfig: StreamFilterConfig = {};

  static getInstance(): GlobalFilterManager {
    if (!GlobalFilterManager.instance) {
      GlobalFilterManager.instance = new GlobalFilterManager();
    }
    return GlobalFilterManager.instance;
  }

  registerProcessor(processor: IStreamProcessor): void {
    this.processors.add(processor);
  }

  unregisterProcessor(processor: IStreamProcessor): void {
    this.processors.delete(processor);
  }

  generateFilterString(config: StreamFilterConfig): string {
    const brightness = normalizeFilterValue(config.brightness);
    const saturation = normalizeFilterValue(config.saturation);
    const contrast = normalizeFilterValue(config.contrast);

    return `brightness(${brightness}) saturate(${saturation}) contrast(${contrast})`;
  }

  initProcessor(config: StreamFilterConfig = {}): {
    filterConfig: StreamFilterConfig;
    filterString: string;
  } {
    // Merge provided config with current state, giving precedence to provided values
    const mergedConfig = {
      brightness: config.brightness ?? this.currentFilterConfig.brightness,
      saturation: config.saturation ?? this.currentFilterConfig.saturation,
      contrast: config.contrast ?? this.currentFilterConfig.contrast,
    };

    const filterString = this.generateFilterString(mergedConfig);

    // Update current config with merged values
    this.currentFilterConfig = { ...mergedConfig };

    return {
      filterConfig: mergedConfig,
      filterString,
    };
  }

  applyFilters(config: StreamFilterConfig): void {
    this.currentFilterConfig = { ...this.currentFilterConfig, ...config };
    Logger.dev("Applying filter settings to all active streams:", config);

    // Apply filter settings to all processors
    this.processors.forEach((processor) => {
      processor.updateFilterSettings(config);
    });
  }

  getCurrentFilterConfig() {
    return { ...this.currentFilterConfig };
  }
}
