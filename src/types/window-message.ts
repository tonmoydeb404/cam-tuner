import { IAppCameraSource, IAppConfig } from "@/context/types";

export enum MessageTypeEnum {
  SETTINGS = "cam_tuner-settings",
  UPDATE = "cam_tuner-update",
}

export type WindowMessage = {
  type: MessageTypeEnum;
  payload: {
    enable: boolean;
    cameraSource: IAppCameraSource | null;
    config: IAppConfig;
  };
};
