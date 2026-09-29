import {
  ALIGN_PLUGIN_ID,
  CROP_PLUGIN_ID,
  FLIP_VERTICAL_PLUGIN_ID,
  MIRROR_PLUGIN_ID,
  ZOOM_PLUGIN_ID,
  type TunerConfig,
} from "@workspace/stream-config"
import { PluginPanel } from "@workspace/ui/components/tuner/plugin-panel"
import { Switch } from "@workspace/ui/components/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Camera, CameraOff, Loader2 } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { ScreenHeader } from "@/components/screen-header"
import { api, onPipelineStats, type PipelineStats } from "@/lib/api"

// The crop family — background effects and Center Stage land later.
const STUDIO_PLUGIN_IDS = [
  CROP_PLUGIN_ID,
  ZOOM_PLUGIN_ID,
  ALIGN_PLUGIN_ID,
  MIRROR_PLUGIN_ID,
  FLIP_VERTICAL_PLUGIN_ID,
]

const CONFIG_SAVE_DEBOUNCE_MS = 300

export function StudioScreen() {
  const [cameras, setCameras] = useState<
    Awaited<ReturnType<typeof api.listCameras>>
  >([])
  const [selectedCamera, setSelectedCamera] = useState<string>("")
  const [enabled, setEnabled] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [starting, setStarting] = useState(false)
  const [stats, setStats] = useState<PipelineStats | null>(null)
  const [config, setConfig] = useState<TunerConfig | null>(null)

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingConfig = useRef<TunerConfig | null>(null)

  useEffect(() => {
    let disposed = false

    async function boot() {
      const [cameraList, tunerConfig] = await Promise.all([
        api.listCameras(),
        api.getTunerConfig(),
      ])
      if (disposed) return
      setCameras(cameraList)
      setSelectedCamera(cameraList[0]?.id ?? "")
      setConfig(tunerConfig)
    }

    boot().catch((err) =>
      toast.error("Failed to load studio", { description: String(err) })
    )

    const unlistenStats = onPipelineStats(setStats)

    return () => {
      disposed = true
      unlistenStats.then((unlisten) => unlisten())
    }
  }, [])

  // Stop the pipeline when leaving the screen (the app keeps running in the
  // tray; preview is a per-screen session).
  useEffect(() => {
    return () => {
      api.stopPreview().catch(() => {})
    }
  }, [])

  const startPreview = useCallback(async (deviceId: string) => {
    setStarting(true)
    try {
      const url = await api.startPreview(deviceId || null)
      setPreviewUrl(url)
      setEnabled(true)
    } catch (err) {
      setEnabled(false)
      setPreviewUrl(null)
      toast.error("Could not start the camera", { description: String(err) })
    } finally {
      setStarting(false)
    }
  }, [])

  const stopPreview = useCallback(async () => {
    setEnabled(false)
    setPreviewUrl(null)
    setStats(null)
    await api
      .stopPreview()
      .catch((err) =>
        toast.error("Failed to stop preview", { description: String(err) })
      )
  }, [])

  const handleToggle = useCallback(
    async (next: boolean) => {
      if (next) {
        await startPreview(selectedCamera)
      } else {
        await stopPreview()
      }
    },
    [selectedCamera, startPreview, stopPreview]
  )

  const handleCameraChange = useCallback(
    async (deviceId: string | null) => {
      if (!deviceId) return
      setSelectedCamera(deviceId)
      if (enabled) {
        // Restart the pipeline on the newly selected device.
        await api.stopPreview().catch(() => {})
        setPreviewUrl(null)
        await startPreview(deviceId)
      }
    },
    [enabled, startPreview]
  )

  const handleConfigChange = useCallback((update: Partial<TunerConfig>) => {
    setConfig((current) => {
      if (!current) return current
      const next = { ...current, ...update }
      pendingConfig.current = next
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        const toSave = pendingConfig.current
        pendingConfig.current = null
        if (toSave) {
          api
            .setTunerConfig(toSave)
            .catch((err) =>
              toast.error("Failed to save settings", {
                description: String(err),
              })
            )
        }
      }, CONFIG_SAVE_DEBOUNCE_MS)
      return next
    })
  }, [])

  const aspectRatio =
    stats && stats.width > 0 ? stats.width / stats.height : 16 / 9

  return (
    <section className="scrollbar-thin min-h-0 flex-1 overflow-auto p-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-4">
        <ScreenHeader
          title="Studio"
          actions={
            <div className="flex items-center gap-3">
              {stats && enabled && (
                <span className="text-faint font-mono text-[10px] tabular-nums">
                  {stats.width}×{stats.height} · {stats.fps.toFixed(0)} fps
                </span>
              )}
              <Switch
                checked={enabled}
                onCheckedChange={handleToggle}
                disabled={starting || cameras.length === 0}
                aria-label="Toggle camera preview"
              />
            </div>
          }
        />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Preview */}
          <div className="flex min-w-0 flex-col gap-3">
            <div
              className="relative w-full overflow-hidden rounded-xl border border-border bg-black"
              style={{ aspectRatio: String(aspectRatio) }}
            >
              {previewUrl && enabled ? (
                <img
                  src={previewUrl}
                  alt="Camera preview"
                  className="h-full w-full object-contain"
                  // MJPEG streams never "finish"; suppress broken-image UX.
                  onError={() => {}}
                />
              ) : (
                <div className="absolute inset-0 grid place-content-center justify-items-center gap-2 text-center">
                  {starting ? (
                    <>
                      <Loader2
                        className="animate-spin text-muted-foreground"
                        size={20}
                      />
                      <span className="text-xs text-muted-foreground">
                        Starting camera…
                      </span>
                    </>
                  ) : (
                    <>
                      {cameras.length === 0 ? (
                        <CameraOff className="text-faint" size={20} />
                      ) : (
                        <Camera className="text-faint" size={20} />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {cameras.length === 0
                          ? "No cameras found"
                          : "Preview is off"}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="w-16 shrink-0 font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                Camera
              </span>
              <Select
                value={selectedCamera}
                onValueChange={handleCameraChange}
                disabled={cameras.length === 0}
              >
                <SelectTrigger size="sm" className="flex-1">
                  <SelectValue placeholder="Select a camera" />
                </SelectTrigger>
                <SelectContent>
                  {cameras.map((camera) => (
                    <SelectItem key={camera.id} value={camera.id}>
                      {camera.label}
                      {camera.isVirtual ? " (test)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Controls */}
          <div className="min-w-0">
            <div className="scrollbar-thin bg-surface flex max-h-[70vh] flex-col gap-6 overflow-y-auto rounded-xl border border-border p-4">
              {config ? (
                <PluginPanel
                  config={config}
                  onConfigChange={handleConfigChange}
                  pluginIds={STUDIO_PLUGIN_IDS}
                />
              ) : (
                <span className="text-xs text-muted-foreground">
                  Loading settings…
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
