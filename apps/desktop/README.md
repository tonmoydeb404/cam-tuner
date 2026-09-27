# <!-- @brand:appName -->CamTuner<!-- /@brand:appName --> Desktop

<!-- @brand:descriptionLong -->CamTuner is a cross-platform desktop app for professional webcam framing: crop, zoom, and align your live camera feed, lock aspect ratios, keep yourself centered with Center Stage tracking, and blur or replace your background. Built with Tauri 2, React, and Rust.<!-- /@brand:descriptionLong -->

Part of the [monorepo](../../README.md). This package (`@cam-tuner/desktop`) holds both the React frontend (`src/`) and the Rust backend (`src-tauri/`).

---

## Features

- **Cross-platform** — one codebase for macOS, Windows, and Linux.
- **System tray** — lives in the tray, hides to tray on close.
- **Auto-start & updates** — launch on system startup; self-updates via signed releases.
- **SQLite storage** — bundled `rusqlite` + `rusqlite_migration`, with a settings key-value store ready to extend.
- **Dark/light theme** — persisted theme with pre-hydration flash prevention.
- **Welcome & update dialogs** — first-run welcome, update and downgrade notices, all brand-driven.

## Tech stack

- **Shell:** [Tauri 2](https://tauri.app/) — Rust backend, in-process IPC (no HTTP).
- **Frontend:** React 19 + TypeScript + Tailwind v4 (Vite).
- **Storage:** SQLite via `rusqlite` (bundled) + `rusqlite_migration`.
- **UI:** shadcn/ui primitives, [`@workspace/ui`](../../packages/ui) shared components, Lucide icons.
- **Plugins:** Tauri `updater`, `dialog`, `process`, `opener`, `autostart`.

## Architecture

Tauri 2 desktop app. The frontend and backend run in one process and communicate via Tauri's IPC.

```
Frontend (React)
  invoke("command_name", args)  →  Rust Tauri command  →  SQLite
Backend (Rust)
  emits events ("update://available")
  →  frontend listen() in src/context/app-context.tsx
```

Frontend types in `src/types.ts` mirror Rust serde output (snake_case for backend types). See [`../../AGENTS.md`](../../AGENTS.md) for the full architecture map.

### Key directories

```
src/                          React frontend
  lib/api.ts                  invoke() wrappers + event listeners
  context/app-context.tsx     global state (settings loading, events)
  screens/                    route screens (app.tsx holds the routes)
  types.ts                    types mirroring Rust serde output
src-tauri/src/                Rust backend
  commands.rs                 all IPC command definitions
  db.rs                       SQLite data access layer
  migrations/sql/             append-only SQL migrations
  tray.rs                     system tray menu
  state.rs / brand.rs
```

## Prerequisites

- **Node.js** 20+ and [pnpm](https://pnpm.io/)
- **Rust** stable toolchain (https://www.rust-lang.org/)
- Platform build tools:
  - **macOS:** Xcode Command Line Tools (`xcode-select --install`)
  - **Windows:** Visual Studio Build Tools (MSVC)
  - **Linux:** `gcc`, `pkg-config`, and the usual Tauri system dependencies (see the [Tauri prerequisites](https://tauri.app/start/prerequisites/))

## Run commands

Run from the **repository root** (this is a pnpm workspace):

```sh
pnpm install              # install all workspace dependencies
pnpm dev:desktop          # Tauri dev (builds Rust + runs Vite at :1420)
pnpm --filter @cam-tuner/desktop tauri build   # production desktop build
```

Or run from within `apps/desktop`:

```sh
pnpm dev                  # = tauri dev (dev identifier/productName)
pnpm dev:vite             # frontend only (Vite at :1420)
pnpm build                # tsc + vite build (frontend only)
pnpm typecheck            # tsc --noEmit
pnpm lint                 # eslint --max-warnings 0
```

Backend (Rust) checks, from `src-tauri/`:

```sh
cargo check               # type check
cargo clippy              # lint
```

## Download

Pre-built binaries: **<!-- @brand:downloadUrl -->https://github.com/tonmoydeb404/cam-tuner/releases/latest<!-- /@brand:downloadUrl -->**

## Links

- Website: <!-- @brand:website -->https://tonmoydeb.com<!-- /@brand:website -->
- Repository: <!-- @brand:repository -->https://github.com/tonmoydeb404/cam-tuner<!-- /@brand:repository -->

## License

[MIT](../../LICENSE) — <!-- @brand:copyright -->Copyright (c) 2026 Tonmoy Deb<!-- /@brand:copyright -->
