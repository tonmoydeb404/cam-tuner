/**
 * Media device utilities extracted from media-device-patcher
 * Centralizes media device operations to reduce code duplication
 */

/**
 * Extract width value from MediaTrackConstraints
 * @param video - MediaTrackConstraints object
 * @returns Width value or undefined
 */
export const getMediaTrackDimension = (
  video: MediaTrackConstraints, 
  key: 'width' | 'height'
): number | undefined => {
  const constraint = video[key];
  
  if (typeof constraint === "object" && constraint !== null) {
    return constraint.ideal || constraint.exact;
  }
  
  return constraint as number | undefined;
};

/**
 * Check if a deviceId constraint matches a target device ID
 * @param deviceId - ConstrainDOMString from MediaTrackConstraints
 * @param targetDeviceId - Target device ID to match against
 * @returns true if device ID matches, false otherwise
 */
export const matchDeviceId = (
  deviceId: ConstrainDOMString,
  targetDeviceId: string
): boolean => {
  if (Array.isArray(deviceId)) {
    return deviceId.includes(targetDeviceId);
  }

  if (typeof deviceId === "object" && deviceId !== null && "exact" in deviceId) {
    return (
      deviceId.exact === targetDeviceId || deviceId.ideal === targetDeviceId
    );
  }

  return deviceId === targetDeviceId;
};

/**
 * Filter video input devices from MediaDeviceInfo array
 * @param devices - Array of MediaDeviceInfo objects
 * @returns Array of video input devices only
 */
export const getVideoInputDevices = (devices: MediaDeviceInfo[]): MediaDeviceInfo[] => {
  return devices.filter((device) => device.kind === "videoinput");
};

/**
 * Find device by label from MediaDeviceInfo array
 * @param devices - Array of MediaDeviceInfo objects
 * @param label - Device label to search for
 * @returns MediaDeviceInfo object or undefined if not found
 */
export const findDeviceByLabel = (
  devices: MediaDeviceInfo[], 
  label: string
): MediaDeviceInfo | undefined => {
  return devices.find((device) => device.label === label);
};

/**
 * Create virtual media device info object
 * @param deviceId - Device ID for the virtual device
 * @param groupId - Group ID for the virtual device
 * @param label - Label for the virtual device
 * @returns MediaDeviceInfo object with toJSON method
 */
export const createVirtualMediaDevice = (
  deviceId: string,
  groupId: string,
  label: string
): MediaDeviceInfo => {
  const mediaDevice: Omit<MediaDeviceInfo, "toJSON"> = {
    deviceId,
    groupId,
    kind: "videoinput",
    label,
  };
  
  return {
    ...mediaDevice,
    toJSON: () => JSON.stringify(mediaDevice),
  };
};

/**
 * Build MediaStreamConstraints from video constraints and source device ID
 * @param originalConstraints - Original MediaStreamConstraints
 * @param width - Video width
 * @param height - Video height
 * @param sourceDeviceId - Source device ID to use
 * @returns Modified MediaStreamConstraints
 */
export const buildMediaStreamConstraints = (
  originalConstraints: MediaStreamConstraints,
  width: number,
  height: number,
  sourceDeviceId?: string
): MediaStreamConstraints => {
  const { video: originalVideo } = originalConstraints;
  
  if (typeof originalVideo !== "object" || originalVideo === null) {
    return originalConstraints;
  }

  return {
    ...originalConstraints,
    video: {
      facingMode: originalVideo.facingMode,
      advanced: originalVideo.advanced,
      width,
      height,
      deviceId: sourceDeviceId,
    },
  };
};

/**
 * Generate random device ID with timestamp
 * @param prefix - Prefix for the device ID
 * @returns Random device ID string
 */
export const generateRandomDeviceId = (prefix: string): string => {
  return `${prefix}_${Date.now()}`;
};