# AGENTS.md

Notes for AI agents working in this repo. pnpm + Turborepo monorepo for **CamTuner**, a browser extension + Tauri 2 desktop app that fine-tune webcam feeds (crop/zoom/align, aspect ratio, letterbox, Center Stage, background effects).

## Commands

All run from repo root unless noted. Scripts are turbo-wrapped.

```bash
pnpm install            # also runs `wxt prepare` in the extension (generates .wxt/)
pnpm dev                # Chrome extension dev (WXT dev server on :3001)
pnpm dev:firefox        # Firefox extension dev
pnpm dev:desktop        # Tauri desktop app dev (needs Rust; Vite on :1420)
pnpm build              # build all (extension -> web); build:firefox for Firefox
pnpm lint               # eslint across workspaces
pnpm typecheck          # tsc --noEmit across workspaces
pnpm format             # prettier across workspaces
pnpm sync-brand         # rewrite brand consumers from brand.json
pnpm sync-brand:check   # exit 1 if any consumer drifted (CI enforces this)
```

Run a task in one workspace:

```bash
pnpm turbo typecheck --filter=@cam-tuner/extension
pnpm turbo build --filter='./packages/*'      # build shared packages only
```

Run tests (only `packages/stream-config` has tests):

```bash
pnpm turbo test
pnpm --filter @workspace/stream-config test                                  # all
pnpm --filter @workspace/stream-config exec vitest run src/utils/__tests__/math.test.ts  # one file
pnpm --filter @workspace/stream-config test:watch                            # watch
```

