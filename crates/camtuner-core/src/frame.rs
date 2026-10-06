//! Frame buffers and pixel operations for the processing pipeline.
//!
//! The pipeline processes in NV12 (the native capture format on macOS/
//! AVFoundation and the format virtual-camera sinks want) and converts to
//! BGRA only for preview encoding. Conversions use BT.601 limited range
//! (studio swing: Y 16–235, U/V 16–240), matching what webcams deliver.
//!
//! The resample blit is nearest-neighbor: correct and fast for crop/zoom,
//! with a per-axis floor on the NV12 chroma planes (odd rect offsets can
//! shift chroma by at most half a pixel — invisible for webcam use). A
//! higher-quality sampler can replace `sample_index` later without touching
//! callers.

use crate::config::Rgb;
use crate::math::{Rect, Size};

/// Bytes per pixel for packed formats.
const BGRA_TEXEL: usize = 4;
/// Bytes per NV12 chroma texel (one U + one V).
const NV12_CHROMA_TEXEL: usize = 2;

/// Supported pixel formats.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum PixelFormat {
    /// 4:2:0, Y plane followed by interleaved UV. Requires even dimensions.
    Nv12,
    /// 8-bit blue-green-red-alpha, tightly packed.
    Bgra,
    /// Packed 4:2:2 (`'2vuy'`/UYVY): [U, Y0, V, Y1] per pixel pair. Output
    /// format for CMIO virtual cameras — produced by [`Frame::nv12_to_uyvy`],
    /// not a blit/convert input. Requires even dimensions.
    Uyvy,
}

/// Errors surfaced by frame construction and frame-to-frame operations.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum FrameError {
    /// NV12 requires even width and height.
    OddDimensions { width: u32, height: u32 },
    /// The two frames involved in an operation use different formats.
    FormatMismatch {
        expected: PixelFormat,
        found: PixelFormat,
    },
    /// A source rect extends beyond the source frame.
    SrcRectOutOfBounds { frame: Size, rect: Rect },
    /// A destination rect extends beyond the destination frame.
    DstRectOutOfBounds { frame: Size, rect: Rect },
}

/// A single video frame: format, dimensions, and a tightly packed buffer.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Frame {
    pub format: PixelFormat,
    pub width: u32,
    pub height: u32,
    pub data: Vec<u8>,
}

impl Frame {
    /// Pixel dimensions of the frame.
    pub fn size(&self) -> Size {
        Size {
            width: self.width,
            height: self.height,
        }
    }

    /// Flips the frame in place: `horizontal` mirrors left/right (the
    /// `mirror` setting), `vertical` flips top/bottom (`flipVertical`; with
    /// both set this is a 180° rotation). No-op when both are false.
    pub fn flip(&mut self, horizontal: bool, vertical: bool) {
        if self.width == 0 || self.height == 0 || !(horizontal || vertical) {
            return;
        }
        let w = self.width as usize;
        let h = self.height as usize;
        match self.format {
            PixelFormat::Bgra => {
                flip_block(
                    &mut self.data,
                    w * BGRA_TEXEL,
                    h,
                    BGRA_TEXEL,
                    horizontal,
                    vertical,
                );
            }
            PixelFormat::Nv12 => {
                let y_plane = w * h;
                let (y_buf, uv_buf) = self.data.split_at_mut(y_plane);
                flip_block(y_buf, w, h, 1, horizontal, vertical);
                // Chroma plane: w bytes per row (w/2 texels), h/2 rows.
                flip_block(uv_buf, w, h / 2, NV12_CHROMA_TEXEL, horizontal, vertical);
            }
            // Pixel pairs are 4-byte units ([U, Y0, V, Y1]); rows are w*2.
            PixelFormat::Uyvy => {
                flip_block(&mut self.data, w * 2, h, 4, horizontal, vertical);
            }
        }
    }

    /// Allocates a zeroed frame. NV12 and UYVY require even dimensions.
    pub fn new(format: PixelFormat, width: u32, height: u32) -> Result<Self, FrameError> {
        if matches!(format, PixelFormat::Nv12 | PixelFormat::Uyvy)
            && (!width.is_multiple_of(2) || !height.is_multiple_of(2))
        {
            return Err(FrameError::OddDimensions { width, height });
        }
        let size = match format {
            PixelFormat::Nv12 => width as usize * height as usize * 3 / 2,
            PixelFormat::Bgra => width as usize * height as usize * 4,
            PixelFormat::Uyvy => width as usize * height as usize * 2,
        };
        Ok(Self {
            format,
            width,
            height,
            data: vec![0; size],
        })
    }

    pub fn new_nv12(width: u32, height: u32) -> Result<Self, FrameError> {
        Self::new(PixelFormat::Nv12, width, height)
    }

    pub fn new_bgra(width: u32, height: u32) -> Result<Self, FrameError> {
        Self::new(PixelFormat::Bgra, width, height)
    }

    pub fn new_uyvy(width: u32, height: u32) -> Result<Self, FrameError> {
        Self::new(PixelFormat::Uyvy, width, height)
    }

