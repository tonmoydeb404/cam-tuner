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
        let stats_app = app.clone();
        let on_stats: crate::pipeline::StatsCallback = Arc::new(move |stats: PipelineStats| {
            let _ = stats_app.emit("pipeline://stats", &stats);
        });

        let pipeline = Pipeline::start(stream, config, bus, Some(on_stats))?;
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
