"use client"

import type { UseTunerReturn } from "@/hooks/use-tuner"
import type { UseWebcamReturn } from "@/hooks/use-webcam"
import { CameraSourceSelect } from "@workspace/ui/components/tuner/camera-source-select"
import { TunerControlFields } from "@workspace/ui/components/tuner/tuner-control-fields"

interface DemoControlFieldsProps {
  tuner: UseTunerReturn
  webcam: Pick<
    UseWebcamReturn,
    "devices" | "selectedDeviceId" | "setSelectedDeviceId"
  >
}

export const DemoControlFields = ({
  tuner,
  webcam,
}: DemoControlFieldsProps) => (
  <div className="flex flex-col gap-6 px-4 py-4">
    <CameraSourceSelect
      devices={webcam.devices}
      selectedDeviceId={webcam.selectedDeviceId}
      onDeviceChange={webcam.setSelectedDeviceId}
    />
    <TunerControlFields
      aspectRatio={tuner.config.aspectRatio}
      onAspectRatioChange={tuner.setAspectRatio}
      zoom={tuner.config.zoom}
      onZoomChange={tuner.setZoom}
      zoomMode={tuner.config.zoomMode ?? "fixed"}
      onZoomModeChange={tuner.setZoomMode}
      autoZoomMin={tuner.config.autoZoomMin ?? 1}
      onAutoZoomMinChange={tuner.setAutoZoomMin}
      autoZoomMax={tuner.config.autoZoomMax ?? 2.5}
      onAutoZoomMaxChange={tuner.setAutoZoomMax}
      align={tuner.config.align}
      onAlignChange={tuner.setAlign}
      barColor={tuner.config.barColor ?? "#000000"}
      onBarColorChange={tuner.setBarColor}
      mirror={tuner.config.mirror}
      onMirrorChange={tuner.setMirror}
      letterbox={tuner.config.letterbox ?? true}
      onLetterboxChange={tuner.setLetterbox}
    />
  </div>
)
