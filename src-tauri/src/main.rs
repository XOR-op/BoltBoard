// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use crate::connection::*;
use std::process::ExitCode;
mod connection;

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
    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            get_group_list,
            set_proxy_for,
            get_connections,
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
