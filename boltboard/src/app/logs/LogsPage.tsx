import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import Grid from "@mui/material/Grid";
import React, {useCallback, useEffect, useState} from "react";
import {api_call, websocket_url} from "../../misc/request";
import useWebSocket from "react-use-websocket";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import ConnectionEntry from "../connection/ConnectionEntry";

interface LogSchema {
    timestamp: string,
    level: string,
    fields: { "message": string },
    target: string
}

const LogsPage = () => {
    const [logs, setLogs] = useState<Array<LogSchema>>([])

    const {lastMessage} = useWebSocket(websocket_url('/ws/logs'))
    useEffect(() => {
        if (lastMessage != null) {
            const message = JSON.parse(lastMessage.data);
            if ('timestamp' in message) {
                setLogs([...logs, message]);
            }
        }
    }, [lastMessage,])

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
                                <TableCell>{item.level}</TableCell>
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
