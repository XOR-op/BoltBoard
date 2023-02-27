import React, {useState} from "react";
import ConnectionEntry, {ConnectionEntryData} from "./ConnectionEntry";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from '@material-ui/styles'
import {Collapse} from '@material-ui/core'
import { IconButton } from "@material-ui/core";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

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
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
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
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {entries.map((item, id) => (<ConnectionEntry key={id} data={item}/>))}
                        </TableBody>
                    </Table>
                </Collapse>
            </TableContainer>
        </React.Fragment>
    )
}

export default ConnectionGroup
