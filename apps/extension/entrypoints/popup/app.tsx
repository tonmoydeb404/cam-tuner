import { IconEye } from "@tabler/icons-react"
import {
  DEFAULT_TUNER_CONFIG,
  processUploadedImage,
  type TunerConfig,
} from "@workspace/stream-config"
import { Button } from "@workspace/ui/components/button"
import { PluginPanel } from "@workspace/ui/components/tuner/plugin-panel"
import { cn } from "@workspace/ui/lib/utils"
import { useEffect, useState } from "react"
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
import { CameraCard } from "./components/camera-card"
import { Header } from "./components/header"
import { getGuides, HelpButton, HelpDrawer } from "./components/help-guides"
import {
  getActiveTab,
  type ActiveTab,
  type Scope,
  type StreamInfo,
} from "./utils"

export default function App() {
  const [config, setConfig] = useState<TunerConfig>(DEFAULT_TUNER_CONFIG)
  const [enabled, setEnabled] = useState(false)
  const [uploads, setUploads] = useState<StoredBackgroundImage[]>([])
  const [sites, setSites] = useState<Record<string, SiteSetting>>({})
  const [activeTab, setActiveTab] = useState<ActiveTab>(null)
  const [streamInfo, setStreamInfo] = useState<StreamInfo | null>(null)
  const [cameraLabel, setCameraLabel] = useState<string | null>(null)
  const [scope, setScope] = useState<Scope>("global")
  const [helpOpen, setHelpOpen] = useState(false)
  const [pinnedGuideId, setPinnedGuideId] = useState<string | null>(null)

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

  const guides = getGuides({
    siteOrigin,
    streamInfo,
    cameraLabel,
    effectiveEnabled,
  })

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

  const handleScopeChange = async (next: Scope) => {
    if (next === scope) return
    if (next === "site" && siteOrigin && !sites[siteOrigin]) {
      await customizeSite(siteOrigin)
    }
    setScope(next)
  }

  const handleResetSite = async (origin: string) => {
    // On the current site, stay on the "This site" tab: re-snapshot the
    // global settings instead of dropping the entry.
    if (origin === siteOrigin && scope === "site") {
      await customizeSite(origin)
      return
    }
    await resetSite(origin)
    if (origin === siteOrigin) setScope("global")
  }

  const handleConfigChange = async (update: Partial<TunerConfig>) => {
    if (editingSite && siteOrigin) {
      await setSiteTunerConfig(siteOrigin, update)
      return
    }
    setConfig((c) => ({ ...c, ...update }))
    await setTunerConfig(update)
  }

  const handleClearCamera = async () => {
    await selectedCameraLabel.setValue(null)
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

  const handlePreview = async () => {
    const webUrl = import.meta.env.VITE_WEB_URL
    if (!webUrl) return
    // In site scope, open the preview pre-scoped to this site so edits there
    // update the site's settings. Bare domain for https; full origin for
    // http (e.g. localhost dev) so the scheme round-trips.
    let siteParam: string | null = null
    if (scope === "site" && siteOrigin) {
      const url = new URL(siteOrigin)
      siteParam = url.protocol === "https:" ? url.host : siteOrigin
    }
    const query = siteParam ? `?site=${encodeURIComponent(siteParam)}` : ""
    await browser.tabs.create({ url: `${webUrl}/preview${query}` })
  }

  return (
    // Chrome caps popups at 600px tall — beyond that, only the body scrolls
    // while the header and footer float above/below it.
    <div className="flex max-h-[580px] w-[320px] flex-col overflow-y-auto bg-background text-foreground">
      <Header
        siteOrigin={siteOrigin}
        site={site}
        scope={scope}
        effectiveEnabled={effectiveEnabled}
        guides={guides}
        pinnedGuideId={pinnedGuideId}
        onDismissGuide={() => setPinnedGuideId(null)}
        onToggle={handleToggle}
        onScopeChange={handleScopeChange}
        onResetSite={() => {
          if (siteOrigin) void handleResetSite(siteOrigin)
        }}
      />

      {/* Scrollable body */}
      <div className="space-y-2.5 px-3 py-2.5">
        {cameraLabel && (
          <CameraCard cameraLabel={cameraLabel} onClear={handleClearCamera} />
        )}

        <div
          className={cn(
            "space-y-4",
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
      </div>

      {/* Footer — floats below the scrolling body */}
      <footer className="sticky bottom-0 z-10 mt-auto shrink-0 border-t bg-card px-3 py-2.5">
        <div className="flex gap-2">
          <Button
            variant="default"
            onClick={handlePreview}
            size={"lg"}
            className="flex-1"
          >
            <IconEye size={15} />
            {scope === "site" ? "Preview This Site" : "Show Preview"}
          </Button>
          <HelpButton onClick={() => setHelpOpen(true)} />
        </div>
        <HelpDrawer
          guides={guides}
          open={helpOpen}
          onOpenChange={setHelpOpen}
          onSelect={setPinnedGuideId}
        />
      </footer>
    </div>
  )
}
