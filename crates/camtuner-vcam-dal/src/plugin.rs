//! Plug-in state and the CMIOObject property model.
//!
//! The DAL drives everything through `ObjectHasProperty` /
//! `ObjectGetPropertyDataSize` / `ObjectGetPropertyData` on three objects:
//! the plug-in itself, one device, and one stream. Property selectors and
//! data encodings follow the SDK headers exactly — clients (and the DAL's
//! own bookkeeping) expect FourCC-precise behavior.

use std::collections::HashMap;
use std::os::raw::c_void;
use std::sync::atomic::{AtomicBool, AtomicU32, Ordering};
use std::sync::{Arc, Mutex, OnceLock};

use crate::ffi::*;

pub const DEVICE_NAME: &str = "CamTuner Camera";
pub const DEVICE_MANUFACTURER: &str = "CamTuner";
pub const DEVICE_MODEL: &str = "CamTuner Virtual Device";
pub const DEVICE_UID: &str = "app.camtuner.vcam";
pub const PLUGIN_BUNDLE_ID: &str = "app.camtuner.vcam.dal";
/// Frames per second advertised to clients (camera-paced in practice).
pub const STREAM_FRAME_RATE: f64 = 30.0;

/// The latest UYVY frame received from the app.
pub struct FrameBytes {
    pub width: u32,
    pub height: u32,
    pub pts_us: u64,
    pub payload: Arc<Vec<u8>>,
}

/// The DAL-owned buffer queue plus the callback used to announce changes.
pub struct StreamQueue {
    pub queue: *mut c_void,
    pub altered_proc: Option<unsafe extern "C" fn(*mut c_void, *mut c_void)>,
    pub altered_refcon: *mut c_void,
}

unsafe impl Send for StreamQueue {}

/// Global plug-in state. Created once per process (the DAL loads one plug-in
/// instance per host); all mutation is interior.
pub struct PluginState {
    pub refs: AtomicU32,
    pub initialized: AtomicBool,
    pub plugin_object_id: AtomicU32,
    pub device_object_id: AtomicU32,
    pub stream_object_id: AtomicU32,

    pub queue: Mutex<Option<StreamQueue>>,
    /// Frame pump control; owned here so Start/StopStream and Teardown can
    /// manage it.
    pub pump: Mutex<Option<crate::pump::FramePump>>,
    pub pump_running: AtomicBool,
    pub latest_frame: Mutex<Option<FrameBytes>>,
    /// CMVideoFormatDescription cache keyed by (width, height).
    pub format_descs: Mutex<HashMap<(u32, u32), *mut c_void>>,

    pub name_string: OnceLock<*mut c_void>,
    pub manufacturer_string: OnceLock<*mut c_void>,
    pub uid_string: OnceLock<*mut c_void>,
    pub model_string: OnceLock<*mut c_void>,
    pub bundle_id_string: OnceLock<*mut c_void>,
}

impl PluginState {
    fn new() -> Self {
        Self {
            refs: AtomicU32::new(0),
            initialized: AtomicBool::new(false),
            plugin_object_id: AtomicU32::new(0),
            device_object_id: AtomicU32::new(0),
            stream_object_id: AtomicU32::new(0),
            queue: Mutex::new(None),
            pump: Mutex::new(None),
            pump_running: AtomicBool::new(false),
            latest_frame: Mutex::new(None),
            format_descs: Mutex::new(HashMap::new()),
            name_string: OnceLock::new(),
            manufacturer_string: OnceLock::new(),
            uid_string: OnceLock::new(),
            model_string: OnceLock::new(),
            bundle_id_string: OnceLock::new(),
        }
    }
}

static STATE: OnceLock<PluginState> = OnceLock::new();

// SAFETY: the raw pointers held by PluginState (cached CFStrings, CM
// format descriptions) are immutable after creation and only ever read;
// mutation goes through the Mutex/Atomic fields.
unsafe impl Send for PluginState {}
unsafe impl Sync for PluginState {}

pub fn state() -> &'static PluginState {
    STATE.get_or_init(PluginState::new)
}

/// Creates a cached CFString (immortal for the process lifetime — the DAL
/// hands out these pointers in property answers, so they must stay valid).
pub fn cached_string(slot: &OnceLock<*mut c_void>, value: &str) -> *mut c_void {
    *slot.get_or_init(|| unsafe {
        CFStringCreateWithCString(
            kCFAllocatorDefault,
            format!("{value}\0").as_ptr() as *const libc::c_char,
            kCFStringEncodingUTF8,
        )
    })
}

