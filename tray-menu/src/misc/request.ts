import { invoke } from "@tauri-apps/api";

export async function apiGetAllProxies(): Promise<any> {
	return invoke("get_all_proxies");
}

export async function apiSetProxyFor(group: string, selected: string): Promise<boolean> {
	return invoke("set_proxy_for", { group: group, proxy: selected });
}

export async function apiSpeedtest(group: string): Promise<any> {
	return invoke("update_group_latency", { group: group });
}

export async function apiGetTun(): Promise<any> {
	return invoke("get_tun");
}

export async function apiSetTun(enabled: boolean): Promise<any> {
	return invoke("set_tun", { enabled: enabled });
}

export async function openDashboard(): Promise<any> {
	return invoke("open_dashboard");
}

export async function quitApp(): Promise<any> {
	return invoke("quit");
}
