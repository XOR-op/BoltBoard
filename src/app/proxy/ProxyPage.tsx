import React, {useCallback, useEffect, useState} from "react";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import Grid from "@mui/material/Grid";
import ProxyGroup, {GroupRpcData} from "./ProxyGroup";
import {useLocalStorage} from "../../core/hooks/useLocalStorage";

export interface ProxyPageProps {
    endpoint: string
}

const ProxyPage = ({endpoint}: ProxyPageProps) => {
    const [groupList, setGroupList] = useState<Array<GroupRpcData>>([]);
    const [authKey, _setAuthKey] = useLocalStorage<string | undefined>('authkey', undefined);
    const refresh = useCallback(() => {
        const headers: HeadersInit = {};
        if (authKey) {
            headers['api-key'] = authKey;
        }
        fetch(endpoint + '/proxies', {headers: headers}).then(res => res.json()).then(p => {
            setGroupList(p)
        }).catch(e => console.log(e))
    }, [endpoint]);
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
                    <ProxyGroup key={item.name} endpoint={endpoint} data={item}/>
                ))}
            </Grid>
        </React.Fragment>
    );
}

export default ProxyPage
