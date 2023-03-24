import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useTranslation } from "react-i18next";
import { Bar, BarChart, ResponsiveContainer } from "recharts";

type SalesWidgetProps = {
  value: number;
};

const SalesWidget = ({ value }: SalesWidgetProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const data = [
    {
      name: "Mon",
      uv: 4000,
    },
    {
      name: "Tue",
      uv: 3000,
    },
    {
      name: "Wed",
      uv: 2000,
    },
    {
      name: "Thu",
      uv: 2780,
    },
    {
      name: "Fri",
      uv: 1890,
    },
    {
      name: "Sat",
      uv: 2390,
    },
  ];

  return (
    <Card>
      <CardHeader title={t("dashboard.salesHistory.title")} />
      <CardContent>
        <ResponsiveContainer width="99%" height={124}>
          <BarChart
            width={150}
            height={40}
            data={data}
            margin={{
              right: 0,
              left: 0,
            }}
          >
            <Bar
              dataKey="uv"
              fill={theme.palette.primary.main}
              radius={[50, 50, 50, 50]}
            />
          </BarChart>
        </ResponsiveContainer>
        <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h2" component="div" marginBottom={1}>
              {value}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="div">
              {t("dashboard.salesHistory.unit")}
            </Typography>
          </Box>
          <TrendingUpIcon sx={{ color: "text.secondary" }} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default SalesWidget;
