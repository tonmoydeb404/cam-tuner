"use client"

import { UseTunerReturn } from "@/hooks/use-tuner"
import { UseWebcamReturn } from "@/hooks/use-webcam"
import { removeBgImage, storeBgImage } from "@/lib/extension-bridge"
import { processUploadedImage } from "@workspace/stream-config"
import { Card, CardFooter, CardHeader } from "@workspace/ui/components/card"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { CameraSourceSelect } from "@workspace/ui/components/tuner/camera-source-select"
import { PluginPanel } from "@workspace/ui/components/tuner/plugin-panel"
import { useEffect, useState } from "react"
import PreviewActions from "./actions"

type Props = {
  webcam: UseWebcamReturn
  tuner: UseTunerReturn
}

type UploadEntry = { id: string; name: string; thumb: string }

const PreviewSidebar = ({ webcam, tuner }: Props) => {
  const [uploads, setUploads] = useState<UploadEntry[]>([])

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "camtuner:store-bg-result" && event.data.id) {
        setUploads((prev) =>
          prev.some((u) => u.id === event.data.id)
            ? prev
            : [
                ...prev,
                {
                  id: event.data.id,
                  name: "Upload",
                  thumb: "",
                },
              ]
        )
      }
    }
    window.addEventListener("message", handler)
    return () => window.removeEventListener("message", handler)
  }, [])

  const handleUpload = async (file: File) => {
    const processed = await processUploadedImage(file)
    setUploads((prev) => [
      ...prev,
      { id: processed.id, name: processed.name, thumb: processed.dataUrl },
    ])
    const storedId = await storeBgImage(
      processed.name,
      processed.dataUrl,
      processed.id
    )
    const finalId = storedId ?? processed.id
    tuner.updateConfig({ backgroundImage: finalId })
  }

  const handleRemoveUpload = async (id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id))
    await removeBgImage(id)
    if (tuner.config.backgroundImage === id) {
      tuner.updateConfig({ backgroundImage: null })
    }
  }

  return (
    <div className="flex w-full flex-col gap-6 md:w-80">
      <Card className="bg-muted dark:bg-card">
        <CardHeader>
          <CameraSourceSelect
            devices={webcam.devices}
            selectedDeviceId={webcam.selectedDeviceId}
            onDeviceChange={webcam.setSelectedDeviceId}
          />
        </CardHeader>

        <ScrollArea className="max-h-125 px-6">
          <div className="flex flex-col gap-6">
            <PluginPanel
              config={tuner.config}
              onConfigChange={tuner.updateConfig}
              extraProps={{
                "core:background-filter": {
                  uploads,
                  onUpload: handleUpload,
                  onRemoveUpload: handleRemoveUpload,
                },
              }}
            />
          </div>
        </ScrollArea>

        <CardFooter className="flex-col items-stretch">
          <PreviewActions webcam={webcam} tuner={tuner} />
        </CardFooter>
      </Card>
    </div>
  )
}

export default PreviewSidebar
