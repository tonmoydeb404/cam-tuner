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
