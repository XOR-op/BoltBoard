import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import {makeStyles} from '@material-ui/styles'
import {Button} from "@material-ui/core";
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
        <Card>
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
