import { MessageTypeEnum } from "@/types/window-message";
import { Logger } from "../utils/log";
import { mediaDevicePatcher } from "../utils/media-device-patcher";
import { triggerGlobalConfetti } from "../utils/stream-patcher";

window.addEventListener("message", (event) => {
  if (event?.data?.type === MessageTypeEnum.SETTINGS) {
    const enable =
      typeof event.data?.payload?.enable === "boolean"
        ? event.data?.payload?.enable
        : true;
    const label = event.data?.payload?.cameraSource?.label;
    const config = event.data?.payload?.config;
    const overlay = event.data?.payload?.overlay;

    Logger.dev("Received settings:", {
      enable: enable,
      sourceDeviceLabel: label,
      config: config,
      overlay: overlay,
    });

    mediaDevicePatcher(enable, label || "", config, overlay);
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
});
