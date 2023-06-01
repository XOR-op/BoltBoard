import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import ViewStreamIcon from "@mui/icons-material/ViewStream";
import BarChartIcon from "@mui/icons-material/BarChart";
import {NavLink} from "react-router-dom";
import Logo from "../../core/components/Logo";
import {drawerCollapsedWidth, drawerWidth} from "../../core/config/layout";
import {Anchor, DarkMode, LightMode, Notes} from "@mui/icons-material";
import {useTheme} from "@mui/material/styles";

type AdminDrawerProps = {
    collapsed: boolean;
    mobileOpen: boolean;
    onDrawerToggle: () => void;
    onModeToggle: () => void;
};

export const menuItems = [
    {
        icon: BarChartIcon,
        key: "Dashboard",
        path: "/admin",
    },
    {
        icon: ViewStreamIcon,
        key: "Connection",
        path: "/admin/connection",
    },
    {
        icon: Anchor,
        key: "Intercept",
        path: "/admin/intercept",
    },
    {
        icon: Notes,
        key: "Logs",
        path: "/admin/logs",
    },
];

const AdminDrawer = ({
                         collapsed,
                         mobileOpen,
                         onDrawerToggle,
                         onModeToggle,
                     }: AdminDrawerProps) => {

    const width = collapsed ? drawerCollapsedWidth : drawerWidth;

    const theme = useTheme();

    const drawer = (
        <Box sx={{display: "flex", flexDirection: "column", minHeight: "100%"}}>
            <Logo sx={{display: "flex", p: 4}}/>
            <List component="nav" sx={{px: 2}}>
                {menuItems.map((item) => (
                    <ListItem
                        button
                        component={NavLink}
                        key={item.path}
                        activeclassname="Mui-selected"
                        end={true}
                        to={`${item.path}`}
                    >
                        <ListItemAvatar>
                            <Avatar sx={{color: "inherit", bgcolor: "transparent"}}>
                                <item.icon/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={item.key}
                            sx={{
                                display: collapsed ? "none" : "block",
                            }}
                        />
                    </ListItem>
                ))}
            </List>
            <Box sx={{flexGrow: 1}}/>
            <List component="nav" sx={{p: 2}}>
                <ListItem button onClick={onModeToggle}>
                    <ListItemAvatar>
                        <Avatar>
                            {theme.palette.mode === "light" ? <LightMode/> : <DarkMode/>}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={theme.palette.mode === "light" ? "Light Mode" : "Dark Mode"}
                        sx={{
                            display: collapsed ? "none" : "block",
                        }}
                    />
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box
            aria-label="Admin drawer"
            component="nav"
            sx={{
                width: {sm: width},
                flexShrink: {sm: 0},
            }}
        >
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: {xs: "block", sm: "none"},
                    "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: width,
                    },
                }}
            >
                {drawer}
            </Drawer>
            <Drawer
                variant="permanent"
                open
                sx={{
                    display: {xs: "none", sm: "block"},
                    "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: width,
                    },
                }}
            >
                {drawer}
            </Drawer>
        </Box>
    );
};

export default AdminDrawer;
