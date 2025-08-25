import { IAppCameraSource, IAppConfig } from "@/context/app/types";

export enum MessageTypeEnum {
  SETTINGS = "cam_tuner-settings",
  UPDATE = "cam_tuner-update",
  CONFETTI = "cam_tuner-confetti",
  MEDIA_OVERLAY = "cam_tuner-media-overlay",
}

export type SettingsUpdateMessage = {
  type: MessageTypeEnum;
  payload: {
    enable: boolean;
    cameraSource: IAppCameraSource | null;
    config: IAppConfig;
    overlay?: any;
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

export type MediaOverlayMessage = {
  type: MessageTypeEnum.MEDIA_OVERLAY;
  payload: {
    mediaUrl: string;
    mediaType: "video" | "image";
    position: { x: number; y: number };
    scale: number;
    duration: number;
    opacity: number;
    delay: number;
  };
};
