//! Raw FFI surface for the CMIO DAL plug-in ABI.
//!
//! Everything here mirrors `CoreMediaIO/CMIOHardwarePlugIn.h`,
//! `CMIOHardwareDevice.h`, `CMIOHardwareStream.h`, and `CMIOHardwareObject.h`
//! from the macOS SDK — property selectors are the SDK's exact FourCCs.
//! The DAL plug-in API is a plain C function-pointer table (COM-style), so
//! no Objective-C runtime is involved.

#![allow(non_snake_case, dead_code, non_upper_case_globals)]
#![allow(clippy::upper_case_acronyms, clippy::too_many_arguments)]

use std::os::raw::c_void;

// ---- Primitive typedefs (CFPlugInCOM.h / MacTypes.h) ----

pub type OSStatus = i32;
pub type HRESULT = i32;
pub type ULONG = u32;
/// Mac `Boolean` is unsigned char.
pub type Boolean = u8;
pub type CMIOObjectID = u32;
pub type CMIOClassID = u32;
pub type UInt32 = u32;

/// CFUUIDBytes is a 16-byte struct of sequential bytes; REFIID is passed by
/// value.
#[repr(C)]
#[derive(Clone, Copy, PartialEq, Eq)]
pub struct CFUUIDBytes(pub [u8; 16]);

/// `kCMIOHardwarePlugInInterfaceID` (B89DFABA-93BF-11D8-8EA6-000A95AF9C6A).
pub const PLUGIN_INTERFACE_UUID: CFUUIDBytes = CFUUIDBytes([
    0xB8, 0x9D, 0xFA, 0xBA, 0x93, 0xBF, 0x11, 0xD8, 0x8E, 0xA6, 0x00, 0x0A, 0x95, 0xAF, 0x9C, 0x6A,
]);

pub const E_NOINTERFACE: HRESULT = 0x8000_4002u32 as i32;
pub const NO_ERROR: OSStatus = 0;

// ---- FourCC helpers ----

pub const fn fourcc(s: &[u8; 4]) -> u32 {
    u32::from_be_bytes(*s)
}

// ---- Class IDs (CMIOHardwareObject.h) ----

pub const kCMIOPlugInClassID: CMIOClassID = fourcc(b"aplg");
pub const kCMIODeviceClassID: CMIOClassID = fourcc(b"adev");
pub const kCMIOStreamClassID: CMIOClassID = fourcc(b"astr");

// ---- Scopes / elements ----

pub const kCMIOObjectPropertyScopeGlobal: u32 = fourcc(b"glob");
pub const kCMIOObjectPropertyElementMaster: u32 = 0;

// ---- Object properties (CMIOHardwareObject.h) ----

pub const kCMIOObjectPropertyClass: u32 = fourcc(b"clas");
pub const kCMIOObjectPropertyName: u32 = fourcc(b"lnam");
pub const kCMIOObjectPropertyManufacturer: u32 = fourcc(b"lmak");
pub const kCMIOObjectPropertyOwner: u32 = fourcc(b"stdv");
pub const kCMIOObjectPropertyOwnedObjects: u32 = fourcc(b"ownd");

// ---- Plug-in properties ----

pub const kCMIOPlugInPropertyBundleID: u32 = fourcc(b"piid");

// ---- Device properties (CMIOHardwareDevice.h) ----

pub const kCMIODevicePropertyDeviceUID: u32 = fourcc(b"uid ");
pub const kCMIODevicePropertyModelUID: u32 = fourcc(b"muid");
pub const kCMIODevicePropertyTransportType: u32 = fourcc(b"tran");
pub const kCMIODevicePropertyDeviceIsAlive: u32 = fourcc(b"livn");
pub const kCMIODevicePropertyDeviceIsRunning: u32 = fourcc(b"goin");
pub const kCMIODevicePropertyDeviceIsRunningSomewhere: u32 = fourcc(b"gone");
pub const kCMIODevicePropertyDeviceHasChanged: u32 = fourcc(b"diff");
pub const kCMIODevicePropertyDeviceCanBeDefaultDevice: u32 = fourcc(b"dflt");
pub const kCMIODevicePropertyStreamConfiguration: u32 = fourcc(b"slay");
pub const kCMIODevicePropertyStreams: u32 = fourcc(b"stm#");
pub const kCMIODevicePropertyPlugIn: u32 = fourcc(b"plug");
pub const kCMIODevicePropertyHogMode: u32 = fourcc(b"oink");
pub const kCMIODevicePropertySuspendedByUser: u32 = fourcc(b"sbyu");
pub const kCMIODevicePropertyLatency: u32 = fourcc(b"ltnc");
pub const kCMIODevicePropertyStreams_FourCC: u32 = kCMIODevicePropertyStreams;