    /// Fills the entire frame with a solid color (the letterbox "bars" fill).
    pub fn fill(&mut self, color: Rgb) {
        match self.format {
            PixelFormat::Bgra => {
                let [b, g, r, a] = bgra_bytes(color);
                for px in self.data.chunks_exact_mut(4) {
                    px[0] = b;
                    px[1] = g;
                    px[2] = r;
                    px[3] = a;
                }
            }
            PixelFormat::Nv12 => {
                let y_plane = self.width as usize * self.height as usize;
                let (y, u, v) = rgb_to_yuv601(color);
                self.data[..y_plane].fill(y);
                for chroma in self.data[y_plane..].chunks_exact_mut(2) {
                    chroma[0] = u;
                    chroma[1] = v;
                }
            }
            PixelFormat::Uyvy => {
                let (y, u, v) = rgb_to_yuv601(color);
                for pair in self.data.chunks_exact_mut(4) {
                    pair[0] = u;
                    pair[1] = y;
                    pair[2] = v;
                    pair[3] = y;
                }
            }
        }
    }

    /// Draws `src_rect` of `src` into `dst_rect` of `self` using
    /// nearest-neighbor sampling. Both frames must share the same format.
    /// A zero-area `dst_rect` is a validated no-op.
    pub fn blit_resample(
        &mut self,
        src: &Frame,
        src_rect: Rect,
        dst_rect: Rect,
    ) -> Result<(), FrameError> {
        if self.format != src.format {
            return Err(FrameError::FormatMismatch {
                expected: self.format,
                found: src.format,
            });
        }
        if src_rect.x.saturating_add(src_rect.width) > src.width
            || src_rect.y.saturating_add(src_rect.height) > src.height
        {
            return Err(FrameError::SrcRectOutOfBounds {
                frame: Size {
                    width: src.width,
                    height: src.height,
                },
                rect: src_rect,
            });
        }
        if dst_rect.x.saturating_add(dst_rect.width) > self.width
            || dst_rect.y.saturating_add(dst_rect.height) > self.height
        {
            return Err(FrameError::DstRectOutOfBounds {
                frame: Size {
                    width: self.width,
                    height: self.height,
                },
                rect: dst_rect,
            });
        }
        if dst_rect.width == 0 || dst_rect.height == 0 {
            return Ok(());
        }

        match self.format {
            PixelFormat::Bgra => {
                self.blit_bgra(src, src_rect, dst_rect);
                Ok(())
            }
            PixelFormat::Nv12 => {
                self.blit_nv12(src, src_rect, dst_rect);
                Ok(())
            }
            // UYVY is a terminal output format (see [`PixelFormat::Uyvy`]);
            // blitting into it has no pipeline use.
            PixelFormat::Uyvy => Err(FrameError::FormatMismatch {
                expected: PixelFormat::Nv12,
                found: PixelFormat::Uyvy,
            }),
        }
    }
    fn blit_bgra(&mut self, src: &Frame, src_rect: Rect, dst_rect: Rect) {
        let map_x = SampleMap::new(dst_rect.width, src_rect.width);
        let map_y = SampleMap::new(dst_rect.height, src_rect.height);
        let row_bytes = dst_rect.width as usize * 4;

        if map_y.is_identity() && map_x.is_identity() {
            // 1:1 blit — plain row copies (the zoom=1 letterbox hot path).
            for dy in 0..dst_rect.height as usize {
                let sy = (src_rect.y as usize + dy) * src.width as usize * 4;
                let dy_row = (dst_rect.y as usize + dy) * self.width as usize * 4;
                let s = src_rect.x as usize * 4;
                let d = (dst_rect.x as usize) * 4;
                self.data[dy_row + d..dy_row + d + row_bytes]
                    .copy_from_slice(&src.data[sy + s..sy + s + row_bytes]);
            }
            return;
        }

        for dy in 0..dst_rect.height as usize {
            let sy = (map_y.index(dy) + src_rect.y as usize) * src.width as usize * 4;
            let src_row = &src.data[sy..];
            let dy_row = (dst_rect.y as usize + dy) * self.width as usize * 4;
            let dst_row = &mut self.data[dy_row..];
            if map_x.is_identity() {
                let s = src_rect.x as usize * 4;
                let d = dst_rect.x as usize * 4;
                dst_row[d..d + row_bytes].copy_from_slice(&src_row[s..s + row_bytes]);
                continue;
            }
            for dx in 0..dst_rect.width as usize {
                let sx = (map_x.index(dx) + src_rect.x as usize) * 4;
                let d = (dst_rect.x as usize + dx) * 4;
                dst_row[d..d + 4].copy_from_slice(&src_row[sx..sx + 4]);
            }
        }
    }

