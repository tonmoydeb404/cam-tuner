import cropStreamAspectRatio from "@/utils/crop-stream-aspect-ratio";
import { useEffect, useState } from "react";

type MediaStreamConfig = {
  aspectRatio?: number;
};

function useMediaStream(deviceId: string | null, config?: MediaStreamConfig) {
  const [stream, setStream] = useState<MediaStream | null>(null);
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

        const cropped = cropStreamAspectRatio(
          rawStream,
          originalWidth,
          originalHeight,
          config?.aspectRatio
        );

        setStream(cropped);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    getStream();
  }, [deviceId, config?.aspectRatio]);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  return { stream, loading, error };
}

export default useMediaStream;
