import React, {useState} from "react";
import ConnectionEntry, {ConnectionEntryData} from "./ConnectionEntry";
import {Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow} from "@mui/material";
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

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

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
                            {displayedRows.map(item => (<ConnectionEntry key={item.conn_id} data={item}/>))}
                        </TableBody>
                    </Table>
                    <TablePagination component="div" rowsPerPageOptions={[5, 10, 25, 100]} count={entries.length} page={page} rowsPerPage={rowsPerPage}
                                     onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange}/>
                </Collapse>
            </TableContainer>
        </React.Fragment>
    )
}

export default ConnectionGroup
