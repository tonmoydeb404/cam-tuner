import { cleanupMediaStream } from "@/utils/stream-utils";
import { RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LoadingState } from "./ui/loading-state";

const PreviewPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null
  );

  const handleRetry = () => {
    window.location.reload();
  };

  useEffect(() => {
    const getDefaultCamera = async () => {
      setLoading(true);
      setError(null);

      try {
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
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to access camera"
        );
      } finally {
        setLoading(false);
      }
    };

    const handleDeviceChange = async () => {
      if (streamRef.current) {
        cleanupMediaStream(streamRef.current);
        streamRef.current = null;
        setStream(null);
      }

      // Restart camera with new device list
      await getDefaultCamera();
    };

    // Initial camera setup
    getDefaultCamera();

    // Listen for device changes
    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);

    return () => {
      // Remove device change listener
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        handleDeviceChange
      );

      // Stop stream
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track: MediaStreamTrack) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative aspect-video w-full bg-muted/20 rounded-lg overflow-hidden border border-border shadow-sm group">
      <LoadingState
        loading={loading}
        error={error}
        retryAction={handleRetry}
        loadingText="Connecting to camera"
        variant="spinner"
        size="md"
        className="absolute inset-0 bg-background/90 backdrop-blur-sm"
      >
        {/* Video Preview */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain rounded-lg"
          autoPlay
          muted
          playsInline
        />

        {/* Video Overlay Indicators */}
        <div className="absolute top-3 left-3 flex gap-2">
          <div className="px-2 py-1 rounded-md bg-red-500 text-white text-xs font-medium backdrop-blur-sm">
            Live
          </div>
        </div>

        {/* Quality Indicator */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="px-2 py-1 rounded-md bg-black/70 text-white text-xs backdrop-blur-sm">
            {size?.width || 0}×{size?.height || 0}
          </div>
        </div>

        {/* Controls Overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none">
          <div className="absolute bottom-3 left-3 flex gap-2 pointer-events-auto">
            <button
              onClick={handleRetry}
              className="p-2 bg-black/70 hover:bg-black/90 text-white rounded-md backdrop-blur-sm transition-colors"
              title="Refresh camera feed"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </LoadingState>
    </div>
  );
};

export default PreviewPlayer;
