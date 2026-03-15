import { storage } from "#imports"
import type { AlignPosition, AspectRatio, TunerConfig } from "./tuner-types"

export const DEFAULT_TUNER_CONFIG: TunerConfig = {
  aspectRatio: "16:9",
  zoom: 1,
  align: "center",
  gridVisible: false,
}

export const tunerConfig = storage.defineItem<TunerConfig>(
  "local:tunerConfig",
  {
    fallback: DEFAULT_TUNER_CONFIG,
    init: () => DEFAULT_TUNER_CONFIG,
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

export async function setGridVisible(gridVisible: boolean): Promise<void> {
  await setTunerConfig({ gridVisible })
}
