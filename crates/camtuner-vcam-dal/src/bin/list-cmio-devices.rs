//! Lists CMIO devices exactly the way client apps (OBS, Zoom, Chrome) see
//! them: queries the system object for `kCMIOHardwarePropertyDevices` and
//! prints each device's name. Run from `crates/`:
//!
//! ```
//! cargo run -p camtuner-vcam-dal --bin list-cmio-devices
//! ```
//!
//! If "CamTuner Camera" is missing here, the DAL never loaded our bundle
//! (install / rescan problem). If it IS here but missing in one app, that
//! app caches or filters devices — restart it.

use camtuner_vcam_dal::ffi::{
    fourcc, CMIOObjectPropertyAddress, NO_ERROR,
};
use std::os::raw::c_void;

const SYSTEM_OBJECT: u32 = 1;
const DEVICES: u32 = fourcc(b"dev#");
const NAME: u32 = fourcc(b"lnam");
const SCOPE_GLOBAL: u32 = fourcc(b"glob");
const UTF8: u32 = 0x0800_0100;

extern "C" {
    fn CMIOObjectGetPropertyDataSize(
        objectID: u32,
        address: *const CMIOObjectPropertyAddress,
        qualifierDataSize: u32,
        qualifierData: *const c_void,
        dataSize: *mut u32,
    ) -> i32;
    fn CMIOObjectGetPropertyData(
        objectID: u32,
        address: *const CMIOObjectPropertyAddress,
        qualifierDataSize: u32,
        qualifierData: *const c_void,
        dataSize: *mut u32,
        data: *mut c_void,
    ) -> i32;
    fn CFStringGetCString(
        theString: *const c_void,
        buffer: *mut u8,
        bufferSize: isize,
        encoding: u32,
    ) -> u8;
    fn CFRelease(cf: *const c_void);
}

fn get_data(object_id: u32, selector: u32) -> Result<Vec<u8>, i32> {
    let addr = CMIOObjectPropertyAddress {
        mSelector: selector,
        mScope: SCOPE_GLOBAL,
        mElement: 0,
    };
    let mut size = 0u32;
    let status = unsafe {
        CMIOObjectGetPropertyDataSize(object_id, &addr, 0, std::ptr::null(), &mut size)
    };
    if status != NO_ERROR {
        return Err(status);
    }
    let mut buf = vec![0u8; size as usize];
    let mut written = size;
    let status = unsafe {
        CMIOObjectGetPropertyData(
            object_id,
            &addr,
            0,
            std::ptr::null(),
            &mut written,
            buf.as_mut_ptr() as *mut c_void,
        )
    };
    if status != NO_ERROR {
        return Err(status);
    }
    buf.truncate(written as usize);
    Ok(buf)
}

fn cfstring_to_string(ptr: *const c_void) -> String {
    if ptr.is_null() {
        return "<null>".to_string();
    }
    let mut buf = [0u8; 512];
    unsafe {
        CFStringGetCString(ptr, buf.as_mut_ptr(), buf.len() as isize, UTF8);
        CFRelease(ptr);
    }
    let len = buf.iter().position(|&b| b == 0).unwrap_or(buf.len());
    String::from_utf8_lossy(&buf[..len]).into_owned()
}

fn main() {
    let bytes = match get_data(SYSTEM_OBJECT, DEVICES) {
        Ok(b) => b,
        Err(status) => {
            eprintln!("failed to list devices: OSStatus {status}");
            std::process::exit(1);
        }
    };
    let count = bytes.len() / 4;
    println!("{count} CMIO device(s):");
    for i in 0..count {
        let id = u32::from_ne_bytes(bytes[i * 4..i * 4 + 4].try_into().unwrap());
        let name = get_data(id, NAME)
            .ok()
            .filter(|b| b.len() >= 8)
            .map(|b| {
                let ptr = usize::from_ne_bytes(b[..8].try_into().unwrap()) as *const c_void;
                cfstring_to_string(ptr)
            })
            .unwrap_or_else(|| "<unnamed>".to_string());
        println!("  id={id}  {name}");
    }
}
