import React, {useState} from "react";
import { Grid, TableRow} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {MitmPayloadData} from "./MitmEntry";
import {makeStyles} from "@material-ui/styles";


const mitmDataStyle = makeStyles({
    header: {
        maxHeight: '300px',
        overflowY: 'scroll',
        wordBreak: 'break-all'
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
    const style = mitmDataStyle();
    return (
        <React.Fragment>
            <Grid item xs={12} sm={6}>
                <Typography variant="body1" className={style.header}>
                    {header.map(l => (<TableRow>{l}</TableRow>))}
                </Typography>
                <br/>
                <br/>
                <Typography variant="body1" className={style.body}>
                    {body}
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
