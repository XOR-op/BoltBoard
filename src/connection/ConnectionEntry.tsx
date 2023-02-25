import React from "react";
import {Grid, TableCell, TableRow} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

export interface ConnectionEntryData {
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

const ConnectionEntry = ({data}: ConnectionEntryProps) => {
    return (
        <TableRow>
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
                    {data.active ? 'open' : 'close'}
                </Typography>
            </TableCell>
        </TableRow>
    )
}
export default ConnectionEntry
