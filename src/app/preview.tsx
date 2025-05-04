import { useAppContext } from "@/context/app";
import useMediaStream from "@/hooks/use-media-stream";
import useStreamPatcher from "@/hooks/use-stream-patcher";
import { LucideLoader, LucideX } from "lucide-react";
import { useEffect, useRef } from "react";

type Props = {};

const Preview = (props: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { cameraSource, config } = useAppContext();
  const { stream, error, loading, size } = useMediaStream(
    cameraSource?.deviceId ?? null
  );
  const patchedStream = useStreamPatcher(stream, size, config);

  useEffect(() => {
    if (videoRef.current && patchedStream) {
      videoRef.current.srcObject = patchedStream;
    }
  }, [patchedStream]);

  return (
    <div className="aspect-video w-full h-full bg-accent flex flex-col items-center justify-center mb-5 rounded-xl mx-auto">
      {loading && (
        <>
          <LucideLoader className="animate-spin" />
          <p className="text-accent-foreground">Loading camera...</p>
        </>
      )}

      {!loading && !!error && (
        <>
          <LucideX />
          <p className="text-accent-foreground">Error: {error.message}</p>
        </>
      )}

      {!loading && !error && (
        <video
          ref={videoRef}
          className="rounded-xl w-full h-full bg-accent object-contain max-w-full max-h-full aspect-video"
          autoPlay
        />
      )}
    </div>
  );
};

export default Preview;
