import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import LinearProgress from "@mui/material/LinearProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

const teams = [
  {
    id: "1",
    color: "primary.main",
    name: "Marketing Team",
    progress: 75,
    value: 122,
  },
  {
    id: "2",
    color: "warning.main",
    name: "Operations Team",
    progress: 50,
    value: 82,
  },
  {
    id: "3",
    color: "error.main",
    name: "Sales Team",
    progress: 25,
    value: 39,
  },
  {
    id: "4",
    color: "text.secondary",
    name: "Research Team",
    progress: 10,
    value: 9,
  },
];

const TeamProgressWidget = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader title={t("dashboard.teams.title")} />
      <CardContent sx={{ px: 2 }}>
        <TableContainer>
          <Table
            aria-label="team progress table"
            size="small"
            sx={{
              "& td, & th": {
                border: 0,
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>{t("dashboard.teams.columns.team")}</TableCell>
                <TableCell>{t("dashboard.teams.columns.progress")}</TableCell>
                <TableCell align="center">
                  {t("dashboard.teams.columns.value")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell>
                    <Typography color="text.secondary" component="div">
                      {team.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box sx={{ width: "100%", mr: 3 }}>
                        <LinearProgress
                          aria-label={`${team.name} progress`}
                          color="inherit"
                          sx={{ color: team.color }}
                          value={team.progress}
                          variant="determinate"
                        />
                      </Box>
                      <Box sx={{ minWidth: 35 }}>
                        <Typography
                          component="span"
                          variant="h6"
                          color={team.color}
                        >{`${team.progress}%`}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">{team.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default TeamProgressWidget;
