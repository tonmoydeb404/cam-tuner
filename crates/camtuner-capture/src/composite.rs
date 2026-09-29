//! Combines the platform hardware backend with the synthetic test-pattern
//! source, so the app always has a working "camera" and hardware devices
//! appear alongside it in the picker.

use crate::avfoundation::AvFoundationBackend;
use crate::synthetic::{SyntheticBackend, SYNTHETIC_DEVICE_ID};
use crate::{CaptureBackend, CaptureError, DeviceInfo, FrameStream, StreamSettings};

/// Hardware cameras first, then the synthetic test pattern.
#[derive(Debug, Default)]
pub struct CompositeBackend {
    hardware: AvFoundationBackend,
    synthetic: SyntheticBackend,
}

impl CompositeBackend {
    pub fn new() -> Self {
        Self::default()
    }
}

impl CaptureBackend for CompositeBackend {
    fn list_devices(&self) -> Vec<DeviceInfo> {
        let mut devices = self.hardware.list_devices();
        devices.extend(self.synthetic.list_devices());
        devices
    }

    fn open(
        &mut self,
        device_id: Option<&str>,
        settings: StreamSettings,
    ) -> Result<FrameStream, CaptureError> {
        match device_id {
            // No preference: default to the first hardware camera, falling
            // back to the test pattern on machines without one.
            None => self.hardware.open(None, settings).or_else(|err| match err {
                CaptureError::NoDevices => self.synthetic.open(None, settings),
                other => Err(other),
            }),
            Some(id) if id == SYNTHETIC_DEVICE_ID => self.synthetic.open(Some(id), settings),
            Some(id) => {
                let is_hardware = self.hardware.list_devices().iter().any(|d| d.id == id);
                if is_hardware {
                    self.hardware.open(Some(id), settings)
                } else {
                    Err(CaptureError::UnknownDevice { id: id.to_string() })
                }
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn lists_hardware_then_synthetic() {
        let devices = CompositeBackend::new().list_devices();
        assert!(
            devices
                .iter()
                .any(|d| d.is_virtual && d.id == SYNTHETIC_DEVICE_ID),
            "synthetic device must always be listed"
        );
        // Hardware presence depends on the machine; ordering matters when
        // both exist.
        let virtual_pos = devices.iter().position(|d| d.is_virtual);
        let hardware_pos = devices.iter().position(|d| !d.is_virtual);
        if let (Some(hw), Some(virt)) = (hardware_pos, virtual_pos) {
            assert!(hw < virt, "hardware cameras come first");
        }
    }

    #[test]
    fn unknown_device_is_rejected() {
        let mut backend = CompositeBackend::new();
        let err = backend
            .open(Some("nope"), StreamSettings::default())
            .unwrap_err();
        assert!(matches!(err, CaptureError::UnknownDevice { .. }));
    }
}
