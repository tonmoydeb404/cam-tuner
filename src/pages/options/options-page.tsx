import { Button } from "@/components/ui/button";
import { Logger } from "@/utils/log";
import { cleanupMediaStream } from "@/utils/stream-utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LoadingState } from "@/components/ui/loading-state";
import useWebcamPermission from "@/hooks/use-webcam-permission";
import {
  Camera,
  CameraOff,
  ExternalLink,
  Loader2,
  LucideCamera,
  RefreshCw,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const CameraPermissionCard = () => {
  const { hasPermission, isSupported, requestPermission } =
    useWebcamPermission();

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">CamTuner Options</CardTitle>
        <CardDescription>Configure your extension settings</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between py-4">
          <div className="space-y-0.5">
            <Label
              htmlFor="camera-permission"
              className="text-base font-medium"
            >
              Camera Permission
            </Label>
            <p className="text-sm text-muted-foreground">
              Allow the extension to access your camera
            </p>
          </div>

          {!isSupported && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <CameraOff size={18} />
              <span>Not supported</span>
            </div>
          )}

          {isSupported && hasPermission === null && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="animate-spin" size={18} />
              <span className="text-sm">Checking...</span>
            </div>
          )}

          {isSupported && hasPermission === false && (
            <Button
              onClick={requestPermission}
              aria-label="Request camera access"
            >
              <LucideCamera className="h-4 w-4" />
              Allow
            </Button>
          )}

          {isSupported && hasPermission === true && (
            <Button variant="outline" className="pointer-events-none">
              Allowed
            </Button>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-start border-t pt-6">
        <p className="text-sm text-muted-foreground mb-2">
          Having issues with the extension? Please report them on our GitHub
          repository.
        </p>
        <Button variant="outline" asChild>
          <a
            href="https://github.com/tonmoydeb404/cam-tuner/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Report an Issue
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

const LivePreviewCard = () => {
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
      Logger.dev('Camera devices changed, refreshing stream...');
      
      // Stop current stream
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
    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);

    return () => {
      // Remove device change listener
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
      
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
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Live Preview
        </CardTitle>
        <CardDescription>
          Real-time camera feed with applied effects from CamTuner virtual
          camera
        </CardDescription>
      </CardHeader>

      <CardContent>
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
              <div className="px-2 py-1 rounded-md bg-black/70 text-white text-xs font-medium backdrop-blur-sm">
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
      </CardContent>

      <CardFooter className="border-t pt-4">
        <p className="text-sm text-muted-foreground">
          This preview shows what others will see when you use CamTuner as your
          camera source in video calls.
        </p>
      </CardFooter>
    </Card>
  );
};

const OptionsPageContent = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto py-8 space-y-6">
        <LivePreviewCard />
        <CameraPermissionCard />
      </div>
    </div>
  );
};

const OptionsPage = () => {
  useEffect(() => {
    const messageListener = (message: unknown, _sender: chrome.runtime.MessageSender, sendResponse: (response?: unknown) => void) => {
      Logger.dev('Options page received message:', message);
      
      // Handle different message types
      const msg = message as { type?: string };
      switch (msg.type) {
        case 'EXAMPLE_MESSAGE':
          // Handle your message here
          sendResponse({ success: true });
          break;
        default:
          Logger.warn('Unknown message type:', msg.type);
      }
    };

    const storageChangeListener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      Logger.dev('Storage changes:', changes);
      
      // Handle specific key changes
      Object.keys(changes).forEach((key) => {
        const change = changes[key];
        Logger.dev(`Key "${key}" changed from`, change.oldValue, 'to', change.newValue);
      });
    };

    // Add the message listener
    chrome.runtime.onMessage.addListener(messageListener);
    
    // Add the storage change listener
    chrome.storage.sync.onChanged.addListener(storageChangeListener);

    // Cleanup listeners on unmount
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
      chrome.storage.sync.onChanged.removeListener(storageChangeListener);
    };
  }, []);

  return <OptionsPageContent />;
};

export default OptionsPage;
