//! Local MJPEG preview server.
//!
//! Serves the processed pipeline output as a `multipart/x-mixed-replace`
//! MJPEG stream on `127.0.0.1:<random port>` protected by a per-session
//! random token. Any webview renders it with a plain `<img>` tag — no
//! platform-specific transport needed. Upgrading to a native surface later
//! only replaces this module's consumer, not the pipeline.

use std::sync::{Arc, Mutex};

use axum::body::Body;
use axum::extract::{Query, State};
use axum::http::{header, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::get;
use axum::Router;
use tokio::sync::{broadcast, watch};
use tokio_stream::wrappers::BroadcastStream;
use tokio_stream::StreamExt;

use std::collections::HashMap;

/// One encoded preview frame handed from the pipeline thread to the server.
#[derive(Clone)]
pub struct PreviewFrame {
    pub jpeg: Arc<Vec<u8>>,
    pub width: u32,
    pub height: u32,
}

/// Fan-out hub for preview frames. The pipeline publishes; each connected
/// webview (and tests) subscribes. Keeps the latest frame so a freshly
/// mounted `<img>` shows a picture instantly instead of waiting a frame.
pub struct PreviewBus {
    tx: broadcast::Sender<PreviewFrame>,
    latest: Mutex<Option<PreviewFrame>>,
}

impl PreviewBus {
    pub fn new() -> Arc<Self> {
        let (tx, _) = broadcast::channel(4);
        Arc::new(Self {
            tx,
            latest: Mutex::new(None),
        })
    }

    pub fn publish(&self, frame: PreviewFrame) {
        *self.latest.lock().expect("preview bus poisoned") = Some(frame.clone());
        let _ = self.tx.send(frame); // Err = no subscribers yet, fine
    }

    /// True when at least one consumer is subscribed (MJPEG connections
    /// subscribe in the handler; tests subscribe directly). The pipeline
    /// skips JPEG encoding entirely while this is false — at 1080p that's
    /// the difference between ~18 and ~30 fps in dev builds.
    pub fn has_consumers(&self) -> bool {
        self.tx.receiver_count() > 0
    }

    /// Returns the cached latest frame (if any) plus a live subscription.
    pub fn subscribe(&self) -> (Option<PreviewFrame>, broadcast::Receiver<PreviewFrame>) {
        (
            self.latest.lock().expect("preview bus poisoned").clone(),
            self.tx.subscribe(),
        )
    }
}

impl Default for PreviewBus {
    fn default() -> Self {
        let (tx, _) = broadcast::channel(4);
        Self {
            tx,
            latest: Mutex::new(None),
        }
    }
}

/// Handle to a running preview server. Dropping it does not stop the server
/// (the tokio task ends with the app); call [`Self::stop`] for a graceful
/// shutdown.
pub struct PreviewServer {
    /// Full URL for the webview: `http://127.0.0.1:<port>/stream?t=<token>`
    pub url: String,
    shutdown_tx: watch::Sender<bool>,
}

impl PreviewServer {
    /// Binds `127.0.0.1:0`, generates a session token, and starts serving on
    /// Tauri's async runtime.
    pub async fn start(bus: Arc<PreviewBus>) -> Result<Self, String> {
        let listener = tokio::net::TcpListener::bind("127.0.0.1:0")
            .await
            .map_err(|err| format!("failed to bind preview server: {err}"))?;
        let port = listener.local_addr().map_err(|err| err.to_string())?.port();

        let token = generate_token();
        let url = format!("http://127.0.0.1:{port}/stream?t={token}");
        let (shutdown_tx, shutdown_rx) = watch::channel(false);

        tauri::async_runtime::spawn(serve(listener, bus, token, shutdown_rx));

        Ok(Self { url, shutdown_tx })
    }

    pub fn stop(&self) {
        let _ = self.shutdown_tx.send(true);
    }
}

/// Encodes one frame as an MJPEG multipart part. Frame dimensions travel in
/// headers so the UI can size the preview before the first stats event.
fn multipart_chunk(frame: &PreviewFrame) -> Vec<u8> {
    let mut buf = Vec::with_capacity(frame.jpeg.len() + 160);
    buf.extend_from_slice(b"--frame\r\nContent-Type: image/jpeg\r\nContent-Length: ");
    buf.extend_from_slice(frame.jpeg.len().to_string().as_bytes());
    buf.extend_from_slice(b"\r\nX-Frame-Width: ");
    buf.extend_from_slice(frame.width.to_string().as_bytes());
    buf.extend_from_slice(b"\r\nX-Frame-Height: ");
    buf.extend_from_slice(frame.height.to_string().as_bytes());
    buf.extend_from_slice(b"\r\n\r\n");
    buf.extend_from_slice(&frame.jpeg);
    buf.extend_from_slice(b"\r\n");
    buf
}

fn generate_token() -> String {
    let bytes: [u8; 16] = rand::random();
    bytes.iter().map(|b| format!("{b:02x}")).collect()
}

fn build_router(bus: Arc<PreviewBus>, token: String) -> Router {
    Router::new()
        .route("/stream", get(stream_handler))
        .with_state((bus, Arc::new(token)))
}

async fn stream_handler(
    State((bus, token)): State<(Arc<PreviewBus>, Arc<String>)>,
    Query(params): Query<HashMap<String, String>>,
) -> Response {
    if params.get("t").map(String::as_str) != Some(token.as_str()) {
        return (StatusCode::UNAUTHORIZED, "invalid preview token").into_response();
    }

    let (initial, rx) = bus.subscribe();
    let stream = BroadcastStream::new(rx).filter_map(|item| match item {
        Ok(frame) => Some(Ok::<Vec<u8>, std::convert::Infallible>(multipart_chunk(
            &frame,
        ))),
        // Lagged: skip ahead; Closed: end the stream.
        Err(_) => None,
    });

    let body = match initial {
        Some(frame) => {
            Body::from_stream(tokio_stream::once(Ok(multipart_chunk(&frame))).chain(stream))
        }
        None => Body::from_stream(stream),
    };

    Response::builder()
        .header(
            header::CONTENT_TYPE,
            "multipart/x-mixed-replace; boundary=frame",
        )
        .header(header::CACHE_CONTROL, "no-store")
        .body(body)
        .expect("static response parts are valid")
}

/// Serves until `shutdown` flips to `true`. Public so tests can run the
/// server on their own runtime.
pub async fn serve(
    listener: tokio::net::TcpListener,
    bus: Arc<PreviewBus>,
    token: String,
    mut shutdown: watch::Receiver<bool>,
) -> std::io::Result<()> {
    let app = build_router(bus, token);
    axum::serve(listener, app)
        .with_graceful_shutdown(async move {
            let _ = shutdown.changed().await;
        })
        .await
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test(flavor = "multi_thread", worker_threads = 2)]
    async fn rejects_requests_without_a_valid_token() {
        let bus = PreviewBus::new();
        let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
        let addr = listener.local_addr().unwrap();
        let (shutdown_tx, shutdown_rx) = watch::channel(false);
        let server = tokio::spawn(serve(listener, bus.clone(), "secret".into(), shutdown_rx));

        let url = format!("http://{addr}/stream?t=wrong");
        let resp = test_get(&url);
        assert_eq!(resp.status, 401);

        shutdown_tx.send(true).unwrap();
        server.abort();
    }

    #[tokio::test(flavor = "multi_thread", worker_threads = 2)]
    async fn streams_the_latest_frame_immediately() {
        let bus = PreviewBus::new();
        bus.publish(PreviewFrame {
            jpeg: Arc::new(vec![0xFF, 0xD8, 0xFF, 0xD9]), // JPEG SOI/EOI
            width: 2,
            height: 2,
        });

        let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
        let addr = listener.local_addr().unwrap();
        let (shutdown_tx, shutdown_rx) = watch::channel(false);
        let server = tokio::spawn(serve(listener, bus.clone(), "secret".into(), shutdown_rx));

        let url = format!("http://{addr}/stream?t=secret");
        let resp = test_get(&url);
        assert_eq!(resp.status, 200);
        assert!(resp.content_type.starts_with("multipart/x-mixed-replace"));
        // The cached latest frame is delivered immediately.
        assert!(resp.body.windows(2).any(|w| w == [0xFF, 0xD8]));
        let marker = b"Content-Type: image/jpeg";
        assert!(resp.body.windows(marker.len()).any(|w| w == marker));

        shutdown_tx.send(true).unwrap();
        server.abort();
    }

    /// Minimal blocking HTTP/1.1 GET — avoids adding an HTTP client dep for
    /// tests (axum only needs to speak plain sockets here).
    fn test_get(url: &str) -> TestResponse {
        use std::io::{Read, Write};

        let addr = url
            .trim_start_matches("http://")
            .split('/')
            .next()
            .unwrap()
            .to_string();
        let path = match url.splitn(4, '/').nth(3) {
            Some(rest) => format!("/{rest}"),
            None => "/".to_string(),
        };
        let mut stream = std::net::TcpStream::connect(addr).unwrap();
        write!(
            stream,
            "GET {path} HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n"
        )
        .unwrap();
        let mut buf = Vec::new();
        stream
            .set_read_timeout(Some(std::time::Duration::from_millis(750)))
            .unwrap();
        // The stream stays open (multipart), so read until quiet — the
        // initial frame arrives immediately after connect.
        loop {
            let mut chunk = [0u8; 16384];
            match stream.read(&mut chunk) {
                Ok(0) => break,
                Ok(n) => buf.extend_from_slice(&chunk[..n]),
                Err(_) => break,
            }
        }

        let text_end = buf.windows(4).position(|w| w == b"\r\n\r\n").unwrap_or(0);
        let headers = String::from_utf8_lossy(&buf[..text_end]).to_string();
        let status: u16 = headers
            .lines()
            .next()
            .and_then(|line| line.split_whitespace().nth(1))
            .and_then(|code| code.parse().ok())
            .unwrap_or(0);
        let content_type = headers
            .lines()
            .find(|l| l.to_ascii_lowercase().starts_with("content-type:"))
            .map(|l| l.split_once(':').unwrap().1.trim().to_string())
            .unwrap_or_default();
        TestResponse {
            status,
            content_type,
            body: buf[text_end + 4..].to_vec(),
        }
    }

    struct TestResponse {
        status: u16,
        content_type: String,
        body: Vec<u8>,
    }
}
