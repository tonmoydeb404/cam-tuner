//! Standalone vcam test server: streams an animated UYVY test pattern into
//! the virtual-camera socket so the DAL plugin can be verified without the
//! full app. Run from `crates/`:
//!
//! ```
//! cargo run -p camtuner-vcam --bin vcam-test-server -- [socket-path]
//! ```
//!
//! Defaults to the release socket path the plugin expects. Ctrl-C to stop.

use std::path::PathBuf;
use std::time::{Duration, Instant};

use camtuner_capture::synthetic::render_frame;
use camtuner_core::frame::Frame;
use camtuner_vcam::server::VcamServer;

fn main() {
    let path = std::env::args()
        .nth(1)
        .unwrap_or_else(|| "/var/tmp/cam-tuner-vcam.sock".to_string());
    let path = PathBuf::from(path);
    std::fs::remove_file(&path).ok();

    let server = VcamServer::start(&path).expect("bind vcam socket");
    println!("streaming test pattern on {}", path.display());
    println!("connect a client (e.g. OBS with the CamTuner plugin installed). Ctrl-C to stop.");

    let mut source = Frame::new_nv12(1280, 720).unwrap();
    let mut index = 0u64;
    let frame_period = Duration::from_secs_f64(1.0 / 30.0);
    let mut next_frame_at = Instant::now();

    loop {
        render_frame(&mut source, index);
        let uyvy = source.nv12_to_uyvy().expect("convert to uyvy");
        let clients = server.broadcast(
            uyvy.width,
            uyvy.height,
            camtuner_vcam::protocol::FORMAT_UYVY,
            index * 33_333,
            &uyvy.data,
        );
        index += 1;
        if index.is_multiple_of(30) {
            println!("frame {index} → {clients} client(s)");
        }
        next_frame_at += frame_period;
        let now = Instant::now();
        if next_frame_at > now {
            std::thread::sleep(next_frame_at - now);
        } else {
            next_frame_at = now;
        }
    }
}
