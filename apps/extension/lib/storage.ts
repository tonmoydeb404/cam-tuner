import { storage } from "#imports"
import {
  type AlignPosition,
  type AspectRatio,
  type TunerConfig,
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

export async function setAlign(align: AlignPosition): Promise<void> {
  await setTunerConfig({ align })
}

export async function setBarColor(barColor: string): Promise<void> {
  await setTunerConfig({ barColor })
}
