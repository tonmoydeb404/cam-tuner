use std::fs;
use std::path::Path;

use rusqlite::{params, Connection};

pub type DbResult<T> = Result<T, rusqlite::Error>;

/// Opens (and migrates) the app database. The filename derives from the brand
/// slug (brand.json → brand.rs), so each app gets its own data file.
pub fn open_connection(app_data_dir: &Path) -> DbResult<Connection> {
    fs::create_dir_all(app_data_dir).ok();
    let db_path = app_data_dir.join(format!("{}.db", crate::brand::SLUG));
    let mut conn = Connection::open(db_path)?;

    conn.pragma_update(None, "journal_mode", "WAL")?;
    conn.pragma_update(None, "foreign_keys", "ON")?;
    conn.busy_timeout(std::time::Duration::from_secs(5))?;

    crate::migrations::migrations()
        .to_latest(&mut conn)
        .map_err(|e| rusqlite::Error::ToSqlConversionFailure(Box::new(e)))?;

    Ok(conn)
}

// ---- Settings: a simple key-value store for app preferences ----
// Add your own tables via new migrations in src/migrations/sql/.

#[allow(dead_code)]
pub fn get_setting(conn: &Connection, key: &str) -> Option<String> {
    conn.query_row(
        "SELECT value FROM settings WHERE key = ?1",
        params![key],
        |r| r.get(0),
    )
    .ok()
}

pub fn set_setting(conn: &Connection, key: &str, value: &str) -> DbResult<()> {
    conn.execute(
        "INSERT INTO settings (key, value) VALUES (?1, ?2)
         ON CONFLICT(key) DO UPDATE SET value = ?2",
        params![key, value],
    )?;
    Ok(())
}

pub fn get_all_settings(conn: &Connection) -> DbResult<Vec<(String, String)>> {
    let mut stmt = conn.prepare("SELECT key, value FROM settings ORDER BY key")?;
    let rows = stmt.query_map([], |r| Ok((r.get(0)?, r.get(1)?)))?;
    let mut result = Vec::new();
    for row in rows {
        result.push(row?);
    }
    Ok(result)
}
