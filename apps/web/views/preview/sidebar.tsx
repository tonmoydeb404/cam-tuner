"use client"

import { UseTunerReturn } from "@/hooks/use-tuner"
import { UseWebcamReturn } from "@/hooks/use-webcam"
import {
  AlignPosition,
  ASPECT_RATIO_OPTIONS,
  AspectRatio,
} from "@/lib/tuner-types"
import {
  ArrowAllDirectionIcon,
  ArrowDown01Icon,
  ArrowDownLeft01Icon,
  ArrowDownRight01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  ArrowUpLeft01Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Slider } from "@workspace/ui/components/slider"
import PreviewActions from "./actions"

type Props = {
  webcam: UseWebcamReturn
  tuner: UseTunerReturn
}

const ALIGN_OPTIONS: AlignPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "center-left",
  "center",
  "center-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
]

const ALIGN_ICONS: Record<AlignPosition, typeof ArrowUpLeft01Icon> = {
  "top-left": ArrowUpLeft01Icon,
  "top-center": ArrowUp01Icon,
  "top-right": ArrowUpRight01Icon,
  "center-left": ArrowLeft01Icon,
  center: ArrowAllDirectionIcon,
  "center-right": ArrowRight01Icon,
  "bottom-left": ArrowDownLeft01Icon,
  "bottom-center": ArrowDown01Icon,
  "bottom-right": ArrowDownRight01Icon,
}

const PreviewSidebar = (props: Props) => {
  const { webcam, tuner } = props

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
              <div className="grid grid-cols-2 gap-2">
                {ASPECT_RATIO_OPTIONS.map((ratio) => (
                  <Button
                    key={ratio}
                    variant={
                      tuner.config.aspectRatio === ratio ? "default" : "outline"
                    }
                    onClick={() => tuner.setAspectRatio(ratio as AspectRatio)}
                  >
                    {ratio}
                  </Button>
                ))}
              </div>
            </div>

            {/* Zoom Control */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                  Zoom
                </Label>
                <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary">
                  {tuner.config.zoom.toFixed(1)}x
                </span>
              </div>
              <Slider
                min={1}
                max={3}
                step={0.1}
                value={[tuner.config.zoom]}
                onValueChange={(values) => tuner.setZoom(values[0] ?? 1)}
                className="w-full [&_[data-slot=slider-track]]:bg-gray-300 dark:[&_[data-slot=slider-track]]:bg-muted"
              />
              <div className="flex items-center justify-between text-[10px] font-medium text-neutral-600">
                <button onClick={() => tuner.setZoom(1)}>1x</button>
                <button onClick={() => tuner.setZoom(2)}>2x</button>
                <button onClick={() => tuner.setZoom(3)}>3x</button>
              </div>
            </div>

            {/* Align Control */}
            <div className="flex flex-col gap-3">
              <Label className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                Align
              </Label>
              <div className="grid w-full grid-cols-3 gap-2">
                {ALIGN_OPTIONS.map((pos) => {
                  const isSelected = tuner.config.align === pos
                  return (
                    <Button
                      key={pos}
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => tuner.setAlign(pos)}
                      aria-label={`Align ${pos}`}
                    >
                      <HugeiconsIcon
                        icon={ALIGN_ICONS[pos]}
                        strokeWidth={2}
                        className="size-4"
                      />
                    </Button>
                  )
                })}
              </div>
            </div>
            <PreviewActions tuner={tuner} webcam={webcam} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PreviewSidebar
