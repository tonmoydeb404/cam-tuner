import { LoadingState } from "@/components/ui/loading-state";
import { useAppContext } from "@/context/app";
import useMediaStream from "@/hooks/use-media-stream";
import useStreamPatcher from "@/hooks/use-stream-patcher";
import { RefreshCw } from "lucide-react";
import { useEffect, useRef } from "react";

type Props = {};

const Preview = (props: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { cameraSource, config } = useAppContext();
  const { stream, error, loading, size } = useMediaStream(
    cameraSource?.deviceId ?? null
  );
  const patchedStream = useStreamPatcher(stream, size, config);

  const handleRetry = () => {
    // Force re-render to retry camera connection
    window.location.reload();
  };

  useEffect(() => {
    if (videoRef.current && patchedStream) {
      videoRef.current.srcObject = patchedStream;
    }
  }, [patchedStream]);

  return (
    <div className="relative aspect-video w-full bg-muted/20 rounded-lg overflow-hidden border border-border shadow-sm group">
      <LoadingState
        loading={loading}
        error={error?.message}
        retryAction={handleRetry}
        loadingText="Connecting to camera"
        variant="spinner"
        size="sm"
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

        {/* Controls Overlay - appears on hover */}
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

export default Preview;
