use tauri::{
    menu::{Menu, MenuItem, PredefinedMenuItem},
    AppHandle,
};

use crate::brand;

/// Builds the tray menu. Static here — swap in DB-driven items by rebuilding
/// this menu whenever your data changes (see commands that call rebuild_menu).
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

pub fn handle_menu_event(app: &AppHandle, id: &str) {
    match id {
        "open" => {
            crate::show_window(app);
        }
        "quit" => {
            app.exit(0);
        }
        _ => {}
    }
}
