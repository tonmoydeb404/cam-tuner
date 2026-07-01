import { storage } from "#imports"
import {
  type AlignPosition,
  type AspectRatio,
  type BackgroundConfig,
  type TunerConfig,
  type ZoomMode,
  DEFAULT_BACKGROUND_CONFIG,
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

/**
 * User-uploaded background images. Stored in extension storage (shared between
 * the popup gallery and the ISOLATED content bridge); presets live as bundled
 * files in public/backgrounds and are NOT stored here. The MAIN-world injector
 * fetches these on demand via a postMessage round-trip (it cannot read
 * extension storage directly).
 */
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

export async function setCenterStageEnabled(enabled: boolean): Promise<void> {
  await setTunerConfig({ centerStageEnabled: enabled })
}

export async function setLetterbox(letterbox: boolean): Promise<void> {
  await setTunerConfig({ letterbox })
}

/**
 * Merges a partial background config into the persisted TunerConfig.background,
 * preserving any fields not supplied. Used by every background control.
 */
export async function setBackground(
  background: Partial<BackgroundConfig>
): Promise<void> {
  const current = await getTunerConfig()
  const merged: BackgroundConfig = {
    ...(current.background ?? DEFAULT_BACKGROUND_CONFIG),
    ...background,
  }
  await setTunerConfig({ background: merged })
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
