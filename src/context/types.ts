import React from "react";

export interface IAppConfig {
  aspectRatio: number;
  zoom: number;
  brightness: number;
  contrast: number;
  saturation: number;
  mirror: boolean;
}

export interface IAppContext {
  enable: boolean;
  setEnable: React.Dispatch<React.SetStateAction<boolean>>;

  cameraSource: string | null;
  setCameraSource: React.Dispatch<React.SetStateAction<string | null>>;

  config: IAppConfig;
  setConfig: React.Dispatch<React.SetStateAction<IAppConfig>>;
  updateConfig: <K extends keyof IAppContext["config"]>(
    key: K
  ) => (value: IAppContext["config"][K]) => void;

  saveToStorage: () => void;
}
