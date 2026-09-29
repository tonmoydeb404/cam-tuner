//! AVFoundation capture backend (macOS).
//!
//! Owns an `AVCaptureSession` on a dedicated thread, negotiated to deliver
//! NV12 (`420v`) pixel buffers — the exact format the pipeline processes —
//! via a sample-buffer delegate on a serial dispatch queue. Frames stop when
//! the [`FrameStream`] is dropped (the delegate notices the closed channel
//! and flags the session thread to stop).
//!
//! All AVFoundation objects live on the session thread; the delegate is the
//! only cross-thread component and communicates exclusively through the
//! frame channel plus an atomic flag.

use crate::{CaptureBackend, CaptureError, DeviceInfo, FrameStream, StreamSettings};
use camtuner_core::frame::{Frame, PixelFormat};
use objc2::define_class;
use objc2::rc::Retained;
use objc2::runtime::{AnyObject, Bool, NSObject, NSObjectProtocol, ProtocolObject};
use objc2::{AnyThread, DefinedClass};
use objc2_av_foundation::{
    AVAuthorizationStatus, AVCaptureDevice, AVCaptureDeviceDiscoverySession, AVCaptureDeviceInput,
    AVCaptureDevicePosition, AVCaptureDeviceTypeBuiltInWideAngleCamera,
    AVCaptureDeviceTypeExternal, AVCaptureOutput, AVCaptureSession, AVCaptureSessionPreset,
    AVCaptureVideoDataOutput, AVCaptureVideoDataOutputSampleBufferDelegate,
};
use objc2_core_foundation::CFRetained;
use objc2_core_media::CMSampleBuffer;
use objc2_core_video::{
    kCVPixelBufferPixelFormatTypeKey, kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange,
    CVPixelBuffer, CVPixelBufferLockFlags,
};
use objc2_foundation::{NSArray, NSDictionary, NSNumber, NSString};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::mpsc::{self, Sender};
use std::sync::Arc;
use std::thread;
use std::time::Duration;

/// How often the session thread checks the stop flag.
const SESSION_POLL_INTERVAL: Duration = Duration::from_millis(150);
/// How long `open` waits for the session to report readiness.
const START_TIMEOUT: Duration = Duration::from_secs(10);
/// How long to wait for the user to answer the macOS camera prompt.
const PERMISSION_TIMEOUT: Duration = Duration::from_secs(120);

/// Hardware camera capture via AVFoundation.
#[derive(Debug, Default, Clone, Copy)]
pub struct AvFoundationBackend;

impl AvFoundationBackend {
    pub fn new() -> Self {
        Self
    }
}

impl CaptureBackend for AvFoundationBackend {
    fn list_devices(&self) -> Vec<DeviceInfo> {
        discover_devices()
    }

    fn open(
        &mut self,
        device_id: Option<&str>,
        settings: StreamSettings,
    ) -> Result<FrameStream, CaptureError> {
        // Validate the device id first — enumeration needs no permission, so
        // bad ids fail without triggering the macOS camera prompt.
        let devices = discover_devices();
        let device = match device_id {
            Some(id) => devices
                .iter()
                .find(|d| d.id == id)
                .ok_or_else(|| CaptureError::UnknownDevice { id: id.to_string() })?,
            None => devices.first().ok_or(CaptureError::NoDevices)?,
        };
        let device_id = device.id.clone();

        ensure_camera_permission()?;

        let (tx, rx) = mpsc::channel();
        let closed = Arc::new(AtomicBool::new(false));
        let (ready_tx, ready_rx) = mpsc::channel::<Result<(), String>>();

        let thread_closed = closed.clone();
        thread::Builder::new()
            .name("camtuner-avf-session".to_string())
            .spawn(move || {
                run_session(&device_id, tx, thread_closed, ready_tx);
            })
            .map_err(|err| CaptureError::OpenFailed {
                reason: format!("failed to spawn capture session thread: {err}"),
            })?;

        match ready_rx.recv_timeout(START_TIMEOUT) {
            Ok(Ok(())) => {}
            Ok(Err(reason)) => return Err(CaptureError::OpenFailed { reason }),
            Err(_) => {
                // Session thread hung starting; flag it dead and report.
                closed.store(true, Ordering::Relaxed);
                return Err(CaptureError::OpenFailed {
                    reason: "camera session failed to start in time".to_string(),
                });
            }
        }

        Ok(FrameStream::new(settings, PixelFormat::Nv12, rx))
    }
}

