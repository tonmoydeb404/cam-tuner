//! Wire protocol between the CamTuner app and virtual-camera plugins.
//!
//! Every message is a fixed 32-byte little-endian header followed by
//! `payload_len` bytes. One message type today (`Frame`); `Ping` exists so
//! plugins can distinguish liveness from silence. Extending means bumping
//! [`PROTOCOL_VERSION`] and adding a variant — receivers must skip unknown
//! types by payload length, never by guessing.

use std::io::{Read, Write};

pub const MAGIC: [u8; 4] = *b"CTVC";
/// Current protocol version. Bump on incompatible header changes.
pub const PROTOCOL_VERSION: u8 = 1;
/// `'2vuy'` (UYVY packed 4:2:2), the format virtual cameras advertise.
pub const FORMAT_UYVY: u32 = u32::from_be_bytes(*b"2vuy");
pub const HEADER_LEN: usize = 32;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[repr(u8)]
pub enum MessageType {
    Frame = 1,
    Ping = 2,
}

impl MessageType {
    fn from_u8(value: u8) -> Option<Self> {
        match value {
            1 => Some(MessageType::Frame),
            2 => Some(MessageType::Ping),
            _ => None,
        }
    }
}

/// The 32-byte message header.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct MessageHeader {
    pub message_type: MessageType,
    pub version: u8,
    pub width: u16,
    pub height: u16,
    /// `'2vuy'` for [`MessageType::Frame`]; zero for pings.
    pub format: u32,
    /// Presentation timestamp in microseconds (0 = unspecified).
    pub pts_us: u64,
    pub payload_len: u32,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ProtocolError {
    BadMagic,
    /// Message from a different protocol generation.
    UnsupportedVersion(u8),
    UnknownMessageType(u8),
    /// Truncated header or payload.
    UnexpectedEof,
    Io(String),
}

impl std::fmt::Display for ProtocolError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ProtocolError::BadMagic => write!(f, "not a CamTuner vcam stream"),
            ProtocolError::UnsupportedVersion(v) => {
                write!(f, "unsupported protocol version {v}")
            }
            ProtocolError::UnknownMessageType(t) => write!(f, "unknown message type {t}"),
            ProtocolError::UnexpectedEof => write!(f, "stream ended mid-message"),
            ProtocolError::Io(e) => write!(f, "io error: {e}"),
        }
    }
}

impl std::error::Error for ProtocolError {}

impl MessageHeader {
    /// Encodes into a fixed-size header block (little-endian).
    pub fn encode(&self) -> [u8; HEADER_LEN] {
        let mut out = [0u8; HEADER_LEN];
        out[0..4].copy_from_slice(&MAGIC);
        out[4] = self.message_type as u8;
        out[5] = self.version;
        out[6..8].copy_from_slice(&self.width.to_le_bytes());
        out[8..10].copy_from_slice(&self.height.to_le_bytes());
        out[10..14].copy_from_slice(&self.format.to_le_bytes());
        out[14..22].copy_from_slice(&self.pts_us.to_le_bytes());
        out[22..26].copy_from_slice(&self.payload_len.to_le_bytes());
        // [26..32] reserved, zero.
        out
    }

    /// Decodes a header block, validating magic, version, and type.
    pub fn decode(block: &[u8; HEADER_LEN]) -> Result<Self, ProtocolError> {
        if block[0..4] != MAGIC {
            return Err(ProtocolError::BadMagic);
        }
        let version = block[5];
        if version != PROTOCOL_VERSION {
            return Err(ProtocolError::UnsupportedVersion(version));
        }
        let message_type =
            MessageType::from_u8(block[4]).ok_or(ProtocolError::UnknownMessageType(block[4]))?;
        Ok(Self {
            message_type,
            version,
            width: u16::from_le_bytes(block[6..8].try_into().expect("2 bytes")),
            height: u16::from_le_bytes(block[8..10].try_into().expect("2 bytes")),
            format: u32::from_le_bytes(block[10..14].try_into().expect("4 bytes")),
            pts_us: u64::from_le_bytes(block[14..22].try_into().expect("8 bytes")),
            payload_len: u32::from_le_bytes(block[22..26].try_into().expect("4 bytes")),
        })
    }
}

/// Encodes a complete frame message (header + payload) into one buffer.
pub fn encode_frame_message(
    width: u16,
    height: u16,
    format: u32,
    pts_us: u64,
    payload: &[u8],
) -> Vec<u8> {
    let header = MessageHeader {
        message_type: MessageType::Frame,
        version: PROTOCOL_VERSION,
        width,
        height,
        format,
        pts_us,
        payload_len: payload.len() as u32,
    };
    let mut out = Vec::with_capacity(HEADER_LEN + payload.len());
    out.extend_from_slice(&header.encode());
    out.extend_from_slice(payload);
    out
}

