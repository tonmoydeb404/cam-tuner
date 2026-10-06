//! Unix-domain-socket server fanning processed frames out to camera-plugin
//! clients.
//!
//! Threading: one accept-loop thread, one writer thread per client, each
//! with a small bounded queue. [`VcamServer::broadcast`] never blocks —
//! a slow client's queue overflows and frames are dropped (preview frames
//! are cheap; latency is not worth stalling the pipeline). Disconnected
//! clients are pruned on the next broadcast.

use std::io::Write;
use std::os::unix::net::UnixStream;
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::mpsc::{self, SyncSender, TrySendError};
use std::sync::{Arc, Mutex};
use std::time::Duration;

use crate::protocol::{self, MessageHeader, MessageType};

/// Per-client queue depth before frames are dropped for that client.
const CLIENT_QUEUE_DEPTH: usize = 4;
/// How often the accept loop checks the stop flag (nonblocking accept).
const ACCEPT_POLL: Duration = Duration::from_millis(50);

#[derive(Debug, Default, Clone, Copy, PartialEq, Eq)]
pub struct ServerStats {
    pub client_count: usize,
}

struct ClientSenders(Mutex<Vec<SyncSender<Vec<u8>>>>);

impl ClientSenders {
    /// Drops senders whose writer thread is gone. Probing with a Ping
    /// doubles as a keepalive for healthy clients.
    fn prune(&self) {
        let ping = MessageHeader {
            message_type: MessageType::Ping,
            version: protocol::PROTOCOL_VERSION,
            width: 0,
            height: 0,
            format: 0,
            pts_us: 0,
            payload_len: 0,
        }
        .encode()
        .to_vec();
        let mut clients = self.0.lock().expect("vcam clients poisoned");
        clients.retain(|sender| {
            !matches!(
                sender.try_send(ping.clone()),
                Err(TrySendError::Disconnected(_))
            )
        });
    }
}

/// A running virtual-camera frame server.
pub struct VcamServer {
    path: PathBuf,
    clients: ClientSenders,
    client_count: AtomicUsize,
    /// Total broadcast calls (diagnostics: compare against client receipts).
    broadcast_count: AtomicUsize,
    stop: Arc<std::sync::atomic::AtomicBool>,
    accept_thread: Mutex<Option<std::thread::JoinHandle<()>>>,
}

impl VcamServer {
    /// Binds `path` (removing a stale socket left by a crash) and starts
    /// accepting clients on a background thread.
    pub fn start(path: &Path) -> std::io::Result<Arc<Self>> {
        if path.exists() {
            // Only remove if nothing is live behind it — a failed connect
            // means the file is a stale socket from a previous run.
            if UnixStream::connect(path).is_ok() {
                return Err(std::io::Error::new(
                    std::io::ErrorKind::AddrInUse,
                    format!(
                        "vcam socket {} already served by another instance",
                        path.display()
                    ),
                ));
            }
            std::fs::remove_file(path).ok();
        }

        let listener = std::os::unix::net::UnixListener::bind(path)?;
        listener.set_nonblocking(true)?;

        let server = Arc::new(Self {
            path: path.to_path_buf(),
            clients: ClientSenders(Mutex::new(Vec::new())),
            client_count: AtomicUsize::new(0),
            broadcast_count: AtomicUsize::new(0),
            stop: Arc::new(std::sync::atomic::AtomicBool::new(false)),
            accept_thread: Mutex::new(None),
        });

        let thread_server = Arc::clone(&server);
        let handle = std::thread::Builder::new()
            .name("camtuner-vcam-accept".to_string())
            .spawn(move || accept_loop(listener, thread_server))?;

        *server.accept_thread.lock().expect("vcam poisoned") = Some(handle);
        Ok(server)
    }

    /// Socket path this server is bound to.
    pub fn path(&self) -> &Path {
        &self.path
    }

    /// Number of currently connected clients.
    pub fn client_count(&self) -> usize {
        self.client_count.load(Ordering::Relaxed)
    }

    /// Broadcast calls since start (diagnostics).
    pub fn broadcast_count(&self) -> usize {
        self.broadcast_count.load(Ordering::Relaxed)
    }

