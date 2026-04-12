import { IconEye, IconVideo, IconVideoOff } from "@tabler/icons-react"
import {
  DEFAULT_TUNER_CONFIG,
  type TunerConfig,
} from "@workspace/stream-config"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Switch } from "@workspace/ui/components/switch"
import { TunerControlFields } from "@workspace/ui/components/tuner/tuner-control-fields"
import { useEffect, useState } from "react"
import {
  getTunerConfig,
  setAlign,
  setAspectRatio,
  setBarColor,
  setZoom,
  virtualCamEnabled,
} from "../../lib/storage"

export default function App() {
  const [config, setConfig] = useState<TunerConfig>(DEFAULT_TUNER_CONFIG)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const load = async () => {
      const [loaded, isEnabled] = await Promise.all([
        getTunerConfig(),
        virtualCamEnabled.getValue(),
      ])
      setConfig(loaded)
      setEnabled(isEnabled)
    }
    load()
  }, [])

  const handleToggle = async (value: boolean) => {
    setEnabled(value)
    await virtualCamEnabled.setValue(value)
  }

  const handlePreview = async () => {
    const webUrl = import.meta.env.VITE_WEB_URL
    await browser.tabs.create({ url: `${webUrl}/preview` })
  }

  return (
    <div className="flex w-[400px] flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <h1 className="text-lg font-semibold">CamTuner</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handlePreview}
            className="text-primary"
          >
            <IconEye size={18} />
          </Button>
        </div>
      </div>

      {/* Enable Toggle */}
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div className="flex items-center gap-3">
          {enabled ? (
            <IconVideo size={20} className={"text-primary"} />
          ) : (
            <IconVideoOff size={20} className={"text-muted-foreground"} />
          )}
          <div>
            <p className="text-sm font-medium">Camera Tuning</p>
            <p className="text-xs text-muted-foreground">
              {enabled ? "Active" : "Disabled"}
            </p>
          </div>
        </div>
        <Switch checked={enabled} onCheckedChange={handleToggle} />
      </div>

      <Card
        className={`bg-muted dark:bg-card transition-opacity${!enabled ? "pointer-events-none opacity-50" : ""}`}
      >
        <CardContent>
          <div className="flex flex-col gap-6">
            <TunerControlFields
              aspectRatio={config.aspectRatio}
              onAspectRatioChange={async (v) => {
                setConfig((c) => ({ ...c, aspectRatio: v }))
                await setAspectRatio(v)
              }}
              zoom={config.zoom}
              onZoomChange={async (v) => {
                setConfig((c) => ({ ...c, zoom: v }))
                await setZoom(v)
              }}
              align={config.align}
              onAlignChange={async (v) => {
                setConfig((c) => ({ ...c, align: v }))
                await setAlign(v)
              }}
              barColor={config.barColor}
              onBarColorChange={async (v) => {
                setConfig((c) => ({ ...c, barColor: v }))
                await setBarColor(v)
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
