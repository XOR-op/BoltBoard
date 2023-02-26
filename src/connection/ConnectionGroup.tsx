import React from "react";
import ConnectionEntry, {ConnectionEntryData} from "./ConnectionEntry";
import {Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from '@material-ui/styles'

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
    return (
        <React.Fragment>
            <Typography gutterBottom component="h2" variant="h3" className={style.titleBar}>
                {name}
            </Typography>
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
            </TableContainer>
        </React.Fragment>
    )
}

export default ConnectionGroup
