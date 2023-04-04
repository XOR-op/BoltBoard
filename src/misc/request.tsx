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