    fn blit_nv12(&mut self, src: &Frame, src_rect: Rect, dst_rect: Rect) {
        let sw = src.width as usize;
        let dw = self.width as usize;
        let y_plane_src = sw * src.height as usize;
        let y_plane_dst = dw * self.height as usize;

        // Luma: nearest mapping with row copies on 1:1 axes.
        let map_x = SampleMap::new(dst_rect.width, src_rect.width);
        let map_y = SampleMap::new(dst_rect.height, src_rect.height);
        let y_row_bytes = dst_rect.width as usize;

        if map_y.is_identity() && map_x.is_identity() {
            for dy in 0..dst_rect.height as usize {
                let sy = (src_rect.y as usize + dy) * sw;
                let dy_row = (dst_rect.y as usize + dy) * dw;
                let s = src_rect.x as usize;
                let d = dst_rect.x as usize;
                self.data[dy_row + d..dy_row + d + y_row_bytes]
                    .copy_from_slice(&src.data[sy + s..sy + s + y_row_bytes]);
            }
        } else {
            for dy in 0..dst_rect.height as usize {
                let sy = (map_y.index(dy) + src_rect.y as usize) * sw;
                let src_row = &src.data[sy..];
                let dy_row = (dst_rect.y as usize + dy) * dw;
                let dst_row = &mut self.data[dy_row..];
                if map_x.is_identity() {
                    let s = src_rect.x as usize;
                    let d = dst_rect.x as usize;
                    dst_row[d..d + y_row_bytes].copy_from_slice(&src_row[s..s + y_row_bytes]);
                    continue;
                }
                for dx in 0..dst_rect.width as usize {
                    let sx = map_x.index(dx) + src_rect.x as usize;
                    dst_row[dst_rect.x as usize + dx] = src_row[sx];
                }
            }
        }

        // Chroma: same mapping on the (w/2, h/2) plane with 2-byte texels.
        // Odd rect origins/dimensions floor on this plane (≤ half-pixel lag).
        let (dcw, dch) = (dw / 2, self.height as usize / 2);
        let sc_rect = (
            (src_rect.x / 2) as usize,
            (src_rect.y / 2) as usize,
            (src_rect.width / 2).max(1) as usize,
            (src_rect.height / 2).max(1) as usize,
        );
        let dc_rect = (
            (dst_rect.x / 2) as usize,
            (dst_rect.y / 2) as usize,
            (dst_rect.width / 2).max(1) as usize,
            (dst_rect.height / 2).max(1) as usize,
        );

        let c_map_x = SampleMap::new(dc_rect.2 as u32, sc_rect.2 as u32);
        let c_map_y = SampleMap::new(dc_rect.3 as u32, sc_rect.3 as u32);
        let c_rows = dch.min(dc_rect.3);
        let c_cols = dcw.min(dc_rect.2);
        let c_row_bytes = c_cols * 2;

        for cdy in 0..c_rows {
            let csy = c_map_y.index(cdy) + sc_rect.1;
            // Chroma row stride is the full frame width in bytes (w/2 texels ×
            // 2 bytes each) — not the texel count.
            let src_row = &src.data[y_plane_src + csy * sw..];
            let dst_row = &mut self.data[y_plane_dst + (dc_rect.1 + cdy) * dw..];
            if c_map_x.is_identity() {
                let s = sc_rect.0 * 2;
                let d = dc_rect.0 * 2;
                dst_row[d..d + c_row_bytes].copy_from_slice(&src_row[s..s + c_row_bytes]);
                continue;
            }
            for cdx in 0..c_cols {
                let csx = (c_map_x.index(cdx) + sc_rect.0) * 2;
                let d = (dc_rect.0 + cdx) * 2;
                dst_row[d..d + 2].copy_from_slice(&src_row[csx..csx + 2]);
            }
        }
    }
    /// Converts an NV12 frame to UYVY (packed 4:2:2, `'2vuy'`) — the format
    /// CMIO virtual cameras advertise. Chroma is upsampled by duplication
    /// (each 2×2 chroma texel applies to its pixel pair), which matches what
    /// capture hardware delivers without introducing resampling softness.
    pub fn nv12_to_uyvy(&self) -> Result<Frame, FrameError> {
        if self.format != PixelFormat::Nv12 {
            return Err(FrameError::FormatMismatch {
                expected: PixelFormat::Nv12,
                found: self.format,
            });
        }
        let (w, h) = (self.width as usize, self.height as usize);
        let mut data = vec![0u8; w * h * 2];
        let y_plane = &self.data[..w * h];
        let uv_plane = &self.data[w * h..];

        for row in 0..h {
            let y_row = &y_plane[row * w..(row + 1) * w];
            let uv_row = &uv_plane[(row / 2) * w..(row / 2) * w + w];
            let out_row = &mut data[row * w * 2..(row + 1) * w * 2];
            for pair in 0..w / 2 {
                let (y0, y1) = (y_row[pair * 2], y_row[pair * 2 + 1]);
                let (u, v) = (uv_row[pair * 2], uv_row[pair * 2 + 1]);
                let o = pair * 4;
                // UYVY: [U, Y0, V, Y1] per pixel pair.
                out_row[o] = u;
                out_row[o + 1] = y0;
                out_row[o + 2] = v;
                out_row[o + 3] = y1;
            }
            // Odd widths: replicate the last luma sample (NV12 requires even
            // dims, but be safe rather than truncate).
            if !w.is_multiple_of(2) {
                let o = (w - 1) * 2;
                out_row[o] = 128;
                out_row[o + 1] = y_row[w - 1];
                out_row[o + 2] = 128;
                out_row[o + 3] = y_row[w - 1];
            }
        }

        Ok(Frame {
            format: PixelFormat::Uyvy,
            width: self.width,
            height: self.height,
            data,
        })
    }

