import { devLog } from "./log";
import { streamPatcher, StreamPatcherConfig } from "./stream-patcher";

// Configuartions ----------------------------------------------------------------------

const MEDIA_DEVICE_ID = "v-cam";
const MEDIA_GROUP_ID = "v-cam_group";
const MEDIA_LABEL = "vCam v1.0";

// Global Variables ----------------------------------------------------------------------

const enumerateDevicesFn = MediaDevices.prototype.enumerateDevices;
const getUserMediaFn = MediaDevices.prototype.getUserMedia;

// Helpers ----------------------------------------------------------------------

const getMediaTrackWidth = (video: MediaTrackConstraints) => {
  if (typeof video.width === "object") {
    return video.width.ideal || video.width.exact;
  }
  return video.width;
};

const getMediaTrackHeight = (video: MediaTrackConstraints) => {
  if (typeof video.height === "object") {
    return video.height.ideal || video.height.exact;
  }
  return video.height;
};

const matchDeviceId = (deviceId: ConstrainDOMString) => {
  if (Array.isArray(deviceId)) {
    return deviceId.includes(MEDIA_DEVICE_ID);
  }

  if (typeof deviceId === "object" && "exact" in deviceId) {
    return (
      deviceId.exact === MEDIA_DEVICE_ID || deviceId.ideal === MEDIA_DEVICE_ID
    );
  }

  return deviceId === MEDIA_DEVICE_ID;
};

// Main Function ----------------------------------------------------------------------

export function mediaDevicePatcher(
  enable: boolean,
  sourceDeviceLabel: string,
  config: StreamPatcherConfig
) {
  let sourceDeviceId: undefined | string;

  if (!enable) {
    MediaDevices.prototype.enumerateDevices = enumerateDevicesFn;
    MediaDevices.prototype.getUserMedia = getUserMediaFn;
    devLog(MEDIA_LABEL, "DISABLED");
    return;
  }

  MediaDevices.prototype.enumerateDevices = async function () {
    devLog("Intercepting enumerateDevices...");
    const res = await enumerateDevicesFn.call(navigator.mediaDevices);

    // Include virtual cam only if there is already a real camera
    const videoInputs = res.filter((item) => item.kind === "videoinput");
    const sourceDevice = videoInputs.find(
      (item) => item.label === sourceDeviceLabel
    );
    sourceDeviceId = sourceDevice?.deviceId;

    if (videoInputs.length > 0 || !!sourceDeviceId) {
      const mediaDevice: Omit<MediaDeviceInfo, "toJSON"> = {
        deviceId: MEDIA_DEVICE_ID,
        groupId: MEDIA_GROUP_ID,
        kind: "videoinput",
        label: MEDIA_LABEL,
      };
      res.push({
        ...mediaDevice,
        toJSON: () => JSON.stringify(mediaDevice),
      });
      devLog("Virtual webcam added to device list.");
    }

    return res;
  };

  MediaDevices.prototype.getUserMedia = async function (arg) {
    try {
      if (arg?.video && typeof arg.video !== "boolean") {
        const { video } = arg;

        if (video.deviceId && matchDeviceId(video.deviceId)) {
          devLog(`${MEDIA_LABEL} requested`);

          const width = getMediaTrackWidth(video) ?? 1280;
          const height = getMediaTrackHeight(video) ?? 720;

          const constraints: MediaStreamConstraints = {
            ...arg,
            video: {
              facingMode: video?.facingMode,
              advanced: video?.advanced,
              width,
              height,
              deviceId: sourceDeviceId,
            },
          };

          const stream = await getUserMediaFn.call(
            navigator.mediaDevices,
            constraints
          );

          return streamPatcher(stream, { height, width }, config);
        }
      }

      return await getUserMediaFn.call(navigator.mediaDevices, arg);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      throw error;
    }
  };

  devLog(MEDIA_LABEL, "INSTALLED.");
}
