use std::collections::HashMap;
use std::sync::Arc;
use tauri::{AppHandle, Emitter, Manager};

use camtuner_capture::{CaptureError, DeviceInfo, StreamSettings};
use camtuner_core::config::TunerConfig;

use crate::db;
use crate::pipeline::{Pipeline, PipelineStats};
use crate::preview::PreviewServer;
use crate::state::{AppState, SELECTED_CAMERA_KEY};

fn map_err<E: std::fmt::Display>(e: E) -> String {
    e.to_string()
}

/// Demo IPC command — shows the invoke() round trip from the frontend.
/// Replace with your app's real commands (see apps/desktop/src/lib/api.ts).
#[tauri::command]
pub fn greet(name: String) -> String {
    format!("Hello, {name}! Welcome to {}.", crate::brand::APP_NAME)
}

// ---- Settings (SQLite key-value store) ----

#[tauri::command]
pub async fn get_settings(app: AppHandle) -> Result<HashMap<String, String>, String> {
    let state = app.state::<AppState>();
    let conn = state.db.lock().map_err(map_err)?;
    db::get_all_settings(&conn)
        .map(|v| v.into_iter().collect())
        .map_err(map_err)
}

#[tauri::command]
pub async fn set_setting(app: AppHandle, key: String, value: String) -> Result<(), String> {
    let state = app.state::<AppState>();
    let conn = state.db.lock().map_err(map_err)?;
    db::set_setting(&conn, &key, &value).map_err(map_err)
}

// ---- Cameras & preview pipeline ----

#[derive(Debug, serde::Serialize)]
pub struct CameraInfo {
    pub id: String,
    pub label: String,
    pub is_virtual: bool,
}

impl From<&DeviceInfo> for CameraInfo {
    fn from(device: &DeviceInfo) -> Self {
        Self {
            id: device.id.clone(),
            label: device.label.clone(),
            is_virtual: device.is_virtual,
        }
    }
}

#[tauri::command]
pub async fn list_cameras(app: AppHandle) -> Result<Vec<CameraInfo>, String> {
    let state = app.state::<AppState>();
    let capture = state.capture.lock().map_err(map_err)?;
    Ok(capture
        .list_devices()
        .iter()
        .map(CameraInfo::from)
        .collect())
}

/// Starts the preview pipeline for a camera (`None` = default/first device)
/// and returns the MJPEG preview URL. Idempotent: an already-running preview
/// for the same device is reused.
#[tauri::command]
pub async fn start_preview(app: AppHandle, device_id: Option<String>) -> Result<String, String> {
    let state = app.state::<AppState>();

    // Ensure the MJPEG server is up (started once, reused after). The guard
    // must not be held across the async start, so check-then-start-then-store.
    let url = {
        let existing = state
            .preview_server
            .lock()
            .map_err(map_err)?
            .as_ref()
            .map(|server| server.url.clone());
        match existing {
            Some(url) => url,
            None => {
                let server = PreviewServer::start(state.preview_bus.clone()).await?;
                let url = server.url.clone();
                *state.preview_server.lock().map_err(map_err)? = Some(server);
                url
            }
        }
    };

    // Restart only when the device selection changed.
    let selected = device_id.clone().or_else(|| {
        state
            .db
            .lock()
            .ok()
            .and_then(|conn| db::get_setting(&conn, SELECTED_CAMERA_KEY))
    });
    let needs_restart = {
        let pipeline = state.pipeline.lock().map_err(map_err)?;
        pipeline.is_none() || state_selected_changed(&state, selected.as_deref())
    };

    if needs_restart {
        stop_pipeline_locked(&state)?;

        let settings = StreamSettings::default();
        let stream = {
            let mut capture = state.capture.lock().map_err(map_err)?;
            capture.open(selected.as_deref(), settings)
        }
        .map_err(capture_error_message)?;

        let config = state.load_tuner_config();
        let bus = state.preview_bus.clone();
        let vcam = state.vcam.clone();
        let stats_app = app.clone();
        let on_stats: crate::pipeline::StatsCallback = Arc::new(move |stats: PipelineStats| {
            let _ = stats_app.emit("pipeline://stats", &stats);
        });

        let pipeline = Pipeline::start(stream, config, bus, vcam, Some(on_stats))?;
        *state.pipeline.lock().map_err(map_err)? = Some(pipeline);

        if let Some(id) = &selected {
            let conn = state.db.lock().map_err(map_err)?;
            db::set_setting(&conn, SELECTED_CAMERA_KEY, id).map_err(map_err)?;
        }
    }

    Ok(url)
}

