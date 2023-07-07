// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::ExitCode;

use tauri::{Manager, RunEvent, SystemTray, SystemTrayEvent};
use tauri::{Window, WindowEvent, Wry};

use crate::connection::*;
use crate::trace::init_tracing;

mod connection;
mod native_tray;
mod trace;
mod window;

fn main() -> ExitCode {
    init_tracing();
    if let Err(e) = tauri::async_runtime::block_on(run()) {
        eprintln!("Error is: {}", e);
        ExitCode::FAILURE
    } else {
        ExitCode::SUCCESS
    }
}

#[allow(clippy::single_match)]
async fn run() -> anyhow::Result<()> {
    let state = ConnectionState::new("/var/run/boltconn.sock".into()).await?;
    println!("Connected to control socket");
    let expected_groups = state
        .client
        .get_all_proxies(tarpc::context::Context::current())
        .await?
        .len();

    tauri::Builder::default()
        .setup(|app| {
            app.set_activation_policy(tauri::ActivationPolicy::Accessory);
            Ok(())
        })
        .on_window_event(|event| {
            if event.window().label() == "menu" {
                match event.event() {
                    WindowEvent::Focused(false) => {
                        let _ = event.window().hide();
                    }
                    WindowEvent::CloseRequested { api, .. } => {
                        let _ = event.window().hide();
                        api.prevent_close();
                    }
                    _ => {}
                }
            }
        })
        .system_tray(SystemTray::new())
        .on_system_tray_event(move |app, event| match event {
            SystemTrayEvent::LeftClick { position, .. } => {
                let w = app
                    .get_window("menu")
                    .unwrap_or_else(|| window::create_menu(app, position, expected_groups));
                if let Ok(is_visible) = w.is_visible() {
                    if is_visible {
                        let _ = w.hide();
                    } else if w.show().is_ok() {
                        let _ = w.set_focus();
                    }
                }
            }

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
            reset_logs,
            quit,
            open_dashboard
        ])
        .build(tauri::generate_context!())?
        .run(|_app, event| match event {
            RunEvent::ExitRequested { api, .. } => api.prevent_exit(),
            _ => {}
        });
    Ok(())
}

#[tauri::command]
fn quit(window: Window<Wry>) {
    window.app_handle().exit(0);
}

#[tauri::command]
fn open_dashboard(window: Window<Wry>) {
    let app = window.app_handle();
    if let Some(w) = app.get_window("menu") {
        let _ = w.hide();
    }
    let w = app
        .get_window("dashboard")
        .unwrap_or_else(|| window::create_dashboard(&app));
    if w.is_visible().is_ok() {
        let _ = w.show();
        let _ = w.set_focus();
    }
}