/// IOAudioDeviceTransportType virtual ('virt').
pub const kIOAudioDeviceTransportTypeVirtual: u32 = fourcc(b"virt");

// ---- Stream properties (CMIOHardwareStream.h) ----

pub const kCMIOStreamPropertyDirection: u32 = fourcc(b"sdir");
pub const kCMIOStreamPropertyOutputBufferQueueSize: u32 = fourcc(b"pmoq");
pub const kCMIOStreamPropertyFormatDescription: u32 = fourcc(b"pft ");
pub const kCMIOStreamPropertyFormatDescriptions: u32 = fourcc(b"pfta");
pub const kCMIOStreamPropertyPreferredFormatDescription: u32 = fourcc(b"prfd");
pub const kCMIOStreamPropertyFrameRate: u32 = fourcc(b"nfrt");
pub const kCMIOStreamPropertyFrameRates: u32 = fourcc(b"nfr#");
pub const kCMIOStreamPropertyFrameRateRanges: u32 = fourcc(b"frrg");
pub const kCMIOStreamPropertyPreferredFrameRate: u32 = fourcc(b"prfr");
pub const kCMIOStreamPropertyMinimumFrameRate: u32 = fourcc(b"mfrt");
pub const kCMIOStreamPropertyLatency: u32 = fourcc(b"ltnc");
pub const kCMIOStreamPropertyStartingChannel: u32 = fourcc(b"schn");
pub const kCMIOStreamPropertyTerminalType: u32 = fourcc(b"term");

/// `'2vuy'` — UYVY packed 4:2:2, kCMVideoCodecType_422YpCbCr8.
pub const kCMVideoCodecType_422YpCbCr8: u32 = fourcc(b"2vuy");

// ---- Error codes ----

pub const kCMIOHardwareNoError: OSStatus = 0;
pub const kCMIOHardwareUnspecifiedError: OSStatus = fourcc(b"what") as i32;
pub const kCMIOHardwareUnsupportedOperationError: OSStatus = fourcc(b"unop") as i32;
pub const kCMIOHardwareBadObjectError: OSStatus = fourcc(b"!obj") as i32;
pub const kCMIOHardwareBadStreamError: OSStatus = fourcc(b"!str") as i32;
pub const kCMIOHardwareBadDeviceError: OSStatus = fourcc(b"!dev") as i32;
pub const kCMIOHardwareUnknownPropertyError: OSStatus = fourcc(b"who?") as i32;
pub const kCMIOHardwareBadPropertySizeError: OSStatus = fourcc(b"!siz") as i32;
pub const kCMIOHardwareNotRunningError: OSStatus = fourcc(b"stop") as i32;

/// `CMIOObjectPropertyAddress` (CMIOHardwareObject.h).
#[repr(C)]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct CMIOObjectPropertyAddress {
    pub mSelector: u32,
    pub mScope: u32,
    pub mElement: u32,
}

/// The DAL plug-in interface, verbatim struct layout from the SDK header.
/// Field order is load-bearing; the trailing function pointers are matched
/// against `CMIOHardwarePlugInInterface` member-for-member.
#[repr(C)]
pub struct CMIOHardwarePlugInInterface {
    pub _reserved: *mut c_void,

    pub QueryInterface: unsafe extern "C" fn(
        self_: *mut c_void,
        uuid: CFUUIDBytes,
        interface: *mut *mut c_void,
    ) -> HRESULT,
    pub AddRef: unsafe extern "C" fn(self_: *mut c_void) -> ULONG,
    pub Release: unsafe extern "C" fn(self_: *mut c_void) -> ULONG,

    pub Initialize: unsafe extern "C" fn(self_: CMIOHardwarePlugInRef) -> OSStatus,
    pub InitializeWithObjectID:
        unsafe extern "C" fn(self_: CMIOHardwarePlugInRef, objectID: CMIOObjectID) -> OSStatus,
    pub Teardown: unsafe extern "C" fn(self_: CMIOHardwarePlugInRef) -> OSStatus,