Rust (run in `crates/`, the standalone cargo workspace — turbo doesn't know about it):

```bash
cargo test                 # unit tests (camtuner-core)
cargo clippy --all-targets
cargo fmt
cargo check                # also: apps/desktop/src-tauri/ (compiles the Tauri app)
```

Verify a change end-to-end: `pnpm lint && pnpm typecheck && pnpm turbo build && pnpm turbo test`. Note turbo wiring (below) means **order matters**.

## Architecture

| Path | Package name | Role |
| --- | --- | --- |
| `apps/extension` | `@cam-tuner/extension` | Main product. WXT (Vite) browser extension, MV3, Chrome + Firefox. |
| `apps/desktop` | `@cam-tuner/desktop` | Tauri 2 desktop app. React 19 + Vite frontend (`src/`), Rust backend (`src-tauri/`, SQLite + tray + auto-updater). |
| `apps/web` | `@cam-tuner/web` | Next.js 16 marketing + live-preview site (Turbopack). |
| `packages/stream-config` | `@workspace/stream-config` | Core video-processing lib (Canvas & WebCodecs engines, plugins, framing, tracking). Bundled by tsup → `dist/`. |
| `packages/ui` | `@workspace/ui` | Shared React components (Radix UI + shadcn + Base UI). |
| `packages/{eslint,typescript}-config` | `@workspace/*` | Shared lint/TS configs. |
| `crates/camtuner-core` | `camtuner-core` | Pure Rust video-processing core (crop/zoom/align geometry, `TunerConfig` mirror, NV12/BGRA frame ops). Path dep of `apps/desktop/src-tauri`; future home of capture + virtual-camera crates. |
| `crates/camtuner-capture` | `camtuner-capture` | Capture backends behind a `CaptureBackend` trait: AVFoundation (macOS hardware, NV12), synthetic test pattern, and a composite (hardware + synthetic) used by the app. |
| `crates/camtuner-vcam` | `camtuner-vcam` | Virtual-camera transport: Unix-socket frame protocol (32-byte header + UYVY payload) shared by the app's `VcamServer` and future native camera-plugin clients. |
| `crates/camtuner-vcam-dal` | `camtuner-vcam-dal` | CMIO DAL virtual camera (macOS): pure-Rust `CMIOHardwarePlugInInterface` vtable, cdylib packaged into `CamTunerCamera.plugin` by the `assemble-plugin` bin (`--install`/`--status`/`--uninstall`). |

Workspace aliases: `@cam-tuner/*` for apps, `@workspace/*` for packages. `ui` depends on `stream-config`; both apps depend on both packages.

## Non-obvious gotchas

- **Turbo build order is load-bearing.** `turbo.json` sets `typecheck` to depend on `^build` and `test` to depend on `build`. `stream-config` ships types only from `dist/` (tsup), so it **must be built before `ui`, `extension`, or `web` can typecheck**. If you typecheck a consumer in isolation and it can't resolve `@workspace/stream-config`, run `pnpm turbo build --filter=./packages/*` first.
- **`apps/web` is excluded from CI.** CI runs `lint`/`typecheck`/`test` with `--filter='!@cam-tuner/web'`. The web app is not typechecked/linted in CI and can drift — don't assume it's green.
- **Extension needs generated files before it works.** Every `dev`/`build`/`build:firefox` chains two codegen scripts before `wxt`:
  - `copy-mediapipe-wasm` → copies the MediaPipe WASM runtime into `public/wasm`
  - `build-mediapipe-adapter` → esbuild standalone ESM bundle into `public/mediapipe-adapter.js`
  - These outputs are **generated, not committed** (`apps/extension/.gitignore` excludes `public/wasm`, `public/mediapipe-adapter.js`). If you edit `apps/extension/lib/tracking/**`, rerun `pnpm dev`/`pnpm build` to regenerate the adapter before testing.
- **`wxt prepare` (postinstall) generates `.wxt/`.** The extension `tsconfig.json` extends `.wxt/tsconfig.json`. If `.wxt/` is missing, extension typecheck fails — run `pnpm install` or `pnpm --filter @cam-tuner/extension exec wxt prepare`.
- **Content script runs in the MAIN world** (`entrypoints/injector.content.ts`, `world: "MAIN"`) and patches `navigator.mediaDevices.getUserMedia` to pipe streams through `stream-config`. A separate ISOLATED-world `content.ts` bridges extension storage. Cross-world messaging uses `window.postMessage` with `camtuner:*` event names.
- **The MediaPipe adapter is lazy-loaded** via `import(/* @vite-ignore */ url)` (for Center Stage tracking) because WXT builds content scripts as IIFE (which inlines dynamic imports). Keep the `@vite-ignore` comments — without them Vite tries to bundle the adapter and breaks the runtime URL loading.
- **CSP uses `wasm-unsafe-eval`** (not `unsafe-eval`, which MV3 blocks). MediaPipe compiles WASM on extension pages — set in `wxt.config.ts`.
- **`VITE_WEB_URL` is required.** Background script and manifest `host_permissions` use it; copy `.env.example` → `.env.local` in `apps/extension`. Release workflow injects it from `vars.VITE_WEB_URL`.
- **Desktop app needs the Rust toolchain.** `pnpm dev:desktop` and `cargo check` (in `apps/desktop/src-tauri/`) require a stable Rust install; turbo `typecheck`/`lint`/`build` for `@cam-tuner/desktop` are Rust-free (tsc + Vite only).
- **`crates/` is a cargo workspace independent of turbo/pnpm.** `camtuner-core` is the Rust port of `stream-config`'s crop/zoom/align math (`math.rs` mirrors `utils/math.ts`; its vitest suite is ported as Rust golden tests — keep both in sync) and the `TunerConfig` JSON contract (serde camelCase, wire-compatible with the TS type). `apps/desktop/src-tauri` consumes it via a path dep, so Rust changes surface in the desktop app only after a `cargo check`/`cargo build` there. Don't rename/move `crates/camtuner-core` without updating that path.
- **macOS capture stack.** `camtuner-capture/src/avfoundation.rs` uses the objc2 binding family (`objc2-av-foundation`, `objc2-core-video`, `dispatch2`, `block2`); the AVF session runs on its own thread and negotiates NV12 (`420v`) via `AVCaptureVideoDataOutput` video settings. Device enumeration needs no TCC permission, but opening a stream does — the ignored test `opens_a_real_frame_stream` exercises it (`cargo test -p camtuner-capture -- --ignored`). Camera permission strings live in `apps/desktop/src-tauri/Info.plist` (auto-merged by Tauri into the bundled app's Info.plist).
- **Brand files are generated — never edit them by hand.** `brand.json` (repo root) is the single source of truth for app name, slug, identifier, version, URLs, and copy. `pnpm sync-brand` rewrites all consumers: package.jsons, `tauri.conf.json`/`tauri.dev.conf.json`, `Cargo.toml`/`Cargo.lock`, `main.rs`, `apps/desktop/index.html`, `Casks/cam-tuner.rb`, `setup/*`, generated `brand.ts`/`brand.rs`, `apps/web/data/brand.ts`, `apps/extension/wxt.config.ts` (imports `lib/brand`), and README marker regions. It also **syncs icons**: `apps/extension/assets/icon.svg` is the canonical mark — it is copied to `apps/desktop/public/logo.svg` and regenerates the whole Tauri icon set (`tauri icon`), enforced byte-for-byte in `--check` mode (`icon.icns` exempt; mobile icon sets are not shipped). Brand sync runs only in the release script (`pnpm release:tag`) and drift is caught by CI's `sync-brand:check` — there is no pre-commit hook. Surface-specific copy lives in `brand.json` under `web` / `extension`.

## Versioning & release

- `brand.json` → `version` is the single version source of truth. `pnpm sync-brand` propagates it to root/extension/web/desktop `package.json`s and `tauri.conf.json`/`Cargo.toml`. Shared packages (`stream-config`, `ui`, configs) are **not** version-synced.
- Cut a release with `pnpm release:tag <major|minor|patch|x.y.z>` (`scripts/release-tag-sync.mjs`). Requires a clean git tree — it bumps `brand.json`, runs `sync-brand`, commits `chore(release): vX.Y.Z`, tags `vX.Y.Z`, and pushes.
- Pushing a `v*` tag triggers `.github/workflows/release.yml`, which runs extension CI, zips Chrome + Firefox + sources (`wxt zip`), and attaches them to a GitHub Release; then builds the desktop app for macOS (aarch64 dmg), Linux (deb), and Windows (msi/nsis) via `tauri-action` and appends those artifacts, and updates `Casks/cam-tuner.rb` with the dmg sha256.
- Desktop updater signing: a password-protected keypair lives at `~/.tauri/cam-tuner.key` (backup copies in the gitignored `.keys/` folder, including `.keys/cam-tuner.key.password`), and its pubkey is wired into `tauri.conf.json` → `plugins.updater.pubkey`. CI needs **both** secrets: `TAURI_SIGNING_PRIVATE_KEY` = contents of the key file, `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` = contents of the password file. Losing either the key or the password breaks all future desktop updates. To rotate: `pnpm --filter @cam-tuner/desktop tauri signer generate --password "<new>" --write-keys ~/.tauri/cam-tuner.key --ci --force`, refresh `.keys/`, and swap the pubkey. `tauri build` fails without the key env because `createUpdaterArtifacts` is enabled; `tauri dev` needs no key.
- `--dry-run` previews; `--no-push` skips pushing.

## Style & config

- **Prettier** (root `.prettierrc`): no semicolons, double quotes, 2-space indent, `trailingComma: es5`, `printWidth: 80`, `prettier-plugin-tailwindcss`. Tailwind functions: `cn`, `cva`; stylesheet: `packages/ui/src/styles/globals.css`.
- **ESLint** flat config (`eslint.config.js` per workspace) extending `@workspace/eslint-config/{base,next-js,react-internal}`. The root `.eslintrc.js` sets `@typescript-eslint/no-unused-vars` to off.
- **TypeScript** shared via `@workspace/typescript-config` (`base.json` / `nextjs.json` / `react-library.json`). Pinned to 5.9.3.
- **Tailwind v4**, PostCSS-based; shared entry in `packages/ui`.
- **Engines:** Node >=20, pnpm 11.9.0 (via `packageManager`). CI runs on Node 22.
- `prettier-plugin-tailwindcss` reorders class names on save — expect diff noise if Prettier isn't run.
