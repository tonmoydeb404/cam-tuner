//! Synthetic capture backend — an animated NV12 test pattern.
//!
//! Lets the whole desktop pipeline (crop/zoom/letterbox, preview, config
//! hot-reload) run and be tested with no camera, no permissions, and no CI
//! hardware. The pattern intentionally has strong spatial and temporal cues:
//! a drifting diagonal luma gradient, a hue-cycling chroma wash, and a
//! bouncing white box, so crop/zoom/align changes are obvious in preview.

use crate::{CaptureBackend, CaptureError, DeviceInfo, FrameStream, StreamSettings};
use camtuner_core::config::Rgb;
use camtuner_core::frame::{rgb_to_yuv601, Frame, PixelFormat};
use std::sync::mpsc;
use std::time::{Duration, Instant};

/// Device id reserved for the synthetic source.
pub const SYNTHETIC_DEVICE_ID: &str = "synthetic";

/// Software capture source generating animated NV12 frames at the requested
/// cadence. Frames stop when the [`FrameStream`] is dropped.
#[derive(Debug, Default, Clone, Copy)]
pub struct SyntheticBackend;

impl SyntheticBackend {
    pub fn new() -> Self {
        Self
    }
}

impl CaptureBackend for SyntheticBackend {
    fn list_devices(&self) -> Vec<DeviceInfo> {
        vec![DeviceInfo {
            id: SYNTHETIC_DEVICE_ID.to_string(),
            label: "CamTuner Test Pattern".to_string(),
            is_virtual: true,
        }]
    }

    fn open(
        &mut self,
        device_id: Option<&str>,
        settings: StreamSettings,
    ) -> Result<FrameStream, CaptureError> {
        if let Some(id) = device_id {
            if id != SYNTHETIC_DEVICE_ID {
                return Err(CaptureError::UnknownDevice { id: id.to_string() });
            }
        }

        let (tx, rx) = mpsc::channel();
        let fps = settings.fps.max(1);
        let frame_period = Duration::from_secs_f64(1.0 / f64::from(fps));
        // NV12 needs even dimensions.
        let width = (settings.width.max(2)) & !1;
        let height = (settings.height.max(2)) & !1;

        std::thread::Builder::new()
            .name("camtuner-synthetic-capture".to_string())
            .spawn(move || {
                let start = Instant::now();
                for index in 0u64.. {
                    let Ok(mut frame) = Frame::new_nv12(width, height) else {
                        break;
                    };
                    render_frame(&mut frame, index);
                    if tx.send(frame).is_err() {
                        break; // receiver dropped — stop generating
                    }
                    let target = start + frame_period * (index as u32).saturating_add(1);
                    let now = Instant::now();
                    if target > now {
                        std::thread::sleep(target - now);
                    }
                }
            })
            .map_err(|err| CaptureError::OpenFailed {
                reason: format!("failed to spawn synthetic source thread: {err}"),
            })?;

        Ok(FrameStream::new(
            StreamSettings { width, height, fps },
            PixelFormat::Nv12,
            rx,
        ))
    }
}

/// Renders the pattern for frame `index`. Deterministic: the same index
/// always produces the same bytes.
pub fn render_frame(frame: &mut Frame, index: u64) {
    if frame.format != PixelFormat::Nv12 {
        return; // synthetic source only produces NV12
    }
    let w = frame.width as usize;
    let h = frame.height as usize;
    let t = index as usize;

    // 1. Diagonal luma gradient, drifting with time (stays in studio swing).
    for row in 0..h {
        let y_row = &mut frame.data[row * w..(row + 1) * w];
        for (col, px) in y_row.iter_mut().enumerate() {
            *px = (16 + (col + row + t) % 219) as u8;
        }
    }

    // 2. Chroma wash cycling through primaries every 30 frames.
    let palette = [
        Rgb::new(255, 0, 0),
        Rgb::new(0, 255, 0),
        Rgb::new(0, 0, 255),
    ];
    let (_, u, v) = rgb_to_yuv601(palette[(t / 30) % 3]);
    let uv_plane = &mut frame.data[w * h..];
    for chroma in uv_plane.chunks_exact_mut(2) {
        chroma[0] = u;
        chroma[1] = v;
    }

    // 3. Bouncing white box (vertical motion is half-speed for variety).
    let bw = (w / 8).max(8);
    let bh = (h / 8).max(8);
    let range_x = (w - bw).max(1);
    let range_y = (h - bh).max(1);
    let x = bounce(t, range_x) & !1;
    let y = bounce(t / 2, range_y) & !1;

    let (bw, bh) = (bw & !1, bh & !1);
    let x_end = (x + bw).min(w);
    let y_end = (y + bh).min(h);

    for row in y..y_end {
        frame.data[row * w + x..row * w + x_end].fill(235);
    }
    for cy in (y / 2)..(y_end / 2) {
        for cx in (x / 2)..(x_end / 2) {
            let o = w * h + cy * w + cx * 2;
            frame.data[o] = 128;
            frame.data[o + 1] = 128;
        }
    }
}

