import { List, ListItem } from "@mui/material";
import { ListItemStyle } from "./style";
import { useState } from "react";
import { ToggleOff, ToggleOn } from "@mui/icons-material";

const GeneralList = () => {
	const [systemProxy, setSystemProxy] = useState(false);
	const [tun, setTun] = useState(false);
	const toggleSystemProxy = () => {
		setSystemProxy(!systemProxy);
	};
	const toggleTun = () => {
		setTun(!tun);
	};
	return (
		<List>
			<ListItem secondaryAction={systemProxy ? <ToggleOn /> : <ToggleOff />} sx={ListItemStyle}
					  onClick={toggleSystemProxy}>System Proxy</ListItem>
			<ListItem secondaryAction={tun ? <ToggleOn /> : <ToggleOff />} sx={ListItemStyle}
					  onClick={toggleTun}>Tun Mode</ListItem>
			<ListItem sx={ListItemStyle}>Dashboard</ListItem>
			<ListItem sx={ListItemStyle}>Quit</ListItem>
		</List>
	);
};

export default GeneralList;
