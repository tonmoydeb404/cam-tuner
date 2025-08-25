import { IAppCameraSource, IAppConfig, IGifOverlay } from "@/context/app/types";

export enum MessageTypeEnum {
  SETTINGS = "cam_tuner-settings",
  UPDATE = "cam_tuner-update",
  CONFETTI = "cam_tuner-confetti",
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

export type ConfettiMessage = {
  type: MessageTypeEnum.CONFETTI;
  payload: {
    confettiType: string;
    colors: string[];
    intensity: number;
    duration: number;
  };
};
