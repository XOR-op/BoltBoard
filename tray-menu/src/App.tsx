import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import GroupList from "./component/group";
import { ErrorBoundary } from "react-error-boundary";
import GeneralList from "./component/general";
import { apiGetAllProxies } from "./misc/request";
import { GroupRpcData } from "./misc/structure.ts";

function fallbackRender({ error, resetErrorBoundary }: any) {
	return (
		<div role="alert">
			<p>Something went wrong:</p>
			<pre style={{ color: "red" }}>{error.message}</pre>
		</div>
	);
}


function App() {
	// const [groups, setGroups] = useState([{
	// 	name: "US",
	// 	selected: "NYC",
	// 	list: [{ name: "NYC", proto: "trojan", latency: "133ms" }, { name: "San Jose", proto: "wireguard" },{ name: "San Joseeeeeeeeeeeeeeeeeeeeeeeeee", proto: "wireguard" }]
	// }, {
	// 	name: "Global",
	// 	selected: "Local",
	// 	list: [{ name: "Tokyo", proto: "shadowsocks" }, { name: "Local", proto: "http" }]
	// }]);
	const [groups, setGroups] = useState<GroupRpcData[]>([]);

	const refresh = useCallback(() => {
		apiGetAllProxies().then(p => {
			setGroups(p);
		}).catch(e => console.log(e));
	}, []);
	useEffect(() => {
		refresh();
	}, [refresh]);

	useLayoutEffect(() => {
		document.documentElement.setAttribute(
			"data-prefers-color-scheme",
			"dark"
		);
		document.documentElement.setAttribute(
			"color-scheme",
			"dark"
		);
	}, []);

	return (
		<>
			<ErrorBoundary fallbackRender={fallbackRender}>
				<GroupList arr={groups} refresh={refresh} />
				<GeneralList />
			</ErrorBoundary>
		</>
	);
}

export default App;
