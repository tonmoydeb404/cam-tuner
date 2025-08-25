import { IAppCameraSource, IAppConfig, IGifOverlay } from "@/context/app/types";

export enum MessageTypeEnum {
  SETTINGS = "cam_tuner-settings",
  UPDATE = "cam_tuner-update",
}

export type SettingsUpdateMessage = {
  type: MessageTypeEnum;
  payload: {
    enable: boolean;
    cameraSource: IAppCameraSource | null;
    config: IAppConfig;
    overlay: IGifOverlay;
  };
};
