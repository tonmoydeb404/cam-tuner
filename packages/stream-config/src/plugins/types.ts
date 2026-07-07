import type { TunerConfig } from "../tuner-types"
import type { StreamModifier, StreamPlugin } from "../types"

export interface PluginContext {
  modifier: StreamModifier
  adapter?: unknown
  wasmUrl: string | null
}

export interface PluginUIProps {
  config: TunerConfig
  onConfigChange: (update: Partial<TunerConfig>) => void
  options?: Record<string, boolean | undefined>
}

export interface PluginManifest {
  id: string
  label: string
  createPlugin: (context: PluginContext) => StreamPlugin<any>
  configMapper: (config: TunerConfig) => any
  isActive: (config: TunerConfig) => boolean
  configFields: string[]
  adapter?: {
    load: (wasmUrl: string | null) => Promise<unknown>
    destroy?: () => void
  }
  /** Order in the canvas/webcodecs execution pipeline (lower runs first). */
  executionOrder: number
  /** Order in the UI panel (lower renders first). */
  uiOrder: number
  /** Initialization-time feature flags for this plugin instance. */
  options?: Record<string, boolean | undefined>
}
