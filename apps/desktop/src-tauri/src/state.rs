use std::path::PathBuf;
use std::sync::Mutex;

use rusqlite::Connection;

/// Shared state managed by Tauri. Extend with whatever your app needs
/// (caches, background workers, connections…).
#[allow(dead_code)]
pub struct AppState {
    pub db: Mutex<Connection>,
    pub app_data_dir: PathBuf,
}

impl AppState {
    pub fn new(conn: Connection, app_data_dir: PathBuf) -> Self {
        AppState {
            db: Mutex::new(conn),
            app_data_dir,
        }
    }

    #[allow(dead_code)]
    pub fn logs_dir(&self) -> PathBuf {
        self.app_data_dir.join("logs")
    }
}
