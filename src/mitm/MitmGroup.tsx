import React from "react";
import MitmEntry, {MitmEntryData} from "./MitmEntry";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

export interface MitmGroupProps {
    key: string,
    endpoint: string,
    name: string,
    entries: Array<MitmEntryData>
}

const MitmGroup = ({endpoint, entries}: MitmGroupProps) => {
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
