import Grid from "@mui/material/Grid";
import React from "react";
import { useTranslation } from "react-i18next";
import AdminAppBar from "../components/AdminAppBar";
import AdminToolbar from "../components/AdminToolbar";
import OverviewWidget from "../widgets/OverviewWidget";

const overviewItems = [
  {
    unit: "dashboard.overview.visits",
    value: "20 700",
  },
  {
    unit: "dashboard.overview.sales",
    value: "$ 1 550",
  },
  {
    unit: "dashboard.overview.orders",
    value: "149",
  },
  {
    unit: "dashboard.overview.users",
    value: "657",
  },
];

const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <AdminAppBar>
        <AdminToolbar title={t("dashboard.title")} />
      </AdminAppBar>
      <Grid container spacing={2}>
        {overviewItems.map((item, index) => (
          <Grid key={index} item xs={6} md={3}>
            <OverviewWidget description={t(item.unit)} title={item.value} />
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );
};

export default Dashboard;