    /// Converts an NV12 frame to BGRA (BT.601 limited range). Alpha is 255.
    pub fn nv12_to_bgra(&self) -> Result<Frame, FrameError> {
        let mut out = Frame::new_bgra(self.width, self.height)?;
        self.nv12_to_bgra_into(&mut out)?;
        Ok(out)
    }

    /// [`Self::nv12_to_bgra`] into a reusable destination frame (pipeline
    /// hot loop avoids per-frame allocation). Destination must be BGRA and
    /// match this frame's dimensions.
    pub fn nv12_to_bgra_into(&self, dst: &mut Frame) -> Result<(), FrameError> {
        if self.format != PixelFormat::Nv12 {
            return Err(FrameError::FormatMismatch {
                expected: PixelFormat::Nv12,
                found: self.format,
            });
        }
        if dst.format != PixelFormat::Bgra || dst.width != self.width || dst.height != self.height {
            return Err(FrameError::FormatMismatch {
                expected: PixelFormat::Bgra,
                found: dst.format,
            });
        }
        let y_plane = self.width as usize * self.height as usize;
        let (w, h) = (self.width as usize, self.height as usize);

        for row in 0..h {
            let y_row = &self.data[row * w..row * w + w];
            let uv_row = &self.data[y_plane + (row / 2) * w..];
            let out_row = &mut dst.data[row * w * 4..(row + 1) * w * 4];
            for col in 0..w {
                let u = uv_row[(col / 2) * 2];
                let v = uv_row[(col / 2) * 2 + 1];
                let [b, g, r, a] = yuv601_to_bgra(y_row[col], u, v);
                let o = col * 4;
                out_row[o] = b;
                out_row[o + 1] = g;
                out_row[o + 2] = r;
                out_row[o + 3] = a;
            }
        }
        Ok(())
    }
}

/// Precomputed nearest-neighbor sample indices for one axis — `map[i]` is
/// the source index for destination sample `i`. Built incrementally
/// (add/compare only), so per-frame rescaling costs no division.
#[derive(Debug, Clone)]
struct SampleMap {
    /// `Some(indices)` when the axis scales; `None` when 1:1 (fast path).
    indices: Option<Vec<u32>>,
}

impl SampleMap {
    fn new(dst_size: u32, src_size: u32) -> Self {
        if dst_size == src_size {
            return Self { indices: None };
        }
        let (dst, src) = (dst_size as u64, src_size as u64);
        let mut indices = Vec::with_capacity(dst as usize);
        let (mut acc, mut cur) = (0u64, 0u64);
        for _ in 0..dst {
            indices.push(cur as u32);
            acc += src;
            while acc >= dst {
                acc -= dst;
                cur += 1;
            }
        }
        Self {
            indices: Some(indices),
        }
    }

    /// Source index for destination sample `i`.
    #[inline]
    fn index(&self, i: usize) -> usize {
        match &self.indices {
            None => i,
            Some(map) => map[i] as usize,
        }
    }

    /// True when the axis is 1:1 (destination rows are plain copies).
    fn is_identity(&self) -> bool {
        self.indices.is_none()
    }
}

/// Flips a planar block of `rows` rows with `stride` bytes per row and
/// `texel` bytes per pixel (1 for NV12 luma, 2/4 for packed formats).
fn flip_block(
    buf: &mut [u8],
    stride: usize,
    rows: usize,
    texel: usize,
    horizontal: bool,
    vertical: bool,
) {
    if vertical {
        let last = rows.saturating_sub(1);
        for i in 0..rows / 2 {
            let j = last - i;
            let (head, tail) = buf.split_at_mut(j * stride);
            head[i * stride..(i + 1) * stride].swap_with_slice(&mut tail[..stride]);
        }
    }
    if horizontal {
        for r in 0..rows {
            let row = &mut buf[r * stride..(r + 1) * stride];
            let texels = row.len() / texel;
            for k in 0..texels / 2 {
                let lo = k * texel;
                let hi = (texels - 1 - k) * texel;
                let (head, tail) = row.split_at_mut(hi);
                head[lo..lo + texel].swap_with_slice(&mut tail[..texel]);
            }
        }
    }
}

fn bgra_bytes(color: Rgb) -> [u8; 4] {
    [color.b, color.g, color.r, 255]
}

/// BT.601 limited-range RGB → YUV (studio swing).
pub fn rgb_to_yuv601(color: Rgb) -> (u8, u8, u8) {
    let (r, g, b) = (f64::from(color.r), f64::from(color.g), f64::from(color.b));
    let y = 16.0 + (65.481 * r + 128.553 * g + 24.966 * b) / 255.0;
    let u = 128.0 + (-37.797 * r - 74.203 * g + 112.0 * b) / 255.0;
    let v = 128.0 + (112.0 * r - 93.786 * g - 18.214 * b) / 255.0;
    (
        y.round().clamp(16.0, 235.0) as u8,
        u.round().clamp(16.0, 240.0) as u8,
        v.round().clamp(16.0, 240.0) as u8,
    )
}

