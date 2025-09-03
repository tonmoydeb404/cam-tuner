import {
  CropMessage,
  FilterMessage,
  MessageTypeEnum,
  PlaceholderMessage,
} from "@/types/window-message";
import { Logger } from "../utils/log";
import { mediaDevicePatcher } from "../utils/media-device-patcher";
import {
  applyGlobalCrop,
  applyGlobalFilters,
  triggerGlobalConfetti,
  triggerGlobalMediaOverlay,
  enableGlobalPlaceholder,
  disableGlobalPlaceholder,
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
    const placeholderConfig = event.data?.payload?.placeholderConfig;

    Logger.dev("Received settings:", {
      enable: enable,
      sourceDeviceLabel: label,
      filterConfig: filterConfig,
      cropConfig: cropConfig,
      placeholderConfig: placeholderConfig,
    });

    mediaDevicePatcher({
      enable,
      sourceDeviceLabel: label || "",
      filterConfig: filterConfig ?? {},
      cropConfig: cropConfig ?? {},
    });

    // Apply initial placeholder config if enabled
    if (placeholderConfig?.enabled) {
      enableGlobalPlaceholder(placeholderConfig);
    }
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

  if (event?.data?.type === MessageTypeEnum.PLACEHOLDER) {
    const payload = event.data?.payload as PlaceholderMessage["payload"];
    if (payload) {
      Logger.dev("Received placeholder message:", payload);
      if (payload.enabled) {
        enableGlobalPlaceholder(payload);
      } else {
        disableGlobalPlaceholder();
      }
    }
  }
});
