import React, {useState} from 'react'
import {Box, CardActionArea, CardActions, Collapse, Grid} from "@mui/material";
import ProxyWidget from "./ProxyWidget";
import Typography from "@mui/material/Typography";
import {apiSetProxyFor, apiSpeedtest} from "../../misc/request";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {Bolt, MoreHoriz} from "@mui/icons-material";

export interface ProxyRpcData {
    name: string,
    proto: string,
    latency: string | null
}

export interface GroupRpcData {
    list: ProxyRpcData[],
    name: string,
    selected: string
}

export interface ProxyGroupProps {
    key: string,
    data: GroupRpcData,

    refresh(): void;
}

const ProxyGroup = ({data, refresh}: ProxyGroupProps) => {
    const [isSpeedtesting, setIsSpeedtesting] = useState(false);
    const [currentProxy, setCurrentProxy] = useState(data.selected);
    const onClickHandler = (proxyName: string) => {
        if (proxyName !== currentProxy) {
            apiSetProxyFor(data.name, proxyName).then(ok => {
                if (ok) {
                    setCurrentProxy(proxyName)
                }
            }).catch(e => console.log(e))
        }
    };

    const onSpeedtestHandler = () => {
        setIsSpeedtesting(true)
        apiSpeedtest(data.name).then(_ => {
                setIsSpeedtesting(false)
                refresh()
            }
        ).catch(e => {
            setIsSpeedtesting(false)
            console.log(e)
        })
    }

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(!open);
    };

    return (
        <React.Fragment>
            <Grid item xs={12} sm={11.25} lg={10} xl={9}>
                <Box>
                    <Card sx={{display: 'flex', justifyContent: 'space-between'}}>
                        <CardActionArea onClick={handleOpen} sx={{cursor: 'pointer'}}>
                            <CardContent sx={{display: 'flex', justifyContent: 'space-between'}}>
                                <Typography variant="h4" sx={{textAlign: 'left'}}>
                                    {data.name}
                                </Typography>
                                <Typography variant="h5" sx={{textAlign: 'right'}}>
                                    {currentProxy}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions onClick={onSpeedtestHandler} sx={{mt: 'auto', cursor: 'pointer'}}>
                            {isSpeedtesting ? <MoreHoriz/> : <Bolt/>}
                        </CardActions>
                    </Card>
                </Box>
            </Grid>

            <Grid item xs={12} sm={11.25} lg={10} xl={9}>
                <Collapse in={open} timeout={'auto'} unmountOnExit>
                    <Grid container spacing={3} alignItems={'center'}>
                        {data.list.map((n, idx) =>
                            (<Grid item xs={6} sm={4} md={3} xl={2.4} key={idx}>
                                    <ProxyWidget proxy={n} selected={n.name === currentProxy}
                                                 onClickHandler={onClickHandler}/>
                                </Grid>
                            ))}

                    </Grid>
                </Collapse>
            </Grid>
        </React.Fragment>
    );
}

export default ProxyGroup
