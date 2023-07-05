export interface ProxyRpcData {
	name: string,
	proto: string,
	latency: string | null
}

export interface GroupRpcData {
	list: ProxyRpcData[],
	name: string,
	selected: string
}
