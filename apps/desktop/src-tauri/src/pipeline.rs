//! Processing pipeline: consumes capture frames, applies the crop family
//! (crop/zoom → letterbox → mirror/flip), and publishes JPEG previews.
//!
//! Runs on a dedicated std thread (video loops don't belong on the tokio
//! runtime). Config is hot-swappable through an `Arc<RwLock<TunerConfig>>` —
//! the Rust analog of the extension's `updatePluginConfig`.

use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, RwLock};
use std::thread::JoinHandle;
use std::time::{Duration, Instant};

use camtuner_capture::{FrameStream, StreamPoll};
use camtuner_core::config::TunerConfig;
use camtuner_core::frame::{Frame, FrameError, PixelFormat};
use camtuner_core::math::{calculate_crop_box, calculate_destination_box, CropConfig, Rect, Size};

use crate::preview::{PreviewBus, PreviewFrame};

/// Poll interval when the capture source is idle — keeps shutdown responsive
/// without busy-spinning.
const POLL_INTERVAL: Duration = Duration::from_millis(250);
/// Preview frames are downscaled to at most this width before JPEG encoding
/// (the webview doesn't need full resolution; keeps encode cost low).
const PREVIEW_MAX_WIDTH: u32 = 960;
/// JPEG quality for the preview stream.
const PREVIEW_JPEG_QUALITY: u8 = 80;

/// Per-second pipeline telemetry, forwarded to the webview.
#[derive(Debug, Clone, Copy, serde::Serialize)]
pub struct PipelineStats {
    pub fps: f64,
    pub width: u32,
    pub height: u32,
}

pub type StatsCallback = Arc<dyn Fn(PipelineStats) + Send + Sync>;

/// Renders one source frame according to `config` into (or reallocating)
/// `dst`. Pure and unit-testable — the thread loop below is a thin shell
/// around this.
///
/// Letterbox (default): output is source-sized, filled with the bar color,
/// and the crop box is drawn into the centered destination box — matching
/// the extension's canvas renderer. Non-letterbox: output is the zoom=1 crop
/// box (stable across zoom changes) with the current crop stretched to fill.
/// Mirror/flipVertical are applied last, like the canvas transform.
pub fn render(
    dst: &mut Option<Frame>,
    src: &Frame,
    config: &TunerConfig,
) -> Result<(), FrameError> {
    let crop = config.to_crop_config();
    let crop_rect = calculate_crop_box(src.size(), &crop);

    if config.letterbox {
        let dest_box = calculate_destination_box(src.size(), crop_rect);
        ensure_size(dst, src.size(), PixelFormat::Nv12)?;
        let out = dst.as_mut().expect("ensure_size allocated the output");
        // Only paint bars when the destination box leaves any uncovered
        // frame (matches the TS renderer, which skips the fillRect too).
        let covers_all = dest_box.x == 0
            && dest_box.y == 0
            && dest_box.width == out.width
            && dest_box.height == out.height;
        if !covers_all {
            out.fill(config.bar_color_rgb());
        }
        out.blit_resample(src, crop_rect, dest_box)?;
    } else {
        // Output dimensions come from the zoom=1 crop box and are held
        // stable as zoom changes (avoids resize flicker), mirroring the
        // TS plugin's getOutputSize behavior. Floored to even: NV12.
        let base = calculate_crop_box(
            src.size(),
            &CropConfig {
                zoom: 1.0,
                zoom_override: None,
                ..crop
            },
        );
        let need = Size {
            width: base.width & !1,
            height: base.height & !1,
        };
        ensure_size(dst, need, PixelFormat::Nv12)?;
        let out = dst.as_mut().expect("ensure_size allocated the output");
        let full = Rect::new(0, 0, out.width, out.height);
        out.blit_resample(src, crop_rect, full)?;
    }

    let out = dst.as_mut().expect("output frame exists");
    out.flip(config.mirror, config.flip_vertical);
    Ok(())
}

fn ensure_size(dst: &mut Option<Frame>, size: Size, format: PixelFormat) -> Result<(), FrameError> {
    match dst {
        Some(frame) if frame.size() == size => Ok(()),
        _ => {
            *dst = Some(Frame::new(format, size.width, size.height)?);
            Ok(())
        }
    }
}

