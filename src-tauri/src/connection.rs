use std::path::PathBuf;

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
use tokio::net::UnixStream;

type ConnResult<T> = Result<T, SerializableError>;

#[derive(Clone)]
struct ClientStreamServer {}

#[tarpc::server]
impl ClientStreamService for ClientStreamServer {
    async fn post_traffic(self, _: Context, traffic: TrafficResp) {
        todo!()
    }

    async fn post_log(self, _: Context, log: String) {
        todo!()
    }
}

pub struct ConnectionState {
    client: ControlServiceClient,
}

impl ConnectionState {
    pub async fn new(bind_addr: PathBuf) -> ConnResult<Self> {
        let conn = UnixStream::connect(bind_addr).await?;
        let transport = tarpc::serde_transport::new(
            LengthDelimitedCodec::builder().new_framed(conn),
            Bincode::default(),
        );
        let (server_t, client_t, in_task, out_task) = rpc_multiplex_twoway(transport);

        tokio::spawn(in_task);
        tokio::spawn(out_task);
        let client = ControlServiceClient::new(Default::default(), client_t).spawn();
        tokio::spawn(BaseChannel::with_defaults(server_t).execute(ClientStreamServer {}.serve()));

        Ok(Self { client })
    }
}

#[tauri::command]
pub async fn get_group_list(
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
pub async fn get_connections(
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
pub async fn get_tun(state: tauri::State<'_, ConnectionState>) -> ConnResult<TunStatusSchema> {
    Ok(state.client.get_tun(Context::current()).await?)
}

#[tauri::command]
pub async fn set_tun(
    state: tauri::State<'_, ConnectionState>,
    enabled: TunStatusSchema,
) -> ConnResult<()> {
    state.client.set_tun(Context::current(), enabled).await?;
    Ok(())
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