    pub ObjectShow: unsafe extern "C" fn(self_: CMIOHardwarePlugInRef, objectID: CMIOObjectID),

    pub ObjectHasProperty: unsafe extern "C" fn(
        self_: CMIOHardwarePlugInRef,
        objectID: CMIOObjectID,
        address: *const CMIOObjectPropertyAddress,
    ) -> Boolean,

    pub ObjectIsPropertySettable: unsafe extern "C" fn(
        self_: CMIOHardwarePlugInRef,
        objectID: CMIOObjectID,
        address: *const CMIOObjectPropertyAddress,
        isSettable: *mut Boolean,
    ) -> OSStatus,

    pub ObjectGetPropertyDataSize: unsafe extern "C" fn(
        self_: CMIOHardwarePlugInRef,
        objectID: CMIOObjectID,
        address: *const CMIOObjectPropertyAddress,
        qualifierDataSize: u32,
        qualifierData: *const c_void,
        dataSize: *mut u32,
    ) -> OSStatus,

    pub ObjectGetPropertyData: unsafe extern "C" fn(
        self_: CMIOHardwarePlugInRef,
        objectID: CMIOObjectID,
        address: *const CMIOObjectPropertyAddress,
        qualifierDataSize: u32,
        qualifierData: *const c_void,
        dataSize: *mut u32,
        data: *mut c_void,
    ) -> OSStatus,

    pub ObjectSetPropertyData: unsafe extern "C" fn(
        self_: CMIOHardwarePlugInRef,
        objectID: CMIOObjectID,
        address: *const CMIOObjectPropertyAddress,
        qualifierDataSize: u32,
        qualifierData: *const c_void,
        dataSize: u32,
        data: *const c_void,
    ) -> OSStatus,

    pub DeviceSuspend:
        unsafe extern "C" fn(self_: CMIOHardwarePlugInRef, device: CMIOObjectID) -> OSStatus,
    pub DeviceResume:
        unsafe extern "C" fn(self_: CMIOHardwarePlugInRef, device: CMIOObjectID) -> OSStatus,
    pub DeviceStartStream: unsafe extern "C" fn(
        self_: CMIOHardwarePlugInRef,
        device: CMIOObjectID,
        stream: CMIOObjectID,
    ) -> OSStatus,
    pub DeviceStopStream: unsafe extern "C" fn(
        self_: CMIOHardwarePlugInRef,
        device: CMIOObjectID,
        stream: CMIOObjectID,
    ) -> OSStatus,
    pub DeviceProcessAVCCommand: unsafe extern "C" fn(
        self_: CMIOHardwarePlugInRef,
        device: CMIOObjectID,
        ioAVCCommand: *mut c_void,
    ) -> OSStatus,
    pub DeviceProcessRS422Command: unsafe extern "C" fn(
        self_: CMIOHardwarePlugInRef,
        device: CMIOObjectID,
        ioRS422Command: *mut c_void,
    ) -> OSStatus,

    /// `CMIODeviceStreamQueueAlteredProc`: called with (refCon, queue) when
    /// frames are enqueued so the DAL knows new buffers exist.
    pub StreamCopyBufferQueue: unsafe extern "C" fn(
        self_: CMIOHardwarePlugInRef,
        stream: CMIOObjectID,
        queueAlteredProc: Option<
            unsafe extern "C" fn(queueAlteredRefCon: *mut c_void, queue: *mut c_void),
        >,
        queueAlteredRefCon: *mut c_void,
        queue: *mut *mut c_void,
    ) -> OSStatus,

    pub StreamDeckPlay:
        unsafe extern "C" fn(self_: CMIOHardwarePlugInRef, stream: CMIOObjectID) -> OSStatus,
    pub StreamDeckStop:
        unsafe extern "C" fn(self_: CMIOHardwarePlugInRef, stream: CMIOObjectID) -> OSStatus,
    pub StreamDeckJog: unsafe extern "C" fn(
        self_: CMIOHardwarePlugInRef,
        stream: CMIOObjectID,
        speed: i32,
    ) -> OSStatus,
    pub StreamDeckCueTo: unsafe extern "C" fn(
        self_: CMIOHardwarePlugInRef,
        stream: CMIOObjectID,
        frameNumber: f64,
        playOnCue: Boolean,
    ) -> OSStatus,
}

