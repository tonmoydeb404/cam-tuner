import { IconEye } from "@tabler/icons-react"
import {
  DEFAULT_TUNER_CONFIG,
  type TunerConfig,
} from "@workspace/stream-config"
import { Button } from "@workspace/ui/components/button"
import { Switch } from "@workspace/ui/components/switch"
import { TunerControlFields } from "@workspace/ui/components/tuner/tuner-control-fields"
import { cn } from "@workspace/ui/lib/utils"
import { useEffect, useState } from "react"
import logo from "../../assets/icon.svg"
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
          "mb-2 space-y-5",
          !enabled && "pointer-events-none opacity-50"
        )}
      >
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

      <Button variant="default" onClick={handlePreview} size={"lg"}>
        <IconEye size={15} />
        Show Preview
      </Button>
    </div>
  )
}
