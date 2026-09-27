//! Environment-dependent naming: dev builds get a `Dev` postfix so a
//! `tauri dev` instance is never confused with the installed production
//! app. Brand values themselves stay in `brand.json` (generated files
//! untouched) — this only composes the runtime display name.

/// True for debug builds (`pnpm dev:desktop` / `tauri dev`); false for
/// release bundles.
pub fn is_dev() -> bool {
    cfg!(debug_assertions)
}

/// URL scheme for deep links. Dormant until the deep-link plugin is wired
/// (see `.source/template-upgrades/README.md` §5); dev uses `<slug>-dev`
/// so dev and production never collide.
#[allow(dead_code)]
pub fn deep_link_scheme() -> String {
    if is_dev() {
        format!("{}-dev", crate::brand::SLUG)
    } else {
        crate::brand::SLUG.to_string()
    }
}

/// App display name with the dev postfix applied — "CamTuner Dev" in dev,
/// "CamTuner" in production. Used for the window title and tray.
pub fn display_name() -> String {
    if is_dev() {
        format!("{} Dev", crate::brand::APP_NAME)
    } else {
        crate::brand::APP_NAME.to_string()
    }
}
