use std::path::PathBuf;
use std::sync::Arc;

use boltapi::multiplex::rpc_multiplex_twoway;
use boltapi::rpc::{ClientStreamService, ControlServiceClient};
use boltapi::{
    ConnectionSchema, GetGroupRespSchema, GetInterceptDataResp, HttpInterceptSchema, TrafficResp,
    TunStatusSchema,
};
use serde::{Serialize, Serializer};
use tarpc::context::Context;
use tarpc::server::{BaseChannel, Channel};
use tarpc::tokio_serde::formats::Bincode;
use tarpc::tokio_util::codec::LengthDelimitedCodec;
use tauri::{AppHandle, Manager, Wry};
use tokio::net::UnixStream;
use tokio::sync::RwLock;

type ConnResult<T> = Result<T, SerializableError>;

#[derive(Clone)]
struct ClientStreamServer {
    traffic_sender: Arc<RwLock<Option<HandleContextInner>>>,
    logs_sender: Arc<RwLock<Option<HandleContextInner>>>,
}

struct HandleContextInner {
    handle: AppHandle<Wry>,
    ctx_id: u64,
}

impl HandleContextInner {
    pub fn new(handle: AppHandle<Wry>) -> Self {
        let id = fastrand::u64(1..u64::MAX);
        Self { handle, ctx_id: id }
    }
}

#[tarpc::server]
impl ClientStreamService for ClientStreamServer {
    async fn post_traffic(self, _: Context, traffic: TrafficResp) -> u64 {
        let guard = self.traffic_sender.read().await;
        if let Some(inner) = &*guard {
            let _ = inner.handle.emit_all("traffic", traffic);
            inner.ctx_id
        } else {
            0
        }
    }

    async fn post_log(self, _: Context, log: String) -> u64 {
        let guard = self.logs_sender.read().await;
        if let Some(inner) = &*guard {
            let _ = inner.handle.emit_all("logs", log);
            inner.ctx_id
        } else {
            0
        }
    }
}

pub struct ConnectionState {
    pub client: ControlServiceClient,
    traffic_sender: Arc<RwLock<Option<HandleContextInner>>>,
    logs_sender: Arc<RwLock<Option<HandleContextInner>>>,
}

impl ConnectionState {
    pub async fn new(bind_addr: PathBuf) -> ConnResult<Self> {
        let conn = UnixStream::connect(bind_addr).await?;
        let transport = tarpc::serde_transport::new(
            LengthDelimitedCodec::builder().new_framed(conn),
            Bincode::default(),
        );
        let (server_t, client_t, in_task, out_task) = rpc_multiplex_twoway(transport);

        tauri::async_runtime::spawn(in_task);
        tauri::async_runtime::spawn(out_task);
        let client = ControlServiceClient::new(Default::default(), client_t).spawn();
        let traffic = Arc::new(RwLock::new(None));
        let logs = Arc::new(RwLock::new(None));
        let t2 = traffic.clone();
        let l2 = logs.clone();
        tauri::async_runtime::spawn(
            BaseChannel::with_defaults(server_t).execute(
                ClientStreamServer {
                    traffic_sender: traffic,
                    logs_sender: logs,
                }
                .serve(),
            ),
        );

        Ok(Self {
            client,
            traffic_sender: t2,
            logs_sender: l2,
        })
    }
}

#[tauri::command]
pub async fn get_all_proxies(
    state: tauri::State<'_, ConnectionState>,
) -> ConnResult<Vec<GetGroupRespSchema>> {
    let resp = state.client.get_all_proxies(Context::current()).await?;
    Ok(resp)
}

#[tauri::command]
pub async fn set_proxy_for(
    state: tauri::State<'_, ConnectionState>,
    group: String,
    proxy: String,
) -> ConnResult<bool> {
    Ok(state
        .client
        .set_proxy_for(Context::current(), group, proxy)
        .await?)
}

#[tauri::command]
pub async fn get_all_connections(
    state: tauri::State<'_, ConnectionState>,
) -> ConnResult<Vec<ConnectionSchema>> {
    Ok(state.client.get_all_conns(Context::current()).await?)
}

