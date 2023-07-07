import React, { useState } from "react";
import { GroupRpcData } from "../misc/structure";
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { apiSetProxyFor, apiSpeedtest } from "../misc/request";
import { ListItemStyle } from "./style";

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
    const [speedtestDisabled, setSpeedtestDisabled] = useState(false);
    const closeDrawer = () => setOpen(false);
    return (
        <React.Fragment>
            <ListItem key={data.name} secondaryAction={data.selected} onClick={() => setOpen(true)}
                      sx={ListItemStyle}>
                {data.name}
            </ListItem>
            <Drawer anchor="right" open={open} onClose={closeDrawer}
                    ModalProps={{ keepMounted: false }} sx={DrawerStyle}>
                <List>
                    <ListItemButton key="Benchmark" disabled={speedtestDisabled} alignItems="center"
                                    onClick={() => {
                                        setSpeedtestDisabled(true);
                                        const interval = setInterval(() => refresh(), 200);
                                        apiSpeedtest(data.name).finally(() => {
                                            clearInterval(interval);
                                            refresh();
                                            setSpeedtestDisabled(false);
                                        });
                                    }} sx={{
                        "padding-top": "0",
                        "padding-bottom": "0",
                        "height": "35px",
                        "text-align": "center", ...ListItemStyle
                    }}><Box sx={{ width: "100%" }}>Benchmark</Box>
                    </ListItemButton>
                    {data.list.map(p => {
                        const colorSetting = p.name === data.selected ? { "color": "rgba(122,179,255,0.95)" } : {};
                        return (
                            <ListItem key={p.name}
                                      onClick={() => {
                                          apiSetProxyFor(data.name, p.name).then((ok: boolean) => {
                                              if (ok) {
                                                  refresh();
                                                  closeDrawer();
                                              }
                                          });
                                      }} sx={{
                                "padding-top": "0",
                                "padding-bottom": "0",
                                ...ListItemStyle
                            }}>
                                <ListItemText primary={p.name} secondary={p.latency ? p.latency : "N/A"}
                                              sx={{
                                                  ".MuiListItemText-primary": {
                                                      "font-family": "Nunito, system-ui, Avenir, Helvetica, Arial, sans-serif",
                                                      ...colorSetting
                                                  },
                                                  ".MuiListItemText-secondary": {
                                                      "font-family": "Nunito, system-ui, Avenir, Helvetica, Arial, sans-serif",
                                                      color: colorizeLatency(p.latency)
                                                  }
                                              }} />
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
