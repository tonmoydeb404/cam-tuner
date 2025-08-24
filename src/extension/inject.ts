import { MessageTypeEnum } from "@/types/window-message";
import { Logger } from "../utils/log";
import { mediaDevicePatcher } from "../utils/media-device-patcher";

// Store current settings
let currentEnable = true;
let currentSourceDeviceLabel: string | undefined;
let currentConfig: Record<string, unknown> = {};

// Function to apply current settings with GIF overlay
function applySettings() {
  const fullConfig = { ...currentConfig };
  Logger.dev("Applying settings:", {
    enable: currentEnable,
    sourceDeviceLabel: currentSourceDeviceLabel,
    config: fullConfig,
  });
  mediaDevicePatcher(currentEnable, currentSourceDeviceLabel || "", fullConfig);
}

window.addEventListener("message", (event) => {
  if (event?.data?.type === MessageTypeEnum.SETTINGS) {
    currentEnable =
      typeof event.data?.payload?.enable === "boolean"
        ? event.data?.payload?.enable
        : true;
    currentSourceDeviceLabel = event.data?.payload?.cameraSource?.label;
    currentConfig = { ...event.data?.payload?.config };

    Logger.dev("Received settings:", {
      enable: currentEnable,
      sourceDeviceLabel: currentSourceDeviceLabel,
      config: currentConfig,
    });

    applySettings();
  }

  if (event?.data?.type === MessageTypeEnum.GIF_OVERLAY) {
    const gifOverlay = event.data?.payload?.gifOverlay;
    Logger.dev("Received GIF overlay:", gifOverlay);

    // Update current config with GIF overlay
    currentConfig = { ...currentConfig, gifOverlay };

    // Reapply settings with updated GIF overlay
    applySettings();
  }

  // Floating preview feature disabled
  // if (event?.data?.type === MessageTypeEnum.FLOATING_PREVIEW) {
  //   // Floating preview functionality temporarily disabled
  // }
});
