import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import {makeStyles} from '@mui/styles'
import {Button} from "@mui/material";
import {ProxyRpcData} from "./ProxyGroup";

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

const ProxyWidget = ({proxy, selected, onClickHandler}: ProxyWidgetProps) => {
    const style = proxyWidgetStyle();
    return (
        <Card elevation={0}>
            <Button fullWidth color='inherit' onClick={() => onClickHandler(proxy.name)}>
                <CardContent sx={{textAlign: "center"}}>
                    <Typography gutterBottom component="div" variant='h3'
                                className={selected ? style.selected : undefined}>
                        {proxy.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {proxy.proto}
                    </Typography>
                </CardContent>

            </Button>
        </Card>
    );
};
export default ProxyWidget
