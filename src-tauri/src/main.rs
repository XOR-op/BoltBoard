// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::ExitCode;
use std::sync::atomic::Ordering;
use std::time::Duration;

use tauri::{AppHandle, Manager, RunEvent, SystemTray, SystemTrayEvent};
use tauri::{Window, WindowEvent, Wry};
use tokio::time::timeout;

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
    let state = ConnectionState::new().await?;
    println!("Connected to control socket");

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
                let state = app.state::<ConnectionState>();
                let group_query = tokio::task::block_in_place(|| {
                    tauri::async_runtime::block_on(timeout(
                        Duration::from_millis(1000),
                        get_all_proxies(state.clone()),
                    ))
                });
                let expected_groups = if let Ok(Ok(groups)) = group_query {
                    if state.reloaded.load(Ordering::Relaxed) {
                        // Create new menu window
                        let _ = app.get_window("menu").map(|w| w.close());
                    }
                    groups.len()
                } else {
                    let _ = app.get_window("menu").map(|w| w.close());
                    let _ = tokio::task::block_in_place(|| {
                        tauri::async_runtime::block_on(timeout(
                            Duration::from_millis(1000),
                            reconnect_background(state.clone()),
                        ))
                    });
                    if let Ok(Ok(x)) = tokio::task::block_in_place(|| {
                        tauri::async_runtime::block_on(timeout(
                            Duration::from_millis(1000),
                            get_all_proxies(state.clone()),
                        ))
                    }) {
                        x.len()
                    } else {
                        0
                    }
                };
                state.reloaded.store(false, Ordering::Relaxed);
                let w = app
                    .get_window("menu")
                    .unwrap_or_else(|| window::create_menu(app, position, expected_groups));
                if let Ok(is_visible) = w.is_visible() {
                    if is_visible {
                        let _ = w.hide();
                    } else {
                        let mut posi = position;
                        posi.y -= 30.0;
                        let _ = w.set_position(posi);
                        if w.show().is_ok() {
                            let _ = w.set_focus();
                        }
                    }
                }
            }
            SystemTrayEvent::RightClick { .. } => open_dashboard_inner(app),

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
            enable_connection_streaming,
            reset_traffic,
            reset_logs,
            reset_connections,
            reconnect_background,
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
    open_dashboard_inner(&app);
}

fn open_dashboard_inner(app: &AppHandle) {
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
