"use client"

import { UseTunerReturn } from "@/hooks/use-tuner"
import { UseWebcamReturn } from "@/hooks/use-webcam"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { AlignControl } from "@workspace/ui/components/tuner/align-control"
import { AspectRatioControl } from "@workspace/ui/components/tuner/aspect-ratio-control"
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
                onValueChange={(v) => v && webcam.setSelectedDeviceId(v)}
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

            {/* Bar Color */}
            <div className="flex flex-col gap-3">
              <Label className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                Bar Color
              </Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={tuner.config.barColor || "#000000"}
                  onChange={(e) => tuner.setBarColor(e.target.value)}
                  className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                />
                <span className="text-xs text-muted-foreground">
                  {tuner.config.barColor || "#000000"}
                </span>
              </div>
            </div>

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
