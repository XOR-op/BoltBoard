// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::ExitCode;

#[cfg(target_os = "macos")]
use cocoa::appkit::{NSWindow, NSWindowStyleMask};
use tauri::{Manager, Runtime, Window};

use crate::connection::*;

mod connection;

pub trait WindowExt {
    #[cfg(target_os = "macos")]
    fn set_transparent_titlebar(&self, transparent: bool);
}

impl<R: Runtime> WindowExt for Window<R> {
    #[cfg(target_os = "macos")]
    fn set_transparent_titlebar(&self, transparent: bool) {
        use cocoa::appkit::NSWindowTitleVisibility;

        unsafe {
            let id = self.ns_window().unwrap() as cocoa::base::id;

            let mut style_mask = id.styleMask();
            style_mask.set(
                NSWindowStyleMask::NSFullSizeContentViewWindowMask,
                transparent,
            );
            id.setStyleMask_(style_mask);

            id.setTitleVisibility_(if transparent {
                NSWindowTitleVisibility::NSWindowTitleHidden
            } else {
                NSWindowTitleVisibility::NSWindowTitleVisible
            });
            id.setTitlebarAppearsTransparent_(if transparent {
                cocoa::base::YES
            } else {
                cocoa::base::NO
            });
        }
    }
}

fn main() -> ExitCode {
    let rt = tokio::runtime::Runtime::new().unwrap();
    if let Err(e) = rt.block_on(run()) {
        eprintln!("Error is: {}", e);
        ExitCode::FAILURE
    } else {
        ExitCode::SUCCESS
    }
}

async fn run() -> anyhow::Result<()> {
    let state = ConnectionState::new("/var/run/boltconn.sock".into()).await?;
    println!("Connected to control socket");
    tauri::Builder::default()
        .setup(|app| {
            let win = app.get_window("main").unwrap();
            win.set_transparent_titlebar(true);

            Ok(())
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
            reload_config
        ])
        .run(tauri::generate_context!())?;
    Ok(())
}
