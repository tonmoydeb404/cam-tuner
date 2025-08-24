import { IAppCameraSource, IAppConfig, IGifOverlay } from "@/context/app/types";

export enum MessageTypeEnum {
  SETTINGS = "cam_tuner-settings",
  UPDATE = "cam_tuner-update",
  GIF_OVERLAY = "cam_tuner-gif-overlay",
  FLOATING_PREVIEW = "cam_tuner-floating-preview",
}

export type WindowMessage = {
  type: MessageTypeEnum;
  payload: {
    enable: boolean;
    cameraSource: IAppCameraSource | null;
    config: IAppConfig;
  };
};

export type GifOverlayMessage = {
  type: MessageTypeEnum.GIF_OVERLAY;
  payload: {
    gifOverlay: IGifOverlay;
  };
};