/// Reads one message (header + payload) from a stream. Blocks until a full
/// message arrives, the peer closes (EOF → `UnexpectedEof`), or an I/O error
/// occurs.
pub fn read_message(reader: &mut impl Read) -> Result<(MessageHeader, Vec<u8>), ProtocolError> {
    let mut block = [0u8; HEADER_LEN];
    read_exact_or_eof(reader, &mut block)?;
    let header = MessageHeader::decode(&block)?;
    let mut payload = vec![0u8; header.payload_len as usize];
    reader
        .read_exact(&mut payload)
        .map_err(|err| map_eof(err, &header))?;
    Ok((header, payload))
}

/// Writes one message (header + payload) to a stream.
pub fn write_message(
    writer: &mut impl Write,
    header: &MessageHeader,
    payload: &[u8],
) -> std::io::Result<()> {
    writer.write_all(&header.encode())?;
    writer.write_all(payload)
}

/// `read_exact`, but a clean EOF before any byte maps to
/// [`ProtocolError::UnexpectedEof`] with context instead of an io::Error.
fn read_exact_or_eof(reader: &mut impl Read, buf: &mut [u8]) -> Result<(), ProtocolError> {
    let mut filled = 0;
    while filled < buf.len() {
        match reader.read(&mut buf[filled..]) {
            Ok(0) => return Err(ProtocolError::UnexpectedEof),
            Ok(n) => filled += n,
            Err(err) if err.kind() == std::io::ErrorKind::Interrupted => continue,
            Err(err) => return Err(ProtocolError::Io(err.to_string())),
        }
    }
    Ok(())
}

fn map_eof(err: std::io::Error, header: &MessageHeader) -> ProtocolError {
    if err.kind() == std::io::ErrorKind::UnexpectedEof {
        ProtocolError::UnexpectedEof
    } else {
        let _ = header;
        ProtocolError::Io(err.to_string())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sample_header() -> MessageHeader {
        MessageHeader {
            message_type: MessageType::Frame,
            version: PROTOCOL_VERSION,
            width: 1920,
            height: 1080,
            format: FORMAT_UYVY,
            pts_us: 1_234_567,
            payload_len: 1920 * 1080 * 2,
        }
    }

    #[test]
    fn header_is_32_bytes_little_endian() {
        let block = sample_header().encode();
        assert_eq!(block.len(), HEADER_LEN);
        assert_eq!(&block[0..4], b"CTVC");
        assert_eq!(block[4], 1); // Frame
        assert_eq!(block[5], 1); // version
        assert_eq!(&block[6..8], &1920u16.to_le_bytes());
        assert_eq!(&block[10..14], &FORMAT_UYVY.to_le_bytes());
    }

    #[test]
    fn header_roundtrips() {
        let block = sample_header().encode();
        assert_eq!(MessageHeader::decode(&block).unwrap(), sample_header());
    }

    #[test]
    fn rejects_bad_magic_version_and_type() {
        let mut block = sample_header().encode();
        block[0] = b'X';
        assert_eq!(MessageHeader::decode(&block), Err(ProtocolError::BadMagic));

        let mut block = sample_header().encode();
        block[5] = 99;
        assert_eq!(
            MessageHeader::decode(&block),
            Err(ProtocolError::UnsupportedVersion(99))
        );

        let mut block = sample_header().encode();
        block[4] = 77;
        assert_eq!(
            MessageHeader::decode(&block),
            Err(ProtocolError::UnknownMessageType(77))
        );
    }

    #[test]
    fn frame_message_roundtrips_over_a_buffer() {
        let payload = vec![7u8; 1000];
        let wire = encode_frame_message(64, 32, FORMAT_UYVY, 42, &payload);

        let mut cursor = std::io::Cursor::new(wire);
        let (header, got) = read_message(&mut cursor).unwrap();
        assert_eq!(header.width, 64);
        assert_eq!(header.height, 32);
        assert_eq!(header.pts_us, 42);
        assert_eq!(header.payload_len, 1000);
        assert_eq!(got, payload);
    }

    #[test]
    fn truncated_payload_surfaces_as_unexpected_eof() {
        let wire = encode_frame_message(64, 32, FORMAT_UYVY, 0, &[1u8; 100]);
        let mut cursor = std::io::Cursor::new(wire[..50].to_vec());
        assert_eq!(read_message(&mut cursor), Err(ProtocolError::UnexpectedEof));
    }

    #[test]
    fn write_then_read_across_a_pipe() {
        let mut buf = Vec::new();
        let mut header = sample_header();
        header.payload_len = 32;
        write_message(&mut buf, &header, &[9u8; 32]).unwrap();
        let mut cursor = std::io::Cursor::new(buf);
        let (got_header, payload) = read_message(&mut cursor).unwrap();
        assert_eq!(got_header, header);
        assert_eq!(payload.len(), 32);
    }
}
