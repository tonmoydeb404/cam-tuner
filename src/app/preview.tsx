import { useAppContext } from "@/context";
import { getRatio } from "@/context/ratio-options";
import useMediaStream from "@/hooks/use-media-stream";
import { LucideLoader, LucideX } from "lucide-react";
import { useEffect, useRef } from "react";

type Props = {};

const Preview = (props: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { cameraSource, aspectRatio } = useAppContext();
  const { stream, error, loading } = useMediaStream(cameraSource, {
    aspectRatio: getRatio(aspectRatio),
  });

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [stream]);

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
      className="aspect-video rounded-xl mb-5 w-full bg-accent"
    />
  );
};

export default Preview;
