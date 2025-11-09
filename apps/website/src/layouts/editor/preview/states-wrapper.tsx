"use client";

import { Spinner } from "@/components/ui/spinner";
import { useWebcamPermission } from "@/lib/webcam";
import { Camera, LucideTriangleAlert, VideoOff } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const PreviewStatesWrapper = (props: Props) => {
  const { children } = props;
  const { isLoading, error, permission, requestPermission } =
    useWebcamPermission();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="size-8" />
          <p className="text-sm text-muted-foreground">
            Requesting camera access...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-3 text-center max-w-md px-4">
          <div className="rounded-full bg-destructive/10 p-3">
            <LucideTriangleAlert className="size-6 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold">Camera Error</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  // Denied state
  if (permission === "denied") {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-3 text-center max-w-md px-4">
          <div className="rounded-full bg-destructive/10 p-3">
            <VideoOff className="size-6 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold">Camera Access Denied</h3>
          <p className="text-sm text-muted-foreground">
            Please allow camera access in your browser settings to use the
            webcam tuner.
          </p>
        </div>
      </div>
    );
  }

  // Unavailable state
  if (permission === "unavailable") {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-3 text-center max-w-md px-4">
          <div className="rounded-full bg-muted p-3">
            <VideoOff className="size-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">Camera Unavailable</h3>
          <p className="text-sm text-muted-foreground">
            No camera device found or camera access is not supported in this
            browser.
          </p>
        </div>
      </div>
    );
  }

  // Prompt state - ask for permission
  if (permission === "prompt") {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-4 text-center max-w-md px-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Camera className="size-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Camera Access Required</h3>
          <p className="text-sm text-muted-foreground">
            This app needs access to your camera to tune and customize your
            webcam settings.
          </p>
          <button
            onClick={requestPermission}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
          >
            <Camera className="size-4" />
            Enable Camera
          </button>
        </div>
      </div>
    );
  }

  // Granted state - placeholder for webcam feed
  return children;
};

export default PreviewStatesWrapper;
