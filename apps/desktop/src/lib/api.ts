import { invoke } from "@tauri-apps/api/core";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import type { UpdateInfo } from "../types";

// All IPC wrappers live here — one entry per Rust command in
// src-tauri/src/commands.rs.

export const api = {
  // Demo command — replace with your app's real commands.
  greet: (name: string) => invoke<string>("greet", { name }),

  getSettings: () => invoke<Record<string, string>>("get_settings"),
  setSetting: (key: string, value: string) =>
    invoke<void>("set_setting", { key, value }),

  enableAutostart: () => invoke<void>("enable_autostart"),
  disableAutostart: () => invoke<void>("disable_autostart"),
  isAutostartEnabled: () => invoke<boolean>("is_autostart_enabled"),

  installUpdate: () => invoke<void>("install_update"),
  checkForUpdate: () => invoke<UpdateInfo | null>("check_for_update"),
};

// Backend → frontend events (emitted from Rust with app.emit(...)).

export function onUpdateAvailable(
  callback: (payload: UpdateInfo) => void,
): Promise<UnlistenFn> {
  return listen<UpdateInfo>("update://available", (event) =>
    callback(event.payload),
  );
}
