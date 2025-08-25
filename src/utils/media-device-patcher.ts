import { env } from "@/config";
import {
  StreamPatcherConfig,
  StreamPatcherOverlay,
} from "@/types/stream-patcher";
import { Logger } from "./log";
import {
  buildMediaStreamConstraints,
  createVirtualMediaDevice,
  findDeviceByLabel,
  generateRandomDeviceId,
  getMediaTrackDimension,
  getVideoInputDevices,
  matchDeviceId,
} from "./media-device-utils";
import { streamPatcher } from "./stream-patcher";

// Configuartions ----------------------------------------------------------------------

const MEDIA_DEVICE_ID = `${env.VITE_CAM_NAME}_${env.VITE_CAM_VERSION}`;
const MEDIA_GROUP_ID = `${env.VITE_CAM_NAME}_group`;
const MEDIA_LABEL = `${env.VITE_CAM_NAME}`;

// Global Variables ----------------------------------------------------------------------

const enumerateDevicesFn = MediaDevices.prototype.enumerateDevices;
const getUserMediaFn = MediaDevices.prototype.getUserMedia;

// Helpers ----------------------------------------------------------------------

// Main Function ----------------------------------------------------------------------

export function mediaDevicePatcher(
  enable: boolean,
  sourceDeviceLabel: string,
  config: StreamPatcherConfig,
  overlay: StreamPatcherOverlay
) {
  let sourceDeviceId: undefined | string;
  const randDeviceId = generateRandomDeviceId(MEDIA_DEVICE_ID); // random device id makes sure realtime updates

  MediaDevices.prototype.enumerateDevices = async function () {
    Logger.dev("Intercepting enumerateDevices...");
    const res = await enumerateDevicesFn.call(navigator.mediaDevices);

    // Include virtual cam only if there is already a real camera
    const videoInputs = getVideoInputDevices(res);
    const sourceDevice = findDeviceByLabel(videoInputs, sourceDeviceLabel);
    sourceDeviceId = sourceDevice?.deviceId;

    if (videoInputs.length > 0 || !!sourceDeviceId) {
      const virtualDevice = createVirtualMediaDevice(
        randDeviceId,
        MEDIA_GROUP_ID,
        MEDIA_LABEL
      );
      res.push(virtualDevice);
      Logger.dev("Virtual webcam added to device list.");
    }

    return res;
  };

  MediaDevices.prototype.getUserMedia = async function (arg) {
    try {
      if (arg?.video && typeof arg.video !== "boolean") {
        const { video } = arg;

        if (video.deviceId && matchDeviceId(video.deviceId, randDeviceId)) {
          Logger.dev(`${MEDIA_LABEL} requested`);

          const width = getMediaTrackDimension(video, "width") ?? 1280;
          const height = getMediaTrackDimension(video, "height") ?? 720;

          const constraints = buildMediaStreamConstraints(
            arg,
            width,
            height,
            sourceDeviceId
          );

          const stream = await getUserMediaFn.call(
            navigator.mediaDevices,
            constraints
          );

          // if patching not enabled then return original stream rather blocking
          if (!enable) {
            return stream;
          }

          return streamPatcher(
            stream,
            { height, width },
            config,
            overlay,
            true
          );
        }
      }

      // currentStream = null;
      // currentArg = null;

      return await getUserMediaFn.call(navigator.mediaDevices, arg);
    } catch (error) {
      Logger.error("Error accessing media devices:", error);
      throw error;
    }
  };

  navigator.mediaDevices.dispatchEvent(new Event("devicechange"));
  Logger.dev(MEDIA_LABEL, "INSTALLED.");
}
