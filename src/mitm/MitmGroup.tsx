import React, {useState} from "react";
import MitmEntry, {MitmEntryData} from "./MitmEntry";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from '@material-ui/styles'
import {Collapse} from '@material-ui/core'
import {IconButton} from "@material-ui/core";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const connGroupStyle = makeStyles({
    titleBar: {
        marginTop: '16px',
        marginBottom: '16px',
    }
})

export interface MitmGroupProps {
    key: string,
    endpoint:string,
    name: string,
    entries: Array<MitmEntryData>
}

const MitmGroup = ({endpoint,entries}: MitmGroupProps) => {
    return (
        <React.Fragment>
            <TableContainer>
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
                            <TableCell>Client</TableCell>
                            <TableCell>URI</TableCell>
                            <TableCell>Method</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Size</TableCell>
                            <TableCell>Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {entries.map(item => (<MitmEntry key={item.mitm_id} endpoint={endpoint} data={item}/>))}
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    )
}

export default MitmGroup
