import { devLog } from "./utils/log";
import { mediaDevicePatcher } from "./utils/media-device-patcher";

window.addEventListener("message", (event) => {
  if (event?.data?.type !== "VCAM_SETTINGS") return;

  const enable = !!event.data?.settings?.enable;
  const sourceDeviceId = event.data?.settings?.sourceDeviceId;
  const config = event.data?.settings?.config;

  devLog("Received settings:", { enable, sourceDeviceId, config });

  mediaDevicePatcher(enable, sourceDeviceId, config);
});
