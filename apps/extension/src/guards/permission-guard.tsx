import { Button } from "@/components/ui/button";
import useWebcamPermission from "@/hooks/use-webcam-permission";
import { LucideCamera, LucideCameraOff } from "lucide-react";
import { ReactNode } from "react";
import Browser from "webextension-polyfill";

type Props = {
  children: ReactNode;
};

const PermissionGuard = (props: Props) => {
  const { hasPermission, isSupported } = useWebcamPermission();

  if (!isSupported) {
    return (
      <div className="px-5 py-10 text-center flex flex-col items-center justify-center">
        <LucideCameraOff size={34} className="mb-4 text-muted-foreground" />
        <h1 className="text-lg font-bold mb-1">Camera Access Not Supported</h1>
        <p className="text-sm text-muted-foreground">
          Your browser doesn't support camera devices, or access has been
          restricted. Please check your browser settings or try a different one.
        </p>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="px-5 py-10 text-center flex flex-col items-center justify-center">
        <LucideCamera size={34} className="mb-4 text-muted-foreground" />
        <h1 className="text-lg font-bold mb-1">Camera Permission Needed</h1>
        <p className="text-sm text-muted-foreground mb-4">
          To continue, please allow access to your camera in the browser
          settings.
        </p>
        <Button onClick={() => Browser.runtime.openOptionsPage()}>
          Allow Access
        </Button>
      </div>
    );
  }

  return props.children;
};

export default PermissionGuard;
