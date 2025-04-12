import { StreamPatcherSize } from "@/utils/stream-patcher";
import { useEffect, useState } from "react";

function useMediaStream(deviceId: string | null) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [size, setSize] = useState<StreamPatcherSize | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getStream = async () => {
      if (!deviceId) return;

      setLoading(true);
      setError(null);

      try {
        const constraints: MediaStreamConstraints = {
          video: {
            deviceId: { exact: deviceId },
          },
        };

        const rawStream = await navigator.mediaDevices.getUserMedia(
          constraints
        );
        const track = rawStream.getVideoTracks()[0];
        const settings = track.getSettings();
        const originalWidth = settings.width ?? 1280;
        const originalHeight = settings.height ?? 720;

        setStream(rawStream);
        setSize({ width: originalWidth, height: originalHeight });
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    getStream();
  }, [deviceId]);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  return { stream, size, loading, error };
}

export default useMediaStream;
