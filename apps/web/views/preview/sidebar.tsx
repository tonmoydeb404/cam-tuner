"use client"

import { UseTunerReturn } from "@/hooks/use-tuner"
import { UseWebcamReturn } from "@/hooks/use-webcam"
import { Card, CardContent } from "@workspace/ui/components/card"
import { CameraSourceSelect } from "@workspace/ui/components/tuner/camera-source-select"
import { TunerControlFields } from "@workspace/ui/components/tuner/tuner-control-fields"
import PreviewActions from "./actions"

type Props = {
  webcam: UseWebcamReturn
  tuner: UseTunerReturn
}

const PreviewSidebar = ({ webcam, tuner }: Props) => {
  return (
    <div className="flex w-full flex-col gap-6 md:w-80">
      <Card className="bg-muted dark:bg-card">
        <CardContent>
          <div className="flex flex-col gap-6">
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
              centerStageEnabled={tuner.config.centerStageEnabled === true}
              onCenterStageChange={tuner.setCenterStageEnabled}
              background={tuner.config.background ?? { mode: "none", blurAmount: 14, imageId: null, quality: "auto" }}
              onBackgroundChange={tuner.setBackground}
              backgroundPresets={tuner.backgroundPresets}
              backgroundUploads={tuner.backgroundUploads}
              onBackgroundUpload={tuner.onBackgroundUpload}
              onRemoveBackgroundUpload={tuner.onRemoveBackgroundUpload}
            />

            <PreviewActions webcam={webcam} tuner={tuner} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PreviewSidebar
