"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface VideoDevice {
  deviceId: string;
  label: string;
}

export interface UseWebcamReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  devices: VideoDevice[];
  selectedDeviceId: string;
  setSelectedDeviceId: (id: string) => void;
  isLoading: boolean;
  error: string | null;
  stream: MediaStream | null;
}

export function useWebcam(): UseWebcamReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [devices, setDevices] = useState<VideoDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStream(null);
  }, []);

  const loadDevices = useCallback(async () => {
    try {
      const all = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = all
        .filter((d) => d.kind === "videoinput")
        .map((d, i) => ({
          deviceId: d.deviceId,
          label: d.label || `Camera ${i + 1}`,
        }));
      setDevices(videoDevices);
      return videoDevices;
    } catch {
      return [];
    }
  }, []);

  const startStream = useCallback(
    async (deviceId?: string) => {
      stopStream();
      setIsLoading(true);
      setError(null);
      try {
        const constraints: MediaStreamConstraints = {
          video: deviceId ? { deviceId: { exact: deviceId } } : true,
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        // Enumerate devices after permission is granted so labels are available
        const videoDevices = await loadDevices();
        if (!deviceId && videoDevices.length > 0) {
          const active = stream.getVideoTracks()[0]?.getSettings().deviceId;
          setSelectedDeviceId(active ?? videoDevices[0]?.deviceId ?? "");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not access camera."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [stopStream, loadDevices]
  );

  // Attach stream to video element once it mounts
  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  });

  // Initial stream start
  useEffect(() => {
    startStream();
    return stopStream;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Switch camera when selection changes (skip first render)
  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (selectedDeviceId) startStream(selectedDeviceId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDeviceId]);

  return { videoRef, devices, selectedDeviceId, setSelectedDeviceId, isLoading, error, stream };
}
