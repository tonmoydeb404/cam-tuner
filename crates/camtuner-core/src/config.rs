//! The user-facing config model, wire-compatible with the TypeScript
//! `TunerConfig` (`packages/stream-config/src/tuner-types.ts`).
//!
//! The JSON contract is camelCase. Optional TS fields (backward compatibility
//! with older persisted configs) are plain typed fields with `#[serde(default)]`
//! here — "missing" and "explicit default" are equivalent by design, exactly
//! like `undefined` in TS.
//!
//! Prefer `#[serde(deny_unknown_fields)]`-free parsing: unknown fields are
//! ignored so older/newer peers stay interoperable.

use serde::{Deserialize, Serialize};

use crate::math::{AlignX, AlignY, CropConfig};

/// Aspect-ratio presets. Serialized as the same strings the extension and web
/// app use (`"16:9"`, `"4:3"`, `"1:1"`, `"9:16"`).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default, Serialize, Deserialize)]
pub enum AspectRatio {
    #[serde(rename = "16:9")]
    #[default]
    SixteenNine,
    #[serde(rename = "4:3")]
    FourThree,
    #[serde(rename = "1:1")]
    OneOne,
    #[serde(rename = "9:16")]
    NineSixteen,
}

impl AspectRatio {
    /// Numeric width / height, port of `parseAspectRatio` (including the
    /// 16:9 fallback for unknown input — unreachable with the enum).
    pub fn ratio(self) -> f64 {
        match self {
            AspectRatio::SixteenNine => 16.0 / 9.0,
            AspectRatio::FourThree => 4.0 / 3.0,
            AspectRatio::OneOne => 1.0,
            AspectRatio::NineSixteen => 9.0 / 16.0,
        }
    }
}

/// Zoom behaviour. `"fixed"` uses the manual `zoom` value; `"auto"` lets face
/// detection drive zoom within `[auto_zoom_min, auto_zoom_max]` (independent
/// of Center Stage).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum ZoomMode {
    #[default]
    Fixed,
    Auto,
}

/// Background effect mode (accepted for wire compatibility; rendering lands
/// in a later milestone).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum BackgroundMode {
    #[default]
    None,
    Blur,
    Image,
}

/// Compound alignment position — the 9-point grid, serialized as kebab-case
/// strings (`"top-left"`, `"center"`, `"bottom-right"`, …).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum AlignPosition {
    TopLeft,
    TopCenter,
    TopRight,
    CenterLeft,
    #[default]
    Center,
    CenterRight,
    BottomLeft,
    BottomCenter,
    BottomRight,
}

impl AlignPosition {
    /// Splits a compound position into horizontal and vertical alignment,
    /// port of `parseAlignPosition`.
    pub fn split(self) -> (AlignX, AlignY) {
        let align_x = match self {
            AlignPosition::TopLeft | AlignPosition::CenterLeft | AlignPosition::BottomLeft => {
                AlignX::Left
            }
            AlignPosition::TopRight | AlignPosition::CenterRight | AlignPosition::BottomRight => {
                AlignX::Right
            }
            _ => AlignX::Center,
        };

        let align_y = match self {
            AlignPosition::TopLeft | AlignPosition::TopCenter | AlignPosition::TopRight => {
                AlignY::Top
            }
            AlignPosition::BottomLeft
            | AlignPosition::BottomCenter
            | AlignPosition::BottomRight => AlignY::Bottom,
            _ => AlignY::Center,
        };

        (align_x, align_y)
    }
}

