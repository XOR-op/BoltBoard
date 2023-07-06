import React, { useState } from "react";
import { GroupRpcData } from "../misc/structure";
import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { ListItemStyle } from "./style";
import { apiSetProxyFor } from "../misc/request";

export interface AllGroupData {
    arr: GroupRpcData[];

    refresh(): void;
}

interface GroupItemProps {
    data: GroupRpcData,

    refresh(): void
}

const DrawerStyle = {
    ".MuiDrawer-paper": {
        color: "rgba(255, 255, 255, 0.87)",
        "background-color": "#11171bdc",
        "max-width": "66%",
        "min-width": "50%"
    },
    ".MuiListItemText-secondary": {
        color: "rgba(255, 255, 255, 0.87)"
    }
};

function colorizeLatency(latency: string | null): string {
    if (!latency) return "#e0e0e0";
    const color = {
        "fast": "#639754",
        "average": "#ffd301",
        "slow": "#ef9367",
        "failed": "#d62f2f"
    };
    if (latency === "Failed") {
        return color["failed"];
    } else {
        const ms = parseInt(latency.split(" ")[0]);
        if (ms < 200) {
            return color["fast"];
        } else if (ms < 400) {
            return color["average"];
        } else {
            return color["slow"];
        }
    }
}

const GroupItem = ({ data, refresh }: GroupItemProps) => {
    const [open, setOpen] = useState(false);
    const closeDrawer = () => setOpen(false);
    return (
        <React.Fragment>
            <ListItem key={data.name} secondaryAction={data.selected} onClick={() => setOpen(true)} sx={ListItemStyle}>
                {data.name}
            </ListItem>
            <Drawer anchor="right" open={open} onClose={closeDrawer}
                    ModalProps={{ keepMounted: false }} sx={DrawerStyle}>
                <List>
                    {data.list.map(p => {
                        return (
                            <ListItem key={p.name}
                                      onClick={() => {
                                          apiSetProxyFor(data.name, p.name).then((ok: boolean) => {
                                              if (ok) {
                                                  refresh();
                                                  closeDrawer();
                                              }
                                          });
                                      }} sx={{ "padding-top": "0", "padding-bottom": "0", "cursor": "pointer" }}>
                                <ListItemText primary={p.name} secondary={p.latency ? p.latency : "N/A"}
                                              sx={{ ".MuiListItemText-secondary": { color: colorizeLatency(p.latency) } }} />
                            </ListItem>
                        );
                    })}
                </List>
            </Drawer>
        </React.Fragment>
    );
};

const GroupList = ({ arr, refresh }: AllGroupData) => {
    return (
        <List>
            {arr.map(p => <GroupItem key={p.name} data={p} refresh={refresh} />)}
        </List>
    );
};

export default GroupList;
