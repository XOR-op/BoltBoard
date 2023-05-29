let globalRequestUrl = 'localhost:18086'

export function setGlobalUrl(url: string) {
    globalRequestUrl = url
}

export function getGlobalUrl() {
    return globalRequestUrl
}

let globalApiKey: string | null = null

export function getGlobalHeader() {
    let header: { [key: string]: string } = {
        'Content-Type': 'application/json'
    }
    if (globalApiKey) {
        header['api-key'] = globalApiKey
    }
    return header
}


export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export function api_call(method: HttpMethod, endpoint: string, body?: any): Promise<Response> {
    return fetch('http://' + getGlobalUrl() + endpoint, {method: method, headers: getGlobalHeader(), body: body})
}

export function websocket_url(endpoint: string) {
    // todo: authorization;
    return 'ws://' + getGlobalUrl() + endpoint
}

