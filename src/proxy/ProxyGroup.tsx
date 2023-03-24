import React, {useState} from 'react'
import {Collapse, Grid, IconButton} from "@mui/material";
import ProxyWidget from "./ProxyWidget";
import Typography from "@mui/material/Typography";
import {makeStyles} from '@mui/styles'
import {useLocalStorage} from "../core/hooks/useLocalStorage";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

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
    endpoint: string,
    data: GroupRpcData,
}

const ProxyGroup = ({endpoint, data}: ProxyGroupProps) => {
    const style = proxyGroupStyle();
    const [currentProxy, setCurrentProxy] = useState(data.selected);
    const [authKey, _setAuthKey] = useLocalStorage<string | undefined>('authkey', undefined);
    const onClickHandler = (proxyName: string) => {
        if (proxyName !== currentProxy) {
            const headers: HeadersInit = {'Content-Type': 'application/json'};
            if (authKey) {
                headers['api-key'] = authKey;
            }
            fetch(endpoint + '/proxies/' + data.name, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify({
                    'selected': proxyName
                })
            }).then(res => {
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
            <Typography gutterBottom component="h2" variant="h3" className={style.titleBar}>
                {data.name + ' [ ' + currentProxy + ' ]'}
                <IconButton onClick={handleOpen} disableFocusRipple={true} size='medium' edge={false}>
                    {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                </IconButton>
            </Typography>

            <Grid container spacing={4}>
                {data.list.map((n, idx) =>
                    (<Grid item xs={6} md={3} key={idx}>
                            <ProxyWidget proxy={n} selected={n.name === currentProxy}
                                         onClickHandler={onClickHandler}/>
                        </Grid>
                    ))}
            </Grid>
        </React.Fragment>
    );
}

export default ProxyGroup
