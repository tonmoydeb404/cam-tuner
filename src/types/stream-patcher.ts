export type StreamPatcherConfig = {
  aspectRatio?: number;
  zoom?: number;
  brightness?: number;
  saturation?: number;
  contrast?: number;
  mirror?: boolean;
  align?: "left" | "center" | "right";
  gifOverlay?: {
    enabled: boolean;
    gifUrl: string;
    gifId: string;
    position: {
      x: number;
      y: number;
    };
    scale: number;
    duration: number;
    delay: number;
    opacity: number;
  };
};

export type StreamPatcherSize = {
  width: number;
  height: number;
};
