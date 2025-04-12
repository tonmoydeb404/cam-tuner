import { MessageTypeEnum } from "@/types/window-message";
import { devLog } from "../utils/log";
import { mediaDevicePatcher } from "../utils/media-device-patcher";

window.addEventListener("message", (event) => {
  if (event?.data?.type !== MessageTypeEnum.SETTINGS) return;

  const enable = !!event.data?.payload?.enable;
  const sourceDeviceLabel = event.data?.payload?.cameraSource?.label;
  const config = event.data?.payload?.config;

  devLog("Received settings:", {
    enable,
    sourceDeviceLabel,
    config,
  });

  mediaDevicePatcher(enable, sourceDeviceLabel, config);
});
