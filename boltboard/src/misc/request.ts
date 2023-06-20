import {invoke} from "@tauri-apps/api";

export function url_and_header() {
    const url = window.localStorage.getItem('url');
    const api_key = window.localStorage.getItem('api-key');
    const header: { [key: string]: string } = {
        'Content-Type': 'application/json'
    };
    if (api_key) {
        header['api-key'] = JSON.parse(api_key)
    }
    return {
        url: url ? JSON.parse(url) : "localhost:18086",
        header: header
    }
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export function api_call(method: HttpMethod, endpoint: string, body?: any): Promise<Response> {
    const {url, header} = url_and_header();
    return fetch('http://' + url + endpoint, {method: method, headers: header, body: body})
}

export function websocket_url(endpoint: string) {
    // todo: authorization
    const {url} = url_and_header();
    return 'ws://' + url + endpoint
}

export async function apiGetAllProxies(): Promise<any> {
    /* #v-ifdef VITE_TAURI */
    return invoke('get_all_proxies');
    /* #v-else */
    return api_call('GET', '/proxies').then(res => res.json());
    /* #v-endif */
}

export async function apiSetProxyFor(group: string, selected: string): Promise<boolean> {
    /* #v-ifdef VITE_TAURI */
    return invoke('set_proxy_for', {group: group, proxy: selected})
    /* #v-else */
    return api_call('PUT', '/proxies/' + group,
        JSON.stringify({
            'selected': selected
        })
    ).then(res => res.status === 200);
    /* #v-endif */
}

export async function apiSpeedtest(group: string): Promise<any> {
    /* #v-ifdef VITE_TAURI */
    return invoke('update_group_latency', {group: group})
    /* #v-else */
    return api_call('GET', '/speedtest/' + group)
    /* #v-endif */
}

export async function apiGetTun(): Promise<any> {
    /* #v-ifdef VITE_TAURI */
    return invoke('get_tun')
    /* #v-else */
    return api_call('GET', '/tun').then(res => res.json())
    /* #v-endif */
}

export async function apiSetTun(enabled: boolean): Promise<any> {
    /* #v-ifdef VITE_TAURI */
    return invoke('set_tun', {enabled: enabled})
    /* #v-else */
    return api_call('PUT', '/tun', JSON.stringify({
        enabled: enabled
    })).then(res => res.status === 200)
    /* #v-endif */
}

export async function apiGetAllConnections(): Promise<any> {
    /* #v-ifdef VITE_TAURI */
    return invoke('get_all_connections');
    /* #v-else */
    return api_call('GET', '/connections').then(res => res.json())
    /* #v-endif */
}

export async function apiGetInterceptedPayload(id: number): Promise<any> {
    /* #v-ifdef VITE_TAURI */
    return invoke('get_intercept_payload', {id: id})
    /* #v-else */
    return api_call('GET', '/intercept/payload/' + id)
        .then(res => res.json())
    /* #v-endif */
}

export async function apiGetAllInterceptions(): Promise<any> {
    /* #v-ifdef VITE_TAURI */
    return invoke('get_all_interceptions')
    /* #v-else */
    return api_call('GET', '/intercept/all')
        .then(res => res.json())
    /* #v-endif */
}


export async function checkConnection(probeUrl: string, timeout: number): Promise<boolean> {
    /* #v-ifdef VITE_TAURI */
    return true;
    /* #v-else */
    return Promise.race([
        fetch(probeUrl),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Connection timed out')), timeout)
        )
    ])
        .then((response: any) => {
            return response.status === 200;
        })
    /* #v-endif */
}
