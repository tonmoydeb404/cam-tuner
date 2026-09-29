//! Crop/zoom/align/letterbox geometry.
//!
//! 1:1 port of `packages/stream-config/src/utils/math.ts`. The unit tests in
//! `math.test.ts` are ported below as golden tests so both implementations are
//! guaranteed to produce identical boxes for identical inputs.
//!
//! Naming note: the TS type `Box` is called [`Rect`] here to avoid clashing
//! with `std::boxed::Box`.

/// Pixel dimensions of a source or destination surface.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub struct Size {
    pub width: u32,
    pub height: u32,
}

impl Size {
    pub const fn new(width: u32, height: u32) -> Self {
        Self { width, height }
    }
}

/// An axis-aligned pixel rectangle. Coordinates are relative to the surface
/// the function that produced it operates on.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub struct Rect {
    pub x: u32,
    pub y: u32,
    pub width: u32,
    pub height: u32,
}

impl Rect {
    pub const ZERO: Self = Self::new(0, 0, 0, 0);

    pub const fn new(x: u32, y: u32, width: u32, height: u32) -> Self {
        Self {
            x,
            y,
            width,
            height,
        }
    }
}

/// Horizontal alignment for the discrete 9-point grid.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum AlignX {
    Left,
    Center,
    Right,
}

/// Vertical alignment for the discrete 9-point grid.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum AlignY {
    Top,
    Center,
    Bottom,
}

/// Axis-neutral alignment used by [`calculate_align_offset`]
/// (`Left`/`Top` -> `Start`, `Right`/`Bottom` -> `End`).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Align {
    Start,
    Center,
    End,
}

impl From<AlignX> for Align {
    fn from(value: AlignX) -> Self {
        match value {
            AlignX::Left => Align::Start,
            AlignX::Center => Align::Center,
            AlignX::Right => Align::End,
        }
    }
}

impl From<AlignY> for Align {
    fn from(value: AlignY) -> Self {
        match value {
            AlignY::Top => Align::Start,
            AlignY::Center => Align::Center,
            AlignY::Bottom => Align::End,
        }
    }
}

/// Continuous alignment point, normalized 0..1 on each axis (0.5 = true
/// center). When present on a crop config it overrides the discrete
/// align_x/align_y grid, enabling sub-pixel auto-framing (Center Stage).
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct AlignCenter {
    pub x: f64,
    pub y: f64,
}

/// Geometry-only crop configuration — the input contract of
/// [`calculate_crop_box`]. Renderer concerns (bar color, mirror, flip,
/// letterbox on/off) live on the render side, not here.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct CropConfig {
    /// Target aspect ratio as width / height (e.g. 16.0 / 9.0).
    pub aspect_ratio: f64,
    /// Digital zoom, 1.0 = no zoom, larger values shrink the viewing box.
    pub zoom: f64,
    pub align_x: AlignX,
    pub align_y: AlignY,
    /// Continuous 0..1 point; overrides the discrete grid when present.
    pub align_center: Option<AlignCenter>,
    /// Overrides `zoom` (used by auto-framing to drive zoom per frame).
    pub zoom_override: Option<f64>,
}

impl Default for CropConfig {
    fn default() -> Self {
        Self {
            aspect_ratio: 16.0 / 9.0,
            zoom: 1.0,
            align_x: AlignX::Center,
            align_y: AlignY::Center,
            align_center: None,
            zoom_override: None,
        }
    }
}

/// Clamps a value into the 0..1 range. NaN collapses to 0 for safety.
pub fn clamp01(value: f64) -> f64 {
    if value.is_nan() {
        return 0.0;
    }
    value.clamp(0.0, 1.0)
}