/// A running pipeline. Dropping it stops the thread and joins it.
pub struct Pipeline {
    stop: Arc<AtomicBool>,
    config: Arc<RwLock<TunerConfig>>,
    handle: Option<JoinHandle<()>>,
}

impl Pipeline {
    /// Starts the processing loop for `stream`. `on_stats` is invoked about
    /// once per second with throughput telemetry.
    pub fn start(
        stream: FrameStream,
        config: TunerConfig,
        preview_bus: Arc<PreviewBus>,
        on_stats: Option<StatsCallback>,
    ) -> Result<Self, String> {
        let stop = Arc::new(AtomicBool::new(false));
        let config = Arc::new(RwLock::new(config));
        let thread_stop = stop.clone();
        let thread_config = config.clone();

        let handle = std::thread::Builder::new()
            .name("camtuner-pipeline".to_string())
            .spawn(move || {
                run_loop(stream, thread_config, preview_bus, on_stats, &thread_stop);
            })
            .map_err(|err| format!("failed to spawn pipeline thread: {err}"))?;

        Ok(Self {
            stop,
            config,
            handle: Some(handle),
        })
    }

    /// Hot-swaps the tuner config; takes effect on the next frame.
    pub fn update_config(&self, config: TunerConfig) {
        if let Ok(mut guard) = self.config.write() {
            *guard = config;
        }
    }

    pub fn stop(&mut self) {
        self.stop.store(true, Ordering::Relaxed);
        if let Some(handle) = self.handle.take() {
            let _ = handle.join();
        }
    }
}

impl Drop for Pipeline {
    fn drop(&mut self) {
        self.stop();
    }
}

#[allow(clippy::too_many_arguments)]
fn run_loop(
    stream: FrameStream,
    config: Arc<RwLock<TunerConfig>>,
    preview_bus: Arc<PreviewBus>,
    on_stats: Option<StatsCallback>,
    stop: &AtomicBool,
) {
    let mut output: Option<Frame> = None;
    let mut bgra_scratch: Option<Frame> = None;
    let mut preview_scratch: Option<Frame> = None;
    let mut jpeg_buf: Vec<u8> = Vec::with_capacity(256 * 1024);

    let mut last_stats_at = Instant::now();
    let mut frames_since_stats = 0u64;
    let mut last_reported_size = (0u32, 0u32);

    loop {
        if stop.load(Ordering::Relaxed) {
            break;
        }
        match stream.recv_timeout(POLL_INTERVAL) {
            Err(StreamPoll::Ended) => break,
            Err(StreamPoll::Timeout) => continue,
            Ok(frame) => {
                // If we're running behind the camera, skip to the freshest
                // frame — keeps preview latency bounded instead of letting
                // the channel queue grow.
                let mut frame = frame;
                while let Some(next) = stream.try_recv() {
                    frame = next;
                }

                let cfg = match config.read() {
                    Ok(guard) => guard.clone(),
                    Err(_) => break, // poisoned lock — nothing sane to do
                };

                if render(&mut output, &frame, &cfg).is_err() {
                    continue;
                }
                let out = match output.as_ref() {
                    Some(out) => out,
                    None => continue,
                };

                let published = publish_preview(
                    out,
                    &mut bgra_scratch,
                    &mut preview_scratch,
                    &mut jpeg_buf,
                    &preview_bus,
                );

                if published {
                    frames_since_stats += 1;
                }
                let out_size = (out.width, out.height);
                let elapsed = last_stats_at.elapsed();
                if elapsed >= Duration::from_secs(1) && out_size.0 > 0 {
                    if let Some(callback) = &on_stats {
                        let fps = frames_since_stats as f64 / elapsed.as_secs_f64();
                        callback(PipelineStats {
                            fps,
                            width: out_size.0,
                            height: out_size.1,
                        });
                    }
                    frames_since_stats = 0;
                    last_stats_at = Instant::now();
                    last_reported_size = out_size;
                } else if out_size != last_reported_size {
                    // Resolution changed — report immediately so the UI
                    // can resize the preview without waiting a second.
                    if let Some(callback) = &on_stats {
                        callback(PipelineStats {
                            fps: 0.0,
                            width: out_size.0,
                            height: out_size.1,
                        });
                    }
                    last_reported_size = out_size;
                }
            }
        }
    }
}

