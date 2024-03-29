import React from "react";
import {TableCell, TableRow} from "@mui/material";
import Typography from "@mui/material/Typography";
import {CheckCircleOutlined, ImportExportOutlined} from "@mui/icons-material";

export interface ProcessSchemaData {
    pid: number,
    path: string,
    name: string,
    cmdline: string,
    parent_name: string | undefined
}

export interface ConnectionEntryData {
    conn_id: number,
    inbound: string,
    destination: string,
    protocol: string,
    proxy: string,
    process: ProcessSchemaData | undefined,
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
    } else if (n < 1024 * 100) {
        return (n / 1024).toFixed(1).toString() + ' KB'
    } else if (n < 1024 * 1024) {
        return Math.round(n / 1024).toString() + ' KB'
    } else if (n < 1024 * 1024 * 100) {
        return (n / 1024 / 1024).toFixed(1).toString() + ' MB'
    }
    else {
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

export interface ConnectionDisplay {
    id: number,
    destination: string,
    protocol: string,
    proxy: string,
    inbound: string,
    process: string,
    upload: string,
    download: string,
    time: string,
    start_time: number,
    active: boolean
}

export function data_to_display(data: ConnectionEntryData): ConnectionDisplay {
    return {
        id: data.conn_id,
        destination: data.destination,
        protocol: data.protocol.toUpperCase(),
        proxy: data.proxy,
        inbound: data.inbound,
        process: data.process ? data.process.name : 'Unknown Process',
        upload: pretty_size(data.upload),
        download: pretty_size(data.download),
        time: pretty_time(data.start_time),
        start_time: data.start_time,
        active: data.active
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
                    {data.process ? data.process.name : 'N/A'}
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