#[tauri::command]
pub async fn stop_preview(app: AppHandle) -> Result<(), String> {
    let state = app.state::<AppState>();
    stop_pipeline_locked(&state)?;

    // Tear the MJPEG server down too; the next start_preview rebinds.
    if let Ok(mut server) = state.preview_server.lock() {
        if let Some(running) = server.take() {
            running.stop();
        }
    }
    Ok(())
}

fn stop_pipeline_locked(state: &tauri::State<'_, AppState>) -> Result<(), String> {
    let mut pipeline = state.pipeline.lock().map_err(map_err)?;
    if let Some(mut running) = pipeline.take() {
        running.stop();
    }
    Ok(())
}

/// The synthetic backend only knows one device, so a changed selection is
/// anything other than the current stored value; once hardware backends land
/// this compares against the running pipeline's device instead.
fn state_selected_changed(state: &tauri::State<'_, AppState>, selected: Option<&str>) -> bool {
    let stored = state
        .db
        .lock()
        .ok()
        .and_then(|conn| db::get_setting(&conn, SELECTED_CAMERA_KEY));
    match (selected, stored.as_deref()) {
        (Some(new), Some(old)) => new != old,
        (Some(_), None) => true,
        (None, _) => false,
    }
}

fn capture_error_message(err: CaptureError) -> String {
    match err {
        CaptureError::UnknownDevice { id } => format!("Unknown camera: {id}"),
        CaptureError::NoDevices => "No cameras found".to_string(),
        CaptureError::OpenFailed { reason } => {
            format!("Failed to open camera: {reason}")
        }
    }
}

// ---- Virtual camera ----

#[derive(Debug, Clone, serde::Serialize)]
pub struct VcamStatus {
    /// Server bound and attached to a running pipeline.
    pub streaming: bool,
    /// Camera plugins currently connected (e.g. an app that opened the camera).
    pub clients: usize,
    /// Unix socket path clients connect to.
    pub socket_path: String,
}

/// Well-known socket path the shipped plugin connects to by default. Dev
/// builds bind a `-dev` socket and bridge it with a symlink here, so an
/// installed plugin works against a dev app unchanged.
fn vcam_link_path() -> std::path::PathBuf {
    std::path::PathBuf::from("/var/tmp").join(format!("{}-vcam.sock", crate::brand::SLUG))
}

/// Best-effort symlink from the plugin's default socket path to ours.
fn bridge_socket_path(actual: &std::path::Path) {
    let link = vcam_link_path();
    if link == actual {
        return; // release build: paths already match
    }
    if link.is_symlink() || link.is_file() {
        std::fs::remove_file(&link).ok();
    }
    #[cfg(unix)]
    std::os::unix::fs::symlink(actual, &link).ok();
}

fn unbridge_socket_path() {
    let link = vcam_link_path();
    if link.is_symlink() {
        std::fs::remove_file(&link).ok();
    }
}

/// Core toggle logic shared by the IPC command and the tray menu.
pub async fn vcam_toggle(app: AppHandle) -> Result<VcamStatus, String> {
    let streaming = vcam_status_inner(&app.state::<AppState>()).streaming;
    if streaming {
        vcam_stop(app).await
    } else {
        vcam_start(app, None).await
    }
}

/// Starts (or ensures) the virtual camera: pipeline running, UDS server
/// bound, sink attached. Reuses the preview pipeline — the preview MJPEG
/// stream simply runs alongside.
#[tauri::command]
pub async fn vcam_start(app: AppHandle, device_id: Option<String>) -> Result<VcamStatus, String> {
    start_preview(app.clone(), device_id).await?;

    let state = app.state::<AppState>();
    let socket_path = state.vcam_socket_path();
    let server = {
        let mut guard = state.vcam.write().map_err(map_err)?;
        if let Some(existing) = guard.as_ref() {
            existing.clone()
        } else {
            let server = camtuner_vcam::server::VcamServer::start(&socket_path).map_err(map_err)?;
            *guard = Some(server.clone());
            server
        }
    };

    if let Ok(pipeline) = state.pipeline.lock() {
        if let Some(running) = pipeline.as_ref() {
            running.set_vcam(Some(server));
        }
    }

    // Bridge the plugin's default socket path to ours (dev builds).
    bridge_socket_path(&socket_path);

    crate::tray::rebuild_menu(&app);
    Ok(vcam_status_inner(&state))
}

