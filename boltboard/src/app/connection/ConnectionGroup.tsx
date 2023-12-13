import React, {useState} from "react";
import ConnectionEntry, {ConnectionEntryData} from "./ConnectionEntry";
import {
    Collapse,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export interface ConnectionGroupProps {
    key: string,
    name: string,
    entries: Array<ConnectionEntryData>
}

const ConnectionGroup = ({name, entries}: ConnectionGroupProps) => {
    const [open, setOpen] = useState(true);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Calculate the index of the first and last rows on the current page
    const firstRowOnPage = page * rowsPerPage;
    const lastRowOnPage = page * rowsPerPage + rowsPerPage;

    // Get the rows to be displayed on the current page
    const displayedRows = entries.slice(firstRowOnPage, lastRowOnPage);

    // Handle page change
    const handlePageChange = (event: any, newPage: number) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleRowsPerPageChange = (event: { target: { value: string; }; }) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const handleOpen = () => {
        setOpen(!open);
    };
    return (
        <React.Fragment>
            <Grid item xs={12} md={8}>
                <Card onClick={handleOpen} sx={{cursor: 'pointer'}}>
                    <CardContent sx={{display: 'flex', justifyContent: 'space-between'}}>
                        <Typography variant="h4" sx={{textAlign: 'left'}}>
                            {name}
                        </Typography>
                        <Typography variant="h5" sx={{textAlign: 'right'}}>
                            {entries.length}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>


            <TableContainer>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Table aria-label="Connection Group"
                           size="small"
                           sx={{
                               "& td, & th": {
                                   border: 0,
                                   borderColor: 'grey.500'
                               },
                               marginTop: '2rem'
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
                            {displayedRows.map(item => (<ConnectionEntry key={item.conn_id} data={item}/>))}
                        </TableBody>
                    </Table>
                    <TablePagination component="div" rowsPerPageOptions={[10, 25, 50, 100]} count={entries.length}
                                     page={page} rowsPerPage={rowsPerPage}
                                     onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange}/>
                </Collapse>
            </TableContainer>
        </React.Fragment>
    )
}

export default ConnectionGroup
