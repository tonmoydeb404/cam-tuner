"use client"

import { UseTunerReturn } from "@/hooks/use-tuner"
import { UseWebcamReturn } from "@/hooks/use-webcam"
import { AlignControl } from "@workspace/ui/components/tuner/align-control"
import { AspectRatioControl } from "@workspace/ui/components/tuner/aspect-ratio-control"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { ZoomControl } from "@workspace/ui/components/tuner/zoom-control"
import PreviewActions from "./actions"

type SyncStatus = "idle" | "syncing" | "success" | "error"

type Props = {
  webcam: UseWebcamReturn
  tuner: UseTunerReturn
  syncStatus: SyncStatus
  setSyncStatus: (status: SyncStatus) => void
}

const PreviewSidebar = (props: Props) => {
  const { webcam, tuner, syncStatus, setSyncStatus } = props

  return (
    <div className="flex w-full flex-col gap-6 md:w-80">
      <Card className="bg-muted dark:bg-card">
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* Device Selector */}
            <div className="flex flex-col gap-3">
              <Label className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                Camera
              </Label>
              <Select
                value={webcam.selectedDeviceId}
                onValueChange={webcam.setSelectedDeviceId}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select camera" />
                </SelectTrigger>
                <SelectContent>
                  {webcam.devices.map((device) => (
                    <SelectItem key={device.deviceId} value={device.deviceId}>
                      {device.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Aspect Ratio Control */}
            <div className="flex flex-col gap-3">
              <Label className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                Aspect Ratio
              </Label>
              <AspectRatioControl
                value={tuner.config.aspectRatio}
                onChange={tuner.setAspectRatio}
              />
            </div>

            {/* Zoom Control */}
            <ZoomControl value={tuner.config.zoom} onChange={tuner.setZoom} />

            {/* Align Control */}
            <AlignControl
              value={tuner.config.align}
              onChange={tuner.setAlign}
            />

            <PreviewActions
              tuner={tuner}
              webcam={webcam}
              syncStatus={syncStatus}
              setSyncStatus={setSyncStatus}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PreviewSidebar
