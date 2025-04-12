import { useAppContext } from "@/context";
import useMediaStream from "@/hooks/use-media-stream";
import useStreamPatcher from "@/hooks/use-stream-patcher";
import { LucideLoader, LucideX } from "lucide-react";
import { useEffect, useRef } from "react";

type Props = {};

const Preview = (props: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { cameraSource, config } = useAppContext();
  const { stream, error, loading, size } = useMediaStream(cameraSource);
  const patchedStream = useStreamPatcher(stream, size, config);

  useEffect(() => {
    if (videoRef.current && patchedStream) {
      videoRef.current.srcObject = patchedStream;
      videoRef.current.play();
    }
  }, [patchedStream]);

  if (loading)
    return (
      <div className="aspect-video w-full bg-accent flex flex-col items-center justify-center mb-5 rounded-xl">
        <LucideLoader className="animate-spin" />
        <p className="text-accent-foreground">Loading camera...</p>
      </div>
    );
  if (error)
    return (
      <div className="aspect-video w-full bg-accent flex flex-col items-center justify-center mb-5 rounded-xl">
        <LucideX />
        <p className="text-accent-foreground">Error: {error.message}</p>
      </div>
    );

  return (
    <video
      ref={videoRef}
      className="aspect-video rounded-xl mb-5 w-full bg-accent object-contain"
    />
  );
};

export default Preview;
