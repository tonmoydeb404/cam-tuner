use std::path::PathBuf;
use std::sync::{Arc, Mutex, RwLock};

use camtuner_capture::CaptureBackend;
use camtuner_core::config::TunerConfig;
use camtuner_vcam::server::VcamServer;
use rusqlite::Connection;

use crate::pipeline::Pipeline;
use crate::preview::{PreviewBus, PreviewServer};

/// Shared state managed by Tauri.
pub struct AppState {
    pub db: Mutex<Connection>,
    pub app_data_dir: PathBuf,
    /// Active capture backend (hardware + synthetic via the composite).
    pub capture: Mutex<Box<dyn CaptureBackend>>,
    /// Running processing pipeline, if preview is live.
    pub pipeline: Mutex<Option<Pipeline>>,
    /// Fan-out hub of processed frames (always present; cheap when idle).
    pub preview_bus: Arc<PreviewBus>,
    /// Local MJPEG server, started with the first preview session.
    pub preview_server: Mutex<Option<PreviewServer>>,
    /// Virtual-camera sink, swappable while the pipeline runs. Held outside
    /// the pipeline so attach/detach works before it starts, too.
    pub vcam: Arc<RwLock<Option<Arc<VcamServer>>>>,
}

impl AppState {
    pub fn new(conn: Connection, app_data_dir: PathBuf, capture: Box<dyn CaptureBackend>) -> Self {
        AppState {
            db: Mutex::new(conn),
            app_data_dir,
            capture: Mutex::new(capture),
            pipeline: Mutex::new(None),
            preview_bus: PreviewBus::new(),
            preview_server: Mutex::new(None),
            vcam: Arc::new(RwLock::new(None)),
        }
    }

    /// Unix socket path the virtual-camera transport listens on. Dev builds
    /// use a separate path so dev and installed apps never cross wires.
    pub fn vcam_socket_path(&self) -> PathBuf {
        let mut name = crate::brand::SLUG.to_string();
        if cfg!(debug_assertions) {
            name.push_str("-dev");
        }
        PathBuf::from("/var/tmp").join(format!("{name}-vcam.sock"))
    }

    /// Loads the persisted tuner config, falling back to defaults for
    /// missing/corrupt values (same resilience rules as the extension).
    pub fn load_tuner_config(&self) -> TunerConfig {
        let stored = self
            .db
            .lock()
            .ok()
            .and_then(|conn| crate::db::get_setting(&conn, TUNER_CONFIG_KEY))
            .and_then(|json| serde_json::from_str::<TunerConfig>(&json).ok());
        stored.unwrap_or_default()
    }

    /// Persists the tuner config as JSON.
    pub fn store_tuner_config(&self, config: &TunerConfig) -> Result<(), String> {
        let json = serde_json::to_string(config).map_err(|err| err.to_string())?;
        let conn = self.db.lock().map_err(|err| err.to_string())?;
        crate::db::set_setting(&conn, TUNER_CONFIG_KEY, &json).map_err(|err| err.to_string())
    }

    #[allow(dead_code)]
    pub fn logs_dir(&self) -> PathBuf {
        self.app_data_dir.join("logs")
    }
}

/// Settings-store key for the tuner config JSON (mirrors the extension's
/// `tunerConfig` storage key).
pub const TUNER_CONFIG_KEY: &str = "tunerConfig";
/// Settings-store key for the selected camera id.
pub const SELECTED_CAMERA_KEY: &str = "selectedCameraId";
