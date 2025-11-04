"use client";

import { useEffect, useRef, useState } from "react";

interface UseCameraStreamProps {
  selectedDeviceId: string;
  facingMode?: "user" | "environment";
  onStreamReady?: (stream: MediaStream) => void;
}

export function useCameraStream({
  selectedDeviceId,
  facingMode = "user",
  onStreamReady,
}: UseCameraStreamProps) {
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreamActive, setIsStreamActive] = useState(false);

  // Start camera stream
  const startCamera = async () => {
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
      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      onStreamReady?.(mediaStream);
      setIsStreamActive(true);
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
  };

  // Stop camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreamActive(false);
  };

  // Auto-restart when device changes
  useEffect(() => {
    if (isStreamActive && selectedDeviceId) {
      stopCamera();
      startCamera();
    }
    // Cleanup on unmount
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDeviceId]);

  return {
    videoRef,
    error,
    isLoading,
    isStreamActive,
    startCamera,
    stopCamera,
  };
}
