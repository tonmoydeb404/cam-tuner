//! The CFPlugIn entry point: the exported factory and the
//! `CMIOHardwarePlugInInterface` vtable.
//!
//! Every vtable function is a panic boundary — the plugin runs inside
//! client processes (Zoom, OBS, …), so unwinding across the FFI would
//! crash the *host app*. All bodies are wrapped in `catch_unwind`.

use std::os::raw::c_void;
use std::panic::{catch_unwind, AssertUnwindSafe};
use std::sync::atomic::Ordering;

use crate::ffi::*;
use crate::plugin::{self, state, StreamQueue};
use crate::pump::{FramePump, DEFAULT_SOCKET_PATH};

/// The singleton vtable; `CMIOHardwarePlugInRef` is a pointer to a pointer
/// to this.
static VTABLE: CMIOHardwarePlugInInterface = CMIOHardwarePlugInInterface {
    _reserved: std::ptr::null_mut(),
    QueryInterface: query_interface,
    AddRef: add_ref,
    Release: release,
    Initialize: initialize,
    InitializeWithObjectID: initialize_with_object_id,
    Teardown: teardown,
    ObjectShow: object_show,
    ObjectHasProperty: object_has_property,
    ObjectIsPropertySettable: object_is_property_settable,
    ObjectGetPropertyDataSize: object_get_property_data_size,
    ObjectGetPropertyData: object_get_property_data,
    ObjectSetPropertyData: object_set_property_data,
    DeviceSuspend: device_suspend,
    DeviceResume: device_resume,
    DeviceStartStream: device_start_stream,
    DeviceStopStream: device_stop_stream,
    DeviceProcessAVCCommand: device_process_avc_command,
    DeviceProcessRS422Command: device_process_rs422_command,
    StreamCopyBufferQueue: stream_copy_buffer_queue,
    StreamDeckPlay: stream_deck_play,
    StreamDeckStop: stream_deck_stop,
    StreamDeckJog: stream_deck_jog,
    StreamDeckCueTo: stream_deck_cue_to,
};

static VTABLE_PTR: &CMIOHardwarePlugInInterface = &VTABLE;

/// `CMIOHardwarePlugInRef` — pointer to the cell holding the vtable pointer.
#[repr(transparent)]
struct VtableRef(CMIOHardwarePlugInRef);
// SAFETY: points at the immutable VTABLE_PTR cell.
unsafe impl Send for VtableRef {}
unsafe impl Sync for VtableRef {}
static VTABLE_REF: VtableRef = VtableRef(
    &VTABLE_PTR as *const &CMIOHardwarePlugInInterface as *const CMIOHardwarePlugInRef
        as CMIOHardwarePlugInRef,
);

/// The CFPlugIn factory the bundle's `Info.plist` names. Returns the
/// plug-in interface when asked for the CMIO interface UUID, else NULL.
///
/// # Safety
/// Called by the DAL with a valid CFAllocator + CFUUID.
#[no_mangle]
pub unsafe extern "C" fn CMIOHardwarePluginFactory(
    _allocator: *const c_void,
    uuid: *const c_void,
) -> CMIOHardwarePlugInRef {
    let result = catch_unwind(|| {
        if uuid.is_null() {
            return std::ptr::null_mut();
        }
        // CFUUIDGetUUIDBytes(uuid)
        unsafe fn uuid_bytes(uuid: *const c_void) -> CFUUIDBytes {
            extern "C" {
                fn CFUUIDGetUUIDBytes(uuid: *const c_void) -> CFUUIDBytes;
            }
            CFUUIDGetUUIDBytes(uuid)
        }
        if uuid_bytes(uuid) == PLUGIN_INTERFACE_UUID {
            VTABLE_REF.0
        } else {
            std::ptr::null_mut()
        }
    });
    result.unwrap_or(std::ptr::null_mut())
}

// ---- IUnknown ----

unsafe extern "C" fn query_interface(
    self_: *mut c_void,
    uuid: CFUUIDBytes,
    interface: *mut *mut c_void,
) -> HRESULT {
    catch_unwind(AssertUnwindSafe(|| {
        if uuid == PLUGIN_INTERFACE_UUID {
            *interface = self_;
            add_ref(std::ptr::null_mut());
            0
        } else {
            E_NOINTERFACE
        }
    }))
    .unwrap_or(E_NOINTERFACE)
}

unsafe extern "C" fn add_ref(_self: *mut c_void) -> ULONG {
    catch_unwind(AssertUnwindSafe(|| {
        state().refs.fetch_add(1, Ordering::Relaxed) + 1
    }))
    .unwrap_or(1)
}

