import { IconEye, IconRefresh, IconWorld } from "@tabler/icons-react"
import {
  DEFAULT_TUNER_CONFIG,
  processUploadedImage,
  type TunerConfig,
} from "@workspace/stream-config"
import { Button } from "@workspace/ui/components/button"
import { Switch } from "@workspace/ui/components/switch"
import { PluginPanel } from "@workspace/ui/components/tuner/plugin-panel"
import { cn } from "@workspace/ui/lib/utils"
import { useEffect, useState } from "react"
import logo from "../../assets/icon.svg"
import {
  addBackgroundImage,
  backgroundImages,
  customizeSite,
  getSiteSettings,
  getTunerConfig,
  removeBackgroundImage,
  resetSite,
  selectedCameraLabel,
  setSiteEnabledMode,
  setSiteTunerConfig,
  setTunerConfig,
  siteSettings,
  tunerConfig,
  virtualCamEnabled,
  type SiteSetting,
  type StoredBackgroundImage,
} from "../../lib/storage"

type Scope = "global" | "site"

type StreamInfo = {
  tuned?: boolean
  reason?: "disabled" | "camera"
  warning?: "tracking" | "background"
}

type ActiveTab = { tabId: number; origin: string } | null

async function getActiveTab(): Promise<ActiveTab> {
  try {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    })
    if (!tab?.url || typeof tab.id !== "number") return null
    const url = new URL(tab.url)
    if (url.protocol !== "https:" && url.protocol !== "http:") return null
    return { tabId: tab.id, origin: url.origin }
  } catch {
    return null
  }
}

