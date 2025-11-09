import * as React from "react";

export type WebcamPermissionState =
  | "prompt"
  | "granted"
  | "denied"
  | "unavailable";

export interface UseWebcamPermissionResult {
  permission: WebcamPermissionState;
  requestPermission: () => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export function useWebcamPermission(): UseWebcamPermissionResult {
  const [permission, setPermission] =
    React.useState<WebcamPermissionState>("prompt");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Check initial permission state
  React.useEffect(() => {
    if (!navigator.mediaDevices || !navigator.permissions) {
      setPermission("unavailable");
      return;
    }

    const checkPermission = async () => {
      try {
        const result = await navigator.permissions.query({
          name: "camera" as PermissionName,
        });
        setPermission(result.state as WebcamPermissionState);

        const handleChange = () => {
          setPermission(result.state as WebcamPermissionState);
        };

        result.addEventListener("change", handleChange);
        return () => result.removeEventListener("change", handleChange);
      } catch (err) {
        // Permissions API might not be fully supported
        setPermission("prompt");
      }
    };

    checkPermission();
  }, []);

  const requestPermission = React.useCallback(async (): Promise<boolean> => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera access is not supported in this browser");
      setPermission("unavailable");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      // Stop the stream immediately, we only needed it to check permission
      mediaStream.getTracks().forEach((track) => track.stop());

      setPermission("granted");
      setIsLoading(false);
      return true;
    } catch (err) {
      setIsLoading(false);

      if (err instanceof Error) {
        if (
          err.name === "NotAllowedError" ||
          err.name === "PermissionDeniedError"
        ) {
          setPermission("denied");
          setError("Camera permission was denied");
        } else if (err.name === "NotFoundError") {
          setPermission("unavailable");
          setError("No camera device found");
        } else if (err.name === "NotReadableError") {
          setPermission("unavailable");
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

  return {
    permission,
    requestPermission,
    isLoading,
    error,
  };
}
