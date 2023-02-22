import React, {useCallback, useEffect, useState} from "react";
import AdminAppBar from "../admin/components/AdminAppBar";
import AdminToolbar from "../admin/components/AdminToolbar";
import Grid from "@material-ui/core/Grid";
import ProxyGroup, {GroupRpcData, ProxyGroupProps} from "./ProxyGroup";

export interface ProxyPageProps {
    endpoint: string
}

const ProxyPage = ({endpoint}: ProxyPageProps) => {
    const [groupList, setGroupList] = useState<Array<GroupRpcData>>([]);
    const refresh = useCallback(() => {
        fetch(endpoint + '/groups').then(res => res.json()).then(p => {
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
                    <ProxyGroup endpoint={endpoint} data={item}/>
                ))}
            </Grid>
        </React.Fragment>
    );
}

export default ProxyPage
