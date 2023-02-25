import React from "react";
import ConnectionEntry, {ConnectionEntryData} from "./ConnectionEntry";
import {Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";

export interface ConnectionGroupProps {
    entries: Array<ConnectionEntryData>
}

const ConnectionGroup = ({entries}: ConnectionGroupProps) => {
    return (
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
                        <TableCell>Destination</TableCell>
                        <TableCell>Protocol</TableCell>
                        <TableCell>Proxy</TableCell>
                        <TableCell>Process</TableCell>
                        <TableCell>Upload</TableCell>
                        <TableCell>Download</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {entries.map(item => (<ConnectionEntry data={item}/>))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default ConnectionGroup
