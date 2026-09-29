//! camtuner-capture — camera capture backends for CamTuner Desktop.
//!
//! [`CaptureBackend`] is the seam between hardware and the processing
//! pipeline: device enumeration plus opening a [`FrameStream`] that yields
//! NV12 frames. Implementations:
//! - [`avfoundation::AvFoundationBackend`] — macOS hardware cameras (NV12
//!   straight off the capture session).
//! - [`synthetic::SyntheticBackend`] — animated test pattern, no camera
//!   needed (dev, CI, permission-less demos).
//! - [`composite::CompositeBackend`] — hardware + synthetic, used by the app.

pub mod avfoundation;
pub mod composite;
pub mod synthetic;

use camtuner_core::frame::{Frame, PixelFormat};
use std::sync::mpsc::{Receiver, RecvTimeoutError};
use std::time::Duration;

/// The backend the desktop app runs: real cameras plus the test pattern.
pub fn default_backend() -> Box<dyn CaptureBackend> {
    Box::new(composite::CompositeBackend::new())
}

/// A capture device advertised by a backend.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DeviceInfo {
    /// Stable id used to open the device (`uniqueID` on AVFoundation).
    pub id: String,
    /// Human-readable label (e.g. "FaceTime HD Camera").
    pub label: String,
    /// True when the device is software-provided (e.g. the synthetic source).
    pub is_virtual: bool,
}

/// Requested stream parameters for opening a device.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct StreamSettings {
    pub width: u32,
    pub height: u32,
    pub fps: u32,
}

impl Default for StreamSettings {
    fn default() -> Self {
        Self {
            width: 1920,
            height: 1080,
            fps: 30,
        }
    }
}

/// Live frame flow from an opened device. Dropping the stream (and its
/// receiver) signals the backend to stop delivering frames.
#[derive(Debug)]
pub struct FrameStream {
    pub settings: StreamSettings,
    pub format: PixelFormat,
    rx: Receiver<Frame>,
}

/// Outcome of a non-blocking poll of a [`FrameStream`].
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum StreamPoll {
    /// No frame available yet; poll again later.
    Timeout,
    /// The source has stopped (sender dropped); no more frames ever.
    Ended,
}

impl FrameStream {
    pub fn new(settings: StreamSettings, format: PixelFormat, rx: Receiver<Frame>) -> Self {
        Self {
            settings,
            format,
            rx,
        }
    }

    /// Next frame, or `None` once the source has stopped.
    pub fn recv(&self) -> Option<Frame> {
        self.rx.recv().ok()
    }

    /// Next frame if one is already queued, without blocking. Used to skip
    /// ahead to the freshest frame when the consumer is running behind.
    pub fn try_recv(&self) -> Option<Frame> {
        self.rx.try_recv().ok()
    }

    /// Next frame with a timeout (used by the pipeline to interleave config
    /// polling and shutdown checks).
    pub fn recv_timeout(&self, timeout: Duration) -> Result<Frame, StreamPoll> {
        match self.rx.recv_timeout(timeout) {
            Ok(frame) => Ok(frame),
            Err(RecvTimeoutError::Timeout) => Err(StreamPoll::Timeout),
            Err(RecvTimeoutError::Disconnected) => Err(StreamPoll::Ended),
        }
    }
}

/// Errors surfaced when opening capture.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum CaptureError {
    UnknownDevice {
        id: String,
    },
    NoDevices,
    /// Platform backend failed (permission denied, device busy, …).
    OpenFailed {
        reason: String,
    },
}

/// A capture backend: enumerates devices and opens frame streams.
pub trait CaptureBackend: Send {
    fn list_devices(&self) -> Vec<DeviceInfo>;
    fn open(
        &mut self,
        device_id: Option<&str>,
        settings: StreamSettings,
    ) -> Result<FrameStream, CaptureError>;
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn default_settings_request_1080p30() {
        let settings = StreamSettings::default();
        assert_eq!(
            settings,
            StreamSettings {
                width: 1920,
                height: 1080,
                fps: 30
            }
        );
    }

    #[test]
    fn frame_stream_recv_returns_none_after_disconnect() {
        let (tx, rx) = std::sync::mpsc::channel();
        let stream = FrameStream::new(StreamSettings::default(), PixelFormat::Nv12, rx);
        drop(tx);
        assert!(stream.recv().is_none());
    }
}
