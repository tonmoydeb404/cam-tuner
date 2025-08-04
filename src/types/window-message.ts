import { IAppConfig } from "@/context/app/types";

export enum MessageTypeEnum {
  SETTINGS = "cam_tuner-settings",
  UPDATE = "cam_tuner-update",
}

export interface IAppCameraSource {
  label: string;
  deviceId: string;
}

export type WindowMessage = {
  type: MessageTypeEnum;
  payload: {
    enable: boolean;
    config: IAppConfig;
  };
};
