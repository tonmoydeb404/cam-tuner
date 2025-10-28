import {
  CropMessage,
  FilterMessage,
  MessageTypeEnum,
} from "@/types/window-message";
import { Logger } from "../utils/log";
import { mediaDevicePatcher } from "../utils/media-device-patcher";
import {
  applyGlobalCrop,
  applyGlobalFilters,
  triggerGlobalConfetti,
  triggerGlobalMediaOverlay,
} from "../utils/stream-patcher";

window.addEventListener("message", (event) => {
  if (event?.data?.type === MessageTypeEnum.SETTINGS) {
    const enable =
      typeof event.data?.payload?.enable === "boolean"
        ? event.data?.payload?.enable
        : true;
    const label = event.data?.payload?.cameraSource?.label;
    const filterConfig = event.data?.payload?.filterConfig;
    const cropConfig = event.data?.payload?.cropConfig;

    Logger.dev("Received settings:", {
      enable: enable,
      sourceDeviceLabel: label,
      filterConfig: filterConfig,
      cropConfig: cropConfig,
    });

    mediaDevicePatcher({
      enable,
      sourceDeviceLabel: label || "",
      filterConfig: filterConfig ?? {},
      cropConfig: cropConfig ?? {},
    });
  }

  if (event?.data?.type === MessageTypeEnum.CROP) {
    const payload = event.data?.payload as CropMessage["payload"];
    if (payload) {
      Logger.dev("Received crop message:", payload);
      applyGlobalCrop(payload);
    }
  }

  if (event?.data?.type === MessageTypeEnum.FILTER) {
    const payload = event.data?.payload as FilterMessage["payload"];
    if (payload) {
      Logger.dev("Received filter message:", payload);
      applyGlobalFilters(payload);
    }
  }

  if (event?.data?.type === MessageTypeEnum.CONFETTI) {
    const payload = event.data?.payload;
    if (payload) {
      Logger.dev("Received confetti message:", payload);
      triggerGlobalConfetti({
        confettiType: payload.confettiType,
        colors: payload.colors,
        intensity: payload.intensity,
        duration: payload.duration,
      });
    }
  }

  if (event?.data?.type === MessageTypeEnum.MEDIA_OVERLAY) {
    const payload = event.data?.payload;
    if (payload) {
      Logger.dev("Received media overlay message:", payload);
      triggerGlobalMediaOverlay({
        mediaUrl: payload.mediaUrl,
        mediaType: payload.mediaType,
        position: payload.position,
        scale: payload.scale,
        duration: payload.duration,
        opacity: payload.opacity,
        delay: payload.delay,
      });
    }
  }
});