/// User-facing tuner configuration — the desktop mirror of the TS
/// `TunerConfig`, persisted as JSON in the app's settings store.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct TunerConfig {
    pub aspect_ratio: AspectRatio,
    pub zoom: f64,
    pub align: AlignPosition,
    pub bar_color: String,
    pub mirror: bool,
    /// Vertical flip. Combined with `mirror` this corrects a physically
    /// upside-down camera (180° rotation).
    #[serde(default)]
    pub flip_vertical: bool,
    /// Center Stage (face-tracking auto-framing) on/off.
    #[serde(default)]
    pub center_stage_enabled: bool,
    /// Pad the cropped region with bars to keep the original resolution
    /// (true, default) or output exactly the cropped region (false).
    #[serde(default = "default_true")]
    pub letterbox: bool,
    /// Whether face detection drives zoom ("auto") or the manual `zoom`
    /// value is used ("fixed"). Independent of `center_stage_enabled`.
    #[serde(default)]
    pub zoom_mode: ZoomMode,
    /// Minimum auto-zoom (only used when `zoom_mode` is auto).
    #[serde(default = "default_auto_zoom_min")]
    pub auto_zoom_min: f64,
    /// Maximum auto-zoom ceiling (only used when `zoom_mode` is auto).
    #[serde(default = "default_auto_zoom_max")]
    pub auto_zoom_max: f64,
    #[serde(default)]
    pub background_mode: BackgroundMode,
    #[serde(default = "default_blur_strength")]
    pub blur_strength: f64,
    #[serde(default)]
    pub background_image: Option<String>,
}

fn default_true() -> bool {
    true
}

fn default_auto_zoom_min() -> f64 {
    1.0
}

fn default_auto_zoom_max() -> f64 {
    2.5
}

fn default_blur_strength() -> f64 {
    14.0
}

impl Default for TunerConfig {
    /// Mirrors `DEFAULT_TUNER_CONFIG` from `tuner-types.ts`.
    fn default() -> Self {
        Self {
            aspect_ratio: AspectRatio::SixteenNine,
            zoom: 1.0,
            align: AlignPosition::Center,
            bar_color: "#000000".to_string(),
            mirror: false,
            flip_vertical: false,
            center_stage_enabled: false,
            letterbox: true,
            zoom_mode: ZoomMode::Fixed,
            auto_zoom_min: 1.0,
            auto_zoom_max: 2.5,
            background_mode: BackgroundMode::None,
            blur_strength: 14.0,
            background_image: None,
        }
    }
}

impl TunerConfig {
    /// Geometry for the crop renderer, port of `tunerConfigToCropConfig`
    /// (bar color / mirror / flip / letterbox are consumed separately by the
    /// render side via [`Self::bar_color_rgb`], [`Self::mirror`], …).
    pub fn to_crop_config(&self) -> CropConfig {
        let (align_x, align_y) = self.align.split();
        CropConfig {
            aspect_ratio: self.aspect_ratio.ratio(),
            zoom: self.zoom,
            align_x,
            align_y,
            align_center: None,
            zoom_override: None,
        }
    }

    /// Letterbox bar color as RGB. Invalid or empty values fall back to
    /// black (matches the TS `barColor || "#000000"` behavior).
    pub fn bar_color_rgb(&self) -> Rgb {
        parse_hex_color(&self.bar_color).unwrap_or(Rgb::BLACK)
    }
}

/// An 8-bit RGB color (parsed from CSS hex strings, consumed by frame fills).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub struct Rgb {
    pub r: u8,
    pub g: u8,
    pub b: u8,
}

impl Rgb {
    pub const BLACK: Self = Self { r: 0, g: 0, b: 0 };

    pub const fn new(r: u8, g: u8, b: u8) -> Self {
        Self { r, g, b }
    }
}