#[tauri::command]
pub async fn stop_all_connections(state: tauri::State<'_, ConnectionState>) -> ConnResult<bool> {
    state.client.stop_all_conns(Context::current()).await?;
    Ok(true)
}

#[tauri::command]
pub async fn stop_connection(
    state: tauri::State<'_, ConnectionState>,
    id: u32,
) -> ConnResult<bool> {
    let r = state.client.stop_conn(Context::current(), id).await?;
    Ok(r)
}

#[tauri::command]
pub async fn update_group_latency(
    state: tauri::State<'_, ConnectionState>,
    group: String,
) -> ConnResult<bool> {
    Ok(state
        .client
        .update_group_latency(Context::current(), group)
        .await?)
}

#[tauri::command]
pub async fn get_tun(state: tauri::State<'_, ConnectionState>) -> ConnResult<TunStatusSchema> {
    Ok(state.client.get_tun(Context::current()).await?)
}

#[tauri::command]
pub async fn set_tun(state: tauri::State<'_, ConnectionState>, enabled: bool) -> ConnResult<bool> {
    Ok(state
        .client
        .set_tun(Context::current(), TunStatusSchema { enabled })
        .await?)
}

#[tauri::command]
pub async fn get_all_interceptions(
    state: tauri::State<'_, ConnectionState>,
) -> ConnResult<Vec<HttpInterceptSchema>> {
    Ok(state
        .client
        .get_all_interceptions(Context::current())
        .await?)
}

#[tauri::command]
pub async fn get_range_interceptions(
    state: tauri::State<'_, ConnectionState>,
    start: u32,
    end: Option<u32>,
) -> ConnResult<Vec<HttpInterceptSchema>> {
    Ok(state
        .client
        .get_range_interceptions(Context::current(), start, end)
        .await?)
}

#[tauri::command]
pub async fn get_intercept_payload(
    state: tauri::State<'_, ConnectionState>,
    id: u32,
) -> ConnResult<GetInterceptDataResp> {
    Ok(state
        .client
        .get_intercepted_payload(Context::current(), id)
        .await?
        .ok_or(anyhow::anyhow!("No response"))?)
}

#[tauri::command]
pub async fn reload_config(state: tauri::State<'_, ConnectionState>) -> ConnResult<()> {
    Ok(state.client.reload(Context::current()).await?)
}

#[tauri::command]
pub async fn enable_traffic_streaming(
    app_handle: AppHandle<Wry>,
    state: tauri::State<'_, ConnectionState>,
) -> ConnResult<()> {
    let handle = HandleContextInner::new(app_handle);
    let _ = state
        .client
        .request_traffic_stream(Context::current(), handle.ctx_id)
        .await;
    *state.traffic_sender.write().await = Some(handle);
    Ok(())
}

#[tauri::command]
pub async fn enable_logs_streaming(
    app_handle: AppHandle<Wry>,
    state: tauri::State<'_, ConnectionState>,
) -> ConnResult<()> {
    let handle = HandleContextInner::new(app_handle);
    let _ = state
        .client
        .request_log_stream(Context::current(), handle.ctx_id)
        .await;
    *state.logs_sender.write().await = Some(handle);
    Ok(())
}

#[tauri::command]
pub async fn reset_traffic(state: tauri::State<'_, ConnectionState>) -> ConnResult<()> {
    *state.traffic_sender.write().await = None;
    Ok(())
}

#[tauri::command]
pub async fn reset_logs(state: tauri::State<'_, ConnectionState>) -> ConnResult<()> {
    *state.logs_sender.write().await = None;
    Ok(())
}

#[derive(Debug, thiserror::Error)]
pub enum SerializableError {
    #[error(transparent)]
    Io(#[from] std::io::Error),
    #[error(transparent)]
    Rpc(#[from] tarpc::client::RpcError),
    #[error(transparent)]
    Anyhow(#[from] anyhow::Error),
}

impl Serialize for SerializableError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        match self {
            SerializableError::Io(err) => serializer.serialize_str(err.to_string().as_str()),
            SerializableError::Rpc(err) => serializer.serialize_str(err.to_string().as_str()),
            SerializableError::Anyhow(err) => serializer.serialize_str(err.to_string().as_str()),
        }
    }
}
