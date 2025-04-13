import { useEffect, useState } from "react";

type WebcamDevice = {
  deviceId: string;
  label: string;
};

const useWebcams = () => {
  const [webcams, setWebcams] = useState<WebcamDevice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCams() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices
          .filter((device) => device.kind === "videoinput" && !!device.deviceId)
          .map((device) => ({
            deviceId: device.deviceId,
            label: device.label,
          }));

        setWebcams(videoInputs);
      } catch (error) {
        console.error("Error accessing webcams:", error);
        setWebcams([]);
      } finally {
        setLoading(false);
      }
    }

    getCams();
  }, []);

  return { webcams, loading };
};

export default useWebcams;
