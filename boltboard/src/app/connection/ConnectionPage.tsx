import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import Grid from "@mui/material/Grid";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {ConnectionDisplay, ConnectionEntryData, data_to_display} from "./ConnectionEntry";
import {apiGetAllConnections} from "../../misc/request";
import MaterialReactTable, {MRT_ColumnDef, MRT_FilterFn} from "material-react-table";
import {useTheme} from "@mui/material/styles";
import {Button, IconButton, MenuItem} from "@mui/material";
import {CachedOutlined} from "@mui/icons-material";

function groupByProcess(list: Array<ConnectionEntryData>): Map<string, Array<any>> {
    const map = new Map();
    list.forEach(item => {
        let realKey = item.process ? item.process.name : 'Unknown Process';
        const collection = map.get(realKey);
        if (!collection) {
            map.set(realKey, [item]);
        } else {
            collection.push(item);
        }
    })
    return map
}

const ConnectionPage = () => {
    const [connList, setConnList] = useState<Array<ConnectionEntryData>>([])

    const refresh = useCallback(() => {
        apiGetAllConnections().then(list => setConnList(list))
            .catch(e => console.log(e))
    }, [])
    useEffect(() => {
        refresh()
    }, [refresh]);

    const regex_filter: MRT_FilterFn<ConnectionDisplay> = (item, columnId, filterValue): boolean => {
        const re = new RegExp(filterValue, 'i');
        return re.test(item.getValue(columnId));
    }
    const displays = connList.map(item => data_to_display(item)).reverse();

    const columns = useMemo<MRT_ColumnDef<ConnectionDisplay>[]>(() => [
        {
            header: 'Destination',
            accessorKey: 'destination',
            size: 200,
            filterFn: 'regex',
            enableColumnFilterModes: false
        },
        {
            header: 'Proto',
            accessorKey: 'protocol',
            size: 70,
            enableColumnFilterModes: false,
            filterFn: 'equals',
            filterSelectOptions: ['TCP', 'UDP', 'TLS', 'QUIC'],
            filterVariant: 'select',
        },
        {
            header: 'Proxy',
            accessorKey: 'proxy',
            size: 80,
            enableColumnFilterModes: false
        },
        {
            header: 'Inbound',
            accessorKey: 'inbound',
            size: 120,
            enableColumnFilterModes: false
        },
        {
            header: 'Process',
            accessorKey: 'process',
            size: 120,
            columnFilterModeOptions: ['contains', 'regex'],
            filterFn: 'contains',
            filterVariant: 'select',
            filterSelectOptions: displays.map(x => x.process)
                .filter((val, idx, arr) => arr.indexOf(val) === idx).sort(),
            renderColumnFilterModeMenuItems: ({onSelectFilterMode}) => [
                <MenuItem key="0" onClick={() => {
                    onSelectFilterMode('contains')
                }}>
                    <div>Select</div>
                </MenuItem>,
                <MenuItem key="1" onClick={() => {
                    onSelectFilterMode('regex')
                }}>
                    <div>Regex</div>
                </MenuItem>,
            ],
        },
        {
            header: 'Upload',
            accessorKey: 'upload',
            size: 100,
            enableSorting: false,
            enableColumnFilter: false,
        },
        {
            header: 'Download',
            accessorKey: 'download',
            size: 100,
            enableSorting: false,
            enableColumnFilter: false,
        },
        {
            header: 'Time',
            accessorKey: 'time',
            size: 200,
            enableColumnFilter: false,
            sortingFn: (a, b) => {
                let aTime: number = a.getValue('start_time');
                let bTime: number = b.getValue('start_time');
                return aTime - bTime < 0 ? -1 : 1;
            }
        }
    ], []);
    const theme = useTheme();
    return (
        <React.Fragment>
            <AdminAppBar>
                <AdminToolbar title={'Connection'}/>
            </AdminAppBar>
            <MaterialReactTable
                // styles
                muiTableContainerProps={{
                    sx: {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgb(55, 60, 67)' : 'rgb(218, 223, 228)',
                        scrollbarWidth: "none",
                        overscrollBehavior: "none"
                    }
                }}
                muiTableProps={{sx: {boxShadow: 'none'}}}
                muiTableHeadRowProps={{sx: {boxShadow: 'none'}}}
                muiTablePaperProps={{sx: {boxShadow: 'none'}}}
                muiTableBodyProps={{
                    sx: {}
                }}
                muiTableHeadCellFilterTextFieldProps={{
                    sx: {m: '0.5rem 0 0 0rem', width: '90%'},
                    variant: 'outlined',
                }}

                // data
                columns={columns}
                data={displays}

                // filter
                enableColumnFilterModes
                filterFns={{
                    regex: regex_filter
                }}
                localization={
                    {filterRegex: 'Regex'} as any
                }

                // configuration
                enableRowVirtualization
                enablePagination={false}
                enableColumnOrdering
                enableColumnDragging={false}
                enableFullScreenToggle={false}
                renderTopToolbarCustomActions={() => <IconButton
                    onClick={() => refresh()}><CachedOutlined/></IconButton>}
                initialState={{showColumnFilters: true}}
            />
        </React.Fragment>
    )
}

export default ConnectionPage