/// `AVMediaTypeVideo`, or `None` if the constant failed to load (never in
/// practice).
fn video_media_type() -> Option<&'static NSString> {
    // SAFETY: statics hold constant NSStrings exported by AVFoundation.
    unsafe { objc2_av_foundation::AVMediaTypeVideo }
}

/// Enumerates video capture devices (no camera permission required; names
/// may be redacted by the OS until access is granted).
fn discover_devices() -> Vec<DeviceInfo> {
    let Some(media_type) = video_media_type() else {
        return Vec::new();
    };
    let devices: Retained<NSArray<AVCaptureDevice>> = unsafe {
        let types = NSArray::from_slice(&[
            AVCaptureDeviceTypeBuiltInWideAngleCamera,
            AVCaptureDeviceTypeExternal,
        ]);
        let discovery =
            AVCaptureDeviceDiscoverySession::discoverySessionWithDeviceTypes_mediaType_position(
                &types,
                Some(media_type),
                AVCaptureDevicePosition::Unspecified,
            );
        discovery.devices()
    };

    unsafe {
        devices
            .iter()
            .map(|device| DeviceInfo {
                id: device.uniqueID().to_string(),
                label: device.localizedName().to_string(),
                is_virtual: false,
            })
            .collect()
    }
}

fn ensure_camera_permission() -> Result<(), CaptureError> {
    let denied = || CaptureError::OpenFailed {
        reason: "camera access denied — grant it in System Settings → Privacy \
                 & Security → Camera"
            .to_string(),
    };

    let Some(media_type) = video_media_type() else {
        return Err(CaptureError::OpenFailed {
            reason: "AVMediaTypeVideo constant unavailable".to_string(),
        });
    };

    let status = unsafe { AVCaptureDevice::authorizationStatusForMediaType(media_type) };
    match status {
        AVAuthorizationStatus::Authorized => Ok(()),
        AVAuthorizationStatus::NotDetermined => {
            let (granted_tx, granted_rx) = mpsc::channel();
            let handler = block2::RcBlock::new(move |granted: Bool| {
                let _ = granted_tx.send(granted.as_bool());
            });
            unsafe {
                AVCaptureDevice::requestAccessForMediaType_completionHandler(media_type, &handler);
            }
            match granted_rx.recv_timeout(PERMISSION_TIMEOUT) {
                Ok(true) => Ok(()),
                Ok(false) => Err(denied()),
                Err(_) => Err(CaptureError::OpenFailed {
                    reason: "timed out waiting for camera permission".to_string(),
                }),
            }
        }
        _ => Err(denied()),
    }
}

/// The delegate's shared state: frames flow out; a closed channel or dropped
/// stream flips `closed` so the session thread tears down.
struct FrameSink {
    tx: Sender<Frame>,
    closed: Arc<AtomicBool>,
}

define_class!(
    #[unsafe(super(NSObject))]
    #[ivars = FrameSink]
    #[name = "CamTunerSampleDelegate"]
    struct SampleDelegate;

    unsafe impl NSObjectProtocol for SampleDelegate {}

    unsafe impl AVCaptureVideoDataOutputSampleBufferDelegate for SampleDelegate {
        #[unsafe(method(captureOutput:didOutputSampleBuffer:fromConnection:))]
        fn capture_output(
            &self,
            _output: &AVCaptureOutput,
            sample_buffer: &CMSampleBuffer,
            _connection: &objc2_av_foundation::AVCaptureConnection,
        ) {
            let sink = self.ivars();
            if sink.closed.load(Ordering::Relaxed) {
                return;
            }
            if let Some(frame) = extract_nv12(sample_buffer) {
                if sink.tx.send(frame).is_err() {
                    sink.closed.store(true, Ordering::Relaxed);
                }
            }
        }
    }
);

impl SampleDelegate {
    fn new(sink: FrameSink) -> Retained<Self> {
        let this = Self::alloc().set_ivars(sink);
        unsafe { objc2::msg_send![super(this), init] }
    }
}