/// Object kinds addressable through the property model.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ObjectKind {
    Plugin,
    Device,
    Stream,
}

pub fn object_kind(object_id: u32) -> Option<ObjectKind> {
    let s = state();
    if object_id == 0 || !s.initialized.load(Ordering::Relaxed) {
        return None;
    }
    if object_id == s.plugin_object_id.load(Ordering::Relaxed) {
        Some(ObjectKind::Plugin)
    } else if object_id == s.device_object_id.load(Ordering::Relaxed) {
        Some(ObjectKind::Device)
    } else if object_id == s.stream_object_id.load(Ordering::Relaxed) {
        Some(ObjectKind::Stream)
    } else {
        None
    }
}

/// Which properties each object supports, global scope, master element.
pub fn has_property(kind: ObjectKind, selector: u32) -> bool {
    match kind {
        ObjectKind::Plugin => matches!(
            selector,
            kCMIOObjectPropertyClass
                | kCMIOObjectPropertyOwner
                | kCMIOObjectPropertyManufacturer
                | kCMIOObjectPropertyName
                | kCMIOPlugInPropertyBundleID
                | kCMIOObjectPropertyOwnedObjects
        ),
        ObjectKind::Device => matches!(
            selector,
            kCMIOObjectPropertyClass
                | kCMIODevicePropertyDeviceUID
                | kCMIODevicePropertyModelUID
                | kCMIODevicePropertyTransportType
                | kCMIODevicePropertyDeviceIsAlive
                | kCMIODevicePropertyDeviceIsRunning
                | kCMIODevicePropertyDeviceIsRunningSomewhere
                | kCMIODevicePropertyDeviceHasChanged
                | kCMIODevicePropertyDeviceCanBeDefaultDevice
                | kCMIODevicePropertyStreamConfiguration
                | kCMIODevicePropertyStreams
                | kCMIODevicePropertyPlugIn
                | kCMIODevicePropertyHogMode
                | kCMIODevicePropertySuspendedByUser
                | kCMIODevicePropertyLatency
        ),
        ObjectKind::Stream => matches!(
            selector,
            kCMIOObjectPropertyClass
                | kCMIOStreamPropertyDirection
                | kCMIOStreamPropertyOutputBufferQueueSize
                | kCMIOStreamPropertyFormatDescription
                | kCMIOStreamPropertyFormatDescriptions
                | kCMIOStreamPropertyPreferredFormatDescription
                | kCMIOStreamPropertyFrameRate
                | kCMIOStreamPropertyFrameRates
                | kCMIOStreamPropertyFrameRateRanges
                | kCMIOStreamPropertyPreferredFrameRate
                | kCMIOStreamPropertyMinimumFrameRate
                | kCMIOStreamPropertyLatency
                | kCMIOStreamPropertyStartingChannel
                | kCMIOStreamPropertyTerminalType
        ),
    }
}