/// Stops the virtual camera: detaches the sink and unbinds the socket.
#[tauri::command]
pub async fn vcam_stop(app: AppHandle) -> Result<VcamStatus, String> {
    let state = app.state::<AppState>();
    if let Ok(guard) = state.vcam.write() {
        if let Some(server) = guard.as_ref() {
            server.stop();
        }
    }
    *state.vcam.write().map_err(map_err)? = None;
    if let Ok(pipeline) = state.pipeline.lock() {
        if let Some(running) = pipeline.as_ref() {
            running.set_vcam(None);
        }
    }
    unbridge_socket_path();
    crate::tray::rebuild_menu(&app);
    Ok(vcam_status_inner(&state))
}

#[tauri::command]
pub async fn vcam_status(app: AppHandle) -> Result<VcamStatus, String> {
    let state = app.state::<AppState>();
    Ok(vcam_status_inner(&state))
}

fn vcam_status_inner(state: &tauri::State<'_, AppState>) -> VcamStatus {
    let (attached, clients) = match state.vcam.read() {
        Ok(guard) => match guard.as_ref() {
            Some(server) => (true, server.client_count()),
            None => (false, 0),
        },
        Err(_) => (false, 0),
    };
    let pipeline_running = state.pipeline.lock().map(|p| p.is_some()).unwrap_or(false);
    VcamStatus {
        streaming: attached && pipeline_running,
        clients,
        socket_path: state.vcam_socket_path().display().to_string(),
    }
}

// ---- Virtual camera plugin install ----

#[derive(Debug, Clone, serde::Serialize)]
pub struct VcamPluginStatus {
    /// The CMIO bundle is present in /Library/CoreMediaIO/Plug-Ins/DAL.
    pub installed: bool,
    /// The installed bundle matches this build's plugin.
    pub up_to_date: bool,
    pub path: String,
}

fn plugin_workspace_path() -> Option<std::path::PathBuf> {
    // Dev builds: the assemble-plugin output inside the repo.
    let dir = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../../../crates/camtuner-vcam-dal/build");
    let bundle = dir.join("CamTunerCamera.plugin");
    bundle.exists().then_some(bundle)
}

fn plugin_source_path(app: &AppHandle) -> Option<std::path::PathBuf> {
    // 1. Explicit override.
    if let Ok(path) = std::env::var("CAMTUNER_VCAM_PLUGIN") {
        if !path.is_empty() {
            let path = std::path::PathBuf::from(path);
            if path.exists() {
                return Some(path);
            }
        }
    }
    // 2. Bundled resource (packaged apps).
    if let Ok(dir) = app.path().resource_dir() {
        let candidate = dir.join("CamTunerCamera.plugin");
        if candidate.exists() {
            return Some(candidate);
        }
    }
    // 3. Workspace build output (dev).
    plugin_workspace_path()
}

fn installed_bundle_path() -> std::path::PathBuf {
    std::path::PathBuf::from("/Library/CoreMediaIO/Plug-Ins/DAL").join("CamTunerCamera.plugin")
}

fn read_bundle_version_marker(bundle: &std::path::Path) -> Option<String> {
    std::fs::read_to_string(bundle.join("Contents/Info.plist")).ok()
}

#[tauri::command]
pub async fn vcam_plugin_status(_app: AppHandle) -> Result<VcamPluginStatus, String> {
    let installed_path = installed_bundle_path();
    let installed = read_bundle_version_marker(&installed_path).is_some();
    let up_to_date = match (installed, plugin_workspace_path()) {
        (true, Some(source)) => {
            read_bundle_version_marker(&installed_path) == read_bundle_version_marker(&source)
        }
        _ => false,
    };
    Ok(VcamPluginStatus {
        installed,
        up_to_date,
        path: installed_path.display().to_string(),
    })
}

