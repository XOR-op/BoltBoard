import React from "react";
import InterceptEntry, {InterceptEntryData} from "./InterceptEntry";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

export interface InterceptGroupProps {
    key: string,
    name: string,
    entries: Array<InterceptEntryData>
}

const InterceptGroup = ({entries}: InterceptGroupProps) => {
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
                        {entries.map(item => (<InterceptEntry key={item.intercept_id} data={item}/>))}
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    )
}

export default InterceptGroup
