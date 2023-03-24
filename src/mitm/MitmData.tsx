import React, {useState} from "react";
import {Grid, TableRow} from "@mui/material";
import Typography from "@mui/material/Typography";
import {MitmPayloadData} from "./MitmEntry";
import {makeStyles} from "@mui/styles";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";


const mitmDataStyle = makeStyles({
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


export interface MitmDataProps {
    key: number
    data: MitmPayloadData
}

interface PacketProps {
    header: string[],
    body: string
}

const MitmPacket = ({header, body}: PacketProps) => {
    const [view, setView] = useState("base64");
    const [data, setData] = useState(body);
    const style = mitmDataStyle();

    const viewChangeHandler = (_:any, viewType: string) => {
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

const MitmData = ({data}: MitmDataProps) => {
    return (
        <React.Fragment>
            <Grid container spacing={2} item={true}>
                <MitmPacket header={data.req_header} body={data.req_body}/>
                <MitmPacket header={data.resp_header} body={data.resp_body}/>
            </Grid>
        </React.Fragment>
    )
}

export default MitmData
