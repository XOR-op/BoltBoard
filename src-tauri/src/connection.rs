use arc_swap::ArcSwap;
use std::path::PathBuf;
use std::sync::atomic::{AtomicBool, Ordering};
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
use tarpc::tokio_util::codec::LengthDelimitedCodec;
use tauri::{AppHandle, Manager, Wry};
use tokio::net::UnixStream;
use tokio::sync::RwLock;
use tokio_serde::formats::Cbor;

type ConnResult<T> = Result<T, SerializableError>;

static CONTROL_PATH: &str = "/var/run/boltconn.sock";

#[derive(Clone)]
struct ClientStreamServer {
    traffic_sender: Arc<RwLock<Option<HandleContextInner>>>,
    logs_sender: Arc<RwLock<Option<HandleContextInner>>>,
    conn_sender: Arc<RwLock<Option<HandleContextInner>>>,
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

    async fn post_connections(self, _: Context, connections: Vec<ConnectionSchema>) -> u64 {
        let guard = self.conn_sender.read().await;
        if let Some(inner) = &*guard {
            let _ = inner.handle.emit_all("connection", connections);
            inner.ctx_id
        } else {
            0
        }
    }
}

pub struct ConnectionState {
    pub client: ArcSwap<ControlServiceClient>,
    tun_status: AtomicBool,
    system_proxy_status: AtomicBool,
    pub reloaded: AtomicBool,
    traffic_sender: ArcSwap<RwLock<Option<HandleContextInner>>>,
    logs_sender: ArcSwap<RwLock<Option<HandleContextInner>>>,
    connection_sender: ArcSwap<RwLock<Option<HandleContextInner>>>,
}

impl ConnectionState {
    pub async fn new() -> ConnResult<Self> {
        let (client, t2, l2, c2) = Self::connect(CONTROL_PATH.into()).await?;
        Ok(Self {
            client: ArcSwap::new(Arc::new(client)),
            tun_status: Default::default(),
            system_proxy_status: Default::default(),
            reloaded: Default::default(),
            traffic_sender: ArcSwap::new(t2),
            logs_sender: ArcSwap::new(l2),
            connection_sender: ArcSwap::new(c2),
        })
    }

    pub fn update_tun_state(&self, state: bool) {
        self.tun_status.store(state, Ordering::Relaxed)
    }

    #[allow(dead_code)]
    pub fn update_system_proxy_state(&self, state: bool) {
        self.system_proxy_status.store(state, Ordering::Relaxed)
    }

    pub fn get_tun_state(&self) -> bool {
        self.tun_status.load(Ordering::Relaxed)
    }

    #[allow(dead_code)]
    pub fn get_system_proxy_state(&self) -> bool {
        self.system_proxy_status.load(Ordering::Relaxed)
    }

    pub async fn reconnect(&self) -> ConnResult<()> {
        let (client, t2, l2, c2) = Self::connect(CONTROL_PATH.into()).await?;
        self.client.store(Arc::new(client));
        self.traffic_sender.store(t2);
        self.logs_sender.store(l2);
        self.connection_sender.store(c2);
        Ok(())
    }

    async fn connect(
        bind_addr: PathBuf,
    ) -> ConnResult<(
        ControlServiceClient,
        Arc<RwLock<Option<HandleContextInner>>>,
        Arc<RwLock<Option<HandleContextInner>>>,
        Arc<RwLock<Option<HandleContextInner>>>,
    )> {
        let conn = UnixStream::connect(bind_addr).await?;
        let transport = tarpc::serde_transport::new(
            LengthDelimitedCodec::builder()
                .max_frame_length(boltapi::rpc::MAX_CODEC_FRAME_LENGTH)
                .new_framed(conn),
            Cbor::default(),
        );
        let (server_t, client_t, in_task, out_task) = rpc_multiplex_twoway(transport);

        tauri::async_runtime::spawn(in_task);
        tauri::async_runtime::spawn(out_task);
        let client = ControlServiceClient::new(Default::default(), client_t).spawn();
        let traffic = Arc::new(RwLock::new(None));
        let logs = Arc::new(RwLock::new(None));
        let conn = Arc::new(RwLock::new(None));
        let t2 = traffic.clone();
        let l2 = logs.clone();
        let c2 = conn.clone();
        tauri::async_runtime::spawn(
            BaseChannel::with_defaults(server_t).execute(
                ClientStreamServer {
                    traffic_sender: traffic,
                    logs_sender: logs,
                    conn_sender: conn,
                }
                .serve(),
            ),
        );
        Ok((client, t2, l2, c2))
    }
}