/// Copies an NV12 pixel buffer out of the sample buffer into an owned
/// [`Frame`]. Returns `None` for unexpected formats (we negotiate `420v`,
/// so anything else is a bug worth dropping silently on).
fn extract_nv12(sample: &CMSampleBuffer) -> Option<Frame> {
    let image_buffer = unsafe { sample.image_buffer() }?;
    // SAFETY: video sample buffers always carry a CVPixelBuffer as their
    // image buffer — CVImageBuffer → CVPixelBuffer is toll-free bridged.
    let pixel_buffer: CFRetained<CVPixelBuffer> =
        unsafe { CFRetained::cast_unchecked(image_buffer) };

    if CVPixelBufferGetPixelFormatType(&pixel_buffer)
        != kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange
    {
        return None;
    }

    let width = CVPixelBufferGetWidth(&pixel_buffer) as u32;
    let height = CVPixelBufferGetHeight(&pixel_buffer) as u32;
    if width == 0 || height == 0 || !width.is_multiple_of(2) || !height.is_multiple_of(2) {
        return None;
    }

    // SAFETY: base addresses are valid while the buffer is locked read-only.
    unsafe {
        if CVPixelBufferLockBaseAddress(&pixel_buffer, CVPixelBufferLockFlags::ReadOnly) != 0 {
            return None;
        }
    }
    let copy = unsafe { copy_pixel_buffer(&pixel_buffer, width, height) };
    unsafe { CVPixelBufferUnlockBaseAddress(&pixel_buffer, CVPixelBufferLockFlags::ReadOnly) };
    copy
}

unsafe fn copy_pixel_buffer(
    pixel_buffer: &CVPixelBuffer,
    width: u32,
    height: u32,
) -> Option<Frame> {
    let (w, h) = (width as usize, height as usize);
    let y_base = CVPixelBufferGetBaseAddressOfPlane(pixel_buffer, 0);
    if y_base.is_null() {
        return None;
    }
    let y_base = y_base as *const u8;
    let y_stride = CVPixelBufferGetBytesPerRowOfPlane(pixel_buffer, 0);
    let uv_base = CVPixelBufferGetBaseAddressOfPlane(pixel_buffer, 1);
    if uv_base.is_null() {
        return None;
    }
    let uv_base = uv_base as *const u8;
    let uv_stride = CVPixelBufferGetBytesPerRowOfPlane(pixel_buffer, 1);

    let mut data = vec![0u8; w * h * 3 / 2];
    for row in 0..h {
        let src = y_base.add(row * y_stride);
        data[row * w..(row + 1) * w].copy_from_slice(std::slice::from_raw_parts(src, w));
    }
    for row in 0..h / 2 {
        let src = uv_base.add(row * uv_stride);
        let dst = &mut data[w * h + row * w..w * h + (row + 1) * w];
        dst.copy_from_slice(std::slice::from_raw_parts(src, w));
    }

    Some(Frame {
        format: PixelFormat::Nv12,
        width,
        height,
        data,
    })
}

// SAFETY: plain C functions taking a valid locked pixel buffer.
use objc2_core_video::{
    CVPixelBufferGetBaseAddressOfPlane, CVPixelBufferGetBytesPerRowOfPlane, CVPixelBufferGetHeight,
    CVPixelBufferGetPixelFormatType, CVPixelBufferGetWidth, CVPixelBufferLockBaseAddress,
    CVPixelBufferUnlockBaseAddress,
};

