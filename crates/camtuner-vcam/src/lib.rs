//! camtuner-vcam — virtual-camera transport for CamTuner.
//!
//! The pipeline produces processed frames; native camera plugins (CMIO DAL
//! on macOS, v4l2loopback writers on Linux) run inside or beside client
//! apps and need those frames. This crate defines the wire contract and the
//! app-side server both sides share:
//!
//! - [`protocol`] — fixed 32-byte message header + payload framing, plus
//!   blocking read/write helpers over any `Read`/`Write` (the plugin crate
//!   reuses them verbatim).
//! - [`server`] — a Unix-domain-socket server that fans frames out to every
//!   connected client. Slow clients drop frames instead of stalling the
//!   pipeline; disconnected clients are pruned lazily.
//!
//! Frame payloads are UYVY (`'2vuy'`) — the format CMIO virtual cameras
//! advertise — converted from the pipeline's NV12 by [`encode_frame`].

pub mod protocol;
pub mod server;

use camtuner_core::frame::Frame;

/// Converts a processed NV12 frame and hands it to every connected client.
/// Returns the number of clients the frame was queued for.
pub fn encode_frame(server: &server::VcamServer, frame: &Frame) -> usize {
    match frame.nv12_to_uyvy() {
        Ok(uyvy) => server.broadcast(
            uyvy.width,
            uyvy.height,
            protocol::FORMAT_UYVY,
            0,
            &uyvy.data,
        ),
        Err(_) => 0,
    }
}
