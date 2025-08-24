/**
 * Stream utilities for managing MediaStream objects
 * Centralizes common stream operations to reduce code duplication
 */

/**
 * Safely cleanup a MediaStream by stopping all tracks
 * @param stream - The MediaStream to cleanup, can be null/undefined
 */
export const cleanupMediaStream = (stream: MediaStream | null | undefined): void => {
  stream?.getTracks().forEach(track => track.stop());
};

/**
 * Check if a MediaStream has active tracks
 * @param stream - The MediaStream to check
 * @returns true if stream has active tracks, false otherwise
 */
export const hasActiveTracks = (stream: MediaStream | null | undefined): boolean => {
  if (!stream) return false;
  return stream.getTracks().some(track => track.readyState === 'live');
};

/**
 * Get track constraints from a MediaStream
 * @param stream - The MediaStream to get constraints from
 * @returns Object containing video and audio track constraints
 */
export const getStreamConstraints = (stream: MediaStream | null | undefined) => {
  if (!stream) return { video: null, audio: null };
  
  const videoTrack = stream.getVideoTracks()[0];
  const audioTrack = stream.getAudioTracks()[0];
  
  return {
    video: videoTrack?.getConstraints() || null,
    audio: audioTrack?.getConstraints() || null
  };
};

/**
 * Clone a MediaStream safely
 * @param stream - The MediaStream to clone
 * @returns Cloned MediaStream or null if input is invalid
 */
export const safeCloneStream = (stream: MediaStream | null | undefined): MediaStream | null => {
  if (!stream || !hasActiveTracks(stream)) return null;
  try {
    return stream.clone();
  } catch {
    return null;
  }
};