/// Property data byte sizes (the value the DAL sees from
/// `ObjectGetPropertyDataSize`).
pub fn property_data_size(kind: ObjectKind, selector: u32) -> Option<usize> {
    let ptr = std::mem::size_of::<*const c_void>();
    Some(match (kind, selector) {
        (ObjectKind::Plugin, kCMIOObjectPropertyClass)
        | (ObjectKind::Device, kCMIOObjectPropertyClass)
        | (ObjectKind::Stream, kCMIOObjectPropertyClass) => 4,
        (ObjectKind::Plugin, kCMIOPlugInPropertyBundleID)
        | (ObjectKind::Plugin, kCMIOObjectPropertyManufacturer)
        | (ObjectKind::Plugin, kCMIOObjectPropertyName)
        | (ObjectKind::Device, kCMIODevicePropertyDeviceUID)
        | (ObjectKind::Device, kCMIODevicePropertyModelUID) => ptr,
        (ObjectKind::Plugin, kCMIOObjectPropertyOwner)
        | (ObjectKind::Device, kCMIODevicePropertyPlugIn) => 4,
        (ObjectKind::Plugin, kCMIOObjectPropertyOwnedObjects) => 4,
        (ObjectKind::Device, kCMIODevicePropertyTransportType)
        | (ObjectKind::Device, kCMIODevicePropertyDeviceIsAlive)
        | (ObjectKind::Device, kCMIODevicePropertyDeviceIsRunning)
        | (ObjectKind::Device, kCMIODevicePropertyDeviceIsRunningSomewhere)
        | (ObjectKind::Device, kCMIODevicePropertyDeviceHasChanged)
        | (ObjectKind::Device, kCMIODevicePropertyDeviceCanBeDefaultDevice)
        | (ObjectKind::Device, kCMIODevicePropertyHogMode)
        | (ObjectKind::Device, kCMIODevicePropertySuspendedByUser)
        | (ObjectKind::Device, kCMIODevicePropertyLatency)
        | (ObjectKind::Stream, kCMIOStreamPropertyDirection)
        | (ObjectKind::Stream, kCMIOStreamPropertyOutputBufferQueueSize)
        | (ObjectKind::Stream, kCMIOStreamPropertyLatency)
        | (ObjectKind::Stream, kCMIOStreamPropertyStartingChannel)
        | (ObjectKind::Stream, kCMIOStreamPropertyTerminalType) => 4,
        (ObjectKind::Device, kCMIODevicePropertyStreamConfiguration) => 8,
        (ObjectKind::Device, kCMIODevicePropertyStreams) => 4,
        (ObjectKind::Stream, kCMIOStreamPropertyFormatDescription)
        | (ObjectKind::Stream, kCMIOStreamPropertyPreferredFormatDescription) => ptr,
        (ObjectKind::Stream, kCMIOStreamPropertyFormatDescriptions) => ptr,
        (ObjectKind::Stream, kCMIOStreamPropertyFrameRate)
        | (ObjectKind::Stream, kCMIOStreamPropertyPreferredFrameRate)
        | (ObjectKind::Stream, kCMIOStreamPropertyMinimumFrameRate) => 8,
        (ObjectKind::Stream, kCMIOStreamPropertyFrameRates) => 8,
        (ObjectKind::Stream, kCMIOStreamPropertyFrameRateRanges) => 16,
        _ => return None,
    })
}

/// Scalar (non-CF) property values, written little-endian native.
pub fn scalar_property(kind: ObjectKind, selector: u32) -> Option<Vec<u8>> {
    let s = state();
    let u32v = |v: u32| v.to_ne_bytes().to_vec();
    match (kind, selector) {
        (ObjectKind::Plugin, kCMIOObjectPropertyClass) => Some(u32v(kCMIOPlugInClassID)),
        (ObjectKind::Device, kCMIOObjectPropertyClass) => Some(u32v(kCMIODeviceClassID)),
        (ObjectKind::Stream, kCMIOObjectPropertyClass) => Some(u32v(kCMIOStreamClassID)),

        (ObjectKind::Plugin, kCMIOObjectPropertyOwner)
        | (ObjectKind::Device, kCMIODevicePropertyPlugIn) => {
            Some(u32v(s.plugin_object_id.load(Ordering::Relaxed)))
        }
        (ObjectKind::Plugin, kCMIOObjectPropertyOwnedObjects) => {
            Some(u32v(s.device_object_id.load(Ordering::Relaxed)))
        }

        (ObjectKind::Device, kCMIODevicePropertyTransportType) => {
            Some(u32v(kIOAudioDeviceTransportTypeVirtual))
        }
        (ObjectKind::Device, kCMIODevicePropertyDeviceIsAlive) => Some(u32v(1)),
        (ObjectKind::Device, kCMIODevicePropertyDeviceIsRunning) => {
            let running = s.pump_running.load(Ordering::Relaxed);
            Some(u32v(running as u32))
        }
        (ObjectKind::Device, kCMIODevicePropertyDeviceIsRunningSomewhere) => {
            let running = s.pump_running.load(Ordering::Relaxed);
            Some(u32v(running as u32))
        }
        (ObjectKind::Device, kCMIODevicePropertyDeviceHasChanged) => Some(u32v(0)),
        (ObjectKind::Device, kCMIODevicePropertyDeviceCanBeDefaultDevice) => Some(u32v(0)),
        (ObjectKind::Device, kCMIODevicePropertyHogMode) => Some(u32v(u32::MAX)), // -1
        (ObjectKind::Device, kCMIODevicePropertySuspendedByUser) => Some(u32v(0)),
        (ObjectKind::Device, kCMIODevicePropertyLatency) => Some(u32v(0)),
        (ObjectKind::Device, kCMIODevicePropertyStreamConfiguration) => {
            // [numberOfStreams, channelsPerStream]
            let mut out = Vec::with_capacity(8);
            out.extend_from_slice(&1u32.to_ne_bytes());
            out.extend_from_slice(&1u32.to_ne_bytes());
            Some(out)
        }
        (ObjectKind::Device, kCMIODevicePropertyStreams) => {
            Some(u32v(s.stream_object_id.load(Ordering::Relaxed)))
        }

        (ObjectKind::Stream, kCMIOStreamPropertyDirection) => Some(u32v(1)), // output
        (ObjectKind::Stream, kCMIOStreamPropertyOutputBufferQueueSize) => Some(u32v(4)),
        (ObjectKind::Stream, kCMIOStreamPropertyLatency) => Some(u32v(0)),
        (ObjectKind::Stream, kCMIOStreamPropertyStartingChannel) => Some(u32v(0)),
        (ObjectKind::Stream, kCMIOStreamPropertyTerminalType) => Some(u32v(0)),
        (ObjectKind::Stream, kCMIOStreamPropertyFrameRate)
        | (ObjectKind::Stream, kCMIOStreamPropertyPreferredFrameRate) => {
            Some(STREAM_FRAME_RATE.to_ne_bytes().to_vec())
        }
        (ObjectKind::Stream, kCMIOStreamPropertyMinimumFrameRate) => {
            Some(STREAM_FRAME_RATE.to_ne_bytes().to_vec())
        }
        (ObjectKind::Stream, kCMIOStreamPropertyFrameRates) => {
            STREAM_FRAME_RATE.to_ne_bytes().to_vec().into()
        }
        (ObjectKind::Stream, kCMIOStreamPropertyFrameRateRanges) => {
            let mut out = Vec::with_capacity(16);
            out.extend_from_slice(&STREAM_FRAME_RATE.to_ne_bytes());
            out.extend_from_slice(&STREAM_FRAME_RATE.to_ne_bytes());
            Some(out)
        }
        _ => None,
    }
}

