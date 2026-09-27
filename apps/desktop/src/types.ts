// Types shared across the frontend. Keep backend (raw) types matching the
// Rust serde output (snake_case); define view types here as needed.

export type UpdateInfo = {
  version: string;
  body: string | null;
  date: string | null;
};
