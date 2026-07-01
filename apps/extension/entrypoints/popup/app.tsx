import { IconEye } from "@tabler/icons-react"
import {
  type BackgroundConfig,
  DEFAULT_BACKGROUND_CONFIG,
  DEFAULT_TUNER_CONFIG,
  type TunerConfig,
  type ZoomMode,
} from "@workspace/stream-config"
import { Button } from "@workspace/ui/components/button"
import {
  type BackgroundPreset,
  type BackgroundUpload,
} from "@workspace/ui/components/tuner/background-control"
import { Switch } from "@workspace/ui/components/switch"
import { TunerControlFields } from "@workspace/ui/components/tuner/tuner-control-fields"
import { cn } from "@workspace/ui/lib/utils"
import { useEffect, useState } from "react"
import logo from "../../assets/icon.svg"
import {
  addBackgroundImage,
  type StoredBackgroundImage,
  backgroundImages,
  getTunerConfig,
  removeBackgroundImage,
  setAlign,
  setAspectRatio,
  setBackground,
  setBarColor,
  setCenterStageEnabled,
  setLetterbox,
  setMirror,
  setZoom,
  setZoomMode,
  setAutoZoomMin,
  setAutoZoomMax,
  virtualCamEnabled,
} from "../../lib/storage"

// Bundled background presets. `id` is what the MAIN-world injector resolves;
// `thumb` is the extension URL the popup renders.
const BG_BASE = (browser.runtime.getURL as (p: string) => string)("backgrounds")
const BACKGROUND_PRESETS: BackgroundPreset[] = [
  { id: "preset:gradient-blue.svg", label: "Ocean", thumb: `${BG_BASE}/gradient-blue.svg` },
  { id: "preset:gradient-emerald.svg", label: "Forest", thumb: `${BG_BASE}/gradient-emerald.svg` },
  { id: "preset:gradient-warm.svg", label: "Sunset", thumb: `${BG_BASE}/gradient-warm.svg` },
  { id: "preset:solid-charcoal.svg", label: "Charcoal", thumb: `${BG_BASE}/solid-charcoal.svg` },
  { id: "preset:solid-navy.svg", label: "Navy", thumb: `${BG_BASE}/solid-navy.svg` },
]

export default function App() {
  const [config, setConfig] = useState<TunerConfig>(DEFAULT_TUNER_CONFIG)
  const [enabled, setEnabled] = useState(false)
  const [uploads, setUploads] = useState<StoredBackgroundImage[]>([])

  const refreshUploads = async () => {
    setUploads((await backgroundImages.getValue()) ?? [])
  }

  useEffect(() => {
    const load = async () => {
      const [loaded, isEnabled, storedUploads] = await Promise.all([
        getTunerConfig(),
        virtualCamEnabled.getValue(),
        backgroundImages.getValue(),
      ])
      setConfig(loaded)
      setEnabled(isEnabled)
      setUploads(storedUploads ?? [])
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

  const handleBackgroundChange = async (partial: Partial<BackgroundConfig>) => {
    setConfig((c) => ({
      ...c,
      background: { ...(c.background ?? DEFAULT_BACKGROUND_CONFIG), ...partial },
    }))
    await setBackground(partial)
  }

  const handleBackgroundUpload = async (file: File) => {
    const dataUrl = await readFileAsDataUrl(file)
    const id = await addBackgroundImage(file.name, dataUrl)
    await refreshUploads()
    await handleBackgroundChange({ mode: "image", imageId: id })
  }

  const handleRemoveUpload = async (id: string) => {
    await removeBackgroundImage(id)
    await refreshUploads()
    setConfig((c) =>
      c.background?.imageId === id
        ? { ...c, background: { ...c.background, imageId: null } }
        : c
    )
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
          zoomMode={config.zoomMode ?? "fixed"}
          onZoomModeChange={async (v: ZoomMode) => {
            setConfig((c) => ({ ...c, zoomMode: v }))
            await setZoomMode(v)
          }}
          autoZoomMin={config.autoZoomMin ?? 1}
          onAutoZoomMinChange={async (v) => {
            setConfig((c) => ({ ...c, autoZoomMin: v }))
            await setAutoZoomMin(v)
          }}
          autoZoomMax={config.autoZoomMax ?? 2.5}
          onAutoZoomMaxChange={async (v) => {
            setConfig((c) => ({ ...c, autoZoomMax: v }))
            await setAutoZoomMax(v)
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
          mirror={config.mirror}
          onMirrorChange={async (v) => {
            setConfig((c) => ({ ...c, mirror: v }))
            await setMirror(v)
          }}
          centerStageEnabled={config.centerStageEnabled === true}
          onCenterStageChange={async (v) => {
            setConfig((c) => ({ ...c, centerStageEnabled: v }))
            await setCenterStageEnabled(v)
          }}
          letterbox={config.letterbox ?? true}
          onLetterboxChange={async (v) => {
            setConfig((c) => ({ ...c, letterbox: v }))
            await setLetterbox(v)
          }}
          background={config.background ?? DEFAULT_BACKGROUND_CONFIG}
          onBackgroundChange={handleBackgroundChange}
          backgroundPresets={BACKGROUND_PRESETS}
          backgroundUploads={uploads.map((u) => ({
            id: u.id,
            name: u.name,
            thumb: u.dataUrl,
          }))}
          onBackgroundUpload={handleBackgroundUpload}
          onRemoveBackgroundUpload={handleRemoveUpload}
        />
      </div>

      <Button variant="default" onClick={handlePreview} size={"lg"}>
        <IconEye size={15} />
        Show Preview
      </Button>
    </div>
  )
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
