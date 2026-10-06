//! Factory smoke test — loads the built cdylib exactly like the DAL does
//! (dlopen → dlsym the factory → call it with the interface UUID) and
//! exercises the IUnknown surface. Run after `cargo build -p camtuner-vcam-dal`:
//! `cargo test -p camtuner-vcam-dal --test factory_smoke -- --ignored --nocapture`

#![allow(non_upper_case_globals)]

use std::ffi::CString;
use std::os::raw::c_void;

use camtuner_vcam_dal::ffi::{
    CMIOHardwarePlugInInterface, CMIOHardwarePlugInRef, PLUGIN_INTERFACE_UUID,
};

extern "C" {
    fn dlopen(path: *const libc::c_char, mode: libc::c_int) -> *mut c_void;
    fn dlsym(handle: *mut c_void, symbol: *const libc::c_char) -> *mut c_void;
    fn CFUUIDCreateWithBytes(
        alloc: *const c_void,
        b0: u8,
        b1: u8,
        b2: u8,
        b3: u8,
        b4: u8,
        b5: u8,
        b6: u8,
        b7: u8,
        b8: u8,
        b9: u8,
        b10: u8,
        b11: u8,
        b12: u8,
        b13: u8,
        b14: u8,
        b15: u8,
    ) -> *mut c_void;
}

const RTLD_NOW: libc::c_int = 2;

type FactoryFn =
    unsafe extern "C" fn(allocator: *const c_void, uuid: *mut c_void) -> CMIOHardwarePlugInRef;

#[test]
#[ignore = "loads the built cdylib; run after cargo build"]
fn factory_loads_and_speaks_iunknown() {
    // The dylib must be built first; locate it relative to the workspace.
    let dylib = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../target/debug/libcamtuner_vcam_dal.dylib");
    assert!(
        dylib.exists(),
        "build the cdylib first: {}",
        dylib.display()
    );

    unsafe {
        let handle = dlopen(
            CString::new(dylib.to_str().unwrap()).unwrap().as_ptr(),
            RTLD_NOW,
        );
        assert!(!handle.is_null(), "dlopen failed");

        let symbol = CString::new("CMIOHardwarePluginFactory").unwrap();
        let factory = dlsym(handle, symbol.as_ptr());
        assert!(!factory.is_null(), "factory symbol not exported");
        let factory: FactoryFn = std::mem::transmute(factory);

        // Right UUID → interface.
        let uuid = CFUUIDCreateWithBytes(
            std::ptr::null(),
            PLUGIN_INTERFACE_UUID.0[0],
            PLUGIN_INTERFACE_UUID.0[1],
            PLUGIN_INTERFACE_UUID.0[2],
            PLUGIN_INTERFACE_UUID.0[3],
            PLUGIN_INTERFACE_UUID.0[4],
            PLUGIN_INTERFACE_UUID.0[5],
            PLUGIN_INTERFACE_UUID.0[6],
            PLUGIN_INTERFACE_UUID.0[7],
            PLUGIN_INTERFACE_UUID.0[8],
            PLUGIN_INTERFACE_UUID.0[9],
            PLUGIN_INTERFACE_UUID.0[10],
            PLUGIN_INTERFACE_UUID.0[11],
            PLUGIN_INTERFACE_UUID.0[12],
            PLUGIN_INTERFACE_UUID.0[13],
            PLUGIN_INTERFACE_UUID.0[14],
            PLUGIN_INTERFACE_UUID.0[15],
        );
        assert!(!uuid.is_null(), "CFUUIDCreateWithBytes failed");
        let plug_in = factory(std::ptr::null(), uuid);
        assert!(!plug_in.is_null(), "factory returned null for our UUID");

        // Wrong UUID → null.
        let other = CFUUIDCreateWithBytes(
            std::ptr::null(),
            0u8,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
        );
        assert!(factory(std::ptr::null(), other).is_null());

        // IUnknown: vtable dereference is `ref → *mut Interface → Interface`.
        // Fresh process state: refcount starts at zero.
        let vtable: *const CMIOHardwarePlugInInterface = *plug_in;
        let add_ref = (*vtable).AddRef;
        let release = (*vtable).Release;
        let query_interface = (*vtable).QueryInterface;

        assert_eq!(add_ref(plug_in as *mut c_void), 1);
        let mut queried: *mut c_void = std::ptr::null_mut();
        let status = query_interface(plug_in as *mut c_void, PLUGIN_INTERFACE_UUID, &mut queried);
        assert_eq!(status, 0);
        assert_eq!(queried, plug_in as *mut c_void);
        // QueryInterface retained: 1 → 2 → back down.
        assert_eq!(release(plug_in as *mut c_void), 2);
        assert_eq!(release(plug_in as *mut c_void), 1);
    }
}