unsafe extern "C" fn release(_self: *mut c_void) -> ULONG {
    catch_unwind(AssertUnwindSafe(|| {
        let s = state();
        let prev = s.refs.load(Ordering::Relaxed);
        if prev > 0 {
            s.refs.store(prev - 1, Ordering::Relaxed);
        }
        prev
    }))
    .unwrap_or(1)
}

// ---- Lifecycle ----

unsafe extern "C" fn initialize(self_: CMIOHardwarePlugInRef) -> OSStatus {
    initialize_with_object_id(self_, 1)
}

unsafe extern "C" fn initialize_with_object_id(
    self_: CMIOHardwarePlugInRef,
    object_id: CMIOObjectID,
) -> OSStatus {
    catch_unwind(AssertUnwindSafe(|| {
        let s = state();
        s.plugin_object_id.store(object_id, Ordering::Relaxed);

        let mut device_id: CMIOObjectID = 0;
        if CMIOObjectCreate(self_, object_id, kCMIODeviceClassID, &mut device_id) != 0 {
            return kCMIOHardwareUnspecifiedError;
        }
        let mut stream_id: CMIOObjectID = 0;
        if CMIOObjectCreate(self_, device_id, kCMIOStreamClassID, &mut stream_id) != 0 {
            return kCMIOHardwareUnspecifiedError;
        }

        s.device_object_id.store(device_id, Ordering::Relaxed);
        s.stream_object_id.store(stream_id, Ordering::Relaxed);
        s.initialized.store(true, Ordering::Relaxed);

        CMIOObjectsPublishedAndDied(self_, object_id, 1, &device_id, 0, std::ptr::null());
        CMIOObjectsPublishedAndDied(self_, device_id, 1, &stream_id, 0, std::ptr::null());
        NO_ERROR
    }))
    .unwrap_or(kCMIOHardwareUnspecifiedError)
}

unsafe extern "C" fn teardown(self_: CMIOHardwarePlugInRef) -> OSStatus {
    catch_unwind(AssertUnwindSafe(|| {
        let s = state();
        stop_pump();

        let device = s.device_object_id.load(Ordering::Relaxed);
        let stream = s.stream_object_id.load(Ordering::Relaxed);
        let plugin_id = s.plugin_object_id.load(Ordering::Relaxed);
        if stream != 0 {
            CMIOObjectsPublishedAndDied(self_, device, 0, std::ptr::null(), 1, &stream);
        }
        if device != 0 {
            CMIOObjectsPublishedAndDied(self_, plugin_id, 0, std::ptr::null(), 1, &device);
        }
        s.initialized.store(false, Ordering::Relaxed);
        NO_ERROR
    }))
    .unwrap_or(kCMIOHardwareUnspecifiedError)
}

// ---- Object property model ----

unsafe extern "C" fn object_show(_self: CMIOHardwarePlugInRef, _object_id: CMIOObjectID) {}

unsafe extern "C" fn object_has_property(
    _self: CMIOHardwarePlugInRef,
    object_id: CMIOObjectID,
    address: *const CMIOObjectPropertyAddress,
) -> Boolean {
    catch_unwind(AssertUnwindSafe(|| {
        let Some(kind) = plugin::object_kind(object_id) else {
            return 0;
        };
        let addr = unsafe { *address };
        (plugin::has_property(kind, addr.mSelector)) as Boolean
    }))
    .unwrap_or(0)
}

unsafe extern "C" fn object_is_property_settable(
    _self: CMIOHardwarePlugInRef,
    object_id: CMIOObjectID,
    address: *const CMIOObjectPropertyAddress,
    is_settable: *mut Boolean,
) -> OSStatus {
    catch_unwind(AssertUnwindSafe(|| {
        let Some(kind) = plugin::object_kind(object_id) else {
            return kCMIOHardwareBadObjectError;
        };
        let addr = unsafe { *address };
        if !plugin::has_property(kind, addr.mSelector) {
            return kCMIOHardwareUnknownPropertyError;
        }
        if !is_settable.is_null() {
            *is_settable = 0; // nothing is settable in v1
        }
        NO_ERROR
    }))
    .unwrap_or(kCMIOHardwareUnspecifiedError)
}

