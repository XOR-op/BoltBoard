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

export async function apiGetAllConnections(): Promise<any> {
    return api_call('GET', '/connections').then(res => res.json())
}

export async function apiGetAllProxies(): Promise<any> {
    return api_call('GET', '/proxies').then(res => res.json());
}

export async function apiSetProxyFor(group: String, selected: String): Promise<boolean> {
    return api_call('PUT', '/proxies/' + group,
        JSON.stringify({
            'selected': selected
        })
    ).then(res => res.status === 200);
}

export async function apiGetTun(): Promise<any> {
    return api_call('GET', '/tun').then(res => res.json())
}

export async function apiSetTun(enabled: boolean): Promise<any> {
    return api_call('PUT', '/tun', JSON.stringify({
        enabled: enabled
    })).then(res => res.status === 200)
}

export async function apiGetInterceptedPayload(id: number): Promise<any> {
    return api_call('GET', '/intercept/payload/' + id)
        .then(res => res.json())
}

export async function apiGetAllInterceptions(): Promise<any> {
    return api_call('GET', '/intercept/all')
        .then(res => res.json())
}

export async function apiSpeedtest(group: String): Promise<any> {
    return api_call('GET', '/speedtest/' + group)
}