/// Fixed-point (8.8) YUV → RGB contribution tables. Decomposed so each
/// channel is one table lookup per input component plus a shift — no
/// floating point in the per-pixel path.
struct YuvTables {
    /// 298 * (y - 16) — the shared luma term for all channels.
    y_term: [i32; 256],
    /// 409 * (v - 128) added to R.
    v_r: [i32; 256],
    /// -100 * (u - 128) added to G.
    u_g: [i32; 256],
    /// -208 * (v - 128) added to G.
    v_g: [i32; 256],
    /// 517 * (u - 128) added to B.
    u_b: [i32; 256],
}

fn yuv_tables() -> &'static YuvTables {
    static TABLES: std::sync::OnceLock<YuvTables> = std::sync::OnceLock::new();
    TABLES.get_or_init(|| {
        let term = |x: i32, scale: i32| (x - 128) * scale;
        YuvTables {
            y_term: std::array::from_fn(|y| 298 * (y as i32 - 16)),
            v_r: std::array::from_fn(|v| term(v as i32, 409)),
            u_g: std::array::from_fn(|u| term(u as i32, -100)),
            v_g: std::array::from_fn(|v| term(v as i32, -208)),
            u_b: std::array::from_fn(|u| term(u as i32, 517)),
        }
    })
}

/// BT.601 limited-range YUV → BGRA (alpha 255).
fn yuv601_to_bgra(y: u8, u: u8, v: u8) -> [u8; 4] {
    let t = yuv_tables();
    let y = t.y_term[y as usize];
    let u = u as usize;
    let v = v as usize;
    // +128 before >>8 rounds to nearest.
    let r = (y + t.v_r[v] + 128) >> 8;
    let g = (y + t.u_g[u] + t.v_g[v] + 128) >> 8;
    let b = (y + t.u_b[u] + 128) >> 8;
    [
        b.clamp(0, 255) as u8,
        g.clamp(0, 255) as u8,
        r.clamp(0, 255) as u8,
        255,
    ]
}

#[cfg(test)]
mod tests {
    use super::*;

    const BLACK: Rgb = Rgb::BLACK;
    const WHITE: Rgb = Rgb::new(255, 255, 255);
    const RED: Rgb = Rgb::new(255, 0, 0);
    const GREEN: Rgb = Rgb::new(0, 255, 0);
    const BLUE: Rgb = Rgb::new(0, 0, 255);

    mod construction {
        use super::*;

        #[test]
        fn nv12_buffer_is_y_plus_interleaved_uv() {
            let frame = Frame::new_nv12(640, 480).unwrap();
            assert_eq!(frame.data.len(), 640 * 480 * 3 / 2);
        }

        #[test]
        fn bgra_buffer_is_four_bytes_per_pixel() {
            let frame = Frame::new_bgra(640, 480).unwrap();
            assert_eq!(frame.data.len(), 640 * 480 * 4);
        }

        #[test]
        fn nv12_rejects_odd_dimensions() {
            assert_eq!(
                Frame::new_nv12(641, 480).unwrap_err(),
                FrameError::OddDimensions {
                    width: 641,
                    height: 480
                }
            );
            assert_eq!(
                Frame::new_nv12(640, 481).unwrap_err(),
                FrameError::OddDimensions {
                    width: 640,
                    height: 481
                }
            );
        }
    }

    mod fill {
        use super::*;

        #[test]
        fn nv12_black_is_studio_swing_reference() {
            let mut frame = Frame::new_nv12(4, 4).unwrap();
            frame.fill(BLACK);
            // BT.601 limited: black → Y 16, U/V 128.
            assert!(frame.data[..16].iter().all(|&y| y == 16));
            assert!(frame.data[16..].chunks_exact(2).all(|c| c == [128, 128]));
        }

        #[test]
        fn nv12_white_hits_top_of_studio_swing() {
            let mut frame = Frame::new_nv12(4, 4).unwrap();
            frame.fill(WHITE);
            assert!(frame.data[..16].iter().all(|&y| y == 235));
            assert!(frame.data[16..].chunks_exact(2).all(|c| c == [128, 128]));
        }

        #[test]
        fn nv12_red_matches_known_yuv_values() {
            let mut frame = Frame::new_nv12(2, 2).unwrap();
            frame.fill(RED);
            let (y, u, v) = rgb_to_yuv601(RED);
            assert_eq!((y, u, v), (81, 90, 240));
            assert_eq!(frame.data[0], 81);
            assert_eq!(&frame.data[4..6], &[90, 240]);
        }

        #[test]
        fn bgra_fill_is_bgr_plus_opaque_alpha() {
            let mut frame = Frame::new_bgra(2, 2).unwrap();
            frame.fill(RED);
            assert_eq!(&frame.data[..4], &[0, 0, 255, 255]);
        }
    }

    mod uyvy {
        use super::*;

        #[test]
        fn buffer_is_two_bytes_per_pixel_and_rejects_odd_dims() {
            let frame = Frame::new_uyvy(8, 4).unwrap();
            assert_eq!(frame.data.len(), 8 * 4 * 2);
            assert_eq!(
                Frame::new_uyvy(7, 4).unwrap_err(),
                FrameError::OddDimensions {
                    width: 7,
                    height: 4
                }
            );
        }

