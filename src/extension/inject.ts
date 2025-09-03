import { CropMessage, MessageTypeEnum } from "@/types/window-message";
import { Logger } from "../utils/log";
import { mediaDevicePatcher } from "../utils/media-device-patcher";
import {
  applyGlobalCrop,
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
    const config = event.data?.payload?.config;
    const cropConfig = event.data?.payload?.cropConfig;

    Logger.dev("Received settings:", {
      enable: enable,
      sourceDeviceLabel: label,
      config: config,
      cropConfig: cropConfig,
    });

    mediaDevicePatcher({
      enable,
      sourceDeviceLabel: label || "",
      filterConfig: config ?? {},
      cropConfig: cropConfig ?? {},
    });
  }

  if (event?.data?.type === MessageTypeEnum.CROP) {
    const payload = event.data?.payload as CropMessage["payload"];
    if (payload) {
      Logger.dev("Received confetti message:", payload);
      applyGlobalCrop(payload);
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
