// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::ExitCode;

#[cfg(target_os = "macos")]
use tauri::{
    CustomMenuItem, Manager, RunEvent, SystemTray, SystemTrayEvent, SystemTrayMenu,
    SystemTrayMenuItem,
};

use crate::connection::*;
use crate::tracing::init_tracing;

mod connection;
mod tracing;
mod window;

fn main() -> ExitCode {
    init_tracing();
    let rt = tokio::runtime::Runtime::new().unwrap();
    if let Err(e) = rt.block_on(run()) {
        eprintln!("Error is: {}", e);
        ExitCode::FAILURE
    } else {
        ExitCode::SUCCESS
    }
}

fn create_menu() -> SystemTrayMenu {
    SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("dashboard".to_string(), "Dashboard"))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("quit".to_string(), "Quit"))
}

#[allow(clippy::single_match)]
async fn run() -> anyhow::Result<()> {
    let state = ConnectionState::new("/var/run/boltconn.sock".into()).await?;
    println!("Connected to control socket");
    let tray_menu = create_menu();
    tauri::Builder::default()
        .system_tray(SystemTray::new().with_menu(tray_menu))
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "dashboard" => {
                    let w = app
                        .get_window("dashboard")
                        .unwrap_or_else(|| window::create_dashboard(app));
                    if w.show().is_ok() {
                        let _ = w.set_focus();
                    }
                }
                "quit" => app.exit(0),
                _ => {}
            },
            SystemTrayEvent::LeftClick { .. } => {}
            SystemTrayEvent::RightClick { .. } => {}
            SystemTrayEvent::DoubleClick { .. } => {}
            _ => {}
        })
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            get_all_proxies,
            set_proxy_for,
            update_group_latency,
            get_all_connections,
            stop_all_connections,
            stop_connection,
            get_tun,
            set_tun,
            get_all_interceptions,
            get_range_interceptions,
            get_intercept_payload,
            reload_config,
            enable_traffic_streaming,
            enable_logs_streaming,
            reset_traffic,
            reset_logs
        ])
        .build(tauri::generate_context!())?
        .run(|_app, event| match event {
            RunEvent::ExitRequested { api, .. } => api.prevent_exit(),
            _ => {}
        });
    Ok(())
}
