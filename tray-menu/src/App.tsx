import React, { useState } from "react";
import GroupList from "./component/group";
import { ErrorBoundary } from "react-error-boundary";

function fallbackRender({ error, resetErrorBoundary }) {
	return (
		<div role="alert">
			<p>Something went wrong:</p>
			<pre style={{ color: "red" }}>{error.message}</pre>
		</div>
	);
}


function App() {
	const [groups, setGroups] = useState([{
		name: "US",
		selected: "NYC",
		list: [{ name: "NYC", proto: "trojan" }, { name: "San Jose", proto: "wireguard" }]
	}, {
		name: "Global",
		selected: "Tokyo",
		list: [{ name: "Tokyo", proto: "shadowsocks" }, { name: "Local", proto: "http" }]
	}]);

	return (
		<>
			<ErrorBoundary fallbackRender={fallbackRender}>
				<GroupList arr={groups} />
			</ErrorBoundary>;
		</>
	);
}

export default App;
