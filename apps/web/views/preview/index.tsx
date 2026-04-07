"use client"

import { useTuner } from "@/hooks/use-tuner"
import { useWebcam } from "@/hooks/use-webcam"
import { Video01Icon, VideoOffIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@workspace/ui/components/button"
import PreviewError from "./error"
import PreviewSidebar from "./sidebar"
import PreviewVideo from "./video"

type SyncStatus = "idle" | "syncing" | "success" | "error"

interface PreviewViewProps {
  syncStatus: SyncStatus
  setSyncStatus: (status: SyncStatus) => void
}

const PreviewView = ({ syncStatus, setSyncStatus }: PreviewViewProps) => {
  const webcam = useWebcam()
  const tuner = useTuner(webcam.stream)

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 md:flex-row">
        {/* Main Camera Preview Area */}
        <div className="relative flex flex-1 flex-col items-center justify-center gap-4 overflow-hidden rounded-xl border bg-black">
          {webcam.error ? (
            <PreviewError />
          ) : (
            <PreviewVideo stream={tuner.outputStream} />
          )}

          {webcam.stream ? (
            <Button
              onClick={webcam.stopCamera}
              variant={"destructive"}
              size={"icon-lg"}
              className="absolute top-4 left-4 bg-destructive/60 text-white hover:bg-destructive/70"
            >
              <HugeiconsIcon icon={VideoOffIcon} />
            </Button>
          ) : (
            <Button
              onClick={webcam.startCamera}
              variant={"default"}
              size={"icon-lg"}
              className="absolute top-4 left-4"
            >
              <HugeiconsIcon icon={Video01Icon} />
            </Button>
          )}
        </div>

        {/* Tuner Controls Sidebar */}
        <PreviewSidebar
          tuner={tuner}
          webcam={webcam}
          syncStatus={syncStatus}
          setSyncStatus={setSyncStatus}
        />
      </div>
    </div>
  )
}

export default PreviewView
