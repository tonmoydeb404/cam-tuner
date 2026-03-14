"use client"

import { AlignControl } from "@/components/align-control"
import { AspectRatioControl } from "@/components/aspect-ratio-control"
import { CameraPreview } from "@/components/camera-preview"
import { DeviceSelector } from "@/components/device-selector"
import { ZoomControl } from "@/components/zoom-control"
import { useTuner } from "@/hooks/use-tuner"
import { useWebcam } from "@/hooks/use-webcam"

const PreviewView = () => {
  const webcam = useWebcam()
  const tuner = useTuner(webcam.stream)

  return (
    <div className="min-h-screen bg-black p-4 font-sans text-neutral-200 selection:bg-indigo-500/30 md:p-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row">
        {/* Main Camera Preview Area */}
        <div className="flex flex-1 flex-col gap-4">
          <div className="relative flex min-h-[50vh] flex-1 items-center justify-center overflow-hidden backdrop-blur-xl md:p-8">
            {webcam.error ? (
              <div className="max-w-sm p-6 text-center">
                <div className="mb-4 inline-block rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-500">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-medium text-white">
                  Camera Access Denied
                </h3>
                <p className="text-sm text-neutral-400">
                  Please allow camera permissions in your browser settings to
                  use Cam Tuner.
                </p>
              </div>
            ) : (
              <CameraPreview
                config={tuner.config}
                stream={tuner.outputStream}
              />
            )}
          </div>
        </div>

        {/* Tuner Controls Sidebar */}
        <div className="flex w-full flex-col gap-6 pt-12 md:w-80 md:pt-14">
          <div className="flex flex-col gap-8 rounded-3xl border border-white/5 bg-neutral-900/60 p-6 shadow-xl backdrop-blur-md">
            <DeviceSelector
              devices={webcam.devices}
              selectedDeviceId={webcam.selectedDeviceId}
              onChange={webcam.setSelectedDeviceId}
            />
            <AspectRatioControl
              value={tuner.config.aspectRatio}
              onChange={tuner.setAspectRatio}
            />
            <ZoomControl value={tuner.config.zoom} onChange={tuner.setZoom} />
            <AlignControl
              value={tuner.config.align}
              onChange={tuner.setAlign}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreviewView
