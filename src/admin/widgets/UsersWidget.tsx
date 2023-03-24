import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material/styles";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PersonIcon from "@mui/icons-material/Person";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";

const users = [
  {
    id: "1",
    firstName: "Rhys",
    gender: "M",
    lastName: "Arriaga",
    role: "Admin",
  },
  {
    id: "2",
    firstName: "Laura",
    gender: "F",
    lastName: "Core",
    role: "Member",
  },
  {
    id: "3",
    firstName: "Joshua",
    gender: "M",
    lastName: "Jagger",
    role: "Member",
  },
];

const UsersWidget = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader title={t("dashboard.users.title")} />
      <CardContent>
        <List>
          {users.map((user) => (
            <ListItem disableGutters key={user.id}>
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${user.lastName} ${user.firstName}`}
                primaryTypographyProps={{
                  fontWeight: theme.typography.fontWeightMedium,
                }}
                secondary={user.role}
              />
              <ListItemSecondaryAction>
                <IconButton
                  aria-label="Go to user details"
                  component={RouterLink}
                  edge="end"
                  to={`/${process.env.PUBLIC_URL}/admin/user-management`}
                  size="large">
                  <ChevronRightIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default UsersWidget;