#[tauri::command]
pub async fn get_all_proxies(
    state: tauri::State<'_, ConnectionState>,
) -> ConnResult<Vec<GetGroupRespSchema>> {
    let resp = state
        .client
        .load()
        .get_all_proxies(Context::current())
        .await?;
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
        .load()
        .set_proxy_for(Context::current(), group, proxy)
        .await?)
}

#[tauri::command]
pub async fn get_all_connections(
    state: tauri::State<'_, ConnectionState>,
) -> ConnResult<Vec<ConnectionSchema>> {
    Ok(state
        .client
        .load()
        .get_all_conns(Context::current())
        .await?)
}

#[tauri::command]
pub async fn stop_all_connections(state: tauri::State<'_, ConnectionState>) -> ConnResult<bool> {
    state
        .client
        .load()
        .stop_all_conns(Context::current())
        .await?;
    Ok(true)
}

#[tauri::command]
pub async fn stop_connection(
    state: tauri::State<'_, ConnectionState>,
    id: u32,
) -> ConnResult<bool> {
    let r = state
        .client
        .load()
        .stop_conn(Context::current(), id)
        .await?;
    Ok(r)
}

#[tauri::command]
pub async fn update_group_latency(
    state: tauri::State<'_, ConnectionState>,
    group: String,
) -> ConnResult<bool> {
    Ok(state
        .client
        .load()
        .update_group_latency(Context::current(), group)
        .await?)
}

#[tauri::command]
pub async fn get_tun(state: tauri::State<'_, ConnectionState>) -> ConnResult<TunStatusSchema> {
    Ok(state.client.load().get_tun(Context::current()).await?)
}

#[tauri::command]
pub async fn set_tun(state: tauri::State<'_, ConnectionState>, enabled: bool) -> ConnResult<bool> {
    Ok(state
        .client
        .load()
        .set_tun(Context::current(), TunStatusSchema { enabled })
        .await?)
}

#[tauri::command]
pub async fn get_all_interceptions(
    state: tauri::State<'_, ConnectionState>,
) -> ConnResult<Vec<HttpInterceptSchema>> {
    Ok(state
        .client
        .load()
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
        .load()
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
        .load()
        .get_intercepted_payload(Context::current(), id)
        .await?
        .ok_or(anyhow::anyhow!("No response"))?)
}

#[tauri::command]
pub async fn reload_config(state: tauri::State<'_, ConnectionState>) -> ConnResult<()> {
    state.client.load().reload(Context::current()).await?;
    state.reloaded.store(true, Ordering::Relaxed);
    Ok(())
}

#[tauri::command]
pub async fn reconnect_background(state: tauri::State<'_, ConnectionState>) -> ConnResult<()> {
    state.reconnect().await
}

#[tauri::command]
pub async fn enable_traffic_streaming(
    app_handle: AppHandle<Wry>,
    state: tauri::State<'_, ConnectionState>,
) -> ConnResult<()> {
    let handle = HandleContextInner::new(app_handle);
    let _ = state
        .client
        .load()
        .request_traffic_stream(Context::current(), handle.ctx_id)
        .await;
    *state.traffic_sender.load().write().await = Some(handle);
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
        .load()
        .request_log_stream(Context::current(), handle.ctx_id)
        .await;
    *state.logs_sender.load().write().await = Some(handle);
    Ok(())
}

#[tauri::command]
pub async fn enable_connection_streaming(
    app_handle: AppHandle<Wry>,
    state: tauri::State<'_, ConnectionState>,
) -> ConnResult<()> {
    let handle = HandleContextInner::new(app_handle);
    let _ = state
        .client
        .load()
        .request_connection_stream(Context::current(), handle.ctx_id)
        .await;
    *state.connection_sender.load().write().await = Some(handle);
    Ok(())
}

#[tauri::command]
pub async fn reset_traffic(state: tauri::State<'_, ConnectionState>) -> ConnResult<()> {
    *state.traffic_sender.load().write().await = None;
    Ok(())
}

#[tauri::command]
pub async fn reset_logs(state: tauri::State<'_, ConnectionState>) -> ConnResult<()> {
    *state.logs_sender.load().write().await = None;
    Ok(())
}

#[tauri::command]
pub async fn reset_connections(state: tauri::State<'_, ConnectionState>) -> ConnResult<()> {
    *state.connection_sender.load().write().await = None;
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