        #[test]
        fn nv12_to_uyvy_golden() {
            // 4x2 NV12: luma rows + one chroma row (two texels).
            let mut src = Frame::new_nv12(4, 2).unwrap();
            src.data[..8].copy_from_slice(&[10, 20, 30, 40, 50, 60, 70, 80]);
            src.data[8..].copy_from_slice(&[200, 100, 210, 110]);

            let out = src.nv12_to_uyvy().unwrap();
            assert_eq!(out.format, PixelFormat::Uyvy);
            assert_eq!(out.width, 4);
            assert_eq!(out.height, 2);
            // Each chroma texel covers its pixel pair on both rows.
            assert_eq!(
                out.data,
                vec![
                    200, 10, 100, 20, 210, 30, 110, 40, //
                    200, 50, 100, 60, 210, 70, 110, 80, //
                ]
            );
        }

        #[test]
        fn uyvy_fill_matches_studio_swing() {
            let mut frame = Frame::new_uyvy(4, 4).unwrap();
            frame.fill(WHITE);
            assert!(frame
                .data
                .chunks_exact(4)
                .all(|p| p == [128, 235, 128, 235]));
        }

        #[test]
        fn uyvy_flip_reverses_pixel_pairs() {
            let mut src = Frame::new_nv12(4, 2).unwrap();
            src.data[..8].copy_from_slice(&[10, 20, 30, 40, 50, 60, 70, 80]);
            src.data[8..].copy_from_slice(&[200, 100, 210, 110]);
            let mut out = src.nv12_to_uyvy().unwrap();
            out.flip(true, false);
            assert_eq!(
                out.data,
                vec![
                    210, 30, 110, 40, 200, 10, 100, 20, //
                    210, 70, 110, 80, 200, 50, 100, 60, //
                ]
            );
        }

        #[test]
        fn uyvy_is_not_a_blit_or_convert_target() {
            let mut uyvy = Frame::new_uyvy(4, 4).unwrap();
            let nv12 = Frame::new_nv12(4, 4).unwrap();
            assert!(matches!(
                uyvy.blit_resample(&nv12, Rect::new(0, 0, 4, 4), Rect::new(0, 0, 4, 4)),
                Err(FrameError::FormatMismatch { .. })
            ));
            assert!(matches!(
                uyvy.nv12_to_uyvy(),
                Err(FrameError::FormatMismatch { .. })
            ));
        }
    }

    mod color_conversion {
        use super::*;

        #[test]
        fn yuv_reference_values_for_primaries() {
            assert_eq!(rgb_to_yuv601(BLACK), (16, 128, 128));
            assert_eq!(rgb_to_yuv601(WHITE), (235, 128, 128));
            assert_eq!(rgb_to_yuv601(RED), (81, 90, 240));
            assert_eq!(rgb_to_yuv601(GREEN), (145, 54, 34));
            assert_eq!(rgb_to_yuv601(BLUE), (41, 240, 110));
        }

        #[test]
        fn nv12_to_bgra_roundtrips_neutral_colors() {
            for color in [BLACK, WHITE] {
                let mut frame = Frame::new_nv12(4, 4).unwrap();
                frame.fill(color);
                let bgra = frame.nv12_to_bgra().unwrap();
                for px in bgra.data.chunks_exact(4) {
                    let [b, g, r, a] = px.try_into().unwrap();
                    assert_eq!(a, 255);
                    let expected = [color.b, color.g, color.r];
                    for (got, want) in [b, g, r].into_iter().zip(expected) {
                        assert!(
                            (i16::from(got) - i16::from(want)).abs() <= 2,
                            "channel {got} vs {want} for {color:?}"
                        );
                    }
                }
            }
        }

        #[test]
        fn nv12_to_bgra_roundtrips_primaries_within_tolerance() {
            for color in [RED, GREEN, BLUE] {
                let mut frame = Frame::new_nv12(4, 4).unwrap();
                frame.fill(color);
                let bgra = frame.nv12_to_bgra().unwrap();
                for px in bgra.data.chunks_exact(4) {
                    for (got, want) in px[..3].iter().copied().zip([color.b, color.g, color.r]) {
                        assert!(
                            (i16::from(got) - i16::from(want)).abs() <= 3,
                            "channel {got} vs {want} for {color:?}"
                        );
                    }
                }
            }
        }

        #[test]
        fn nv12_to_bgra_rejects_other_formats() {
            let frame = Frame::new_bgra(4, 4).unwrap();
            assert!(matches!(
                frame.nv12_to_bgra(),
                Err(FrameError::FormatMismatch { .. })
            ));
        }
    }

    mod flip {
        use super::*;

        /// BGRA frame with pixel values 0..n laid out row-major.
        fn bgra_pattern(width: u32, height: u32) -> Frame {
            let mut frame = Frame::new_bgra(width, height).unwrap();
            for (i, px) in frame.data.chunks_exact_mut(4).enumerate() {
                px[2] = i as u8; // store index in R channel
            }
            frame
        }

        fn pixel(frame: &Frame, x: u32, y: u32) -> u8 {
            let o = ((y * frame.width + x) * 4 + 2) as usize;
            frame.data[o]
        }