/// Copies the plugin bundle into the CMIO DAL directory. Triggers a macOS
/// administrator password prompt (osascript) — the only sanctioned way to
/// modify that system directory.
#[tauri::command]
pub async fn vcam_plugin_install(app: AppHandle) -> Result<VcamPluginStatus, String> {
    let Some(source) = plugin_source_path(&app) else {
        return Err(
            "Plugin bundle not found. Build it with `cargo run -p camtuner-vcam-dal \
             --bin assemble-plugin -- --release` first."
                .to_string(),
        );
    };
    let target = installed_bundle_path();
    let dir = target.parent().expect("install dir has a parent");
    let script = format!(
        "do shell script \"mkdir -p '{dir}' && rm -rf '{target}' && cp -R '{src}' '{target}'\" \
         with administrator privileges",
        dir = dir.display(),
        target = target.display(),
        src = source.display(),
    );
    let status = std::process::Command::new("osascript")
        .arg("-e")
        .arg(&script)
        .status()
        .map_err(map_err)?;
    if !status.success() {
        return Err("Install cancelled or failed".to_string());
    }
    vcam_plugin_status(app).await
}

#[tauri::command]
pub async fn vcam_plugin_uninstall(app: AppHandle) -> Result<VcamPluginStatus, String> {
    let target = installed_bundle_path();
    let script = format!(
        "do shell script \"rm -rf '{target}'\" with administrator privileges",
        target = target.display(),
    );
    let status = std::process::Command::new("osascript")
        .arg("-e")
        .arg(&script)
        .status()
        .map_err(map_err)?;
    if !status.success() {
        return Err("Uninstall cancelled or failed".to_string());
    }
    vcam_plugin_status(app).await
}

// ---- Tuner config ----

#[tauri::command]
pub async fn get_tuner_config(app: AppHandle) -> Result<TunerConfig, String> {
    let state = app.state::<AppState>();
    Ok(state.load_tuner_config())
}

/// Persists the tuner config and hot-applies it to a running pipeline.
#[tauri::command]
pub async fn set_tuner_config(app: AppHandle, config: TunerConfig) -> Result<(), String> {
    let state = app.state::<AppState>();
    state.store_tuner_config(&config)?;
    if let Ok(pipeline) = state.pipeline.lock() {
        if let Some(running) = pipeline.as_ref() {
            running.update_config(config);
        }
    }
    Ok(())
}

// ---- Auto-start ----

#[tauri::command]
pub async fn enable_autostart(app: AppHandle) -> Result<(), String> {
    use tauri_plugin_autostart::ManagerExt;
    app.autolaunch().enable().map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn disable_autostart(app: AppHandle) -> Result<(), String> {
    use tauri_plugin_autostart::ManagerExt;
    app.autolaunch().disable().map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn is_autostart_enabled(app: AppHandle) -> Result<bool, String> {
    use tauri_plugin_autostart::ManagerExt;
    app.autolaunch().is_enabled().map_err(|e| e.to_string())
}

// ---- Updater ----

#[derive(Debug, serde::Serialize)]
pub struct UpdateInfo {
    pub version: String,
    pub body: Option<String>,
    pub date: Option<String>,
}

/// Checks the updater endpoint. Emits `update://available` when a newer
/// version exists (listeners stay in sync) and returns it to the caller —
/// `None` when up to date. Shared by the boot check and the manual
/// `check_for_update` command.
pub async fn run_update_check(app: &AppHandle) -> Result<Option<UpdateInfo>, String> {
    use tauri_plugin_updater::UpdaterExt;

    let updater = app.updater().map_err(map_err)?;
    match updater.check().await.map_err(map_err)? {
        Some(update) => {
            let info = UpdateInfo {
                version: update.version.clone(),
                body: update.body.clone(),
                date: update.date.map(|d| d.to_string()),
            };
            let _ = app.emit("update://available", &info);
            Ok(Some(info))
        }
        None => Ok(None),
    }
}

/// Manual "Check for updates" (settings screen).
#[tauri::command]
pub async fn check_for_update(app: AppHandle) -> Result<Option<UpdateInfo>, String> {
    run_update_check(&app).await
}

#[tauri::command]
pub async fn install_update(app: AppHandle) -> Result<(), String> {
    use tauri_plugin_updater::UpdaterExt;

    let updater = app.updater().map_err(map_err)?;
    match updater.check().await.map_err(map_err)? {
        Some(update) => {
            update
                .download_and_install(|_, _| {}, || {})
                .await
                .map_err(map_err)?;
            // On macOS/Linux: restart to apply the update.
            // On Windows: the process exits during install, so this is unreachable.
            app.request_restart();
        }
        None => return Err("No update available".into()),
    }
    Ok(())
}
