"use client"

import { CamState } from "@/components/camera-states"
import type { UseTunerReturn } from "@/hooks/use-tuner"
import type { UseWebcamReturn } from "@/hooks/use-webcam"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { DemoControlFields } from "./demo-control-fields"

interface DemoControlsPanelProps {
  camState: CamState
  tuner: UseTunerReturn
  webcam: Pick<
    UseWebcamReturn,
    "devices" | "selectedDeviceId" | "setSelectedDeviceId"
  >
}

export const DemoControlsPanel = (props: DemoControlsPanelProps) => {
  const { camState, tuner, webcam } = props
  const isDisabled = camState !== "active"

  return (
    <ScrollArea className="flex w-full shrink-0 md:w-80">
      {isDisabled && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-card/80 backdrop-blur-[2px]"></div>
      )}

      <DemoControlFields tuner={tuner} webcam={webcam} />
    </ScrollArea>
  )
}