        #[test]
        fn bgra_horizontal_mirror_reverses_rows() {
            let mut frame = bgra_pattern(3, 2);
            frame.flip(true, false);
            assert_eq!(pixel(&frame, 0, 0), 2);
            assert_eq!(pixel(&frame, 2, 0), 0);
            assert_eq!(pixel(&frame, 0, 1), 5);
            assert_eq!(pixel(&frame, 2, 1), 3);
        }

        #[test]
        fn bgra_vertical_flip_reverses_rows_order() {
            let mut frame = bgra_pattern(3, 2);
            frame.flip(false, true);
            assert_eq!(pixel(&frame, 0, 0), 3);
            assert_eq!(pixel(&frame, 2, 0), 5);
            assert_eq!(pixel(&frame, 0, 1), 0);
            assert_eq!(pixel(&frame, 2, 1), 2);
        }

        #[test]
        fn bgra_both_flips_rotate_180_degrees() {
            let mut frame = bgra_pattern(3, 2);
            frame.flip(true, true);
            assert_eq!(pixel(&frame, 0, 0), 5);
            assert_eq!(pixel(&frame, 2, 1), 0);
        }

        #[test]
        fn flip_disabled_is_a_no_op() {
            let mut frame = bgra_pattern(3, 2);
            let before = frame.data.clone();
            frame.flip(false, false);
            assert_eq!(frame.data, before);
        }

        #[test]
        fn nv12_flip_keeps_chroma_aligned_with_luma() {
            // 4x2: left half colored red-ish chroma (90, 240), right half
            // blue-ish chroma (240, 110); luma gradient 16..23.
            let mut frame = Frame::new_nv12(4, 2).unwrap();
            for (i, y) in frame.data[..8].iter_mut().enumerate() {
                *y = (16 + i) as u8;
            }
            let uv = &mut frame.data[8..];
            uv[0] = 90;
            uv[1] = 240; // left texel (red)
            uv[2] = 240;
            uv[3] = 110; // right texel (blue)

            frame.flip(true, false);
            // Luma row mirrored.
            assert_eq!(&frame.data[..4], &[19, 18, 17, 16]);
            // Chroma texels swapped: blue now left, red right.
            assert_eq!(&frame.data[8..12], &[240, 110, 90, 240]);

            frame.flip(false, true); // now flipped both ways from original
                                     // Vertical flip swaps the two luma rows: row 1 [23,22,21,20]
                                     // moves up top.
            assert_eq!(frame.data[0], 23);
        }
    }

    mod blit {
        use super::*;

        /// Fills each pixel of an NV12 frame with a unique luma value.
        fn nv12_pattern(width: u32, height: u32) -> Frame {
            let mut frame = Frame::new_nv12(width, height).unwrap();
            for (i, y) in frame.data[..(width * height) as usize]
                .iter_mut()
                .enumerate()
            {
                *y = (i % 256) as u8;
            }
            frame
        }

        #[test]
        fn identity_blit_preserves_luma() {
            let src = nv12_pattern(4, 4);
            let mut dst = Frame::new_nv12(4, 4).unwrap();
            dst.blit_resample(&src, Rect::new(0, 0, 4, 4), Rect::new(0, 0, 4, 4))
                .unwrap();
            assert_eq!(dst.data[..16], src.data[..16]);
        }

        #[test]
        fn two_times_upscale_duplicates_samples() {
            // 2x2 luma: [[10, 20], [30, 40]] → 4x4 nearest upscale.
            let mut src = Frame::new_nv12(2, 2).unwrap();
            src.data[0] = 10;
            src.data[1] = 20;
            src.data[2] = 30;
            src.data[3] = 40;
            let mut dst = Frame::new_nv12(4, 4).unwrap();
            dst.blit_resample(&src, Rect::new(0, 0, 2, 2), Rect::new(0, 0, 4, 4))
                .unwrap();
            let expected = [
                10, 10, 20, 20, //
                10, 10, 20, 20, //
                30, 30, 40, 40, //
                30, 30, 40, 40,
            ];
            assert_eq!(dst.data[..16], expected);
        }

        /// Fills the chroma plane with unique per-texel values so stride
        /// mistakes can't hide (regression guard for the green-tint bug).
        fn nv12_chroma_pattern(width: u32, height: u32) -> Frame {
            let mut frame = Frame::new_nv12(width, height).unwrap();
            let uv = &mut frame.data[(width * height) as usize..];
            let (cw, ch) = ((width / 2) as usize, (height / 2) as usize);
            for cy in 0..ch {
                for cx in 0..cw {
                    uv[(cy * cw + cx) * 2] = (100 + cx) as u8;
                    uv[(cy * cw + cx) * 2 + 1] = (50 + cy) as u8;
                }
            }
            frame
        }

        #[test]
        fn one_to_one_blit_preserves_chroma_layout() {
            let src = nv12_chroma_pattern(8, 8);
            let mut dst = Frame::new_nv12(8, 8).unwrap();
            dst.blit_resample(&src, Rect::new(0, 0, 8, 8), Rect::new(0, 0, 8, 8))
                .unwrap();
            let plane = 8 * 8;
            assert_eq!(
                &dst.data[plane..],
                &src.data[plane..],
                "chroma plane must survive an identity blit byte-for-byte"
            );
        }

