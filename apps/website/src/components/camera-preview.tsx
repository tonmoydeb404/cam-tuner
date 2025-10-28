"use client";

import { useEffect, useRef, useState } from "react";

interface CameraPreviewProps {
  width?: number;
  height?: number;
  className?: string;
  onStreamReady?: (stream: MediaStream) => void;
  facingMode?: "user" | "environment";
}

function CameraPreview({
  className = "",
  onStreamReady,
  facingMode = "user",
}: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");

  // Get available camera devices
  useEffect(() => {
    async function getDevices() {
      try {
        const deviceList = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = deviceList.filter(
          (device) => device.kind === "videoinput"
        );
        setDevices(videoDevices);
        if (videoDevices.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      } catch (err) {
        console.error("Error enumerating devices:", err);
      }
    }

    getDevices();
  }, [selectedDeviceId]);

  // Start camera stream
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    async function startCamera() {
      try {
        setIsLoading(true);
        setError(null);

        const constraints: MediaStreamConstraints = {
          video: selectedDeviceId
            ? { deviceId: { exact: selectedDeviceId } }
            : {
                facingMode,
              },
          audio: false,
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia(
          constraints
        );
        currentStream = mediaStream;

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        onStreamReady?.(mediaStream);
        setIsLoading(false);
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to access camera. Please ensure you have granted camera permissions."
        );
        setIsLoading(false);
      }
    }

    startCamera();

    // Cleanup function
    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode, selectedDeviceId, onStreamReady]);

  const handleDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDeviceId(event.target.value);
  };

  return (
    <div className={`camera-preview-container relative ${className}`}>
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg">
            <div className="text-white">Loading camera...</div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900/90 rounded-lg p-4">
            <div className="text-white text-center">
              <p className="font-semibold mb-2">Camera Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full rounded-lg bg-black aspect-video"
        />
      </div>

      {devices.length > 1 && (
        <div className="absolute top-2 left-2">
          <select
            id="camera-select"
            value={selectedDeviceId}
            onChange={handleDeviceChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId.slice(0, 8)}...`}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

export default CameraPreview;
