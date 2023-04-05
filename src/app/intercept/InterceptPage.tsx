import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import Grid from "@mui/material/Grid";
import React, {useCallback, useEffect, useState} from "react";
import {InterceptEntryData} from "./InterceptEntry";
import InterceptGroup from "./InterceptGroup";
import {Box} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {api_call} from "../../misc/request";


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


const InterceptPage = () => {
    const [interceptEntryData, setInterceptEntryData] = useState<Array<InterceptEntryData>>([])

    const refresh = useCallback(() => {
        api_call('GET', '/intercept/all')
            .then(res => res.json()).then(list => setInterceptEntryData(list))
            .catch(e => console.log(e))
    }, []);
    useEffect(() => {
        refresh()
    }, [refresh]);

    return (
        <Box>
            <AdminAppBar>
                <AdminToolbar title={'Intercept Packets'}/>
            </AdminAppBar>
            <Grid container>{
                <InterceptGroup key='0' name='All' entries={interceptEntryData.reverse()}/>
            }
            </Grid>
        </Box>
    )
}

export default InterceptPage