/// Builds and runs the capture session on its own thread. Reports readiness
/// (or the failure reason) through `ready_tx` once `startRunning` returns.
fn run_session(
    device_id: &str,
    tx: Sender<Frame>,
    closed: Arc<AtomicBool>,
    ready_tx: mpsc::Sender<Result<(), String>>,
) {
    let fail = |ready_tx: &mpsc::Sender<Result<(), String>>, reason: String| {
        let _ = ready_tx.send(Err(reason));
    };

    let Some(device) = (unsafe {
        let types = NSArray::from_slice(&[
            AVCaptureDeviceTypeBuiltInWideAngleCamera,
            AVCaptureDeviceTypeExternal,
        ]);
        let Some(media_type) = video_media_type() else {
            return fail(&ready_tx, "AVMediaTypeVideo unavailable".to_string());
        };
        AVCaptureDeviceDiscoverySession::discoverySessionWithDeviceTypes_mediaType_position(
            &types,
            Some(media_type),
            AVCaptureDevicePosition::Unspecified,
        )
        .devices()
        .iter()
        .find(|d| d.uniqueID().to_string() == device_id)
    }) else {
        return fail(&ready_tx, format!("camera {device_id} not found"));
    };

    let session = unsafe { AVCaptureSession::new() };

    unsafe {
        // Prefer 1080p; fall back to the device's "High" preset.
        let preset: &AVCaptureSessionPreset =
            if session.canSetSessionPreset(objc2_av_foundation::AVCaptureSessionPreset1920x1080) {
                objc2_av_foundation::AVCaptureSessionPreset1920x1080
            } else {
                objc2_av_foundation::AVCaptureSessionPresetHigh
            };
        session.setSessionPreset(preset);
    }

    let input = unsafe { AVCaptureDeviceInput::deviceInputWithDevice_error(&device) };
    let Ok(input) = input else {
        return fail(&ready_tx, "failed to create camera input".to_string());
    };
    if !unsafe { session.canAddInput(&input) } {
        return fail(
            &ready_tx,
            "camera input rejected — the device may be in use by another app".to_string(),
        );
    }
    unsafe { session.addInput(&input) };

    let output = unsafe { AVCaptureVideoDataOutput::new() };
    unsafe { output.setAlwaysDiscardsLateVideoFrames(true) };
    // Negotiate NV12 (limited range) — the pipeline's native format.
    let format_key = NSString::from_str(&unsafe { kCVPixelBufferPixelFormatTypeKey.to_string() });
    let format_value = NSNumber::new_u32(kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange);
    let object: &AnyObject = &format_value;
    let settings = NSDictionary::<NSString, AnyObject>::from_slices(&[&*format_key], &[object]);
    unsafe { output.setVideoSettings(Some(&settings)) };

    let delegate = SampleDelegate::new(FrameSink {
        tx,
        closed: closed.clone(),
    });
    let queue =
        dispatch2::DispatchQueue::new("camtuner.capture", dispatch2::DispatchQueueAttr::SERIAL);
    let proto = ProtocolObject::from_retained(delegate.clone());
    unsafe {
        output.setSampleBufferDelegate_queue(Some(&proto), Some(&queue));
    }

    if !unsafe { session.canAddOutput(&output) } {
        return fail(&ready_tx, "camera output rejected".to_string());
    }
    unsafe { session.addOutput(&output) };

    unsafe { session.startRunning() };
    let _ = ready_tx.send(Ok(()));

    // Serve frames until the consumer drops the stream (or app shutdown).
    while !closed.load(Ordering::Relaxed) {
        thread::sleep(SESSION_POLL_INTERVAL);
    }

    unsafe { session.stopRunning() };
    // Keep AVF objects alive until after stopRunning (drop order).
    drop((delegate, output, input, queue));
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn enumerates_at_least_one_camera_on_mac() {
        let devices = AvFoundationBackend::new().list_devices();
        assert!(
            !devices.is_empty(),
            "expected at least one camera on this Mac"
        );
        assert!(devices.iter().all(|d| !d.id.is_empty()));
        for device in &devices {
            println!("found camera: {} ({})", device.label, device.id);
        }
    }

    #[test]
    fn unknown_device_id_is_rejected() {
        let mut backend = AvFoundationBackend::new();
        let err = backend
            .open(Some("definitely-not-a-camera"), StreamSettings::default())
            .unwrap_err();
        assert!(matches!(err, CaptureError::UnknownDevice { .. }));
    }

    /// Requires camera permission (TCC) — run manually with
    /// `cargo test -- --ignored`.
    #[test]
    #[ignore = "opens the real camera; needs TCC camera permission"]
    fn opens_a_real_frame_stream() {
        let mut backend = AvFoundationBackend::new();
        let stream = backend.open(None, StreamSettings::default()).unwrap();
        let frame = stream.recv().expect("first frame within timeout");
        assert_eq!(frame.format, PixelFormat::Nv12);
        assert!(frame.width >= 640 && frame.height >= 360);
    }
}