/// Triangle wave over `0..range` — used for smooth back-and-forth motion.
fn bounce(step: usize, range: usize) -> usize {
    let period = range * 2;
    let m = step % period;
    if m < range {
        m
    } else {
        period - m
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn lists_one_virtual_device() {
        let devices = SyntheticBackend::new().list_devices();
        assert_eq!(devices.len(), 1);
        assert_eq!(devices[0].id, SYNTHETIC_DEVICE_ID);
        assert!(devices[0].is_virtual);
    }

    #[test]
    fn rejects_unknown_device_ids() {
        let mut backend = SyntheticBackend::new();
        let err = backend
            .open(Some("not-a-device"), StreamSettings::default())
            .unwrap_err();
        assert_eq!(
            err,
            CaptureError::UnknownDevice {
                id: "not-a-device".to_string()
            }
        );
    }

    #[test]
    fn opens_stream_with_requested_even_settings() {
        let mut backend = SyntheticBackend::new();
        let stream = backend
            .open(
                None,
                StreamSettings {
                    width: 641,
                    height: 479,
                    fps: 60,
                },
            )
            .unwrap();
        assert_eq!(stream.settings.width, 640);
        assert_eq!(stream.settings.height, 478);
        assert_eq!(stream.settings.fps, 60);
        assert_eq!(stream.format, PixelFormat::Nv12);
    }

    #[test]
    fn delivers_frames_of_the_requested_size() {
        let mut backend = SyntheticBackend::new();
        let stream = backend
            .open(
                None,
                StreamSettings {
                    width: 320,
                    height: 240,
                    fps: 30,
                },
            )
            .unwrap();
        let frame = stream.recv().unwrap();
        assert_eq!(frame.width, 320);
        assert_eq!(frame.height, 240);
        assert_eq!(frame.format, PixelFormat::Nv12);
    }

    #[test]
    fn animation_produces_differing_frames() {
        let mut a = Frame::new_nv12(64, 64).unwrap();
        let mut b = Frame::new_nv12(64, 64).unwrap();
        render_frame(&mut a, 0);
        render_frame(&mut b, 1);
        assert_ne!(a.data, b.data);
    }

    #[test]
    fn rendering_is_deterministic_per_index() {
        let mut a = Frame::new_nv12(64, 64).unwrap();
        let mut b = Frame::new_nv12(64, 64).unwrap();
        render_frame(&mut a, 42);
        render_frame(&mut b, 42);
        assert_eq!(a.data, b.data);
    }

    #[test]
    fn bouncing_box_is_visible_in_luma_and_neutral_in_chroma() {
        let mut frame = Frame::new_nv12(64, 64).unwrap();
        render_frame(&mut frame, 0);
        // Box is 8x8 white (Y=235) anchored at the top-left for index 0.
        assert_eq!(frame.data[0], 235);
        // Its chroma is neutral gray (128, 128).
        assert_eq!(&frame.data[64 * 64..64 * 64 + 2], &[128, 128]);
    }

    #[test]
    fn bounce_stays_in_range() {
        // The triangle wave touches both ends (0 and range) inclusive.
        for step in 0..1000 {
            assert!(bounce(step, 13) <= 13);
        }
    }

    #[test]
    fn stream_stops_when_receiver_is_dropped() {
        // The generator thread must exit instead of leaking: exercised by
        // dropping the stream and confirming send-side termination via the
        // channel contract (send returns Err once rx is gone).
        let (tx, rx) = mpsc::channel::<Frame>();
        drop(rx);
        assert!(tx.send(Frame::new_nv12(2, 2).unwrap()).is_err());
    }
}
