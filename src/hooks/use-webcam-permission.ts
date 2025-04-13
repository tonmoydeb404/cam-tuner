import { useEffect, useState } from "react";

function useWebcamPermission() {
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        if (!navigator.permissions || !navigator.mediaDevices) {
          setIsSupported(false);
          return;
        }

        const result = await navigator.permissions.query({
          name: "camera" as PermissionName,
        });

        setHasPermission(result.state === "granted");

        result.onchange = () => {
          setHasPermission(result.state === "granted");
        };
      } catch (error) {
        // Fallback: Try requesting access
        await requestPermission();
      }
    };

    checkPermission();
  }, []);

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);

      // Immediately stop all video tracks to turn off camera
      stream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      setHasPermission(false);
    }
  };

  return { hasPermission, isSupported, requestPermission };
}

export default useWebcamPermission;