// SAFETY: the vtable is all function pointers plus a null reserved field —
// it is process-global immutable data by construction.
unsafe impl Send for CMIOHardwarePlugInInterface {}
unsafe impl Sync for CMIOHardwarePlugInInterface {}

pub type CMIOHardwarePlugInRef = *mut *mut CMIOHardwarePlugInInterface;

// ---- DAL helper functions the plug-in calls back into ----

extern "C" {
    #[link_name = "CMIOObjectCreate"]
    pub fn CMIOObjectCreate(
        owningPlugIn: CMIOHardwarePlugInRef,
        owningObjectID: CMIOObjectID,
        classID: CMIOClassID,
        objectID: *mut CMIOObjectID,
    ) -> OSStatus;

    #[link_name = "CMIOObjectsPublishedAndDied"]
    pub fn CMIOObjectsPublishedAndDied(
        owningPlugIn: CMIOHardwarePlugInRef,
        owningObjectID: CMIOObjectID,
        numberPublished: u32,
        published: *const CMIOObjectID,
        numberDead: u32,
        dead: *const CMIOObjectID,
    ) -> OSStatus;

    #[link_name = "CMIOObjectPropertiesChanged"]
    pub fn CMIOObjectPropertiesChanged(
        owningPlugIn: CMIOHardwarePlugInRef,
        objectID: CMIOObjectID,
        numberAddresses: u32,
        addresses: *const CMIOObjectPropertyAddress,
    ) -> OSStatus;
}

// ---- CoreFoundation / CoreMedia / CoreVideo helpers ----

pub const kCFAllocatorDefault: *const c_void = std::ptr::null();
pub const kCFStringEncodingUTF8: u32 = 0x0800_0100;

#[repr(C)]
#[derive(Debug, Clone, Copy)]
pub struct CMTime {
    pub value: i64,
    pub timescale: i32,
    pub flags: u32,
    pub epoch: i64,
}

#[repr(C)]
#[derive(Debug, Clone, Copy)]
pub struct CMSampleTimingInfo {
    pub duration: CMTime,
    pub presentationTimeStamp: CMTime,
    pub decodeTimeStamp: CMTime,
}

extern "C" {
    pub fn CFStringCreateWithCString(
        alloc: *const c_void,
        cStr: *const libc::c_char,
        encoding: u32,
    ) -> *mut c_void;

    pub fn CFArrayCreate(
        allocator: *const c_void,
        values: *const *const c_void,
        numValues: isize,
        callBacks: *const c_void,
    ) -> *mut c_void;

    pub fn CFRelease(cf: *const c_void);

    pub fn CMSimpleQueueCreate(
        allocator: *const c_void,
        capacity: i32,
        queue: *mut *mut c_void,
    ) -> OSStatus;

    /// The queue retains the element.
    pub fn CMSimpleQueueEnqueue(queue: *mut c_void, element: *const c_void) -> OSStatus;

    pub fn CMVideoFormatDescriptionCreate(
        allocator: *const c_void,
        codecType: u32,
        width: i32,
        height: i32,
        extensions: *const c_void,
        outDesc: *mut *mut c_void,
    ) -> OSStatus;

    pub fn CMSampleBufferCreateForImageBuffer(
        allocator: *const c_void,
        imageBuffer: *mut c_void,
        dataReady: Boolean,
        makeDataReadyCallback: *const c_void,
        makeDataReadyRefcon: *const c_void,
        formatDescription: *mut c_void,
        sampleTiming: *const CMSampleTimingInfo,
        sampleBufferOut: *mut *mut c_void,
    ) -> OSStatus;

    pub fn CVPixelBufferCreate(
        allocator: *const c_void,
        width: usize,
        height: usize,
        pixelFormatType: u32,
        pixelBufferAttributes: *const c_void,
        pixelBufferOut: *mut *mut c_void,
    ) -> i32;

    pub fn CVPixelBufferLockBaseAddress(pixelBuffer: *mut c_void, flags: u32) -> i32;
    pub fn CVPixelBufferUnlockBaseAddress(pixelBuffer: *mut c_void, flags: u32) -> i32;
    pub fn CVPixelBufferGetBaseAddress(pixelBuffer: *mut c_void) -> *mut c_void;
    pub fn CVPixelBufferGetBytesPerRow(pixelBuffer: *mut c_void) -> usize;
}
