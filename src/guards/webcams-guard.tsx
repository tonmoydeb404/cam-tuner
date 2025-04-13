import useWebcams from "@/hooks/use-web-cams";
import { Loader2, LucideCameraOff } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const WebcamsGuard = ({ children }: Props) => {
  const { webcams, loading } = useWebcams();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-sm text-muted-foreground text-center">
        <Loader2 className="animate-spin mb-4" />
        <p className="text-sm">Checking camera devices...</p>
      </div>
    );
  }

  if (!webcams || webcams.length === 0) {
    return (
      <div className="px-5 py-10 text-center flex flex-col items-center justify-center">
        <LucideCameraOff size={34} className="mb-4 text-muted-foreground" />
        <h1 className="text-lg font-bold mb-1">No camera devices found</h1>
        <p className="text-sm text-muted-foreground">
          Please make sure at least one webcam is connected and accessible by
          your browser.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default WebcamsGuard;
