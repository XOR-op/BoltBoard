import React, {useState} from 'react'
import {Collapse, Grid, IconButton} from "@mui/material";
import ProxyWidget from "./ProxyWidget";
import Typography from "@mui/material/Typography";
import {makeStyles} from '@mui/styles'
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {api_call} from "../../misc/request";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const proxyGroupStyle = makeStyles({
    titleBar: {
        marginTop: '16px',
        marginBottom: '16px',
    }
})

export interface ProxyRpcData {
    name: string,
    proto: string,
}

export interface GroupRpcData {
    list: ProxyRpcData[],
    name: string,
    selected: string
}

export interface ProxyGroupProps {
    key: string,
    data: GroupRpcData,
}

const ProxyGroup = ({data}: ProxyGroupProps) => {
    const style = proxyGroupStyle();
    const [currentProxy, setCurrentProxy] = useState(data.selected);
    const onClickHandler = (proxyName: string) => {
        if (proxyName !== currentProxy) {
            api_call('PUT', '/proxies/' + data.name,
                JSON.stringify({
                    'selected': proxyName
                })
            ).then(res => {
                if (res.status === 200) {
                    setCurrentProxy(proxyName)
                }
            }).catch(e => console.log(e))
        }
    };

    const [open, setOpen] = useState(true);

    const handleOpen = () => {
        setOpen(!open);
    };

    return (
        <React.Fragment>
            <Grid item xs={12} md={8}>
                <Card onClick={handleOpen}>
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h4" sx={{textAlign: 'left'}}>
                            {data.name}
                        </Typography>
                        <Typography variant="h5" sx={{textAlign: 'right'}}>
                            {currentProxy}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={8}>
                <Collapse in={open}>
                    <Grid container spacing={3} alignItems={'center'}>
                        {data.list.map((n, idx) =>
                            (<Grid item xs={6} sm={4} md={3} xl={2} key={idx}>
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