/// Internal f64 variant of [`calculate_align_offset`] — mirrors the TS
/// function exactly, including NaN propagation, so `calculate_crop_box` can
/// sanitize at the end the same way the TS implementation does.
fn align_offset_raw(available: f64, align: Align, continuous: Option<f64>) -> f64 {
    if let Some(continuous) = continuous {
        return (available * clamp01(continuous)).round();
    }
    match align {
        Align::Start => 0.0,
        Align::End => available,
        Align::Center => (available / 2.0).round(),
    }
}

/// Resolves a crop offset within `available` pixels.
///
/// A `continuous` value (normalized 0..1) takes precedence over the discrete
/// 9-point grid when provided — this is what lets auto-framing position the
/// crop with sub-pixel precision. Otherwise it falls back to start/center/end.
pub fn calculate_align_offset(available: u32, align: Align, continuous: Option<f64>) -> u32 {
    align_offset_raw(available as f64, align, continuous).max(0.0) as u32
}

/// Internal f64 variant of [`calculate_centered_offset`] (see
/// [`align_offset_raw`] for why).
fn centered_offset_raw(source_norm: f64, zoom_size: f64, original_size: f64) -> f64 {
    let available = original_size - zoom_size;
    if available <= 0.0 {
        return 0.0;
    }
    let desired = source_norm * original_size - zoom_size / 2.0;
    desired.clamp(0.0, available).round()
}

/// Centers the crop on a source-normalized point (0..1) and clamps it to the
/// frame edges. This is the Center Stage positioning strategy: keep the
/// subject centered while there is panning room, and pin to the nearest edge
/// (subject still fully in frame) once that room runs out.
///
/// `source_norm` is the subject's position as a fraction of the original
/// frame (e.g. a face centroid), `zoom_size` is the cropped dimension in
/// source pixels.
pub fn calculate_centered_offset(source_norm: f64, zoom_size: u32, original_size: u32) -> u32 {
    centered_offset_raw(source_norm, zoom_size as f64, original_size as f64).max(0.0) as u32
}

/// Calculates the crop box within the original stream size so that the box
/// matches the desired `aspect_ratio`, zoomed in by the zoom factor, and
/// aligned accordingly. The crop box coordinates are relative to the original
/// video dimensions.
///
/// Degenerate inputs are handled safely: a zero-sized `original` produces a
/// zero rect; a non-finite `aspect_ratio` falls back to the full frame (same
/// as the TS sanitize path).
pub fn calculate_crop_box(original: Size, config: &CropConfig) -> Rect {
    if original.width == 0 || original.height == 0 {
        return Rect::ZERO;
    }

    let (width, height) = (original.width as f64, original.height as f64);
    let original_aspect = width / height;

    // 1. Base crop dimensions (zoom = 1) that fit inside the original size
    // maintaining the requested aspect ratio.
    let mut crop_width = width;
    let mut crop_height = height;

    if original_aspect > config.aspect_ratio {
        // Original is wider than requested (e.g. 16:9 source, 4:3 target):
        // crop left/right, height stays 100%.
        crop_width = (height * config.aspect_ratio).round();
    } else {
        // Original is taller than requested (e.g. 4:3 source, 16:9 target):
        // crop top/bottom, width stays 100%.
        crop_height = (width / config.aspect_ratio).round();
    }

    // 2. Digital zoom (zoom > 1 shrinks the viewing box). `zoom_override`
    // (from auto-framing) takes precedence over the user's zoom.
    let effective_zoom = config.zoom_override.unwrap_or(config.zoom);
    let actual_zoom = effective_zoom.max(1.0);
    let zoom_width = (crop_width / actual_zoom).round();
    let zoom_height = (crop_height / actual_zoom).round();

    // 3 & 4. Alignment offsets. `align_center` (continuous 0..1) overrides
    // the discrete 9-point grid and is interpreted as "center the subject
    // here, then clamp to the frame" rather than a proportional pan.
    let (offset_x, offset_y) = match config.align_center {
        Some(center) => (
            centered_offset_raw(center.x, zoom_width, width),
            centered_offset_raw(center.y, zoom_height, height),
        ),
        None => (
            align_offset_raw(width - zoom_width, config.align_x.into(), None),
            align_offset_raw(height - zoom_height, config.align_y.into(), None),
        ),
    };

    // Sanitize so NaN or floating-point drift can never break bounds.
    let safe_x = if offset_x.is_nan() {
        0
    } else {
        offset_x.clamp(0.0, width - 1.0) as u32
    };
    let safe_y = if offset_y.is_nan() {
        0
    } else {
        offset_y.clamp(0.0, height - 1.0) as u32
    };
    let safe_width = if zoom_width.is_nan() {
        original.width
    } else {
        (zoom_width as i64).clamp(1, (original.width - safe_x) as i64) as u32
    };
    let safe_height = if zoom_height.is_nan() {
        original.height
    } else {
        (zoom_height as i64).clamp(1, (original.height - safe_y) as i64) as u32
    };

    Rect {
        x: safe_x,
        y: safe_y,
        width: safe_width,
        height: safe_height,
    }
}

