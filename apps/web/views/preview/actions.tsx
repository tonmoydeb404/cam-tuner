import { UseTunerReturn } from "@/hooks/use-tuner"
import { UseWebcamReturn } from "@/hooks/use-webcam"
import { CheckmarkCircle01Icon, RefreshIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@workspace/ui/components/button"

type Props = {
  webcam: UseWebcamReturn
  tuner: UseTunerReturn
}

const PreviewActions = (props: Props) => {
  const { webcam } = props

  return (
    <div className="flex flex-col gap-y-2">
      <Button variant="default" size={"lg"}>
        <HugeiconsIcon icon={CheckmarkCircle01Icon} />
        Apply
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
