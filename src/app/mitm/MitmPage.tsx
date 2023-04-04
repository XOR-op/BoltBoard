import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import Grid from "@mui/material/Grid";
import React, {useCallback, useEffect, useState} from "react";
import {MitmEntryData} from "./MitmEntry";
import {useLocalStorage} from "../../core/hooks/useLocalStorage";
import MitmGroup from "./MitmGroup";
import {Box} from "@mui/material";
import {makeStyles} from "@mui/styles";

export interface MitmPageProps {
    endpoint: string
}

const scrollbarFixStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        height: '100%',
    },
    content: {
        flex: 1,
    },
});


const MitmPage = ({endpoint}: MitmPageProps) => {
    const [mitmList, setMitmList] = useState<Array<MitmEntryData>>([])
    const [authKey, _setAuthKey] = useLocalStorage<string | undefined>('authkey', undefined);

    const refresh = useCallback(() => {
        const headers: HeadersInit = {};
        if (authKey) {
            headers['api-key'] = authKey;
        }
        fetch(endpoint + '/eavesdrop/all', {
            method: 'GET',
            headers: headers,
        }).then(res => res.json()).then(list => setMitmList(list))
            .catch(e => console.log(e))
    }, [endpoint])
    useEffect(() => {
        refresh()
    }, [refresh]);

    return (
        <Box>
            <AdminAppBar>
                <AdminToolbar title={'MitM Packets'}/>
            </AdminAppBar>
            <Grid container>{
                <MitmGroup key='0' name='All' endpoint={endpoint} entries={mitmList.reverse()}/>
            }
            </Grid>
        </Box>
    )
}

export default MitmPage
