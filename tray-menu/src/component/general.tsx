import { List, ListItem } from "@mui/material";
import { ListItemStyle } from "./style";
import { useEffect, useState } from "react";
import { ToggleOff, ToggleOn } from "@mui/icons-material";
import { apiGetTun, apiSetTun, openDashboard, quitApp, reload } from "../misc/request";


const GeneralList = () => {
    // const [systemProxy, setSystemProxy] = useState(false);
    // const toggleSystemProxy = () => {
    //     setSystemProxy(!systemProxy);
    // };
    const [tun, setTun] = useState(false);
    const toggleTun = () => {
        const next = !tun;
        apiSetTun(next).then(() => setTun(next));
    };
    useEffect(() => {
        apiGetTun().then((r: any) => setTun(r.enabled));
    }, []);
    return (
        <List>
            {/*<ListItem secondaryAction={systemProxy ? <ToggleOn /> : <ToggleOff />} sx={ListItemStyle}*/}
            {/*          onClick={toggleSystemProxy}>*/}
            {/*    System Proxy*/}
            {/*</ListItem>*/}
            <ListItem secondaryAction={tun ? <ToggleOn /> : <ToggleOff />} sx={ListItemStyle} onClick={toggleTun}>
                Tun Mode
            </ListItem>
            <ListItem sx={ListItemStyle} onClick={reload}>Reload</ListItem>
            <ListItem sx={ListItemStyle} onClick={openDashboard}>Dashboard</ListItem>
            <ListItem sx={ListItemStyle} onClick={quitApp}>Quit</ListItem>
        </List>
    );
};

export default GeneralList;