/// Downscaled NV12 → BGRA → JPEG preview, reusing scratch buffers across
/// frames. Downscaling happens *before* conversion so the (comparatively
/// expensive) YUV→RGB step only touches preview-sized pixels.
fn publish_preview(
    out: &Frame,
    bgra_scratch: &mut Option<Frame>,
    preview_scratch: &mut Option<Frame>,
    jpeg_buf: &mut Vec<u8>,
    preview_bus: &PreviewBus,
) -> bool {
    // Downscale NV12 → preview-sized NV12 first (reused buffer).
    let need = out.size();
    let preview_w = need.width.min(PREVIEW_MAX_WIDTH) & !1;
    let preview_h =
        ((need.height as u64 * preview_w as u64) / need.width.max(1) as u64) as u32 & !1;
    let preview_size = Size {
        width: preview_w.max(2),
        height: preview_h.max(2),
    };
    match preview_scratch {
        Some(frame) if frame.size() == preview_size => {}
        _ => {
            *preview_scratch = Frame::new_nv12(preview_size.width, preview_size.height).ok();
        }
    }
    let Some(preview_frame) = preview_scratch.as_mut() else {
        return false;
    };
    if preview_frame
        .blit_resample(
            out,
            Rect::new(0, 0, out.width, out.height),
            Rect::new(0, 0, preview_frame.width, preview_frame.height),
        )
        .is_err()
    {
        return false;
    }

    // Preview NV12 → BGRA (reused buffer).
    match bgra_scratch {
        Some(frame) if frame.size() == preview_size => {}
        _ => {
            *bgra_scratch = Frame::new_bgra(preview_size.width, preview_size.height).ok();
        }
    }
    let Some(bgra) = bgra_scratch.as_mut() else {
        return false;
    };
    if preview_frame.nv12_to_bgra_into(bgra).is_err() {
        return false;
    }

    // JPEG encode from the BGRA frame; `mem::take` hands the buffer to the
    // published frame without copying and leaves `jpeg_buf` empty for reuse.
    jpeg_buf.clear();
    let encoder = jpeg_encoder::Encoder::new(&mut *jpeg_buf, PREVIEW_JPEG_QUALITY);
    if encoder
        .encode(
            &bgra.data,
            bgra.width as u16,
            bgra.height as u16,
            jpeg_encoder::ColorType::Bgra,
        )
        .is_err()
    {
        return false;
    }
    preview_bus.publish(PreviewFrame {
        jpeg: Arc::new(std::mem::take(jpeg_buf)),
        width: bgra.width,
        height: bgra.height,
    });
    true
}

#[cfg(test)]
mod tests {
    use super::*;

    fn test_config() -> TunerConfig {
        TunerConfig::default()
    }

    fn source_640x480() -> Frame {
        let mut src = Frame::new_nv12(640, 480).unwrap();
        // Distinct luma per row block so crop placement is verifiable.
        for (i, byte) in src.data.iter_mut().enumerate() {
            *byte = (i % 251) as u8;
        }
        src
    }

    #[test]
    fn letterbox_output_is_source_sized_with_bars() {
        // 4:3 source, 16:9 target → letterboxed with top/bottom bars.
        let src = source_640x480();
        let mut dst = None;
        render(&mut dst, &src, &test_config()).unwrap();
        let out = dst.unwrap();
        assert_eq!(out.size(), src.size());
        // Top bar row is the bar color (black → Y 16).
        assert_eq!(out.data[0], 16);
        // Center row comes from the crop (gradient values, not bar fill).
        let center = out.data[(240 * 640 + 320) as usize];
        assert_ne!(center, 16);
    }

    #[test]
    fn bar_color_is_respected() {
        let src = source_640x480();
        let config = TunerConfig {
            bar_color: "#ffffff".to_string(),
            ..test_config()
        };
        let mut dst = None;
        render(&mut dst, &src, &config).unwrap();
        // White bars → Y 235 in the top letterbox region.
        assert_eq!(dst.as_ref().unwrap().data[0], 235);
    }

