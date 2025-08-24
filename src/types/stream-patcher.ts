export type StreamPatcherConfig = {
  aspectRatio?: number;
  zoom?: number;
  brightness?: number;
  saturation?: number;
  contrast?: number;
  mirror?: boolean;
  align?: "left" | "center" | "right";
};

export type StreamPatcherSize = {
  width: number;
  height: number;
};

export type StreamPatcherOverlay = {
  enabled: boolean;
  gifUrl: string;
  mp4Url: string;
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
