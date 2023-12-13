import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {ConnectionDisplay, ConnectionEntryData, data_to_display} from "./ConnectionEntry";
import {apiGetAllConnections} from "../../misc/request";
import {MRT_ColumnDef, MRT_FilterFn, MaterialReactTable, useMaterialReactTable} from "material-react-table";
import {useTheme} from "@mui/material/styles";
import {IconButton, MenuItem} from "@mui/material";
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

    const [processFilterSelect, setProcessFilterSelect] = useState<boolean>(true);
    const processList = [...displays.map(x => x.process).reduce((acc: Map<string, number>, val) => {
        const v = acc.get(val);
        if (v === undefined) acc.set(val, 1);
        else acc.set(val, v + 1);
        return acc;
    }, new Map()).entries()]
        .sort(([k1, v1], [k2, v2]) => {
            const v = v2 - v1;
            if (v === 0) return k1.localeCompare(k2);
            else return v;
        })
        .map(([key, value]) => {
            return {
                text: `${key} (${value})`, value: key
            }
        });
    const sortDataTransfer = (a: string, b: string) => {
        let process = (a: string) => {
            if (a.endsWith('KB')) {
                return parseFloat(a.slice(0, -3)) * 1024;
            } else if (a.endsWith('MB')) {
                return parseFloat(a.slice(0, -3)) * 1024 * 1024;
            } else if (a.endsWith('B')) {
                return parseFloat(a.slice(0, -2));
            } else if (a.endsWith('GB')) {
                return parseFloat(a.slice(0, -3)) * 1024 * 1024 * 1024;
            }
            return 0
        }
        return process(a) - process(b) < 0 ? -1 : 1;
    }

    const columns = useMemo<MRT_ColumnDef<ConnectionDisplay>[]>(() => [
                {
                    header: 'Destination',
                    accessorKey: 'destination',
                    size: 150,
                    filterFn: 'regex',
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Proto',
                    accessorKey: 'protocol',
                    size: 50,
                    enableColumnFilterModes: false,
                    filterFn: 'equals',
                    filterSelectOptions: ['TCP', 'UDP', 'TLS', 'QUIC'],
                    filterVariant: 'select',
                },
                {
                    header: 'Proxy',
                    accessorKey: 'proxy',
                    size: 80,
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Inbound',
                    accessorKey: 'inbound',
                    size: 80,
                    enableColumnFilterModes: false,
                },
                {
                    header: 'Process',
                    accessorKey: 'process',
                    size: 80,
                    columnFilterModeOptions: ['contains', 'regex'],

                    filterFn: 'contains',
                    filterVariant: processFilterSelect ? 'select' : 'text',
                    filterSelectOptions: processList,
                    renderColumnFilterModeMenuItems:
                        ({onSelectFilterMode}) => [
                            <MenuItem key="0" onClick={() => {
                                setProcessFilterSelect(true)
                                onSelectFilterMode('contains')
                            }}>
                                <div>Select</div>
                            </MenuItem>,
                            <MenuItem key="1" onClick={() => {
                                setProcessFilterSelect(false)
                                onSelectFilterMode('regex')
                            }}>
                                <div>Regex</div>
                            </MenuItem>,
                        ],
                },
                {
                    header: 'Upload',
                    accessorKey: 'upload',
                    size: 60,
                    sortingFn: (a, b) => sortDataTransfer(a.getValue('upload'), b.getValue('upload')),
                    enableColumnFilter: false,
                },
                {
                    header: 'Download',
                    accessorKey: 'download',
                    size: 60,

                    sortingFn: (a, b) => sortDataTransfer(a.getValue('download'), b.getValue('download')),
                    enableColumnFilter: false,
                },
                {
                    header: 'Time',
                    accessorKey: 'time',
                    size: 100,
                    enableColumnFilter: false,
                    sortingFn: (a, b) => {
                        let aTime: number = a.original.start_time;
                        let bTime: number = b.original.start_time;
                        return aTime - bTime < 0 ? -1 : 1;
                    },
                },
            ],
            [processFilterSelect, processList]
        )
    ;
    const theme = useTheme();
    const table = useMaterialReactTable({
        columns,
        data: displays,
        // styles
        muiTableContainerProps: {
            sx: {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgb(55, 60, 67)' : 'rgb(218, 223, 228)',
                scrollbarWidth: "none",
                overscrollBehavior: "none"
            }
        },
        muiTableProps: {sx: {boxShadow: 'none'}},
        muiTableHeadRowProps: {sx: {boxShadow: 'none'}},
        muiTablePaperProps: {sx: {boxShadow: 'none'}},
        muiTableBodyProps: {
            sx: {}
        },
        // filter
        enableColumnFilterModes: true,
        columnFilterDisplayMode: 'popover',
        filterFns: {
            regex: regex_filter
        },
        localization: {
            filterContains: 'Select',
            filterRegex: 'Regex',
        },

        // configuration
        enableRowVirtualization: true,
        enablePagination: false,
        enableColumnOrdering: true,
        enableColumnDragging: false,
        enableColumnActions: false,
        enableFullScreenToggle: false,
        renderTopToolbarCustomActions: () => (
            <IconButton
                onClick={() => refresh()}><CachedOutlined/></IconButton>
        ),
        initialState: {
            showColumnFilters: true
        },
    })
    return (
        <React.Fragment>
            <AdminAppBar>
                <AdminToolbar title={'Connection'}/>
            </AdminAppBar>
            <MaterialReactTable table={table}/>
        </React.Fragment>
    )
}

export default ConnectionPage