        #[test]
        fn downscale_blit_samples_chroma_at_the_right_offsets() {
            // 8x8 → 4x4: chroma 4x4 texels → 2x2, sampling texels
            // (0,0), (2,0), (0,2), (2,2) of the source chroma plane.
            let src = nv12_chroma_pattern(8, 8);
            let mut dst = Frame::new_nv12(4, 4).unwrap();
            dst.blit_resample(&src, Rect::new(0, 0, 8, 8), Rect::new(0, 0, 4, 4))
                .unwrap();
            let plane = 4 * 4;
            let uv = &dst.data[plane..];
            // Dest chroma stride is 4 bytes/row (2 texels × 2 bytes).
            assert_eq!(
                uv,
                &[
                    100, 50, 102, 50, // row 0: texels (0,0), (2,0)
                    100, 52, 102, 52, // row 1: texels (0,2), (2,2)
                ]
            );
        }

        #[test]
        fn crop_blit_extracts_the_requested_region() {
            let src = nv12_pattern(4, 4);
            let mut dst = Frame::new_nv12(2, 2).unwrap();
            dst.blit_resample(
                &src,
                Rect::new(2, 2, 2, 2), // bottom-right quadrant
                Rect::new(0, 0, 2, 2),
            )
            .unwrap();
            let expected: Vec<u8> = (2..4)
                .flat_map(|row| (2..4).map(move |col| row * 4 + col))
                .map(|i| (i % 256) as u8)
                .collect();
            assert_eq!(dst.data[..4], expected);
        }

        #[test]
        fn crop_blit_places_region_at_dst_offset() {
            let src = nv12_pattern(4, 4);
            let mut dst = Frame::new_nv12(4, 4).unwrap();
            dst.fill(BLACK);
            dst.blit_resample(
                &src,
                Rect::new(0, 0, 2, 2), // top-left of source
                Rect::new(2, 2, 2, 2), // bottom-right of destination
            )
            .unwrap();
            // Destination luma stays 16 (letterbox bars) outside the blit.
            assert_eq!(dst.data[0], 16);
            assert_eq!(dst.data[(2 * 4 + 2) as usize], 0); // src(0,0)
            assert_eq!(dst.data[(3 * 4 + 3) as usize], 5); // src(1,1)
        }

        #[test]
        fn bgra_blit_upscales_with_nearest_sampling() {
            let mut src = Frame::new_bgra(2, 2).unwrap();
            src.fill(BLACK);
            // Paint src(1,1) white.
            for px in src.data.chunks_exact_mut(4).skip(3).take(1) {
                px.copy_from_slice(&[255, 255, 255, 255]);
            }
            let mut dst = Frame::new_bgra(4, 4).unwrap();
            dst.blit_resample(&src, Rect::new(0, 0, 2, 2), Rect::new(0, 0, 4, 4))
                .unwrap();
            // Bottom-right quadrant of dst is white, rest black.
            let get = |x: u32, y: u32| -> [u8; 4] {
                let o = ((y * 4 + x) * 4) as usize;
                dst.data[o..o + 4].try_into().unwrap()
            };
            assert_eq!(get(0, 0), [0, 0, 0, 255]);
            assert_eq!(get(3, 3), [255, 255, 255, 255]);
            assert_eq!(get(3, 0), [0, 0, 0, 255]);
            assert_eq!(get(0, 3), [0, 0, 0, 255]);
        }

        #[test]
        fn zero_area_dst_rect_is_a_validated_no_op() {
            let src = nv12_pattern(4, 4);
            let mut dst = Frame::new_nv12(4, 4).unwrap();
            dst.fill(BLACK);
            assert!(dst
                .blit_resample(&src, Rect::new(0, 0, 4, 4), Rect::new(0, 0, 0, 4))
                .is_ok());
            assert!(dst.data[..16].iter().all(|&y| y == 16));
        }

        #[test]
        fn rejects_format_mismatch() {
            let src = Frame::new_bgra(4, 4).unwrap();
            let mut dst = Frame::new_nv12(4, 4).unwrap();
            assert!(matches!(
                dst.blit_resample(&src, Rect::new(0, 0, 4, 4), Rect::new(0, 0, 4, 4)),
                Err(FrameError::FormatMismatch { .. })
            ));
        }

        #[test]
        fn rejects_out_of_bounds_src_rect() {
            let src = Frame::new_nv12(4, 4).unwrap();
            let mut dst = Frame::new_nv12(4, 4).unwrap();
            assert_eq!(
                dst.blit_resample(&src, Rect::new(2, 2, 4, 4), Rect::new(0, 0, 4, 4)),
                Err(FrameError::SrcRectOutOfBounds {
                    frame: Size {
                        width: 4,
                        height: 4
                    },
                    rect: Rect::new(2, 2, 4, 4)
                })
            );
        }

        #[test]
        fn rejects_out_of_bounds_dst_rect() {
            let src = Frame::new_nv12(4, 4).unwrap();
            let mut dst = Frame::new_nv12(4, 4).unwrap();
            assert!(matches!(
                dst.blit_resample(&src, Rect::new(0, 0, 4, 4), Rect::new(2, 2, 4, 4)),
                Err(FrameError::DstRectOutOfBounds { .. })
            ));
        }
    }
}
