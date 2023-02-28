import React, {useState} from "react";
import {Collapse, IconButton, TableCell, TableRow} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import {useLocalStorage} from "../core/hooks/useLocalStorage";

export interface MitmEntryData {
    mitm_id: number,
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
    endpoint: string,
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


const MitmEntry = ({endpoint, data}: MitmEntryProps) => {
    const [open, setOpen] = useState(false);
    const [payload, setPayload] = useState<MitmPayloadData | undefined>(undefined);
    const [authKey, _setAuthKey] = useLocalStorage<string | undefined>('authkey', undefined);

    const handleOpen = () => {
        if (!open && payload === undefined) {
            const headers: HeadersInit = {};
            if (authKey) {
                headers['api-key'] = authKey;
            }
            fetch(endpoint + '/mitm/payload/' + data.mitm_id, {
                method: 'GET',
                headers: headers,
            }).then(res => res.json()).then(pl => setPayload(pl))
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
            <Collapse in={open} timeout="auto" unmountOnExit>
                { payload===undefined?(<div></div>):(
                <Typography gutterBottom component="h2" variant="h3">
                    TEST
                </Typography>
                )}
            </Collapse>
        </React.Fragment>
    )
}
export default MitmEntry
