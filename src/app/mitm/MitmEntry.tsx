import React, {useState} from "react";
import {Collapse, IconButton, TableCell, TableRow} from "@mui/material";
import Typography from "@mui/material/Typography";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MitmData from "./MitmData";
import {api_call} from "../../misc/request";

export interface MitmEntryData {
    eavesdrop_id: number,
    client: string | undefined,
    uri: string,
    method: string,
    status: number,
    size: number,
    time: string,
}

export interface MitmPayloadData {
    req_header: string[],
    req_body: string,
    resp_header: string[],
    resp_body: string,
}

export interface MitmEntryProps {
    key: number
    data: MitmEntryData
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


const MitmEntry = ({data}: MitmEntryProps) => {
    const [open, setOpen] = useState(false);
    const [payload, setPayload] = useState<MitmPayloadData | undefined>(undefined);

    const handleOpen = () => {
        if (!open && payload === undefined) {
            api_call('GET', '/eavesdrop/payload/' + data.eavesdrop_id)
                .then(res => res.json()).then(pl => setPayload(pl))
                .catch(e => console.log(e))
        }
        setOpen(!open);
    };

    return (
        <React.Fragment>
            <TableRow>
                <TableCell>
                    <Typography component='div'>
                        {(data.client === undefined) ? 'N/A' : data.client}
                    </Typography>
                </TableCell>
                <TableCell>
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
                        {pretty_size(data.size)}
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
                            <MitmData key={data.eavesdrop_id} data={payload}/>
                        )}
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}
export default MitmEntry
