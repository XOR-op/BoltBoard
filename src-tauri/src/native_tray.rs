#![allow(dead_code)]
use crate::connection::ConnectionState;
use crate::window;
use boltapi::{GetGroupRespSchema, ProxyData, TunStatusSchema};
use std::future::Future;
use std::str::FromStr;
use tauri::{
    AppHandle, CustomMenuItem, Manager, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
    SystemTraySubmenu, Wry,
};

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

fn on_system_tray_event(app: &AppHandle<Wry>, event: SystemTrayEvent) {
    match event {
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
                        .load()
                        .set_tun(
                            tarpc::context::Context::current(),
                            TunStatusSchema {
                                enabled: next_state,
                            },
                        )
                        .await
                    {
                        eprintln!("Failed to set proxy: {}", err)
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
                                    .load()
                                    .set_proxy_for(
                                        tarpc::context::Context::current(),
                                        splitted.get(1).unwrap().to_string(),
                                        splitted.get(2).unwrap().to_string(),
                                    )
                                    .await
                                {
                                    eprintln!("Failed to set proxy: {}", err)
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
        _ => {
            // ignore
        }
    }
}

pub async fn flush_state(state: &ConnectionState) -> SystemTrayMenu {
    let mut menu = SystemTrayMenu::new();

    if let Ok(groups) = state
        .client
        .load()
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
        .load()
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