/// Calculates how the cropped box should be painted onto the destination
/// surface so it acts as a letterbox (centered, touching the edges). In this
/// architecture the destination size is always equal to the original size.
pub fn calculate_destination_box(destination: Size, crop_box: Rect) -> Rect {
    if destination.width == 0
        || destination.height == 0
        || crop_box.width == 0
        || crop_box.height == 0
    {
        return Rect::ZERO;
    }

    let dest_aspect = destination.width as f64 / destination.height as f64;
    let crop_aspect = crop_box.width as f64 / crop_box.height as f64;

    let mut draw_width = destination.width as f64;
    let mut draw_height = destination.height as f64;

    if crop_aspect > dest_aspect {
        // Cropped video is wider than destination. Fit to width.
        draw_height = (destination.width as f64 / crop_aspect).round();
    } else {
        // Cropped video is taller. Fit to height.
        draw_width = (destination.height as f64 * crop_aspect).round();
    }

    // Center exactly in the middle of destination.
    let dest_x = ((destination.width as f64 - draw_width) / 2.0)
        .round()
        .max(0.0);
    let dest_y = ((destination.height as f64 - draw_height) / 2.0)
        .round()
        .max(0.0);

    Rect {
        x: dest_x as u32,
        y: dest_y as u32,
        width: draw_width.max(0.0) as u32,
        height: draw_height.max(0.0) as u32,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const HD: Size = Size::new(1920, 1080);
    const SD: Size = Size::new(640, 480);

    fn center_config(aspect_ratio: f64) -> CropConfig {
        CropConfig {
            aspect_ratio,
            zoom: 1.0,
            align_x: AlignX::Center,
            align_y: AlignY::Center,
            align_center: None,
            zoom_override: None,
        }
    }

    mod calculate_crop_box {
        use super::*;

        #[test]
        fn returns_full_dimensions_when_aspect_matches_and_zoom_is_1() {
            let config = center_config(16.0 / 9.0);
            let rect = calculate_crop_box(HD, &config);
            assert_eq!(rect.width, 1920);
            assert_eq!(rect.height, 1080);
            assert_eq!(rect.x, 0);
            assert_eq!(rect.y, 0);
        }

        #[test]
        fn crops_width_when_original_is_wider_than_target_ratio() {
            let config = center_config(4.0 / 3.0);
            let rect = calculate_crop_box(HD, &config);
            // 1080 * 4/3 = 1440
            assert_eq!(rect.width, 1440);
            assert_eq!(rect.height, 1080);
            // Centered: (1920 - 1440) / 2 = 240
            assert_eq!(rect.x, 240);
            assert_eq!(rect.y, 0);
        }

        #[test]
        fn crops_height_when_original_is_taller_than_target_ratio() {
            let config = center_config(21.0 / 9.0);
            let rect = calculate_crop_box(HD, &config);
            // 1920 / (21/9) = 1920 * 9/21 ≈ 823
            assert_eq!(rect.height, (1920.0_f64 / (21.0 / 9.0)).round() as u32);
            assert_eq!(rect.width, 1920);
        }

        #[test]
        fn applies_zoom_by_shrinking_the_crop_box() {
            let config = CropConfig {
                zoom: 2.0,
                ..center_config(16.0 / 9.0)
            };
            let rect = calculate_crop_box(HD, &config);
            assert_eq!(rect.width, 960);
            assert_eq!(rect.height, 540);
            // Centered: (1920 - 960) / 2 = 480
            assert_eq!(rect.x, 480);
            assert_eq!(rect.y, 270);
        }

        #[test]
        fn aligns_crop_box_to_top_left() {
            let config = CropConfig {
                zoom: 2.0,
                align_x: AlignX::Left,
                align_y: AlignY::Top,
                ..center_config(16.0 / 9.0)
            };
            let rect = calculate_crop_box(HD, &config);
            assert_eq!(rect.x, 0);
            assert_eq!(rect.y, 0);
        }

        #[test]
        fn aligns_crop_box_to_bottom_right() {
            let config = CropConfig {
                zoom: 2.0,
                align_x: AlignX::Right,
                align_y: AlignY::Bottom,
                ..center_config(16.0 / 9.0)
            };
            let rect = calculate_crop_box(HD, &config);
            assert_eq!(rect.x, 1920 - rect.width);
            assert_eq!(rect.y, 1080 - rect.height);
        }

        #[test]
        fn handles_square_ratio() {
            let config = center_config(1.0);
            let rect = calculate_crop_box(HD, &config);
            assert_eq!(rect.width, 1080);
            assert_eq!(rect.height, 1080);
            assert_eq!(rect.x, (1920 - 1080) / 2);
        }

        #[test]
        fn handles_portrait_ratio() {
            let config = center_config(9.0 / 16.0);
            let rect = calculate_crop_box(HD, &config);
            // aspectRatio 9/16 = 0.5625; originalAspect = 1.777 > 0.5625, so
            // the original is wider: cropWidth = 1080 * 0.5625 = 607.5 ≈ 608.
            assert_eq!(rect.height, 1080);
            assert_eq!(rect.width, (1080.0_f64 * (9.0 / 16.0)).round() as u32);
        }

        #[test]
        fn clamps_zoom_at_minimum_1() {
            let config = CropConfig {
                zoom: 0.5,
                ..center_config(16.0 / 9.0)
            };
            let rect = calculate_crop_box(HD, &config);
            // zoom 0.5 is clamped to 1
            assert_eq!(rect.width, 1920);
            assert_eq!(rect.height, 1080);
        }

        #[test]
        fn works_with_sd_resolution() {
            // 640x480 is 4:3, target 16:9 → crops height
            let rect = calculate_crop_box(SD, &center_config(16.0 / 9.0));
            assert_eq!(rect.width, 640);
            // 640 / (16/9) = 360
            assert_eq!(rect.height, 360);
        }

        #[test]
        fn zoom_override_takes_precedence_over_zoom() {
            let config = CropConfig {
                zoom: 1.0,
                zoom_override: Some(2.0),
                ..center_config(16.0 / 9.0)
            };
            let rect = calculate_crop_box(HD, &config);
            assert_eq!(rect.width, 960);
            assert_eq!(rect.height, 540);
        }
    }

    mod calculate_destination_box {
        use super::*;

        #[test]
        fn centers_a_cropped_box_that_is_wider_than_destination() {
            let dest = Size::new(1920, 1080);
            let crop = Rect::new(0, 0, 1920, 800);
            let result = calculate_destination_box(dest, crop);
            // 1920/800 = 2.4 > 1.78 → fit to width
            assert_eq!(result.width, 1920);
            assert_eq!(
                result.height,
                (1920.0_f64 / (1920.0 / 800.0)).round() as u32
            );
            assert_eq!(result.x, 0);
            assert_eq!(result.y, (1080 - result.height) / 2);
        }

        #[test]
        fn centers_a_cropped_box_that_is_taller_than_destination() {
            let dest = Size::new(1920, 1080);
            let crop = Rect::new(0, 0, 800, 1920);
            let result = calculate_destination_box(dest, crop);
            // 800/1920 = 0.417 < 1.78 → fit to height
            assert_eq!(result.height, 1080);
            assert_eq!(result.width, (1080.0_f64 * (800.0 / 1920.0)).round() as u32);
        }

        #[test]
        fn returns_full_dimensions_when_crop_matches_destination() {
            let dest = Size::new(1920, 1080);
            let crop = Rect::new(0, 0, 1920, 1080);
            let result = calculate_destination_box(dest, crop);
            assert_eq!(result.width, 1920);
            assert_eq!(result.height, 1080);
            assert_eq!(result.x, 0);
            assert_eq!(result.y, 0);
        }
    }

    mod clamp01 {
        use super::*;

        #[test]
        fn clamps_values_below_0_to_0() {
            assert_eq!(clamp01(-0.5), 0.0);
        }

        #[test]
        fn clamps_values_above_1_to_1() {
            assert_eq!(clamp01(1.5), 1.0);
        }

        #[test]
        fn passes_through_values_within_0_to_1() {
            assert_eq!(clamp01(0.3), 0.3);
        }

        #[test]
        fn collapses_nan_to_0() {
            assert_eq!(clamp01(f64::NAN), 0.0);
        }
    }

    mod calculate_align_offset {
        use super::*;

        #[test]
        fn returns_0_for_start_discrete_alignment() {
            assert_eq!(calculate_align_offset(400, Align::Start, None), 0);
        }

        #[test]
        fn returns_full_available_for_end_discrete_alignment() {
            assert_eq!(calculate_align_offset(400, Align::End, None), 400);
        }

        #[test]
        fn returns_half_for_center_discrete_alignment() {
            assert_eq!(calculate_align_offset(400, Align::Center, None), 200);
        }

        #[test]
        fn converts_from_align_x_and_align_y() {
            assert_eq!(Align::from(AlignX::Left), Align::Start);
            assert_eq!(Align::from(AlignX::Right), Align::End);
            assert_eq!(Align::from(AlignY::Top), Align::Start);
            assert_eq!(Align::from(AlignY::Bottom), Align::End);
        }

        #[test]
        fn uses_continuous_value_when_provided() {
            // 0.25 of 400 = 100
            assert_eq!(calculate_align_offset(400, Align::Center, Some(0.25)), 100);
            // discrete ignored when continuous present
            assert_eq!(calculate_align_offset(400, Align::Start, Some(0.75)), 300);
        }

        #[test]
        fn clamps_continuous_values_outside_0_to_1() {
            assert_eq!(calculate_align_offset(400, Align::Center, Some(1.5)), 400);
            assert_eq!(calculate_align_offset(400, Align::Center, Some(-0.2)), 0);
        }
    }

    mod with_align_center {
        use super::*;

        fn with_center(x: f64, y: f64) -> CropConfig {
            CropConfig {
                zoom: 2.0,
                align_center: Some(AlignCenter { x, y }),
                ..center_config(16.0 / 9.0)
            }
        }

        #[test]
        fn centers_crop_on_align_center_0_5_matching_discrete_center() {
            let discrete = calculate_crop_box(HD, &with_center_discrete());
            let continuous = calculate_crop_box(HD, &with_center(0.5, 0.5));
            assert_eq!(continuous, discrete);
        }

        fn with_center_discrete() -> CropConfig {
            CropConfig {
                zoom: 2.0,
                ..center_config(16.0 / 9.0)
            }
        }

        #[test]
        fn shifts_crop_horizontally_toward_the_right_for_high_x() {
            let left = calculate_crop_box(HD, &with_center(0.0, 0.5));
            let right = calculate_crop_box(HD, &with_center(1.0, 0.5));
            // higher x shifts the crop box further right
            assert!(right.x > left.x);
            assert!(right.x + right.width <= 1920);
        }

        #[test]
        fn places_crop_at_far_right_for_align_center_x_1() {
            let rect = calculate_crop_box(HD, &with_center(1.0, 0.5));
            assert_eq!(rect.x, 1920 - rect.width);
        }

        #[test]
        fn shifts_crop_vertically_toward_the_bottom_for_high_y() {
            let top = calculate_crop_box(HD, &with_center(0.5, 0.0));
            let bottom = calculate_crop_box(HD, &with_center(0.5, 1.0));
            assert!(bottom.y > top.y);
        }

        #[test]
        fn falls_back_to_discrete_align_when_align_center_is_none() {
            let config = CropConfig {
                zoom: 2.0,
                align_x: AlignX::Left,
                align_y: AlignY::Top,
                ..center_config(16.0 / 9.0)
            };
            let rect = calculate_crop_box(HD, &config);
            assert_eq!(rect.x, 0);
            assert_eq!(rect.y, 0);
        }

        #[test]
        fn centers_off_center_subject_while_panning_room_exists() {
            // zoom 2 on 1920-wide → zoomWidth 960, panning range [0, 960].
            // Subject at x=0.6 (1152px) is centerable: crop start = 1152 - 480 = 672.
            let rect = calculate_crop_box(HD, &with_center(0.6, 0.5));
            assert_eq!(rect.x, 672);
            // The subject lands at the exact center of the crop.
            assert_eq!(0.6 * 1920.0 - rect.x as f64, rect.width as f64 / 2.0);
        }

        #[test]
        fn pins_to_frame_edge_when_there_is_no_room_to_center() {
            // Subject at x=0.9 (1728px) can't be centered; crop clamps to the right edge.
            let rect = calculate_crop_box(HD, &with_center(0.9, 0.5));
            assert_eq!(rect.x, 1920 - rect.width);
            assert_eq!(rect.x + rect.width, 1920);
        }
    }

    mod calculate_centered_offset {
        use super::*;

        #[test]
        fn centers_a_mid_frame_subject() {
            // subject 0.5 of 1000 = 500; zoomSize 400 → start 500 - 200 = 300
            assert_eq!(calculate_centered_offset(0.5, 400, 1000), 300);
        }

        #[test]
        fn clamps_to_the_left_edge() {
            assert_eq!(calculate_centered_offset(0.1, 400, 1000), 0);
        }

        #[test]
        fn clamps_to_the_right_edge() {
            assert_eq!(calculate_centered_offset(0.9, 400, 1000), 600);
        }

        #[test]
        fn returns_0_when_zoomed_box_is_at_least_as_large_as_frame() {
            assert_eq!(calculate_centered_offset(0.5, 1200, 1000), 0);
        }
    }

    mod degenerate_inputs {
        use super::*;

        #[test]
        fn zero_sized_original_returns_zero_rect() {
            let rect = calculate_crop_box(Size::new(0, 1080), &center_config(16.0 / 9.0));
            assert_eq!(rect, Rect::new(0, 0, 0, 0));
        }

        #[test]
        fn non_finite_aspect_ratio_falls_back_to_full_frame() {
            // Matches the TS sanitize path: NaN width/height fall back to the
            // original dimensions, producing the full frame at 0,0.
            let config = center_config(f64::NAN);
            let rect = calculate_crop_box(HD, &config);
            assert_eq!(rect, Rect::new(0, 0, 1920, 1080));
        }

        #[test]
        fn zero_sized_destination_returns_zero_rect() {
            let result = calculate_destination_box(Size::new(0, 0), Rect::new(0, 0, 100, 100));
            assert_eq!(result, Rect::new(0, 0, 0, 0));
        }
    }
}
