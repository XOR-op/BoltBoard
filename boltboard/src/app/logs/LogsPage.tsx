import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import Grid from "@mui/material/Grid";
import React, {useEffect, useState} from "react";
import {websocket_url} from "../../misc/request";
import useWebSocket from "react-use-websocket";
import {Table, TableBody, TableCell, TableHead, TableRow, Theme} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {invoke} from "@tauri-apps/api";
import {listen} from "@tauri-apps/api/event";

interface LogSchema {
    timestamp: string,
    level: string,
    fields: { "message": string },
    target: string
}


function levelColor(theme: Theme, level: string) {
    let color
    level = level.toLowerCase()
    if (level === 'error') {
        color = theme.palette.error
    } else if (level === 'warning') {
        color = theme.palette.warning
    } else if (level === 'info') {
        color = theme.palette.success
    } else if (level === 'trace') {
        color = theme.palette.info
    } else {
        color = theme.palette.primary
    }
    if (theme.palette.mode === 'dark') {
        return color.dark
    } else {
        return color.light
    }
}

const LogsPage = () => {
    const [logs, setLogs] = useState<Array<LogSchema>>([])
    const theme = useTheme()

    /* #v-ifdef VITE_TAURI */
    var lastMessage: MessageEvent<any> | null = null;
    useEffect(() => {
        invoke('enable_logs_streaming')
        const unlisten = listen('logs', (e) => {
            console.log("Get log:" + e.payload as string)
            let message = JSON.parse(e.payload as string);
            setLogs(arr => [...arr, message]);
        });
        return () => {
            unlisten.then(f => f())
            invoke('reset_logs')
        };
    }, [])
    /* #v-else */
    var {lastMessage} = useWebSocket(websocket_url('/ws/logs'))

    useEffect(() => {
        if (lastMessage != null) {
            const message = JSON.parse(lastMessage.data);
            if ('timestamp' in message) {
                setLogs(arr => [...arr, message]);
            }
        }
    }, [lastMessage,])
    /* #v-endif */

    return (
        <React.Fragment>
            <AdminAppBar>
                <AdminToolbar title={'Logs'}/>
            </AdminAppBar>
            <Grid container>{
                <Table aria-label="Logs"
                       size="small"
                       sx={{
                           "& td, & th": {
                               border: 0,
                               borderColor: 'grey.500'
                           },
                       }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>Time</TableCell>
                            <TableCell>Level</TableCell>
                            <TableCell>Message</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logs.map((item, idx) => (
                            <TableRow key={idx.toString() + "/" + item.timestamp}>
                                <TableCell>{item.timestamp}</TableCell>
                                <TableCell sx={{color: levelColor(theme, item.level)}}>{item.level}</TableCell>
                                <TableCell>{item.fields.message}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            }
            </Grid>
        </React.Fragment>
    )
}

export default LogsPage
