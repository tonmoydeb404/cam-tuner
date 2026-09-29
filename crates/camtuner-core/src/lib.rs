//! camtuner-core — pure video-processing primitives for CamTuner Desktop.
//!
//! Platform-free Rust port of the browser-only `@workspace/stream-config`
//! processing core (crop/zoom/align family). Consumed by the Tauri app's
//! pipeline and (later) by native virtual-camera plugins.
//!
//! Conventions:
//! - Geometry lives in [`math`] and mirrors `packages/stream-config/src/utils/math.ts`
//!   1:1; its unit tests are ported as golden tests.
//! - The serialized config contract lives in [`config`] and is wire-compatible
//!   with the TypeScript `TunerConfig` (camelCase JSON).
//! - Frame buffers and pixel ops live in [`frame`] (NV12 native processing,
//!   BGRA for preview/encode).

pub mod config;
pub mod frame;
pub mod math;
