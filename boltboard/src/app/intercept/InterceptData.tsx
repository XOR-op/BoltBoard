import React, {useEffect, useState} from "react";
import {Grid} from "@mui/material";
import Typography from "@mui/material/Typography";
import {InterceptPayloadBody, InterceptPayloadData} from "./InterceptEntry";
import {makeStyles} from "@mui/styles";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import pako from 'pako'
import brotliDecompress from 'brotli/decompress'


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
    body: InterceptPayloadBody
}

interface DataDisplayProps {
    className: string,
    compress: string,
    view: PayloadType,
    body: string,
    warning: string | undefined
}

type PayloadType = 'base64' | 'text' | 'img'

const DataDisplay = ({className, compress, view, body, warning}: DataDisplayProps) => {
    const [data, setData] = useState(body);
    useEffect(() => {
            if (warning) {
                setData(warning);
                return
            }
            if (view === "base64") {
                setData(body);
            } else if (view === "text") {
                try {
                    const rawData = window.atob(body);

                    let bytes = new Uint8Array(rawData.length);
                    for (let i = 0; i < rawData.length; i++) {
                        bytes[i] = rawData.charCodeAt(i);
                    }
                    if (compress === "gzip" || compress === 'deflate') {
                        setData(pako.inflate(bytes, {to: 'string'}))
                    } else if (compress === 'br') {
                        setData(new TextDecoder().decode(brotliDecompress(bytes)))
                    } else {
                        setData(rawData)
                    }
                } catch (e) {
                    console.log(e)
                    setData("Failed to decode text");
                }
            }
        }
        ,
        [view]
    )
    return (<Typography variant="body1" className={className}>
        {data}
    </Typography>)
}

const InterceptPacket = ({header, body}: PacketProps) => {
    const [view, setView] = useState<PayloadType>("base64");
    const [compress, setCompress] = useState("");
    const style = interceptDataStyle();

    const viewChangeHandler = (_: any, viewType: PayloadType) => {
        if (viewType === view) {
            return
        }
        setView(viewType);
    };

    useEffect(() => {
        for (const idx in header) {
            let l = header[idx].toLowerCase()
            if (l.startsWith('content-encoding:')) {
                setCompress(l.split(': ')[1])
            }
            if (l.startsWith('content-type:') && (l.includes('text') || l.includes('json') || l.includes('x-www-form-urlencoded'))) {
                viewChangeHandler(0, 'text')
            }
        }
    }, [header])


    return (
        <React.Fragment>
            <Grid item xs={12} sm={6}>
                <Typography variant="body1" className={style.header} component="div">
                    {header.map((l, idx) => (<div key={idx}>{l}</div>))}
                    {/*{header.join('\na\n')}*/}
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
                <DataDisplay className={style.body} compress={compress} view={view}
                             body={body.type == 'body' ? body.content as string : ''}
                             warning={body.type != 'body' ? (body.type == 'warning' ? body.content : '**EMPTY BODY**') : undefined}/>
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