    /// Queues one frame for every connected client. Non-blocking: a full
    /// per-client queue drops the frame for that client only.
    pub fn broadcast(
        &self,
        width: u32,
        height: u32,
        format: u32,
        pts_us: u64,
        payload: &[u8],
    ) -> usize {
        let message =
            protocol::encode_frame_message(width as u16, height as u16, format, pts_us, payload);
        let header = MessageHeader {
            message_type: MessageType::Frame,
            version: protocol::PROTOCOL_VERSION,
            width: width as u16,
            height: height as u16,
            format,
            pts_us,
            payload_len: payload.len() as u32,
        };
        let _ = header; // encoded inside `message`

        let mut clients = self.clients.0.lock().expect("vcam clients poisoned");
        self.broadcast_count.fetch_add(1, Ordering::Relaxed);
        clients.retain(|sender| match sender.try_send(message.clone()) {
            Ok(()) => true,
            Err(TrySendError::Full(_)) => true, // slow client: drop this frame
            Err(TrySendError::Disconnected(_)) => false,
        });
        clients.len()
    }

    /// Stops the accept loop and disconnects all clients. The socket file
    /// is removed so a restart binds cleanly.
    pub fn stop(&self) {
        self.stop.store(true, std::sync::atomic::Ordering::Relaxed);
        if let Some(handle) = self.accept_thread.lock().expect("vcam poisoned").take() {
            let _ = handle.join();
        }
        self.clients
            .0
            .lock()
            .expect("vcam clients poisoned")
            .clear();
        self.client_count.store(0, Ordering::Relaxed);
        std::fs::remove_file(&self.path).ok();
    }
}

impl Drop for VcamServer {
    fn drop(&mut self) {
        self.stop();
    }
}

fn accept_loop(listener: std::os::unix::net::UnixListener, server: Arc<VcamServer>) {
    while !server.stop.load(std::sync::atomic::Ordering::Relaxed) {
        match listener.accept() {
            Ok((stream, _addr)) => spawn_client(&server, stream),
            Err(err) if err.kind() == std::io::ErrorKind::WouldBlock => {
                std::thread::sleep(ACCEPT_POLL);
            }
            Err(err) if err.kind() == std::io::ErrorKind::Interrupted => continue,
            Err(_) => break, // listener dead (e.g. socket file removed)
        }
    }
}

fn spawn_client(server: &Arc<VcamServer>, stream: UnixStream) {
    let (tx, rx) = mpsc::sync_channel::<Vec<u8>>(CLIENT_QUEUE_DEPTH);
    server
        .clients
        .0
        .lock()
        .expect("vcam clients poisoned")
        .push(tx);
    server.client_count.fetch_add(1, Ordering::Relaxed);

    let thread_server = Arc::clone(server);
    let spawned = std::thread::Builder::new()
        .name("camtuner-vcam-client".to_string())
        .spawn(move || {
            client_writer(stream, rx);
            thread_server.client_count.fetch_sub(1, Ordering::Relaxed);
            thread_server.clients.prune();
        });

    if spawned.is_err() {
        // Could not spawn the writer; drop the sender we registered.
        server.client_count.fetch_sub(1, Ordering::Relaxed);
        server.clients.prune();
    }
}