unsafe extern "C" fn object_get_property_data_size(
    _self: CMIOHardwarePlugInRef,
    object_id: CMIOObjectID,
    address: *const CMIOObjectPropertyAddress,
    _qualifier_data_size: u32,
    _qualifier_data: *const c_void,
    data_size: *mut u32,
) -> OSStatus {
    catch_unwind(AssertUnwindSafe(|| {
        let Some(kind) = plugin::object_kind(object_id) else {
            return kCMIOHardwareBadObjectError;
        };
        let addr = unsafe { *address };
        match plugin::property_data_size(kind, addr.mSelector) {
            Some(size) => {
                if !data_size.is_null() {
                    *data_size = size as u32;
                }
                NO_ERROR
            }
            None => kCMIOHardwareUnknownPropertyError,
        }
    }))
    .unwrap_or(kCMIOHardwareUnspecifiedError)
}

unsafe extern "C" fn object_get_property_data(
    _self: CMIOHardwarePlugInRef,
    object_id: CMIOObjectID,
    address: *const CMIOObjectPropertyAddress,
    _qualifier_data_size: u32,
    _qualifier_data: *const c_void,
    data_size: *mut u32,
    data: *mut c_void,
) -> OSStatus {
    catch_unwind(AssertUnwindSafe(|| {
        let Some(kind) = plugin::object_kind(object_id) else {
            return kCMIOHardwareBadObjectError;
        };
        let addr = unsafe { *address };
        let Some(needed) = plugin::property_data_size(kind, addr.mSelector) else {
            return kCMIOHardwareUnknownPropertyError;
        };
        let capacity = if data_size.is_null() {
            0
        } else {
            *data_size as usize
        };
        if needed > capacity || data.is_null() {
            if !data_size.is_null() {
                *data_size = needed as u32;
            }
            return kCMIOHardwareBadPropertySizeError;
        }

        if let Some(bytes) = plugin::scalar_property(kind, addr.mSelector) {
            std::ptr::copy_nonoverlapping(bytes.as_ptr(), data as *mut u8, bytes.len());
            if !data_size.is_null() {
                *data_size = bytes.len() as u32;
            }
            return NO_ERROR;
        }

        if let Some(cf_type) = plugin::cftypes_property(kind, addr.mSelector) {
            std::ptr::copy_nonoverlapping(
                &cf_type as *const *mut c_void as *const u8,
                data as *mut u8,
                std::mem::size_of::<*mut c_void>(),
            );
            if !data_size.is_null() {
                *data_size = std::mem::size_of::<*mut c_void>() as u32;
            }
            return NO_ERROR;
        }

        kCMIOHardwareUnknownPropertyError
    }))
    .unwrap_or(kCMIOHardwareUnspecifiedError)
}

unsafe extern "C" fn object_set_property_data(
    _self: CMIOHardwarePlugInRef,
    object_id: CMIOObjectID,
    address: *const CMIOObjectPropertyAddress,
    _qualifier_data_size: u32,
    _qualifier_data: *const c_void,
    _data_size: u32,
    _data: *const c_void,
) -> OSStatus {
    catch_unwind(AssertUnwindSafe(|| {
        let Some(kind) = plugin::object_kind(object_id) else {
            return kCMIOHardwareBadObjectError;
        };
        let addr = unsafe { *address };
        if !plugin::has_property(kind, addr.mSelector) {
            return kCMIOHardwareUnknownPropertyError;
        }
        kCMIOHardwareUnsupportedOperationError
    }))
    .unwrap_or(kCMIOHardwareUnspecifiedError)
}

// ---- Device control ----

unsafe extern "C" fn device_suspend(
    _self: CMIOHardwarePlugInRef,
    _device: CMIOObjectID,
) -> OSStatus {
    NO_ERROR
}

unsafe extern "C" fn device_resume(
    _self: CMIOHardwarePlugInRef,
    _device: CMIOObjectID,
) -> OSStatus {
    NO_ERROR
}

/// Socket path resolution: the app publishes the dev path via env var when
/// appropriate; the release path is the brand default.
fn socket_path() -> std::path::PathBuf {
    if let Ok(path) = std::env::var("CAMTUNER_VCAM_SOCKET") {
        if !path.is_empty() {
            return std::path::PathBuf::from(path);
        }
    }
    std::path::PathBuf::from(DEFAULT_SOCKET_PATH)
}

unsafe extern "C" fn device_start_stream(
    _self: CMIOHardwarePlugInRef,
    device: CMIOObjectID,
    stream: CMIOObjectID,
) -> OSStatus {
    catch_unwind(AssertUnwindSafe(|| {
        let s = state();
        if device != s.device_object_id.load(Ordering::Relaxed)
            || stream != s.stream_object_id.load(Ordering::Relaxed)
        {
            return kCMIOHardwareBadDeviceError;
        }
        // Replace any previous pump.
        stop_pump();
        match FramePump::start(socket_path()) {
            Ok(pump) => {
                if let Ok(mut slot) = s.pump.lock() {
                    *slot = Some(pump);
                }
                s.pump_running.store(true, Ordering::Relaxed);
                notify_running_changed();
                NO_ERROR
            }
            Err(_) => kCMIOHardwareUnspecifiedError,
        }
    }))
    .unwrap_or(kCMIOHardwareUnspecifiedError)
}

