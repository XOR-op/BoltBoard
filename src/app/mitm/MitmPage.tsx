import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import Grid from "@mui/material/Grid";
import React, {useCallback, useEffect, useState} from "react";
import {MitmEntryData} from "./MitmEntry";
import MitmGroup from "./MitmGroup";
import {Box} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {api_call} from "../../misc/request";

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


const MitmPage = () => {
    const [mitmList, setMitmList] = useState<Array<MitmEntryData>>([])

    const refresh = useCallback(() => {
        api_call('GET', '/eavesdrop/all')
            .then(res => res.json()).then(list => setMitmList(list))
            .catch(e => console.log(e))
    }, []);
    useEffect(() => {
        refresh()
    }, [refresh]);

    return (
        <Box>
            <AdminAppBar>
                <AdminToolbar title={'MitM Packets'}/>
            </AdminAppBar>
            <Grid container>{
                <MitmGroup key='0' name='All' entries={mitmList.reverse()}/>
            }
            </Grid>
        </Box>
    )
}

export default MitmPage