/// Drains the queue to the socket until the client goes away or the server
/// shuts the sender side down.
fn client_writer(mut stream: UnixStream, rx: mpsc::Receiver<Vec<u8>>) {
    stream.set_nonblocking(false).ok();
    while let Ok(message) = rx.recv() {
        if stream.write_all(&message).is_err() {
            break;
        }
    }
    // Dropping `stream` closes the socket; the client sees EOF.
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::protocol::{read_message, FORMAT_UYVY};

    fn temp_socket_path(tag: &str) -> PathBuf {
        let dir = std::env::temp_dir();
        let name = format!("camtuner-vcam-test-{tag}-{}", std::process::id());
        let path = dir.join(name);
        std::fs::remove_file(&path).ok();
        path
    }

    fn wait_for_clients(server: &VcamServer, want: usize) {
        for _ in 0..100 {
            if server.client_count() >= want {
                return;
            }
            std::thread::sleep(Duration::from_millis(10));
        }
        panic!("client did not connect in time");
    }

    #[test]
    fn broadcasts_frames_to_connected_clients() {
        let path = temp_socket_path("basic");
        let server = VcamServer::start(&path).unwrap();

        let mut client = UnixStream::connect(&path).unwrap();
        wait_for_clients(&server, 1);

        let payload = vec![42u8; 64];
        let queued = server.broadcast(8, 4, FORMAT_UYVY, 7, &payload);
        assert_eq!(queued, 1);

        let (header, got) = read_message(&mut client).unwrap();
        assert_eq!(header.message_type, MessageType::Frame);
        assert_eq!(header.width, 8);
        assert_eq!(header.height, 4);
        assert_eq!(header.format, FORMAT_UYVY);
        assert_eq!(header.pts_us, 7);
        assert_eq!(got, payload);

        server.stop();
    }

    #[test]
    fn multiple_clients_each_get_every_frame() {
        let path = temp_socket_path("multi");
        let server = VcamServer::start(&path).unwrap();

        let mut a = UnixStream::connect(&path).unwrap();
        let mut b = UnixStream::connect(&path).unwrap();
        wait_for_clients(&server, 2);

        server.broadcast(4, 4, FORMAT_UYVY, 0, &[1u8; 32]);
        server.broadcast(4, 4, FORMAT_UYVY, 1, &[2u8; 32]);

        for stream in [&mut a, &mut b] {
            let (_, first) = read_message(stream).unwrap();
            let (_, second) = read_message(stream).unwrap();
            assert_eq!(first, vec![1u8; 32]);
            assert_eq!(second, vec![2u8; 32]);
        }

        server.stop();
    }

    #[test]
    fn disconnecting_clients_are_pruned() {
        let path = temp_socket_path("prune");
        let server = VcamServer::start(&path).unwrap();

        let client = UnixStream::connect(&path).unwrap();
        wait_for_clients(&server, 1);
        drop(client);

        // The writer thread notices the closed socket on its next send or
        // the retain pass; poll briefly.
        for _ in 0..100 {
            server.broadcast(4, 4, FORMAT_UYVY, 0, &[0u8; 16]);
            if server.client_count() == 0 {
                break;
            }
            std::thread::sleep(Duration::from_millis(10));
        }
        assert_eq!(server.client_count(), 0);

        server.stop();
    }

    #[test]
    fn rejects_binding_a_live_socket() {
        let path = temp_socket_path("inuse");
        let server = VcamServer::start(&path).unwrap();
        // A second server on the same path must refuse (the first is live).
        assert!(VcamServer::start(&path).is_err());
        server.stop();

        // After stop, the path is free again.
        let restarted = VcamServer::start(&path).unwrap();
        restarted.stop();
    }

    #[test]
    fn stale_socket_file_is_replaced() {
        let path = temp_socket_path("stale");
        std::fs::write(&path, b"garbage").unwrap();
        let server = VcamServer::start(&path).unwrap();
        assert!(path.exists());
        server.stop();
        assert!(!path.exists(), "stop removes the socket file");
    }

    fn set_sock_bufs(stream: &UnixStream, bytes: usize) {
        use std::os::fd::AsRawFd;
        let fd = stream.as_raw_fd();
        let val: libc::c_int = bytes as libc::c_int;
        unsafe {
            libc::setsockopt(
                fd,
                libc::SOL_SOCKET,
                libc::SO_SNDBUF,
                &val as *const _ as *const libc::c_void,
                std::mem::size_of::<libc::c_int>() as u32,
            );
            libc::setsockopt(
                fd,
                libc::SOL_SOCKET,
                libc::SO_RCVBUF,
                &val as *const _ as *const libc::c_void,
                std::mem::size_of::<libc::c_int>() as u32,
            );
        }
    }

    #[test]
    #[ignore = "throughput probe"]
    fn uds_throughput_probe() {
        use std::io::{Read, Write};
        use std::time::Instant;

        let payload = vec![7u8; 4_147_200];

        for (label, sndbuf, rcvbuf) in [("default", 0, 0), ("4MB", 4 << 20, 4 << 20)] {
            let (mut a, mut b) = UnixStream::pair().unwrap();
            if sndbuf > 0 {
                set_sock_bufs(&a, sndbuf);
                set_sock_bufs(&b, rcvbuf);
            }
            let reader = std::thread::spawn(move || {
                let mut buf = vec![0u8; 4_147_200];
                let t = Instant::now();
                for _ in 0..30 {
                    b.read_exact(&mut buf).unwrap();
                }
                t.elapsed()
            });
            let write_start = Instant::now();
            for _ in 0..30 {
                a.write_all(&payload).unwrap();
            }
            let write_time = write_start.elapsed();
            let read_time = reader.join().unwrap();
            println!(
                "{label} buffers: write {write_time:?} read {read_time:?} ({:.0} MB/s read)",
                30.0 * 4.1472 / read_time.as_secs_f64()
            );
        }
    }
}
