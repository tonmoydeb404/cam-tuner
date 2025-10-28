import { IAppCameraSource } from "@/context/app/types";
import {
  StreamCropConfig,
  StreamFilterConfig,
} from "../utils/stream-patcher/types";

export enum MessageTypeEnum {
  SETTINGS = "cam_tuner-settings",
  UPDATE = "cam_tuner-update",
  CROP = "cam_tuner-crop",
  FILTER = "cam_tuner-filter",
  CONFETTI = "cam_tuner-confetti",
  MEDIA_OVERLAY = "cam_tuner-media-overlay",
  TOGGLE_IFRAME = "cam_tuner-toggle-iframe",
}

export type SettingsUpdateMessage = {
  type: MessageTypeEnum;
  payload: {
    enable: boolean;
    cameraSource: IAppCameraSource | null;
  };
};

export type CropMessage = {
  type: MessageTypeEnum.CROP;
  payload: StreamCropConfig;
};

export type FilterMessage = {
  type: MessageTypeEnum.FILTER;
  payload: StreamFilterConfig;
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

export type ToggleIframeMessage = {
  type: MessageTypeEnum.TOGGLE_IFRAME;
  payload?: Record<string, never>;
};
