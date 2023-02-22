import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

export interface ProxyWidgetProps{
    name: string,
    type: string,
    selected: boolean
}

const ProxyWidget = ({ name, type, selected }: ProxyWidgetProps) => {
    return (
        <Card>
            <CardContent sx={{ textAlign: "center" }}>
                <Typography gutterBottom component="div" variant='h3'>
                    {name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    {type}
                </Typography>
            </CardContent>
        </Card>
    );
};
export default ProxyWidget
