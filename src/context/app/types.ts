import { StreamPatcherConfig } from "@/types/stream-patcher";
import React from "react";

export interface IAppConfig {
  aspectRatio: number;
  zoom: number;
  brightness: number;
  contrast: number;
  saturation: number;
  mirror: boolean;
  align: StreamPatcherConfig["align"];
}

export interface IAppContext {
  enable: boolean;
  setEnable: (v: boolean) => void;

  config: IAppConfig;
  setConfig: React.Dispatch<React.SetStateAction<IAppConfig>>;
  updateConfig: <K extends keyof IAppContext["config"]>(
    key: K
  ) => (value: IAppContext["config"][K]) => void;

  applySettings: () => void;

  changesPending: boolean;
}
