import { processUploadedImage } from "@workspace/stream-config"
import { DEFAULT_TUNER_CONFIG, type TunerConfig } from "@workspace/stream-config"
import { Button } from "@workspace/ui/components/button"
import { Switch } from "@workspace/ui/components/switch"
import { PluginPanel } from "@workspace/ui/components/tuner/plugin-panel"
import { cn } from "@workspace/ui/lib/utils"
import { useEffect, useState } from "react"
import { IconEye } from "@tabler/icons-react"
import logo from "../../assets/icon.svg"
import {
  addBackgroundImage,
  backgroundImages,
  type StoredBackgroundImage,
  getTunerConfig,
  removeBackgroundImage,
  setTunerConfig,
  tunerConfig,
  virtualCamEnabled,
} from "../../lib/storage"

export default function App() {
  const [config, setConfig] = useState<TunerConfig>(DEFAULT_TUNER_CONFIG)
  const [enabled, setEnabled] = useState(false)
  const [uploads, setUploads] = useState<StoredBackgroundImage[]>([])

  useEffect(() => {
    const load = async () => {
      const [loaded, isEnabled, stored] = await Promise.all([
        getTunerConfig(),
        virtualCamEnabled.getValue(),
        backgroundImages.getValue(),
      ])
      setConfig(loaded)
      setEnabled(isEnabled)
      setUploads(stored)
    }
    load()

    const unwatchConfig = tunerConfig.watch((val) => setConfig(val))
    const unwatchEnabled = virtualCamEnabled.watch((val) => setEnabled(val))
    const unwatchUploads = backgroundImages.watch((val) => setUploads(val))
    return () => {
      unwatchConfig()
      unwatchEnabled()
      unwatchUploads()
    }
  }, [])

  const handleToggle = async (value: boolean) => {
    setEnabled(value)
    await virtualCamEnabled.setValue(value)
  }

  const handleConfigChange = async (update: Partial<TunerConfig>) => {
    setConfig((c) => ({ ...c, ...update }))
    await setTunerConfig(update)
  }

  const handleUpload = async (file: File) => {
    const processed = await processUploadedImage(file)
    await addBackgroundImage(processed.name, processed.dataUrl, processed.id)
    await setTunerConfig({ backgroundImage: processed.id })
    setConfig((c) => ({ ...c, backgroundImage: processed.id }))
  }

  const handleRemoveUpload = async (id: string) => {
    await removeBackgroundImage(id)
    if (config.backgroundImage === id) {
      await setTunerConfig({ backgroundImage: null })
      setConfig((c) => ({ ...c, backgroundImage: null }))
    }
  }

  const handlePreview = async () => {
    const webUrl = import.meta.env.VITE_WEB_URL
    await browser.tabs.create({ url: `${webUrl}/preview` })
  }

  return (
    <div className="flex w-[320px] flex-col gap-2.5 bg-background p-3 text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="CamTuner Logo"
            width={25}
            height={25}
            className={cn(enabled ? "" : "grayscale")}
          />
          <h1 className="text-sm font-semibold">CamTuner</h1>
        </div>
        <div className="flex items-center gap-1.5">
          <Switch checked={enabled} onCheckedChange={handleToggle} />
        </div>
      </div>

      <div className="mb-2 h-px bg-border" />

      <div
        className={cn(
          "mb-2 space-y-4",
          !enabled && "pointer-events-none opacity-50"
        )}
      >
        <PluginPanel
          config={config}
          onConfigChange={handleConfigChange}
          extraProps={{
            "core:background-filter": {
              uploads: uploads.map((u) => ({
                id: u.id,
                name: u.name,
                thumb: u.dataUrl,
              })),
              onUpload: handleUpload,
              onRemoveUpload: handleRemoveUpload,
            },
          }}
        />
      </div>

      <Button variant="default" onClick={handlePreview} size={"lg"}>
        <IconEye size={15} />
        Show Preview
      </Button>
    </div>
  )
}