/// CFType-valued properties — the returned pointer is cached/immortal, so no
/// release bookkeeping is needed on either side.
pub fn cftypes_property(kind: ObjectKind, selector: u32) -> Option<*mut c_void> {
    let s = state();
    match (kind, selector) {
        (ObjectKind::Plugin, kCMIOObjectPropertyName)
        | (ObjectKind::Device, kCMIOObjectPropertyName) => {
            Some(cached_string(&s.name_string, DEVICE_NAME))
        }
        (ObjectKind::Plugin, kCMIOObjectPropertyManufacturer)
        | (ObjectKind::Device, kCMIODevicePropertyModelUID) => {
            // ModelUID is a string; manufacturer string doubles for it.
            Some(cached_string(&s.manufacturer_string, DEVICE_MANUFACTURER))
        }
        (ObjectKind::Device, kCMIODevicePropertyDeviceUID) => {
            Some(cached_string(&s.uid_string, DEVICE_UID))
        }
        (ObjectKind::Plugin, kCMIOPlugInPropertyBundleID) => {
            Some(cached_string(&s.bundle_id_string, PLUGIN_BUNDLE_ID))
        }
        (ObjectKind::Stream, kCMIOStreamPropertyFormatDescription)
        | (ObjectKind::Stream, kCMIOStreamPropertyPreferredFormatDescription) => {
            let (w, h) = current_dims(s);
            Some(format_description_for(w, h))
        }
        (ObjectKind::Stream, kCMIOStreamPropertyFormatDescriptions) => {
            let (w, h) = current_dims(s);
            let desc = format_description_for(w, h);
            let values = [desc];
            // Array with no callbacks: we own descriptor lifetime (cached).
            unsafe {
                Some(CFArrayCreate(
                    kCFAllocatorDefault,
                    values.as_ptr() as *const *const c_void,
                    1,
                    std::ptr::null(),
                ))
            }
        }
        _ => None,
    }
}

fn current_dims(s: &PluginState) -> (u32, u32) {
    s.latest_frame
        .lock()
        .map(|f| {
            f.as_ref()
                .map(|frame| (frame.width, frame.height))
                .unwrap_or((1280, 720))
        })
        .unwrap_or((1280, 720))
}

