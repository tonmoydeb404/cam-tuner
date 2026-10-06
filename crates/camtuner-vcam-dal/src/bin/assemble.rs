//! Assembles (and optionally installs) `CamTunerCamera.plugin` from the
//! built cdylib. The bundle recipe mirrors the SDK's CMIO plug-in contract:
//! `CFPlugInFactories` maps the interface UUID to the exported factory
//! symbol, `CFPlugInTypes` registers it as a DAL plug-in.
//!
//! Usage (run from `crates/`):
//! - `cargo run -p camtuner-vcam-dal --bin assemble-plugin`            → build bundle (debug)
//! - `cargo run -p camtuner-vcam-dal --bin assemble-plugin -- --release` → build bundle (release)
//! - `... -- --install`   → additionally copy into /Library/CoreMediaIO/Plug-Ins/DAL (admin prompt)
//! - `... -- --uninstall` → remove from /Library/CoreMediaIO/Plug-Ins/DAL (admin prompt)
//! - `... -- --status`    → print installed version info

use std::path::{Path, PathBuf};
use std::process::Command;

const BUNDLE_NAME: &str = "CamTunerCamera.plugin";
const FACTORY_UUID: &str = "B89DFABA-93BF-11D8-8EA6-000A95AF9C6A";
const TYPE_UUID: &str = "30010C1C-93BF-11D8-8B5B-000A95AF9C6A";
const INSTALL_DIR: &str = "/Library/CoreMediaIO/Plug-Ins/DAL";

fn main() {
    let args: Vec<String> = std::env::args().skip(1).collect();
    let release = args.iter().any(|a| a == "--release");

    let bundle = assemble(release);
    println!("bundle ready: {}", bundle.display());

    if args.iter().any(|a| a == "--status") {
        status(&bundle);
        return;
    }
    if args.iter().any(|a| a == "--uninstall") {
        uninstall();
        return;
    }
    if args.iter().any(|a| a == "--install") {
        install(&bundle);
    }
}

fn workspace_target(release: bool) -> PathBuf {
    let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    manifest_dir
        .join("../target")
        .join(if release { "release" } else { "debug" })
}

fn cdylib_path(release: bool) -> PathBuf {
    workspace_target(release).join("libcamtuner_vcam_dal.dylib")
}

fn assemble(release: bool) -> PathBuf {
    let src = cdylib_path(release);
    assert!(
        src.exists(),
        "missing cdylib at {} — run `cargo build -p camtuner-vcam-dal` first",
        src.display()
    );

    let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    let bundle = manifest_dir.join("build").join(BUNDLE_NAME);
    let macos_dir = bundle.join("Contents/MacOS");
    std::fs::create_dir_all(&macos_dir).expect("create bundle dirs");
    std::fs::copy(&src, macos_dir.join("CamTunerCamera")).expect("copy cdylib into bundle");

    let plist = format!(
        r#"<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>English</string>
    <key>CFBundleExecutable</key>
    <string>CamTunerCamera</string>
    <key>CFBundleIdentifier</key>
    <string>app.camtuner.vcam.dal</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>CamTunerCamera</string>
    <key>CFBundlePackageType</key>
    <string>BNDL</string>
    <key>CFBundleShortVersionString</key>
    <string>{version}</string>
    <key>CFBundleVersion</key>
    <string>{version}</string>
    <key>CFPlugInFactories</key>
    <dict>
      <key>{factory}</key>
      <string>CMIOHardwarePluginFactory</string>
    </dict>
    <key>CFPlugInTypes</key>
    <dict>
      <key>{type_id}</key>
      <array>
        <string>{factory}</string>
      </array>
    </dict>
  </dict>
</plist>
"#,
        version = env!("CARGO_PKG_VERSION"),
        factory = FACTORY_UUID,
        type_id = TYPE_UUID,
    );
    std::fs::write(bundle.join("Contents/Info.plist"), plist).expect("write Info.plist");
    bundle
}

fn installed_path() -> PathBuf {
    Path::new(INSTALL_DIR).join(BUNDLE_NAME)
}

fn status(bundle: &Path) {
    match std::fs::read_to_string(installed_path().join("Contents/Info.plist")) {
        Ok(installed_plist) => {
            println!("installed: {}", installed_path().display());
            let local =
                std::fs::read_to_string(bundle.join("Contents/Info.plist")).unwrap_or_default();
            if installed_plist.trim() == local.trim() {
                println!("version: up to date");
            } else {
                println!("version: differs from local build — reinstall to update");
            }
        }
        Err(_) => println!("installed: no"),
    }
}

fn install(bundle: &Path) {
    let target = installed_path();
    let script = format!(
        "do shell script \"mkdir -p '{dir}' && rm -rf '{target}' && cp -R '{src}' '{target}'\" with administrator privileges",
        dir = INSTALL_DIR,
        target = target.display(),
        src = bundle.display(),
    );
    let status = Command::new("osascript").arg("-e").arg(&script).status();
    match status {
        Ok(code) if code.success() => {
            println!(
                "installed at {}.\nRestart any app that should see the camera \
                 (clients enumerate devices at launch).",
                target.display()
            );
        }
        _ => {
            eprintln!("install failed or was cancelled");
            std::process::exit(1);
        }
    }
}

fn uninstall() {
    let target = installed_path();
    let script = format!(
        "do shell script \"rm -rf '{target}'\" with administrator privileges",
        target = target.display(),
    );
    let status = Command::new("osascript").arg("-e").arg(&script).status();
    if matches!(status, Ok(code) if code.success()) {
        println!("uninstalled. Restart camera-using apps to forget the device.");
    } else {
        eprintln!("uninstall failed or was cancelled");
        std::process::exit(1);
    }
}
