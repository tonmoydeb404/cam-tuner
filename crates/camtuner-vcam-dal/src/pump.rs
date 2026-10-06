//! The frame pump: connects to the app's virtual-camera socket and pushes
//! received UYVY frames into the DAL buffer queue as CMSampleBuffers.
//!
//! Runs on a dedicated thread started by `DeviceStartStream`. Reconnects
//! with backoff when the app isn't running (the device stays listed and
//! holds its last frame — clients see a still frame rather than a dead
//! camera).

use std::net::Shutdown;
use std::os::raw::c_void;
use std::path::PathBuf;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::time::Duration;

use camtuner_vcam::protocol::{read_message, MessageType};

use crate::ffi::*;
use crate::plugin::{self, state, FrameBytes};

/// Default socket path; must match the app's `vcam_socket_path` for release
/// builds. Dev builds pass the dev path via `CAMTUNER_VCAM_SOCKET`.
pub const DEFAULT_SOCKET_PATH: &str = "/var/tmp/cam-tuner-vcam.sock";

/// Handle for the running pump; dropping it does not stop the thread —
/// call [`FramePump::stop`].
pub struct FramePump {
    stop: Arc<AtomicBool>,
    handle: Option<std::thread::JoinHandle<()>>,
}

impl FramePump {
    pub fn start(socket_path: PathBuf) -> Result<Self, String> {
        let stop = Arc::new(AtomicBool::new(false));
        let thread_stop = Arc::clone(&stop);
        let handle = std::thread::Builder::new()
            .name("camtuner-vcam-dal-pump".to_string())
            .spawn(move || run(thread_stop, socket_path))
            .map_err(|err| format!("failed to spawn vcam pump: {err}"))?;
        Ok(Self {
            stop,
            handle: Some(handle),
        })
    }

    pub fn stop(&mut self) {
        self.stop.store(true, Ordering::Relaxed);
        if let Some(handle) = self.handle.take() {
            let _ = handle.join();
        }
    }
}

impl Drop for FramePump {
    fn drop(&mut self) {
        self.stop();
    }
}

fn run(stop: Arc<AtomicBool>, socket_path: PathBuf) {
    while !stop.load(Ordering::Relaxed) {
        match std::os::unix::net::UnixStream::connect(&socket_path) {
            Ok(stream) => {
                stream.set_nonblocking(false).ok();
                serve(stop.clone(), stream);
            }
            Err(_) => {
                // App not running; retry at a leisurely pace.
                std::thread::sleep(Duration::from_millis(500));
            }
        }
    }
}

fn serve(stop: Arc<AtomicBool>, mut stream: std::os::unix::net::UnixStream) {
    stream
        .set_read_timeout(Some(Duration::from_millis(750)))
        .ok();
    while !stop.load(Ordering::Relaxed) {
        match read_message(&mut stream) {
            Ok((header, payload)) => {
                if header.message_type == MessageType::Ping {
                    continue;
                }
                let frame = FrameBytes {
                    width: u32::from(header.width),
                    height: u32::from(header.height),
                    pts_us: header.pts_us,
                    payload: Arc::new(payload),
                };
                {
                    let mut latest = state().latest_frame.lock().expect("frame slot poisoned");
                    *latest = Some(frame);
                }
                unsafe {
                    push_latest_to_queue();
                }
            }
            // Read timeout is normal when the app pauses its stream.
            Err(camtuner_vcam::protocol::ProtocolError::Io(err)) if err.contains("timed out") => {
                continue;
            }
            Err(_) => break, // disconnect: reconnect with backoff
        }
    }
    stream.shutdown(Shutdown::Both).ok();
}

/// Wraps the latest frame in a CVPixelBuffer + CMSampleBuffer and enqueues
/// it for the DAL. All FFI entry points are panic-guarded by the vtable
/// caller; this function assumes `latest_frame` is populated.
unsafe fn push_latest_to_queue() {
    let s = state();
    let (queue_ptr, altered_proc, altered_refcon) = {
        let guard = s.queue.lock().expect("stream queue poisoned");
        match guard.as_ref() {
            Some(q) => (q.queue, q.altered_proc, q.altered_refcon),
            None => return,
        }
    };

    let Some(frame) = s
        .latest_frame
        .lock()
        .expect("frame slot poisoned")
        .as_ref()
        .map(|f| (f.width, f.height, f.pts_us, Arc::clone(&f.payload)))
    else {
        return;
    };
    let (width, height, pts_us, payload) = frame;
    let (width, height) = (width as usize, height as usize);

    // 1. Allocate a pixel buffer in the stream's format.
    let mut pixel_buffer: *mut c_void = std::ptr::null_mut();
    if CVPixelBufferCreate(
        kCFAllocatorDefault,
        width,
        height,
        kCMVideoCodecType_422YpCbCr8,
        std::ptr::null(),
        &mut pixel_buffer,
    ) != 0
        || pixel_buffer.is_null()
    {
        return;
    }

    // 2. Copy UYVY bytes honoring the buffer's row stride.
    if CVPixelBufferLockBaseAddress(pixel_buffer, 0) == 0 {
        let base = CVPixelBufferGetBaseAddress(pixel_buffer);
        let stride = CVPixelBufferGetBytesPerRow(pixel_buffer);
        if !base.is_null() && stride >= width * 2 {
            let dst = std::slice::from_raw_parts_mut(base as *mut u8, stride * height);
            for row in 0..height {
                let src = &payload[row * width * 2..(row + 1) * width * 2];
                dst[row * stride..row * stride + width * 2].copy_from_slice(src);
            }
        }
        CVPixelBufferUnlockBaseAddress(pixel_buffer, 0);
    }

    // 3. Wrap in a sample buffer with timing.
    let desc = plugin::format_description_for(width as u32, height as u32);
    let valid = 1u32;
    let timing = CMSampleTimingInfo {
        duration: CMTime {
            value: 1,
            timescale: 30,
            flags: valid,
            epoch: 0,
        },
        presentationTimeStamp: CMTime {
            value: pts_us as i64,
            timescale: 1_000_000,
            flags: valid,
            epoch: 0,
        },
        decodeTimeStamp: CMTime {
            value: 0,
            timescale: 0,
            flags: 0,
            epoch: 0,
        },
    };
    let mut sample_buffer: *mut c_void = std::ptr::null_mut();
    let status = CMSampleBufferCreateForImageBuffer(
        kCFAllocatorDefault,
        pixel_buffer,
        1,
        std::ptr::null(),
        std::ptr::null(),
        desc,
        &timing,
        &mut sample_buffer,
    );
    if status != 0 || sample_buffer.is_null() {
        CFRelease(pixel_buffer);
        return;
    }

    // 4. Hand off to the DAL queue; the queue retains the sample buffer.
    let enqueued = CMSimpleQueueEnqueue(queue_ptr, sample_buffer) == 0;
    CFRelease(sample_buffer); // our reference; queue holds its own
    let _ = enqueued;

    // 5. Tell the DAL new buffers exist.
    if let Some(proc_) = altered_proc {
        proc_(altered_refcon, queue_ptr);
    }
}