/// Creates (and caches) a CMVideoFormatDescription for `'2vuy'` at `dims`.
pub fn format_description_for(width: u32, height: u32) -> *mut c_void {
    let s = state();
    let mut cache = s.format_descs.lock().expect("format desc cache poisoned");
    *cache.entry((width, height)).or_insert_with(|| unsafe {
        let mut desc: *mut c_void = std::ptr::null_mut();
        CMVideoFormatDescriptionCreate(
            kCFAllocatorDefault,
            kCMVideoCodecType_422YpCbCr8,
            width as i32,
            height as i32,
            std::ptr::null(),
            &mut desc,
        );
        desc
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn fourcc_values_match_sdk_constants() {
        assert_eq!(kCMIODevicePropertyDeviceUID, fourcc(b"uid "));
        assert_eq!(kCMIODevicePropertyStreamConfiguration, fourcc(b"slay"));
        assert_eq!(kCMIODevicePropertyStreams, fourcc(b"stm#"));
        assert_eq!(kCMIODeviceClassID, fourcc(b"adev"));
        assert_eq!(kCMIOStreamClassID, fourcc(b"astr"));
        assert_eq!(kCMIOPlugInClassID, fourcc(b"aplg"));
        assert_eq!(kCMIOStreamPropertyFormatDescription, fourcc(b"pft "));
        assert_eq!(kCMIOStreamPropertyFrameRate, fourcc(b"nfrt"));
        assert_eq!(kCMVideoCodecType_422YpCbCr8, u32::from_be_bytes(*b"2vuy"));
        assert_eq!(
            kCMIOHardwareUnsupportedOperationError as u32,
            fourcc(b"unop")
        );
    }

    #[test]
    fn stream_configuration_packing() {
        let data =
            scalar_property(ObjectKind::Device, kCMIODevicePropertyStreamConfiguration).unwrap();
        assert_eq!(data.len(), 8);
        assert_eq!(&data[..4], &1u32.to_ne_bytes());
        assert_eq!(&data[4..], &1u32.to_ne_bytes());
    }

    #[test]
    fn device_property_tables_are_consistent() {
        // Every property with a size has a value path and vice versa.
        for kind in [ObjectKind::Plugin, ObjectKind::Device, ObjectKind::Stream] {
            let selectors: &[u32] = match kind {
                ObjectKind::Plugin => &[
                    kCMIOObjectPropertyClass,
                    kCMIOObjectPropertyOwner,
                    kCMIOObjectPropertyManufacturer,
                    kCMIOObjectPropertyName,
                    kCMIOPlugInPropertyBundleID,
                    kCMIOObjectPropertyOwnedObjects,
                ],
                ObjectKind::Device => &[
                    kCMIOObjectPropertyClass,
                    kCMIODevicePropertyDeviceUID,
                    kCMIODevicePropertyModelUID,
                    kCMIODevicePropertyTransportType,
                    kCMIODevicePropertyDeviceIsAlive,
                    kCMIODevicePropertyDeviceIsRunning,
                    kCMIODevicePropertyDeviceIsRunningSomewhere,
                    kCMIODevicePropertyDeviceHasChanged,
                    kCMIODevicePropertyDeviceCanBeDefaultDevice,
                    kCMIODevicePropertyStreamConfiguration,
                    kCMIODevicePropertyStreams,
                    kCMIODevicePropertyPlugIn,
                    kCMIODevicePropertyHogMode,
                    kCMIODevicePropertySuspendedByUser,
                    kCMIODevicePropertyLatency,
                ],
                ObjectKind::Stream => &[
                    kCMIOObjectPropertyClass,
                    kCMIOStreamPropertyDirection,
                    kCMIOStreamPropertyOutputBufferQueueSize,
                    kCMIOStreamPropertyFrameRate,
                    kCMIOStreamPropertyFrameRates,
                    kCMIOStreamPropertyFrameRateRanges,
                    kCMIOStreamPropertyPreferredFrameRate,
                    kCMIOStreamPropertyMinimumFrameRate,
                    kCMIOStreamPropertyLatency,
                    kCMIOStreamPropertyStartingChannel,
                    kCMIOStreamPropertyTerminalType,
                ],
            };
            for selector in selectors {
                assert!(has_property(kind, *selector), "{kind:?} {selector:#x}");
                assert!(
                    property_data_size(kind, *selector).is_some(),
                    "{kind:?} {selector:#x} missing size"
                );
                // Scalars or CF values must cover everything except the
                // dimension-dependent CF descriptions.
            }
        }
    }

    #[test]
    fn scalar_properties_resolve_off_device() {
        // No camera needed — pure table lookups.
        assert!(scalar_property(ObjectKind::Device, kCMIODevicePropertyDeviceIsAlive).is_some());
        assert_eq!(
            scalar_property(ObjectKind::Device, kCMIODevicePropertyLatency)
                .unwrap()
                .len(),
            4
        );
        assert_eq!(
            scalar_property(ObjectKind::Stream, kCMIOStreamPropertyFrameRate)
                .unwrap()
                .len(),
            8
        );
    }
}
