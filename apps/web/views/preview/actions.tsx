import { UseTunerReturn } from "@/hooks/use-tuner"
import { UseWebcamReturn } from "@/hooks/use-webcam"
import { CheckmarkCircle01Icon, RefreshIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@workspace/ui/components/button"

type SyncStatus = "idle" | "syncing" | "success" | "error"

type Props = {
  webcam: UseWebcamReturn
  tuner: UseTunerReturn
  syncStatus: SyncStatus
  setSyncStatus: (status: SyncStatus) => void
}

const PreviewActions = (props: Props) => {
  const { webcam, tuner, syncStatus, setSyncStatus } = props

  const handleApply = () => {
    setSyncStatus("syncing")
    window.postMessage(
      {
        type: "syncConfig",
        config: tuner.config,
      },
      "*"
    )
  }

  const getButtonText = () => {
    switch (syncStatus) {
      case "syncing":
        return "Syncing..."
      case "success":
        return "Applied!"
      case "error":
        return "Failed"
      default:
        return "Apply"
    }
  }

  const getButtonVariant = () => {
    switch (syncStatus) {
      case "success":
        return "default" as const
      case "error":
        return "destructive" as const
      default:
        return "default" as const
    }
  }

  return (
    <div className="flex flex-col gap-y-2">
      <Button
        variant={getButtonVariant()}
        size={"lg"}
        onClick={handleApply}
        // disabled={syncStatus === "syncing"}
      >
        <HugeiconsIcon icon={CheckmarkCircle01Icon} />
        {getButtonText()}
      </Button>

      <Button
        onClick={() => {
          webcam.stopCamera()
          setTimeout(() => webcam.startCamera(), 100)
        }}
        variant="outline"
        size={"lg"}
      >
        <HugeiconsIcon icon={RefreshIcon} />
        Restart
      </Button>
    </div>
  )
}

export default PreviewActions