/// Parses `#rgb`, `#rrggbb`, and `#rrggbbaa` hex colors. Returns `None` for
/// anything else (callers decide the fallback; [`TunerConfig::bar_color_rgb`]
/// falls back to black like the TS implementation).
pub fn parse_hex_color(input: &str) -> Option<Rgb> {
    let hex = input.strip_prefix('#')?;
    match hex.len() {
        3 => {
            let r = u8::from_str_radix(&hex[0..1].repeat(2), 16).ok()?;
            let g = u8::from_str_radix(&hex[1..2].repeat(2), 16).ok()?;
            let b = u8::from_str_radix(&hex[2..3].repeat(2), 16).ok()?;
            Some(Rgb::new(r, g, b))
        }
        6 => {
            let r = u8::from_str_radix(&hex[0..2], 16).ok()?;
            let g = u8::from_str_radix(&hex[2..4], 16).ok()?;
            let b = u8::from_str_radix(&hex[4..6], 16).ok()?;
            Some(Rgb::new(r, g, b))
        }
        8 => {
            let r = u8::from_str_radix(&hex[0..2], 16).ok()?;
            let g = u8::from_str_radix(&hex[2..4], 16).ok()?;
            let b = u8::from_str_radix(&hex[4..6], 16).ok()?;
            // Alpha is accepted (web parity) but ignored for frame fills.
            let _ = u8::from_str_radix(&hex[6..8], 16).ok()?;
            Some(Rgb::new(r, g, b))
        }
        _ => None,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    mod serde_roundtrip {
        use super::*;

        #[test]
        fn serializes_camel_case_matching_ts_contract() {
            let json = serde_json::to_string(&TunerConfig::default()).unwrap();
            assert!(json.contains("\"aspectRatio\":\"16:9\""));
            assert!(json.contains("\"barColor\":\"#000000\""));
            assert!(json.contains("\"zoomMode\":\"fixed\""));
            assert!(json.contains("\"autoZoomMax\":2.5"));
            assert!(!json.to_lowercase().contains("aspect_ratio"));
        }

        #[test]
        fn deserializes_full_ts_shape() {
            let json = r##"{
                "aspectRatio": "9:16",
                "zoom": 1.75,
                "align": "bottom-right",
                "barColor": "#112233",
                "mirror": true,
                "flipVertical": true,
                "centerStageEnabled": true,
                "letterbox": false,
                "zoomMode": "auto",
                "autoZoomMin": 1.2,
                "autoZoomMax": 3.0,
                "backgroundMode": "blur",
                "blurStrength": 20,
                "backgroundImage": "preset:blur"
            }"##;
            let config: TunerConfig = serde_json::from_str(json).unwrap();
            assert_eq!(config.aspect_ratio, AspectRatio::NineSixteen);
            assert_eq!(config.zoom, 1.75);
            assert_eq!(config.align, AlignPosition::BottomRight);
            assert!(config.mirror);
            assert!(config.flip_vertical);
            assert!(config.center_stage_enabled);
            assert!(!config.letterbox);
            assert_eq!(config.zoom_mode, ZoomMode::Auto);
            assert_eq!(config.auto_zoom_min, 1.2);
            assert_eq!(config.auto_zoom_max, 3.0);
            assert_eq!(config.background_mode, BackgroundMode::Blur);
            assert_eq!(config.background_image.as_deref(), Some("preset:blur"));
        }

        #[test]
        fn missing_legacy_optional_fields_get_ts_defaults() {
            // Older persisted configs predate flipVertical / letterbox /
            // zoomMode / background* — undefined maps to the same defaults
            // the TS consumers apply.
            let json = r##"{
                "aspectRatio": "4:3",
                "zoom": 1,
                "align": "center",
                "barColor": "#000000",
                "mirror": false
            }"##;
            let config: TunerConfig = serde_json::from_str(json).unwrap();
            assert_eq!(
                config,
                TunerConfig {
                    aspect_ratio: AspectRatio::FourThree,
                    ..TunerConfig::default()
                }
            );
            assert!(!config.flip_vertical);
            assert!(config.letterbox);
            assert_eq!(config.zoom_mode, ZoomMode::Fixed);
            assert_eq!(config.background_mode, BackgroundMode::None);
            assert_eq!(config.background_image, None);
        }

        #[test]
        fn unknown_fields_are_ignored_for_interop() {
            let json = r##"{
                "aspectRatio": "1:1",
                "zoom": 1,
                "align": "center",
                "barColor": "#000000",
                "mirror": false,
                "someFutureField": { "nested": true }
            }"##;
            let config: TunerConfig = serde_json::from_str(json).unwrap();
            assert_eq!(config.aspect_ratio, AspectRatio::OneOne);
        }

        #[test]
        fn roundtrip_preserves_values() {
            let original = TunerConfig {
                zoom: 2.25,
                align: AlignPosition::TopLeft,
                ..TunerConfig::default()
            };
            let json = serde_json::to_string(&original).unwrap();
            let parsed: TunerConfig = serde_json::from_str(&json).unwrap();
            assert_eq!(parsed, original);
        }
    }

    mod aspect_ratio {
        use super::*;

        #[test]
        fn parses_to_numeric_ratio() {
            assert!((AspectRatio::SixteenNine.ratio() - 16.0 / 9.0).abs() < f64::EPSILON);
            assert!((AspectRatio::FourThree.ratio() - 4.0 / 3.0).abs() < f64::EPSILON);
            assert_eq!(AspectRatio::OneOne.ratio(), 1.0);
            assert!((AspectRatio::NineSixteen.ratio() - 9.0 / 16.0).abs() < f64::EPSILON);
        }
    }

    mod align_position {
        use super::*;

        #[test]
        fn splits_compound_positions() {
            assert_eq!(AlignPosition::TopLeft.split(), (AlignX::Left, AlignY::Top));
            assert_eq!(
                AlignPosition::BottomCenter.split(),
                (AlignX::Center, AlignY::Bottom)
            );
            assert_eq!(
                AlignPosition::CenterRight.split(),
                (AlignX::Right, AlignY::Center)
            );
        }

        #[test]
        fn center_splits_to_center() {
            assert_eq!(
                AlignPosition::Center.split(),
                (AlignX::Center, AlignY::Center)
            );
        }

        #[test]
        fn serializes_kebab_case() {
            assert_eq!(
                serde_json::to_string(&AlignPosition::TopLeft).unwrap(),
                "\"top-left\""
            );
            assert_eq!(
                serde_json::to_string(&AlignPosition::Center).unwrap(),
                "\"center\""
            );
        }
    }

    mod colors {
        use super::*;

        #[test]
        fn parses_six_digit_hex() {
            assert_eq!(parse_hex_color("#ff8800"), Some(Rgb::new(255, 136, 0)));
            assert_eq!(parse_hex_color("#000000"), Some(Rgb::BLACK));
        }

        #[test]
        fn parses_three_digit_hex() {
            assert_eq!(parse_hex_color("#f80"), Some(Rgb::new(255, 136, 0)));
        }

        #[test]
        fn parses_eight_digit_hex_ignoring_alpha() {
            assert_eq!(parse_hex_color("#ff880080"), Some(Rgb::new(255, 136, 0)));
        }

        #[test]
        fn rejects_invalid_input() {
            assert_eq!(parse_hex_color(""), None);
            assert_eq!(parse_hex_color("ff8800"), None);
            assert_eq!(parse_hex_color("#12345"), None);
            assert_eq!(parse_hex_color("#zzzzzz"), None);
        }

        #[test]
        fn bar_color_falls_back_to_black_on_garbage() {
            let config = TunerConfig {
                bar_color: "not-a-color".to_string(),
                ..TunerConfig::default()
            };
            assert_eq!(config.bar_color_rgb(), Rgb::BLACK);
            let config = TunerConfig {
                bar_color: String::new(),
                ..TunerConfig::default()
            };
            assert_eq!(config.bar_color_rgb(), Rgb::BLACK);
        }
    }

    mod to_crop_config {
        use super::*;

        #[test]
        fn maps_user_facing_config_to_geometry() {
            let config = TunerConfig {
                aspect_ratio: AspectRatio::FourThree,
                zoom: 2.0,
                align: AlignPosition::TopRight,
                ..TunerConfig::default()
            };
            let crop = config.to_crop_config();
            assert!((crop.aspect_ratio - 4.0 / 3.0).abs() < f64::EPSILON);
            assert_eq!(crop.zoom, 2.0);
            assert_eq!(crop.align_x, AlignX::Right);
            assert_eq!(crop.align_y, AlignY::Top);
            assert_eq!(crop.align_center, None);
            assert_eq!(crop.zoom_override, None);
        }
    }
}
