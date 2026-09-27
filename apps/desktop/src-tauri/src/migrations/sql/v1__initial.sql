PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- Simple key-value settings store. Add your own tables in new migrations
-- (v2__*.sql, v3__*.sql, …) — never edit an applied migration.
CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
