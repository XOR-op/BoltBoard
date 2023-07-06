// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::future::Future;
use std::process::ExitCode;
use std::str::FromStr;

use boltapi::{GetGroupRespSchema, ProxyData, TunStatusSchema};
use tauri::{AppHandle, SystemTraySubmenu, Wry};
#[cfg(target_os = "macos")]
use tauri::{
    CustomMenuItem, Manager, RunEvent, SystemTray, SystemTrayEvent, SystemTrayMenu,
    SystemTrayMenuItem,
};

use crate::connection::*;
use crate::trace::init_tracing;

mod connection;
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
const SPLITTER: &str = "#!@";

fn proxy_entry_display(d: &ProxyData) -> String {
    match &d.latency {
        None => "◽",
        Some(s) => {
            if let Ok(ms) = u32::from_str(s.split(" ms").collect::<Vec<&str>>().first().unwrap()) {
                if ms < 200 {
                    "🔹"
                } else if ms < 400 {
                    "🔸"
                } else {
                    "🔺"
                }
            } else {
                "✖️"
            }
        }
    }
    .to_string()
        + d.name.as_str()
}

async fn flush_state(state: &ConnectionState) -> SystemTrayMenu {
    let mut menu = SystemTrayMenu::new();

    if let Ok(groups) = state
        .client
        .get_all_proxies(tarpc::context::Context::current())
        .await
    {
        let groups: Vec<GetGroupRespSchema> = groups;
        for entry in &groups {
            let mut submenu = SystemTrayMenu::new();
            for d in entry.list.iter() {
                let mut item = CustomMenuItem::new(
                    "_proxy".to_string()
                        + SPLITTER
                        + entry.name.as_str()
                        + SPLITTER
                        + d.name.as_str(),
                    proxy_entry_display(d),
                );
                if d.name == entry.selected {
                    item.selected = true;
                }
                submenu = submenu.add_item(item)
            }
            menu = menu.add_submenu(SystemTraySubmenu::new(
                format!("[{}] / {}", entry.name, entry.selected),
                submenu,
            ))
        }
    }
    menu = menu
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new(
            "system_proxy".to_string(),
            "System Proxy",
        ));
    if let Ok(status) = state
        .client
        .get_tun(tarpc::context::Context::current())
        .await
    {
        let mut item = CustomMenuItem::new("tun".to_string(), "Tun Mode");
        item.selected = status.enabled;
        menu = menu.add_item(item);
        state.update_tun_state(status.enabled);
    }
    menu.add_native_item(SystemTrayMenuItem::Separator)
        .add_item(
            CustomMenuItem::new("dashboard".to_string(), "Dashboard").accelerator("CmdOrControl+D"),
        )
        .add_item(CustomMenuItem::new("flush".to_string(), "Flush").accelerator("CmdOrControl+F"))
        .add_item(CustomMenuItem::new("quit".to_string(), "Quit").accelerator("CmdOrControl+Q"))
}

fn block_task<F: Future>(f: F) -> F::Output {
    tokio::task::block_in_place(|| tauri::async_runtime::block_on(f))
}

fn update_menu(app: &AppHandle<Wry>) {
    let app_copy = app.clone();
    block_task(async move {
        let state = app_copy.state::<ConnectionState>().inner();
        let menu = flush_state(state).await;
        if let Err(err) = app_copy.tray_handle().set_menu(menu) {
            eprintln!("Failed to set menu: {}", err)
        }
    })
}

#[allow(clippy::single_match)]
async fn run() -> anyhow::Result<()> {
    let state = ConnectionState::new("/var/run/boltconn.sock".into()).await?;
    println!("Connected to control socket");

    let tray_menu = flush_state(&state).await;
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
                "tun" => {
                    let app_copy = app.clone();
                    block_task(async move {
                        let state = app_copy.state::<ConnectionState>().inner();
                        let next_state = !state.get_tun_state();
                        if let Err(err) = state
                            .client
                            .set_tun(
                                tarpc::context::Context::current(),
                                TunStatusSchema {
                                    enabled: next_state,
                                },
                            )
                            .await
                        {
                            eprintln!("Failed to set proxy")
                        }
                    });
                    update_menu(app)
                }
                "flush" => update_menu(app),
                s => {
                    let splitted: Vec<String> = s.split(SPLITTER).map(|s| s.to_string()).collect();
                    if splitted.len() == 3 {
                        match splitted.get(0).unwrap().as_str() {
                            "_proxy" => {
                                let app_copy = app.clone();
                                block_task(async move {
                                    let state = app_copy.state::<ConnectionState>().inner();
                                    if let Err(err) = state
                                        .client
                                        .set_proxy_for(
                                            tarpc::context::Context::current(),
                                            splitted.get(1).unwrap().to_string(),
                                            splitted.get(2).unwrap().to_string(),
                                        )
                                        .await
                                    {
                                        eprintln!("Failed to set proxy")
                                    }
                                });
                                update_menu(app)
                            }
                            invalid => {
                                tracing::warn!("Suspious event: {}", invalid);
                            }
                        }
                    }
                }
            },
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
