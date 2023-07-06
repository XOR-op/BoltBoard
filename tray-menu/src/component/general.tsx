import { List, ListItem } from "@mui/material";
import { ListItemStyle } from "./style";
import { useEffect, useState } from "react";
import { ToggleOff, ToggleOn } from "@mui/icons-material";
import { apiGetTun, apiSetTun, openDashboard, quitApp } from "../misc/request";

export interface UpdateState {
    refresh(): void;
}

const GeneralList = ({ refresh }: UpdateState) => {
    const [systemProxy, setSystemProxy] = useState(false);
    const [tun, setTun] = useState(false);
    const toggleSystemProxy = () => {
        setSystemProxy(!systemProxy);
    };
    const toggleTun = () => {
        const next = !tun;
        apiSetTun(next).then(() => refresh());
    };
    useEffect(() => {
        apiGetTun().then((r: boolean) => setTun(r));
    }, []);
    return (
        <List><ListItem secondaryAction={systemProxy ? <ToggleOn /> : <ToggleOff />} sx={ListItemStyle}
                        onClick={toggleSystemProxy}>System Proxy</ListItem>
            <ListItem secondaryAction={tun ? <ToggleOn /> : <ToggleOff />} sx={ListItemStyle} onClick={toggleTun}>Tun
                Mode</ListItem>
            <ListItem sx={ListItemStyle} onClick={openDashboard}>Dashboard</ListItem>
            <ListItem sx={ListItemStyle} onClick={quitApp}>Quit</ListItem>
        </List>
    );
};

export default GeneralList;
