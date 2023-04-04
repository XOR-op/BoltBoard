import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import Grid from "@mui/material/Grid";
import React, {useCallback, useEffect, useState} from "react";
import {ConnectionEntryData} from "./ConnectionEntry";
import ConnectionGroup from "./ConnectionGroup";
import {api_call} from "../../misc/request";

export interface ConnectionPageProps {
    endpoint: string
}

function groupBy(list: Array<any>, key: string): Map<string, Array<any>> {
    const map = new Map();
    list.forEach(item => {
        let realKey = item[key];
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
        api_call('GET', '/connections').then(res => res.json()).then(list => setConnList(list))
            .catch(e => console.log(e))
    }, [])
    useEffect(() => {
        refresh()
    }, [refresh]);

    return (
        <React.Fragment>
            <AdminAppBar>
                <AdminToolbar title={'Connection'}/>
            </AdminAppBar>
            <Grid container>{
                Array.from(groupBy(connList, 'process')).sort(([a, av], [b, bv]) => {
                    if (a.toLowerCase() > b.toLowerCase()) return 1;
                    if (a.toLowerCase() < b.toLowerCase()) return -1;
                    return 0;
                }).map(([key, val]) => (
                    <ConnectionGroup key={key} name={key} entries={val.reverse()}/>
                ))
            }
            </Grid>
        </React.Fragment>
    )
}

export default ConnectionPage