    #[test]
    fn zoom_shrinks_the_visible_region() {
        let src = source_640x480();
        let mut config = test_config();
        config.zoom = 2.0;
        let mut dst = None;
        render(&mut dst, &src, &config).unwrap();
        let out = dst.unwrap();
        // Letterbox output stays source-sized under zoom…
        assert_eq!(out.size(), src.size());
        // …and a zoomed frame differs from the unzoomed render.
        let mut plain = None;
        render(&mut plain, &src, &test_config()).unwrap();
        assert_ne!(out.data, plain.unwrap().data);
    }

    #[test]
    fn non_letterbox_output_is_the_zoom1_crop_box() {
        let src = source_640x480();
        let mut config = test_config();
        config.letterbox = false;
        let mut dst = None;
        render(&mut dst, &src, &config).unwrap();
        let out = dst.unwrap();
        // 640x480 (4:3) cropped to 16:9 at zoom 1 → 640x360, even.
        assert_eq!(out.width, 640);
        assert_eq!(out.height, 360);
        // No bars: no pixel equals the untouched fill value at the edges…
        // (top-left is actual image data, not a letterbox fill)
        assert_ne!(out.data[0], 0);
    }

    #[test]
    fn non_letterbox_dimensions_stay_stable_across_zoom() {
        let src = source_640x480();
        let mut config = test_config();
        config.letterbox = false;
        let mut dst = None;
        render(&mut dst, &src, &config).unwrap();
        let first = dst.as_ref().unwrap().size();

        config.zoom = 2.5;
        render(&mut dst, &src, &config).unwrap();
        assert_eq!(dst.as_ref().unwrap().size(), first);
    }

    #[test]
    fn mirror_flips_the_output() {
        let src = source_640x480();
        let mut config = test_config();
        // 4:3 → 16:9 non-letterbox is a 1:1 blit of the center crop, so
        // luma bytes map directly: mirrored output is the reversed row.
        config.letterbox = false;
        let mut mirrored = None;
        config.mirror = true;
        render(&mut mirrored, &src, &config).unwrap();
        let mut normal = None;
        config.mirror = false;
        render(&mut normal, &src, &config).unwrap();
        let (m, n) = (mirrored.unwrap(), normal.unwrap());
        let (w, h) = (n.width as usize, n.height as usize);
        for y in [0, h / 2, h - 1] {
            for x in 0..4 {
                assert_eq!(
                    m.data[y * w + x],
                    n.data[y * w + (w - 1 - x)],
                    "luma row {y} col {x}"
                );
            }
        }
        // Chroma texels mirror within the row too.
        let cw = w / 2;
        for cx in 0..4 {
            assert_eq!(
                m.data[w * h + cx * 2],
                n.data[w * h + (cw - 1 - cx) * 2],
                "chroma U texel {cx}"
            );
        }
    }

    #[test]
    fn flip_vertical_flips_the_output() {
        let src = source_640x480();
        let mut config = test_config();
        config.letterbox = false;
        let mut flipped = None;
        config.flip_vertical = true;
        render(&mut flipped, &src, &config).unwrap();
        let mut normal = None;
        config.flip_vertical = false;
        render(&mut normal, &src, &config).unwrap();
        let (f, n) = (flipped.unwrap(), normal.unwrap());
        let stride = n.width as usize;
        let h = n.height as usize;
        // Top luma row of flipped == bottom luma row of normal.
        assert_eq!(&f.data[..stride], &n.data[(h - 1) * stride..h * stride]);
    }

    #[test]
    fn black_and_white_bars_render_as_reference_yuv() {
        let src = source_640x480();
        for (hex, expected_y) in [("#000000", 16u8), ("#ffffff", 235u8)] {
            let config = TunerConfig {
                bar_color: hex.to_string(),
                ..test_config()
            };
            let mut dst = None;
            render(&mut dst, &src, &config).unwrap();
            // Sample deep inside the top bar (bar is (480-360)/2 = 60 rows).
            assert_eq!(dst.as_ref().unwrap().data[320], expected_y, "{hex}");
        }
    }

