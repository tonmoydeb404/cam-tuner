//! camtuner-vcam-dal — CamTuner's virtual camera as a CMIO DAL plug-in.
//!
//! Builds as a cdylib packaged into `CamTunerCamera.plugin` (see
//! `src/bin/assemble.rs`). The DAL loads the bundle into every client
//! process that opens the camera; the factory + vtable in [`factory`]
//! implement the CMIOHardwarePlugInInterface, and [`pump`] pulls UYVY
//! frames from the CamTuner app over the [`camtuner_vcam`] socket
//! protocol.

// SDK constants keep their C names (kCMIO…) for 1:1 header traceability.
#![allow(non_upper_case_globals)]

pub mod factory;
pub mod ffi;
pub mod plugin;
pub mod pump;
