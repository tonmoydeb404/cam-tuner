import { brand } from "./brand";

// Runtime app name with an environment postfix: "Tymar Dev" in dev builds
// (`vite dev` / debug Rust), "Tymar" in production. Brand values themselves
// live in brand.json (generated `brand.ts` untouched) — this composes the
// display name only, mirroring src-tauri/src/env.rs on the Rust side.
export const displayName: string = import.meta.env.DEV
  ? `${brand.appName} Dev`
  : brand.appName;
