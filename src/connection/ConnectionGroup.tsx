import React, {useState} from "react";
import ConnectionEntry, {ConnectionEntryData} from "./ConnectionEntry";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import Typography from "@mui/material/Typography";
import {makeStyles} from '@mui/styles'
import {Collapse} from '@mui/material'
import {IconButton} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const connGroupStyle = makeStyles({
    titleBar: {
        marginTop: '16px',
        marginBottom: '16px',
    }
})

export interface ConnectionGroupProps {
    key: string,
    name: string,
    entries: Array<ConnectionEntryData>
}

const ConnectionGroup = ({name, entries}: ConnectionGroupProps) => {
    const style = connGroupStyle();
    const [open, setOpen] = useState(true);

    const handleOpen = () => {
        setOpen(!open);
    };
    return (
        <React.Fragment>
            <Typography gutterBottom component="h2" variant="h3" className={style.titleBar}>
                {name}
                <IconButton onClick={handleOpen} disableFocusRipple={true} size='medium' edge={false}>
                    {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                </IconButton>
            </Typography>

            <TableContainer>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Table aria-label="Connection Group"
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
                                <TableCell></TableCell>
                                <TableCell>Destination</TableCell>
                                <TableCell>Protocol</TableCell>
                                <TableCell>Proxy</TableCell>
                                <TableCell>Process</TableCell>
                                <TableCell>Upload</TableCell>
                                <TableCell>Download</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {entries.map(item => (<ConnectionEntry key={item.conn_id} data={item}/>))}
                        </TableBody>
                    </Table>
                </Collapse>
            </TableContainer>
        </React.Fragment>
    )
}

export default ConnectionGroup
