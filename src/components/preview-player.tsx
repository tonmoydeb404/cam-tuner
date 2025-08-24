import { cleanupMediaStream } from "@/utils/stream-utils";
import { LucidePause, Play, RefreshCw, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { LoadingState } from "./ui/loading-state";

interface VideoSize {
  width: number;
  height: number;
}

type ErrorType = "permission" | "support" | "device" | "general";

const PreviewPlayer = () => {
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // State
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [loading, setLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [size, setSize] = useState<VideoSize | null>(null);

  // Utility functions
  const checkBrowserSupport = (): boolean => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };

  const getErrorType = (error: Error): ErrorType => {
    const message = error.message.toLowerCase();
    const name = error.name.toLowerCase();

    if (name === "notallowederror" || message.includes("permission")) {
      return "permission";
    }
    if (
      name === "notfounderror" ||
      message.includes("camtuner camera not found")
    ) {
      return "device";
    }
    if (name === "notsupportederror" || message.includes("not supported")) {
      return "support";
    }
    return "general";
  };

  // Camera management functions
  const initializeCamera = async (): Promise<void> => {
    if (!checkBrowserSupport()) {
      throw new Error("Camera access is not supported in this browser");
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    const device = devices.find((d) =>
      d.label.toLowerCase().includes("camtuner")
    );

    if (!device) {
      throw new Error("Camtuner camera not found!");
    }

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: device ? { deviceId: device.deviceId } : true,
    });

    const videoTrack = mediaStream.getVideoTracks()[0];
    if (videoTrack) {
      const settings = videoTrack.getSettings();
      setSize({
        width: settings.width || 0,
        height: settings.height || 0,
      });
    }

    streamRef.current = mediaStream;
    setStream(mediaStream);
  };

  const cleanupCamera = (): void => {
    if (streamRef.current) {
      cleanupMediaStream(streamRef.current);
      streamRef.current = null;
    }
    setStream(null);
    navigator.mediaDevices.removeEventListener(
      "devicechange",
      handleDeviceChange
    );
  };

  const openOptionsPage = (): void => {
    if (typeof chrome !== "undefined" && chrome.runtime) {
      chrome.runtime.openOptionsPage();
    } else {
      // Fallback for non-extension environments
      window.open("/options", "_blank");
    }
  };

  // Event handlers
  const handleStart = async (): Promise<void> => {
    setIsStarted(true);
    setLoading(true);
    setError(null);
    setErrorType(null);

    try {
      await initializeCamera();
      navigator.mediaDevices.addEventListener(
        "devicechange",
        handleDeviceChange
      );
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to access camera");
      setError(error.message);
      setErrorType(getErrorType(error));
      setIsStarted(false);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = (): void => {
    setIsStarted(false);
    setError(null);
    setErrorType(null);
    cleanupCamera();
  };

  const handleRetry = (): void => {
    setIsStarted(false);
    setError(null);
    setErrorType(null);
    cleanupCamera();
  };

  const handleDeviceChange = async (): Promise<void> => {
    cleanupCamera();
    await handleStart();
  };

  // Effects
  useEffect(() => {
    return () => {
      cleanupCamera();
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track: MediaStreamTrack) => track.stop());
        streamRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Render components
  const renderStartButton = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm">
      <Button onClick={handleStart} size={"icon"}>
        <Play className="h-5 w-5" />
      </Button>
    </div>
  );

  const renderPermissionError = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
      <h3 className="text-base font-semibold mb-4">
        Camera Permission Required
      </h3>
      <div className="flex gap-2 items-center justify-center flex-wrap">
        <Button onClick={openOptionsPage} variant="default" size={"sm"}>
          <Settings className="h-4 w-4" />
          Grant Permission
        </Button>
        <Button onClick={handleRetry} variant="outline" size={"sm"}>
          Try Again
        </Button>
      </div>
    </div>
  );

  const renderSupportError = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
      <h3 className="text-base font-semibold mb-4">Browser Not Supported</h3>
      <Button onClick={handleRetry} variant="outline" size={"sm"}>
        Try Again
      </Button>
    </div>
  );

  const renderDeviceError = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
      <h3 className="text-base font-semibold mb-4">Camera Not Found</h3>

      <div className="flex gap-2 items-center justify-center flex-wrap">
        <Button onClick={openOptionsPage} variant="default" size={"sm"}>
          <Settings className="h-4 w-4 mr-2" />
          Open Settings
        </Button>
        <Button onClick={handleRetry} variant="outline" size={"sm"}>
          Try Again
        </Button>
      </div>
    </div>
  );

  const renderGeneralError = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
      <h3 className="text-base font-semibold mb-4">Camera Error</h3>
      <Button onClick={handleRetry} variant="outline" size={"sm"}>
        Try Again
      </Button>
    </div>
  );

  const renderVideoControls = () => (
    <div className="absolute top-3 left-3 flex gap-2">
      <Button size={"icon"} variant={"destructive"} onClick={handleStop}>
        <LucidePause />
      </Button>
    </div>
  );

  const renderQualityIndicator = () => (
    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="px-2 py-1 rounded-md bg-black/70 text-white text-xs backdrop-blur-sm">
        {size?.width || 0}×{size?.height || 0}
      </div>
    </div>
  );

  const renderControlsOverlay = () => (
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none">
      <div className="absolute bottom-3 left-3 flex gap-2 pointer-events-auto">
        <Button
          onClick={handleRetry}
          size="icon"
          variant="secondary"
          className="bg-black/70 hover:bg-black/90 text-white backdrop-blur-sm"
          title="Refresh camera feed"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderVideoPlayer = () => (
    <LoadingState
      loading={loading}
      error={error}
      retryAction={handleRetry}
      loadingText="Connecting to camera"
      variant="spinner"
      size="md"
      className="absolute inset-0 bg-background/90 backdrop-blur-sm"
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain rounded-lg"
        autoPlay
        muted
        playsInline
      />
      {renderVideoControls()}
      {renderQualityIndicator()}
      {renderControlsOverlay()}
    </LoadingState>
  );

  // Error state renderer
  const renderErrorState = () => {
    switch (errorType) {
      case "permission":
        return renderPermissionError();
      case "support":
        return renderSupportError();
      case "device":
        return renderDeviceError();
      case "general":
      default:
        return renderGeneralError();
    }
  };

  // Main component render
  return (
    <div className="relative aspect-video w-full bg-muted/20 rounded-lg overflow-hidden border border-border shadow-sm group">
      {!isStarted && !error
        ? renderStartButton()
        : error && errorType
        ? renderErrorState()
        : renderVideoPlayer()}
    </div>
  );
};

export default PreviewPlayer;
