import React from "react";
import {TableCell, TableRow} from "@mui/material";
import Typography from "@mui/material/Typography";
import {CheckCircleOutlined, ImportExportOutlined} from "@mui/icons-material";

export interface ConnectionEntryData {
    conn_id: number,
    destination: string,
    protocol: string,
    proxy: string,
    process: string | undefined,
    upload: number,
    download: number,
    start_time: number,
    active: boolean
}

export interface ConnectionEntryProps {
    key: number
    data: ConnectionEntryData
}

function pretty_size(n: number) {
    if (n < 1024) {
        return n.toString() + ' B'
    } else if (n < 1024 * 10) {
        return (n / 1024).toFixed(1).toString() + ' KB'
    } else if (n < 1024 * 1024) {
        return Math.round(n / 1024).toString() + ' KB'
    } else {
        return Math.round(n / (1024 * 1024)).toString() + ' MB'
    }
}

function pretty_time(n: number) {
    const diff = Math.floor(Date.now() / 1000) - n;
    if (diff < 0) {
        return "N/A";
    } else {
        if (diff < 60) {
            return diff.toString() + ' seconds ago'
        } else if (diff < 60 * 60) {
            return Math.floor(diff / 60).toString() + ' minutes ago'
        } else if (diff < 24 * 60 * 60) {
            return Math.floor(diff / 60 / 60).toString() + ' hours ago'
        } else {
            return Math.floor(diff / 24 / 60 / 60).toString() + ' days ago'
        }
    }
}

const ConnectionEntry = ({data}: ConnectionEntryProps) => {
    return (
        <TableRow>
            <TableCell>
                {data.active ? (<ImportExportOutlined/>) : (<CheckCircleOutlined/>)}
            </TableCell>
            <TableCell>
                <Typography component='div'>
                    {data.destination}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography component='div'>
                    {data.protocol.toUpperCase()}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography component='div'>
                    {data.proxy}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography component='div'>
                    {(data.process === undefined) ? 'N/A' : data.process}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography component='div'>
                    {pretty_size(data.upload)}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography component='div'>
                    {pretty_size(data.download)}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography component='div'>
                    {pretty_time(data.start_time)}
                </Typography>
            </TableCell>
        </TableRow>
    )
}
export default ConnectionEntry
