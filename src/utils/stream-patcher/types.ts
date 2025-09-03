export type StreamFilterConfig = {
  brightness?: number;
  saturation?: number;
  contrast?: number;
};

export type StreamCropConfig = {
  aspectRatio?: number;
  zoom?: number;
  mirror?: boolean;
  align?: "left" | "center" | "right";
  enableLetterbox?: boolean;
  letterboxBgColor?: string | null;
};

export type StreamPatcherSize = {
  width: number;
  height: number;
};

export type MediaPatcherSettings = {
  enable: boolean;
  sourceDeviceLabel: string;
  filterConfig: StreamFilterConfig;
  cropConfig: StreamCropConfig;
};

export type StreamPatcherSettings = {
  stream: MediaStream;
  filterConfig: StreamFilterConfig;
  cropConfig: StreamCropConfig;
  size: StreamPatcherSize;
};

export type StreamMediaOverlayConfig = {
  mediaUrl: string;
  mediaType: "video" | "image";
  position: { x: number; y: number };
  scale: number;
  duration: number;
  opacity: number;
  delay: number;
};

export type StreamConfettiConfig = {
  confettiType: string;
  colors: string[];
  intensity: number;
  duration: number;
};

export type StreamPlaceholderConfig = {
  enabled: boolean;
  position: {
    x: number;
    y: number;
  };
  background: {
    mode: "color" | "image" | "video";
    colorCode: string | null;
    imageUrl: string | null;
    videoUrl: string | null;
  };
  foreground: {
    mode: "text" | "image" | "video";
    text: {
      content: string | null;
      bgColorCode: string | null;
      fontColorCode: string | null;
      fontSize: number;
    };
    imageUrl: string | null;
    videoUrl: string | null;
    scale: number;
    radius: number;
  };
};
