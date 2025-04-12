import { devLog } from "../utils/log";
import { mediaDevicePatcher } from "../utils/media-device-patcher";

window.addEventListener("message", (event) => {
  if (event?.data?.type !== "VCAM_SETTINGS") return;

  const enable = !!event.data?.settings?.enable;
  const sourceDeviceLabel = event.data?.settings?.cameraSource?.label;
  const config = event.data?.settings?.config;

  devLog("Received settings:", {
    enable,
    sourceDeviceLabel,
    config,
  });

  mediaDevicePatcher(enable, sourceDeviceLabel, config);
});
