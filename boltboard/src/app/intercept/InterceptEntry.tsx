import React, {useState} from "react";
import {Collapse, IconButton, TableCell, TableRow} from "@mui/material";
import Typography from "@mui/material/Typography";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import InterceptData from "./InterceptData";
import {apiGetInterceptedPayload} from "../../misc/request";

export interface InterceptEntryData {
    intercept_id: number,
    client: string | undefined,
    uri: string,
    method: string,
    status: number,
    size: number | undefined,
    time: string,
}

export interface InterceptPayloadBody {
    type: 'empty' | 'warning' | 'body'
    content: string | undefined
}

export interface InterceptPayloadData {
    req_header: string[],
    req_body: InterceptPayloadBody,
    resp_header: string[],
    resp_body: InterceptPayloadBody,
}

export interface InterceptEntryProps {
    key: number
    data: InterceptEntryData
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


const InterceptEntry = ({data}: InterceptEntryProps) => {
    const [open, setOpen] = useState(false);
    const [payload, setPayload] = useState<InterceptPayloadData | undefined>(undefined);

    const handleOpen = () => {
        if (!open && payload === undefined) {
            apiGetInterceptedPayload(data.intercept_id).then(pl => setPayload(pl))
                .catch(e => console.log(e))
        }
        setOpen(!open);
    };

    return (
        <React.Fragment>
            <TableRow>
                <TableCell sx={{
                    overflow: 'hidden',
                    overflowWrap: 'break-word'
                }}>
                    <Typography component='div'>
                        {(data.client === undefined) ? 'N/A' : data.client}
                    </Typography>
                </TableCell>
                <TableCell sx={{
                    overflow: 'hidden',
                    overflowWrap: 'anywhere'
                }}>
                    <Typography component='div'>
                        {data.uri}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography component='div'>
                        {data.method.toUpperCase()}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography component='div'>
                        {data.status}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography component='div'>
                        {data.size ? pretty_size(data.size) : 'N/A'}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography component='div'>
                        {data.time}
                    </Typography>
                </TableCell>
                <TableCell>
                    <IconButton onClick={handleOpen} disableFocusRipple={true} size='medium' edge={false}>
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={6} style={{paddingTop: '0px', paddingBottom: '0px'}}>
                    <Collapse in={open} timeout={200}>
                        {payload === undefined ? (<div/>) : (
                            <InterceptData key={data.intercept_id} data={payload}/>
                        )}
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}
export default InterceptEntry
