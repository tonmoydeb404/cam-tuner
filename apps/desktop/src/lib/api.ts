import { invoke } from "@tauri-apps/api/core"
import { listen, type UnlistenFn } from "@tauri-apps/api/event"
import type { TunerConfig } from "@workspace/stream-config"
import type { UpdateInfo } from "../types"

// All IPC wrappers live here — one entry per Rust command in
// src-tauri/src/commands.rs.

export interface CameraInfo {
  id: string
  label: string
  isVirtual: boolean
}

export interface PipelineStats {
  fps: number
  width: number
  height: number
}

export const api = {
  getSettings: () => invoke<Record<string, string>>("get_settings"),
  setSetting: (key: string, value: string) =>
    invoke<void>("set_setting", { key, value }),

  listCameras: () => invoke<CameraInfo[]>("list_cameras"),
  /** Starts the preview pipeline and returns the MJPEG stream URL. */
  startPreview: (deviceId?: string | null) =>
    invoke<string>("start_preview", { deviceId: deviceId ?? null }),
  stopPreview: () => invoke<void>("stop_preview"),

  getTunerConfig: () => invoke<TunerConfig>("get_tuner_config"),
  setTunerConfig: (config: TunerConfig) =>
    invoke<void>("set_tuner_config", { config }),

  enableAutostart: () => invoke<void>("enable_autostart"),
  disableAutostart: () => invoke<void>("disable_autostart"),
  isAutostartEnabled: () => invoke<boolean>("is_autostart_enabled"),

  installUpdate: () => invoke<void>("install_update"),
  checkForUpdate: () => invoke<UpdateInfo | null>("check_for_update"),
}

// Backend → frontend events (emitted from Rust with app.emit(...)).

export function onUpdateAvailable(
  callback: (payload: UpdateInfo) => void
): Promise<UnlistenFn> {
  return listen<UpdateInfo>("update://available", (event) =>
    callback(event.payload)
  )
}

export function onPipelineStats(
  callback: (payload: PipelineStats) => void
): Promise<UnlistenFn> {
  return listen<PipelineStats>("pipeline://stats", (event) =>
    callback(event.payload)
  )
}
