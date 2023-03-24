import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

type OverviewWidgetProps = {
  color?: "primary" | "warning" | "error";
  description: string;
  title: string;
};

const OverviewWidget = ({ description, title }: OverviewWidgetProps) => {
  return (
    <Card>
      <CardContent sx={{ textAlign: "center" }}>
        <Typography gutterBottom component="div" variant="h3">
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default OverviewWidget;
