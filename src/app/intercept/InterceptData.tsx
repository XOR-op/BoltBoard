import React, {useCallback, useEffect, useState} from "react";
import {Grid, TableRow} from "@mui/material";
import Typography from "@mui/material/Typography";
import {InterceptPayloadData} from "./InterceptEntry";
import {makeStyles} from "@mui/styles";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";


const interceptDataStyle = makeStyles({
    header: {
        height: '300px',
        overflowY: 'scroll',
        wordBreak: 'break-word'
    },

    body: {
        maxHeight: '500px',
        overflowY: 'scroll',
        wordBreak: 'break-all'
    }
})


export interface InterceptDataProps {
    key: number
    data: InterceptPayloadData
}

interface PacketProps {
    header: string[],
    body: string
}

type PayloadType = 'base64' | 'text' | 'img'

const InterceptPacket = ({header, body}: PacketProps) => {
    const [view, setView] = useState<PayloadType>("base64");
    const [data, setData] = useState(body);
    const style = interceptDataStyle();

    const viewChangeHandler = (_: any, viewType: PayloadType) => {
        if (viewType === view) {
            return
        }
        setView(viewType);
        if (viewType === "base64") {
            setData(body);
        } else if (viewType === "text") {
            let decoded = atob(body);
            setData(decoded);
        }
    };

    useEffect(() => {
        for (const idx in header) {
            let l = header[idx].toLowerCase()
            if (l.startsWith('content-type:')) {
                if (l.includes('text')) {
                    viewChangeHandler(0, 'text')
                }
                break
            }
        }
    }, [header])

    return (
        <React.Fragment>
            <Grid item xs={12} sm={6}>
                <Typography variant="body1" className={style.header}>
                    {header.map(l => (<TableRow>{l}</TableRow>))}
                </Typography>
                <br/>
                <ToggleButtonGroup
                    color="primary"
                    value={view}
                    exclusive
                    fullWidth
                    onChange={viewChangeHandler}
                >
                    <ToggleButton value="text">
                        Text
                    </ToggleButton>
                    <ToggleButton value="base64">
                        Base64
                    </ToggleButton>
                </ToggleButtonGroup>
                <br/>
                <Typography variant="body1" className={style.body}>
                    {data}
                </Typography>
            </Grid>
        </React.Fragment>
    )
}

const InterceptData = ({data}: InterceptDataProps) => {
    return (
        <React.Fragment>
            <Grid container spacing={2} item={true}>
                <InterceptPacket header={data.req_header} body={data.req_body}/>
                <InterceptPacket header={data.resp_header} body={data.resp_body}/>
            </Grid>
        </React.Fragment>
    )
}

export default InterceptData