    #[test]
    fn invalid_bar_color_falls_back_to_black_bars() {
        let src = source_640x480();
        let config = TunerConfig {
            bar_color: "garbage".to_string(),
            ..test_config()
        };
        let mut dst = None;
        render(&mut dst, &src, &config).unwrap();
        assert_eq!(dst.as_ref().unwrap().data[0], 16);
    }

    /// Throughput of render + preview publish at 1080p30 — run manually:
    /// `cargo test --release bench_1080p -- --ignored --nocapture`
    #[test]
    #[ignore = "throughput benchmark"]
    fn bench_1080p() {
        let src = source_640x480();
        // Real 1080p source (NV12) rendered once.
        let mut hd = Frame::new_nv12(1920, 1080).unwrap();
        hd.blit_resample(&src, Rect::new(0, 0, 640, 480), Rect::new(0, 0, 1920, 1080))
            .unwrap();

        let bus = crate::preview::PreviewBus::new();
        let config = test_config();
        let mut output = None;
        let mut bgra = None;
        let mut preview = None;
        let mut jpeg_buf = Vec::new();

        let frames = 300;
        let start = Instant::now();
        for _ in 0..frames {
            render(&mut output, &hd, &config).unwrap();
            let out = output.as_ref().unwrap();
            publish_preview(out, &mut bgra, &mut preview, &mut jpeg_buf, bus.as_ref());
        }
        let elapsed = start.elapsed();
        let per_frame = elapsed.as_secs_f64() * 1000.0 / frames as f64;
        println!(
            "1080p render+preview: {per_frame:.2} ms/frame ({:.1} fps budget)",
            1000.0 / per_frame
        );
    }

    /// The exact app path — real camera through `Pipeline::start` and the
    /// preview bus. Run manually: `cargo test real_camera_pipeline -- --ignored --nocapture`
    #[test]
    #[ignore = "opens the real camera; needs TCC camera permission"]
    fn real_camera_pipeline_delivers() {
        use camtuner_capture::{CaptureBackend, StreamSettings};

        let mut backend = camtuner_capture::composite::CompositeBackend::new();
        let device = backend
            .list_devices()
            .into_iter()
            .find(|d| !d.is_virtual)
            .expect("no hardware camera");
        println!("opening camera: {}", device.label);

        let stream = backend
            .open(Some(&device.id), StreamSettings::default())
            .unwrap();

        // Mimic run_loop's receive pattern directly.
        for i in 0..6 {
            match stream.recv_timeout(Duration::from_millis(500)) {
                Ok(f) => println!(
                    "poll {i}: frame {}x{} ({}B)",
                    f.width,
                    f.height,
                    f.data.len()
                ),
                Err(poll) => println!("poll {i}: {poll:?}"),
            }
        }

        let bus = crate::preview::PreviewBus::new();
        let mut pipeline = Pipeline::start(stream, test_config(), bus.clone(), None).unwrap();

        // Subscribe immediately (like the app's MJPEG server does).
        let (initial, mut rx) = bus.subscribe();
        println!("initial cached frame present: {}", initial.is_some());

        // Raw blocking recv on a dedicated runtime thread.
        let handle = std::thread::spawn(move || {
            let rt = tokio::runtime::Builder::new_current_thread()
                .enable_time()
                .build()
                .unwrap();
            rt.block_on(async move {
                let mut frames = 0u32;
                let deadline = Instant::now() + Duration::from_secs(2);
                while Instant::now() < deadline {
                    match tokio::time::timeout(Duration::from_millis(300), rx.recv()).await {
                        Ok(Ok(_)) => frames += 1,
                        Ok(Err(_)) => break,
                        Err(_) => {}
                    }
                }
                frames
            })
        });

        std::thread::sleep(Duration::from_millis(2500));
        let (latest, _) = bus.subscribe();
        println!(
            "latest cached frame present after 2.5s: {}",
            latest.is_some()
        );
        if let Some(latest) = latest {
            println!(
                "latest preview: {}x{} jpeg {}B",
                latest.width,
                latest.height,
                latest.jpeg.len()
            );
        }

        let frames = handle.join().unwrap();
        println!("received {frames} frames via bus in 2s window");
        pipeline.stop();

        assert!(frames >= 30, "expected ≥30 preview frames, got {frames}");
    }
}
