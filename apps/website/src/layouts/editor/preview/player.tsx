"use client";

import { useWebcamStream } from "@/lib/webcam";
import { useCallback, useEffect, useRef } from "react";
import PlayerActions from "./player-actions";

const PreviewPlayer = () => {
  const { stream, isLoading, error, startStream, stopStream } =
    useWebcamStream();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      return;
    }

    if (stream) {
      videoElement.srcObject = stream;
      const playPromise = videoElement.play();

      // Some browsers return a promise we need to handle
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Ignore autoplay errors, user actions will resolve them
        });
      }
    } else {
      videoElement.pause();
      videoElement.srcObject = null;
    }
  }, [stream]);

  const handleStart = useCallback(async () => {
    await startStream();
  }, [startStream]);

  const handleStop = useCallback(() => {
    stopStream();
  }, [stopStream]);

  const isStreaming = Boolean(stream);

  return (
    <div className="relative flex flex-col h-full w-full items-center justify-center overflow-hidden gap-y-4">
      <div className="aspect-video max-w-3xl w-full border rounded-2xl bg-sidebar">
        <video
          ref={videoRef}
          className="h-full w-full object-contain"
          autoPlay
          playsInline
          muted
        />
      </div>

      <PlayerActions
        isStreaming={isStreaming}
        isLoading={isLoading}
        error={error}
        onStart={handleStart}
        onStop={handleStop}
        onRetry={handleStart}
      />
    </div>
  );
};

export default PreviewPlayer;
