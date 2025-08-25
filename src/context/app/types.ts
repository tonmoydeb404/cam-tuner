import { StreamPatcherConfig } from "@/types/stream-patcher";
import React from "react";

export interface IGifOverlay {
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
}

export interface IAppConfig {
  aspectRatio: number;
  zoom: number;
  brightness: number;
  contrast: number;
  saturation: number;
  mirror: boolean;
  align: StreamPatcherConfig["align"];
}

export interface IAppCameraSource {
  label: string;
  deviceId: string;
}

export interface IAppContext {
  enable: boolean;
  setEnable: (v: boolean) => void;

  cameraSource: IAppCameraSource | null;
  initCameraSource: (v: IAppCameraSource) => void;
  setCameraSource: (v: IAppCameraSource | null) => void;

  config: IAppConfig;
  setConfig: React.Dispatch<React.SetStateAction<IAppConfig>>;
  updateConfig: <K extends keyof IAppContext["config"]>(
    key: K
  ) => (value: IAppContext["config"][K]) => void;

  overlay: IGifOverlay;
  setOverlay: React.Dispatch<React.SetStateAction<IGifOverlay>>;
  updateOverlay: <K extends keyof IGifOverlay>(
    key: K
  ) => (value: IGifOverlay[K]) => void;
  resetOverlay: () => void;
  setSelectedGif: (gifUrl: string, mp4Url: string, gifId: string) => void;
  setOverlayEnable: (enabled: boolean) => void;

  applySettings: () => void;

  changesPending: boolean;
}
