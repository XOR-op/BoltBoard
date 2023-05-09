import Grid from "@mui/material/Grid";
import React, {useCallback, useEffect, useState} from "react";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import useWebSocket from 'react-use-websocket';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {Box, Button} from "@mui/material";
import {api_call, websocket_url} from "../../misc/request";
import ProxyGroup, {GroupRpcData} from "../proxy/ProxyGroup";

interface TrafficData {
    upload: number,
    download: number,
    upload_speed: number
    download_speed: number
}

function bytes_to_string(data?: number) {
    data = data ? data : 0
    const KB = 1024;
    const MB = 1024 * KB;
    const GB = 1024 * MB;
    if (data < KB) {
        return data.toString() + " B"
    } else if (data < 10 * KB) {
        return (data / KB).toFixed(2) + " KB"
    } else if (data < MB) {
        return (data / KB).toFixed(1) + " KB"
    } else if (data < 10 * MB) {
        return (data / MB).toFixed(2) + " MB"
    } else if (data < GB) {
        return (data / MB).toFixed(1) + " MB"
    } else if (data < 10 * GB) {
        return (data / GB).toFixed(2) + " GB"
    } else {
        return (data / GB).toFixed(1) + " GB"
    }
}

export interface DashboardProps {
    endpoint: string
}

type DataWidgetProps = {
    title: string;
    data: string;
};

const DataWidget = ({data, title}: DataWidgetProps) => {
    return (
        <Card elevation={0}>
            <CardContent sx={{textAlign: "center"}}>
                <Typography gutterBottom component="div" variant="h3">
                    {data}
                </Typography>
                <Typography variant="body1" component="p">
                    {title}
                </Typography>
            </CardContent>
        </Card>
    );
};

type OptionState = "Loading..." | "ON" | "OFF"

const OptionWidget = () => {
    const [state, setState] = useState<OptionState>("Loading...")

    const onClickHandler = () => {
        const target = state !== "ON";
        if (state !== "Loading...") {
            api_call('PUT', '/tun', JSON.stringify({
                    enabled: target
                })
            ).then(res => {
                if (res.status === 200) {
                    setState(target ? "ON" : "OFF")
                }
            }).catch(e => console.log(e))
        }
    }

    useEffect(() => {
        api_call('GET', '/tun').then(res => res.json()).then(p => {
            if ("enabled" in p) {
                setState(p.enabled ? "ON" : "OFF")
            }
        }).catch(e => console.log(e))
    }, [])

    return (
        <Card onClick={onClickHandler} sx={{cursor: 'pointer'}}>
            <CardContent sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography variant='h4' sx={{textAlign: 'left'}}>
                    {"TUN"}
                </Typography>
                <Typography color="primary" variant="h5" sx={{textAlign: 'right'}}>
                    {state}
                </Typography>
            </CardContent>
        </Card>
    )
}


const Dashboard = () => {

    const [traffic, setTraffic] = useState<TrafficData>({upload: 0, download: 0, upload_speed: 0, download_speed: 0})

    const {lastMessage} = useWebSocket(websocket_url('/ws/traffic'))
    useEffect(() => {
        if (lastMessage != null) {
            const message = JSON.parse(lastMessage.data);
            if ('upload' in message && 'download' in message) {
                setTraffic({
                    upload: message.upload,
                    download: message.download,
                    upload_speed: message.upload_speed,
                    download_speed: message.download_speed
                });
            }
        }
    }, [lastMessage,])

    const [groupList, setGroupList] = useState<Array<GroupRpcData>>([]);
    const refresh = useCallback(() => {
        api_call('GET', '/proxies').then(res => res.json()).then(p => {
            setGroupList(p)
        }).catch(e => console.log(e))
    }, []);
    useEffect(() => {
        refresh()
    }, [refresh]);


    return (
        <React.Fragment>
            <AdminAppBar>
                <AdminToolbar title={"DashBoard"}/>
            </AdminAppBar>
            <Box>
                <Grid container spacing={{xs: 1, sm: 3}} alignItems='center' minWidth='100vw'>
                    {
                        [{
                            data: bytes_to_string(traffic.upload),
                            title: 'Upload'
                        }, {data: bytes_to_string(traffic.download), title: "Download"},
                            {data: bytes_to_string(traffic.upload_speed) + '/s', title: "Upload Speed"}
                            , {
                            data: bytes_to_string(traffic.download_speed) + '/s',
                            title: "Download Speed"
                        }].map(({data, title}) => (
                            <Grid item xs={3} md={2} xl={1.5}>
                                <DataWidget data={data} title={title}/>
                            </Grid>
                        ))
                    }
                    <Grid item xs={12} md={8}>
                        <OptionWidget/>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{my: '2rem'}}>
                <Grid container spacing={2}>
                    {groupList.map(item => (
                        <ProxyGroup key={item.name} data={item} refresh={refresh}/>
                    ))}
                </Grid>
            </Box>
        </React.Fragment>
    );
};

export default Dashboard;
