use tauri::{
    menu::{Menu, MenuItem, PredefinedMenuItem},
    AppHandle, Manager,
};

use crate::brand;
use crate::commands;
use crate::state::AppState;

/// Builds the tray menu. The virtual-camera item is rebuilt on demand so its
/// label always reflects whether the sink is streaming.
pub fn rebuild_menu(app: &AppHandle) {
    let menu = match Menu::new(app) {
        Ok(m) => m,
        Err(_) => return,
    };

    if let Ok(item) = MenuItem::with_id(
        app,
        "open",
        format!("Open {}", brand::APP_NAME),
        true,
        None::<&str>,
    ) {
        let _ = menu.append(&item);
    }

    let vcam_label = if is_vcam_streaming(app) {
        "Virtual Camera: On"
    } else {
        "Virtual Camera: Off"
    };
    if let Ok(item) = MenuItem::with_id(app, "vcam-toggle", vcam_label, true, None::<&str>) {
        let _ = menu.append(&item);
    }

    if let Ok(sep) = PredefinedMenuItem::separator(app) {
        let _ = menu.append(&sep);
    }

    if let Ok(item) = MenuItem::with_id(
        app,
        "quit",
        format!("Quit {}", brand::APP_NAME),
        true,
        None::<&str>,
    ) {
        let _ = menu.append(&item);
    }

    if let Some(tray) = app.tray_by_id("main_tray") {
        let _ = tray.set_menu(Some(menu));
    }
}

fn is_vcam_streaming(app: &AppHandle) -> bool {
    app.state::<AppState>()
        .vcam
        .read()
        .map(|v| v.is_some())
        .unwrap_or(false)
}

pub fn handle_menu_event(app: &AppHandle, id: &str) {
    match id {
        "open" => {
            crate::show_window(app);
        }
        "vcam-toggle" => {
            // The toggle needs an async context; spawn it and refresh the
            // menu label when it settles.
            let app = app.clone();
            tauri::async_runtime::spawn(async move {
                let _ = commands::vcam_toggle(app.clone()).await;
                crate::tray::rebuild_menu(&app);
            });
        }
        "quit" => {
            app.exit(0);
        }
        _ => {}
    }
}