unsafe extern "C" fn device_stop_stream(
    _self: CMIOHardwarePlugInRef,
    _device: CMIOObjectID,
    _stream: CMIOObjectID,
) -> OSStatus {
    catch_unwind(AssertUnwindSafe(|| {
        stop_pump();
        NO_ERROR
    }))
    .unwrap_or(kCMIOHardwareUnspecifiedError)
}

fn stop_pump() {
    let s = state();
    if let Ok(mut slot) = s.pump.lock() {
        if let Some(mut pump) = slot.take() {
            pump.stop();
        }
    }
    s.pump_running.store(false, Ordering::Relaxed);
    notify_running_changed();
}

fn notify_running_changed() {
    let s = state();
    let device = s.device_object_id.load(Ordering::Relaxed);
    let plugin_ref = VTABLE_REF.0;
    if device != 0 {
        let addr = CMIOObjectPropertyAddress {
            mSelector: kCMIODevicePropertyDeviceIsRunning,
            mScope: kCMIOObjectPropertyScopeGlobal,
            mElement: kCMIOObjectPropertyElementMaster,
        };
        unsafe {
            CMIOObjectPropertiesChanged(plugin_ref, device, 1, &addr);
        }
    }
}

unsafe extern "C" fn device_process_avc_command(
    _self: CMIOHardwarePlugInRef,
    _device: CMIOObjectID,
    _command: *mut c_void,
) -> OSStatus {
    kCMIOHardwareUnsupportedOperationError
}

unsafe extern "C" fn device_process_rs422_command(
    _self: CMIOHardwarePlugInRef,
    _device: CMIOObjectID,
    _command: *mut c_void,
) -> OSStatus {
    kCMIOHardwareUnsupportedOperationError
}

// ---- Stream ----

unsafe extern "C" fn stream_copy_buffer_queue(
    _self: CMIOHardwarePlugInRef,
    stream: CMIOObjectID,
    queue_altered_proc: Option<unsafe extern "C" fn(*mut c_void, *mut c_void)>,
    queue_altered_refcon: *mut c_void,
    queue: *mut *mut c_void,
) -> OSStatus {
    catch_unwind(AssertUnwindSafe(|| {
        let s = state();
        if stream != s.stream_object_id.load(Ordering::Relaxed) {
            return kCMIOHardwareBadStreamError;
        }
        let mut new_queue: *mut c_void = std::ptr::null_mut();
        if CMSimpleQueueCreate(kCFAllocatorDefault, 4, &mut new_queue) != 0 {
            return kCMIOHardwareUnspecifiedError;
        }
        // Replace any previous queue (client re-opened the camera).
        let replaced = {
            let mut guard = s.queue.lock().expect("stream queue poisoned");
            guard.replace(StreamQueue {
                queue: new_queue,
                altered_proc: queue_altered_proc,
                altered_refcon: queue_altered_refcon,
            })
        };
        if let Some(old) = replaced {
            if !old.queue.is_null() {
                CFRelease(old.queue);
            }
        }
        if !queue.is_null() {
            *queue = new_queue;
        }
        NO_ERROR
    }))
    .unwrap_or(kCMIOHardwareUnspecifiedError)
}

unsafe extern "C" fn stream_deck_play(
    _self: CMIOHardwarePlugInRef,
    _stream: CMIOObjectID,
) -> OSStatus {
    kCMIOHardwareUnsupportedOperationError
}

unsafe extern "C" fn stream_deck_stop(
    _self: CMIOHardwarePlugInRef,
    _stream: CMIOObjectID,
) -> OSStatus {
    kCMIOHardwareUnsupportedOperationError
}

unsafe extern "C" fn stream_deck_jog(
    _self: CMIOHardwarePlugInRef,
    _stream: CMIOObjectID,
    _speed: i32,
) -> OSStatus {
    kCMIOHardwareUnsupportedOperationError
}

unsafe extern "C" fn stream_deck_cue_to(
    _self: CMIOHardwarePlugInRef,
    _stream: CMIOObjectID,
    _frame_number: f64,
    _play_on_cue: Boolean,
) -> OSStatus {
    kCMIOHardwareUnsupportedOperationError
}

// Keep the unused-kind warning quiet; ObjectKind is re-exported for tests.
#[allow(unused_imports)]
use crate::plugin::ObjectKind as _ObjectKindUsed;
