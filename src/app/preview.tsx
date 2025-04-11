import { useAppContext } from "@/context";
import useMediaStream from "@/hooks/use-media-stream";
import { useEffect, useRef } from "react";

type Props = {};

const Preview = (props: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { cameraSource } = useAppContext();
  const { stream, error, loading } = useMediaStream(cameraSource);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (loading) return <p>Loading camera...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <video ref={videoRef} className="aspect-video rounded-xl mb-5 w-full" />
  );
};

export default Preview;
