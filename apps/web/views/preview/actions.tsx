import { UseTunerReturn } from "@/hooks/use-tuner"
import { UseWebcamReturn } from "@/hooks/use-webcam"
import { IconRefresh, IconRotate } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"

type Props = {
  webcam: UseWebcamReturn
  tuner: UseTunerReturn
}

const PreviewActions = ({ webcam, tuner }: Props) => {
  return (
    <div className="flex gap-2">
      <Button
        onClick={() => {
          webcam.stopCamera()
          setTimeout(() => webcam.startCamera(), 100)
        }}
        variant="outline"
        size={"lg"}
        className="flex-1"
      >
        <IconRefresh />
        Restart
      </Button>
      <Button
        onClick={tuner.resetConfig}
        variant="outline"
        size={"lg"}
        className="flex-1"
      >
        <IconRotate />
        Reset
      </Button>
    </div>
  )
}

export default PreviewActions
