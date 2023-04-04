import React, {useCallback, useEffect, useState} from "react";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import Grid from "@mui/material/Grid";
import ProxyGroup, {GroupRpcData} from "./ProxyGroup";
import {api_call} from "../../misc/request";

const ProxyPage = () => {
    const [groupList, setGroupList] = useState<Array<GroupRpcData>>([]);
    const refresh = useCallback(() => {
        api_call('GET', '/proxies').then(res => res.json()).then(p => {
            setGroupList(p)
        }).catch(e => console.log(e))
    }, []);
    useEffect(() => {
        refresh()
    }, [refresh]);

    return (
        <React.Fragment>
            <AdminAppBar>
                <AdminToolbar title={'Proxy'}/>
            </AdminAppBar>
            <Grid container>
                {groupList.map(item => (
                    <ProxyGroup key={item.name} data={item}/>
                ))}
            </Grid>
        </React.Fragment>
    );
}

export default ProxyPage