function hostnameOf(origin: string): string {
  try {
    return new URL(origin).hostname
  } catch {
    return origin
  }
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <div className="grid auto-cols-fr grid-flow-col gap-1 rounded-md bg-muted p-1">
      {options.map((opt) => (
        <Button
          key={opt.value}
          type="button"
          size="xs"
          variant={value === opt.value ? "default" : "ghost"}
          className={cn(value === opt.value && "shadow-sm")}
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  )
}

export default function App() {
  const [config, setConfig] = useState<TunerConfig>(DEFAULT_TUNER_CONFIG)
  const [enabled, setEnabled] = useState(false)
  const [uploads, setUploads] = useState<StoredBackgroundImage[]>([])
  const [sites, setSites] = useState<Record<string, SiteSetting>>({})
  const [activeTab, setActiveTab] = useState<ActiveTab>(null)
  const [streamInfo, setStreamInfo] = useState<StreamInfo | null>(null)
  const [cameraLabel, setCameraLabel] = useState<string | null>(null)
  const [scope, setScope] = useState<Scope>("global")

  const siteOrigin = activeTab?.origin ?? null

  useEffect(() => {
    const load = async () => {
      const [loaded, isEnabled, stored, siteMap, selectedCamera] =
        await Promise.all([
          getTunerConfig(),
          virtualCamEnabled.getValue(),
          backgroundImages.getValue(),
          getSiteSettings(),
          selectedCameraLabel.getValue(),
        ])
      setConfig(loaded)
      setEnabled(isEnabled)
      setUploads(stored)
      setSites(siteMap)
      setCameraLabel(selectedCamera)

      const tab = await getActiveTab()
      setActiveTab(tab)
      if (tab) {
        try {
          const res = (await browser.runtime.sendMessage({
            type: "camtuner:get-stream-state",
            tabId: tab.tabId,
          })) as { state?: StreamInfo | null } | undefined
          setStreamInfo(res?.state ?? null)
        } catch {
          setStreamInfo(null)
        }
      } else {
        setStreamInfo(null)
      }
      if (tab?.origin && siteMap[tab.origin]) setScope("site")
    }
    load()

    const unwatchConfig = tunerConfig.watch((val) => setConfig(val))
    const unwatchEnabled = virtualCamEnabled.watch((val) => setEnabled(val))
    const unwatchUploads = backgroundImages.watch((val) => setUploads(val))
    const unwatchSites = siteSettings.watch((val) => setSites(val ?? {}))
    const unwatchCamera = selectedCameraLabel.watch((val) =>
      setCameraLabel(val)
    )
    return () => {
      unwatchConfig()
      unwatchEnabled()
      unwatchUploads()
      unwatchSites()
      unwatchCamera()
    }
  }, [])

  const site = siteOrigin ? (sites[siteOrigin] ?? null) : null
  const editingSite = scope === "site" ? site : null
  const activeConfig = editingSite ? editingSite.config : config
  const effectiveEnabled = editingSite
    ? editingSite.enabled !== "off" && enabled
    : enabled

  const handleToggle = async (value: boolean) => {
    // In "This site" scope the switch controls the per-site mode:
    // off = force off for this site, on = follow the global switch again.
    if (scope === "site" && siteOrigin) {
      const entry = sites[siteOrigin]
      if (!value) {
        if (!entry) await customizeSite(siteOrigin)
        await setSiteEnabledMode(siteOrigin, "off")
        return
      }
      if (!entry) return
      await setSiteEnabledMode(siteOrigin, "default")
      // If the site's snapshot never diverged from global, drop the entry so
      // it keeps following global config changes too.
      const globalConfig = await getTunerConfig()
      if (JSON.stringify(entry.config) === JSON.stringify(globalConfig)) {
        await resetSite(siteOrigin)
        setScope("global")
      }
      return
    }
    setEnabled(value)
    await virtualCamEnabled.setValue(value)
  }

  const handleConfigChange = async (update: Partial<TunerConfig>) => {
    if (editingSite && siteOrigin) {
      await setSiteTunerConfig(siteOrigin, update)
      return
    }
    setConfig((c) => ({ ...c, ...update }))
    await setTunerConfig(update)
  }

  const handleScopeChange = async (next: Scope) => {
    if (next === scope) return
    if (next === "site" && siteOrigin && !sites[siteOrigin]) {
      await customizeSite(siteOrigin)
    }
    setScope(next)
  }

  const handleResetSite = async (origin: string) => {
    await resetSite(origin)
    if (origin === siteOrigin) setScope("global")
  }

  const handleUpload = async (file: File) => {
    const processed = await processUploadedImage(file)
    await addBackgroundImage(processed.name, processed.dataUrl, processed.id)
    await handleConfigChange({ backgroundImage: processed.id })
  }

  const handleRemoveUpload = async (id: string) => {
    await removeBackgroundImage(id)
    if (activeConfig.backgroundImage === id) {
      await handleConfigChange({ backgroundImage: null })
    }
  }

  const handleClearCamera = async () => {
    await selectedCameraLabel.setValue(null)
  }

  const handlePreview = async () => {
    const webUrl = import.meta.env.VITE_WEB_URL
    if (!webUrl) return
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
            className={cn(effectiveEnabled ? "" : "grayscale")}
          />
          <h1 className="text-sm font-semibold">CamTuner</h1>
        </div>
        <label className="flex items-center gap-1.5">
          <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            {scope === "site" ? "This site" : "All sites"}
          </span>
          <Switch
            checked={effectiveEnabled}
            onCheckedChange={handleToggle}
            aria-label={
              scope === "site"
                ? "Enable CamTuner on this site"
                : "Enable CamTuner on all sites"
            }
          />
        </label>
      </div>

      <div className="mb-2 h-px bg-border" />

      {!siteOrigin && (
        <p className="text-xs text-muted-foreground">
          CamTuner isn&rsquo;t active on this page — editing global settings.
        </p>
      )}

      {siteOrigin && streamInfo?.tuned === false && effectiveEnabled && (
        <p className="mb-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-1.5 text-[11px] leading-snug text-amber-700 dark:text-amber-400">
          {streamInfo.reason === "camera"
            ? cameraLabel
              ? `Only “${cameraLabel}” is being tuned (picked in the web preview), but this page is using a different camera. Switch cameras, or Clear the selection above.`
              : "This page's camera doesn't match the camera selected in the web preview. Switch cameras, or clear the camera selection."
            : `CamTuner was off when this page opened its camera. Toggle the camera off and on in ${hostnameOf(siteOrigin)} — or reload the page — to apply your settings.`}
        </p>
      )}

      {siteOrigin && streamInfo?.warning && effectiveEnabled && (
        <p className="mb-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-1.5 text-[11px] leading-snug text-amber-700 dark:text-amber-400">
          {streamInfo.warning === "background"
            ? "Background effects failed to load on this page. Check your connection and reload."
            : "Center Stage / auto-zoom failed to load on this page. Check your connection and reload."}
        </p>
      )}

      {siteOrigin && (
        <div className="mb-2 space-y-2 rounded-md border bg-muted/40 p-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1.5">
              <IconWorld size={14} className="shrink-0 text-muted-foreground" />
              <span className="truncate text-xs font-medium">
                {hostnameOf(siteOrigin)}
              </span>
              <span
                className={cn(
                  "flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                  effectiveEnabled
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-500/15 text-red-600 dark:text-red-400"
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    effectiveEnabled ? "bg-emerald-500" : "bg-red-400"
                  )}
                />
                {effectiveEnabled ? "On" : "Off"}
              </span>
              {site && (
                <span className="shrink-0 rounded bg-primary/10 px-1 py-0.5 text-[10px] font-medium text-primary">
                  Customized
                </span>
              )}
            </div>
            {site && (
              <Button
                variant="ghost"
                size="xs"
                title="Remove this site's custom settings and follow global again"
                onClick={() => handleResetSite(siteOrigin)}
              >
                <IconRefresh size={12} />
                Reset
              </Button>
            )}
          </div>

          <Segmented<Scope>
            value={scope}
            onChange={handleScopeChange}
            options={[
              { value: "site", label: "This site" },
              { value: "global", label: "Global" },
            ]}
          />

          {editingSite && (
            <p className="text-[10px] leading-snug text-muted-foreground">
              {editingSite.enabled === "off"
                ? "Camera is off for this site — turn the switch above on to follow global settings."
                : `Following the global switch (currently ${enabled ? "on" : "off"}) · edits below apply to this site only`}
            </p>
          )}

          {!editingSite && site && (
            <p className="text-[10px] leading-snug text-muted-foreground">
              This site still uses its own customized settings — switch to
              &ldquo;This site&rdquo; to edit them.
            </p>
          )}
        </div>
      )}

      {cameraLabel && (
        <div className="mb-2 flex items-center justify-between gap-2 rounded-md border px-2 py-1.5">
          <div className="min-w-0">
            <div className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
              Camera
            </div>
            <div className="truncate text-xs font-medium">{cameraLabel}</div>
          </div>
          <Button
            variant="ghost"
            size="xs"
            title="Tune every camera again (this was set in the web preview)"
            onClick={handleClearCamera}
          >
            Clear
          </Button>
        </div>
      )}

      <div
        className={cn(
          "mb-2 space-y-4",
          !effectiveEnabled && "pointer-events-none opacity-50"
        )}
      >
        <PluginPanel
          config={activeConfig}
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
