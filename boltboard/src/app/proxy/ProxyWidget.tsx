import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import {makeStyles} from '@mui/styles'
import {Button, Theme} from "@mui/material";
import {ProxyRpcData} from "./ProxyGroup";
import {useTheme} from "@mui/material/styles";

const proxyWidgetStyle = makeStyles({
    selected: {
        color: '#5580dd'
    }
})


export interface ProxyWidgetProps {
    proxy: ProxyRpcData,
    selected: boolean,

    onClickHandler(proxyName: string): void;
}

function colorizeLatency(theme: Theme, latency: string | null): string {
    if (!latency) return theme.palette.primary.main;
    const color = {
        'light':{
            'fast':'#009b3d',
            'average':'#bf9301',
            'slow':'#e06337',
            'failed':'#e03c32'
        },
        'dark':{
            'fast':'#639754',
            'average':'#ffd301',
            'slow':'#ef9367',
            'failed':'#d62f2f'
        }
    }
    if (latency === 'Failed') {
        return color[theme.palette.mode]['failed']
    } else {
        const ms = parseInt(latency.split(' ')[0])
        if (ms < 200) {
            return color[theme.palette.mode]['fast']
        } else if (ms < 300) {
            return color[theme.palette.mode]['average']
        } else {
            return color[theme.palette.mode]['slow']
        }
    }
}

const ProxyWidget = ({proxy, selected, onClickHandler}: ProxyWidgetProps) => {
    const theme = useTheme()
    const style = proxyWidgetStyle();
    return (
        <Card elevation={0}>
            <CardContent onClick={() => onClickHandler(proxy.name)} sx={{textAlign: "center", cursor: 'pointer'}}>
                <Typography gutterBottom component="div" variant='h3'
                            className={selected ? style.selected : undefined}>
                    {proxy.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    {proxy.proto}
                </Typography>
                <Typography variant="body2" color={colorizeLatency(theme, proxy.latency)} component="p">
                    {proxy.latency ? proxy.latency : ' '}
                </Typography>
            </CardContent>
        </Card>
    );
};
export default ProxyWidget
