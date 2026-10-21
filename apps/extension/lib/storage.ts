import { storage } from "#imports"
import {
  type AlignPosition,
  type AspectRatio,
  type BackgroundMode,
  type TunerConfig,
  type ZoomMode,
  DEFAULT_TUNER_CONFIG,
} from "@workspace/stream-config"

export const tunerConfig = storage.defineItem<TunerConfig>(
  "local:tunerConfig",
  {
    fallback: DEFAULT_TUNER_CONFIG,
    init: () => DEFAULT_TUNER_CONFIG,
  }
)

export const virtualCamEnabled = storage.defineItem<boolean>(
  "local:virtualCamEnabled",
  {
    fallback: true,
    init: () => true,
  }
)

export const selectedCameraLabel = storage.defineItem<string | null>(
  "local:selectedCameraLabel",
  {
    fallback: null,
    init: () => null,
  }
)

export type StoredBackgroundImage = {
  id: string
  name: string
  dataUrl: string
}

export const backgroundImages = storage.defineItem<StoredBackgroundImage[]>(
  "local:backgroundImages",
  {
    fallback: [],
    init: () => [],
  }
)

export type SiteEnabledMode = "default" | "off"

export type SiteSetting = {
  // Full snapshot of the global TunerConfig taken when the site was
  // customized; later global changes do not affect customized sites.
  config: TunerConfig
  // "off" forces the camera off for this site; "default" follows the
  // global virtual-camera switch.
  enabled: SiteEnabledMode
}

export const siteSettings = storage.defineItem<Record<string, SiteSetting>>(
  "local:siteSettings",
  {
    fallback: {},
    init: () => ({}),
  }
)

export async function getTunerConfig(): Promise<TunerConfig> {
  return await tunerConfig.getValue()
}

export async function setTunerConfig(
  config: Partial<TunerConfig>
): Promise<void> {
  const current = await getTunerConfig()
  await tunerConfig.setValue({ ...current, ...config })
}

export async function setAspectRatio(aspectRatio: AspectRatio): Promise<void> {
  await setTunerConfig({ aspectRatio })
}

export async function setZoom(zoom: number): Promise<void> {
  await setTunerConfig({ zoom })
}

export async function setZoomMode(zoomMode: ZoomMode): Promise<void> {
  await setTunerConfig({ zoomMode })
}

export async function setAutoZoomMin(autoZoomMin: number): Promise<void> {
  await setTunerConfig({ autoZoomMin })
}

export async function setAutoZoomMax(autoZoomMax: number): Promise<void> {
  await setTunerConfig({ autoZoomMax })
}

export async function setAlign(align: AlignPosition): Promise<void> {
  await setTunerConfig({ align })
}

export async function setBarColor(barColor: string): Promise<void> {
  await setTunerConfig({ barColor })
}

export async function setMirror(mirror: boolean): Promise<void> {
  await setTunerConfig({ mirror })
}

export async function setFlipVertical(flipVertical: boolean): Promise<void> {
  await setTunerConfig({ flipVertical })
}

export async function setCenterStageEnabled(enabled: boolean): Promise<void> {
  await setTunerConfig({ centerStageEnabled: enabled })
}

export async function setLetterbox(letterbox: boolean): Promise<void> {
  await setTunerConfig({ letterbox })
}

export async function setBackgroundMode(
  backgroundMode: BackgroundMode
): Promise<void> {
  await setTunerConfig({ backgroundMode })
}

export async function setBlurStrength(blurStrength: number): Promise<void> {
  await setTunerConfig({ blurStrength })
}

export async function setBackgroundImage(
  backgroundImage: string | null
): Promise<void> {
  await setTunerConfig({ backgroundImage })
}

export async function addBackgroundImage(
  name: string,
  dataUrl: string,
  id?: string
): Promise<string> {
  const finalId =
    id ?? `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const list = await backgroundImages.getValue()
  await backgroundImages.setValue([...list, { id: finalId, name, dataUrl }])
  return finalId
}

export async function removeBackgroundImage(id: string): Promise<void> {
  const list = await backgroundImages.getValue()
  await backgroundImages.setValue(list.filter((img) => img.id !== id))
}

export async function findBackgroundImage(
  id: string
): Promise<StoredBackgroundImage | undefined> {
  const list = await backgroundImages.getValue()
  return list.find((img) => img.id === id)
}

export async function getSiteSettings(): Promise<Record<string, SiteSetting>> {
  return await siteSettings.getValue()
}

export async function getSiteSetting(
  origin: string
): Promise<SiteSetting | null> {
  const all = await getSiteSettings()
  return all[origin] ?? null
}

export async function customizeSite(origin: string): Promise<SiteSetting> {
  const snapshot: SiteSetting = {
    config: { ...(await getTunerConfig()) },
    enabled: "default",
  }
  const all = await getSiteSettings()
  await siteSettings.setValue({ ...all, [origin]: snapshot })
  return snapshot
}

export async function setSiteTunerConfig(
  origin: string,
  config: Partial<TunerConfig>
): Promise<void> {
  const all = await getSiteSettings()
  const site = all[origin]
  if (!site) return
  await siteSettings.setValue({
    ...all,
    [origin]: { ...site, config: { ...site.config, ...config } },
  })
}

export async function setSiteEnabledMode(
  origin: string,
  enabled: SiteEnabledMode
): Promise<void> {
  const all = await getSiteSettings()
  const site = all[origin]
  if (!site) return
  await siteSettings.setValue({ ...all, [origin]: { ...site, enabled } })
}

export async function resetSite(origin: string): Promise<void> {
  const all = await getSiteSettings()
  if (!(origin in all)) return
  const next = { ...all }
  delete next[origin]
  await siteSettings.setValue(next)
}

export type EffectiveSettings = {
  config: TunerConfig
  enabled: boolean
  siteSetting: SiteSetting | null
}

export async function resolveEffectiveSettings(
  origin: string
): Promise<EffectiveSettings> {
  const [globalConfig, globalEnabled, site] = await Promise.all([
    getTunerConfig(),
    virtualCamEnabled.getValue(),
    getSiteSetting(origin),
  ])
  if (site) {
    return {
      config: site.config,
      enabled: site.enabled !== "off" ? globalEnabled : false,
      siteSetting: site,
    }
  }
  return { config: globalConfig, enabled: globalEnabled, siteSetting: null }
}
