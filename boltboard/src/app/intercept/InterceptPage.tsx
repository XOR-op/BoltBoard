import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import Grid from "@mui/material/Grid";
import React, {useCallback, useEffect, useState} from "react";
import {InterceptEntryData} from "./InterceptEntry";
import InterceptGroup from "./InterceptGroup";
import {Box} from "@mui/material";
import {apiGetAllInterceptions} from "../../misc/request";

const InterceptPage = () => {
    const [interceptEntryData, setInterceptEntryData] = useState<Array<InterceptEntryData>>([])

    const refresh = useCallback(() => {
        apiGetAllInterceptions().then(list => setInterceptEntryData(list))
            .catch(e => console.log(e))
    }, []);
    useEffect(() => {
        refresh()
    }, [refresh]);

    return (
        <Box>
            <AdminAppBar>
                <AdminToolbar title={'Intercepted Packets'}/>
            </AdminAppBar>
            <Grid container>{
                <InterceptGroup key='0' name='All' entries={interceptEntryData.reverse()}/>
            }
            </Grid>
        </Box>
    )
}

export default InterceptPage
