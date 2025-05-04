import { Logger } from "@/utils/log";
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
          name: "camera",
        });

        setHasPermission(result.state === "granted");

        result.addEventListener("change", (ev) => {
          if (ev.target && "state" in ev.target) {
            setHasPermission(ev.target.state === "granted");
          }
        });
      } catch (error) {
        Logger.error("Failed to check permission: ", error);
      }
    };

    checkPermission();
  }, []);

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      // Immediately stop all video tracks to turn off camera
      stream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      setHasPermission(false);
    }
  };

  return { hasPermission, isSupported, requestPermission };
}

export default useWebcamPermission;
