import * as React from "react";

export interface UseWebcamStreamResult {
  stream: MediaStream | null;
  isLoading: boolean;
  error: string | null;
  startStream: () => Promise<boolean>;
  stopStream: () => void;
}

export function useWebcamStream(): UseWebcamStreamResult {
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const startStream = React.useCallback(async (): Promise<boolean> => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera access is not supported in this browser");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      setStream(mediaStream);
      setIsLoading(false);
      return true;
    } catch (err) {
      setIsLoading(false);

      if (err instanceof Error) {
        if (
          err.name === "NotAllowedError" ||
          err.name === "PermissionDeniedError"
        ) {
          setError("Camera permission was denied");
        } else if (err.name === "NotFoundError") {
          setError("No camera device found");
        } else if (err.name === "NotReadableError") {
          setError("Camera is already in use by another application");
        } else {
          setError(`Camera access error: ${err.message}`);
        }
      } else {
        setError("Failed to access camera");
      }

      return false;
    }
  }, []);

  const stopStream = React.useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return {
    stream,
    isLoading,
    error,
    startStream,
    stopStream,
  };
}
