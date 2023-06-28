import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import {useState} from "react";
import {Outlet} from "react-router-dom";
import QueryWrapper from "../../core/components/QueryWrapper";
import {useSettings} from "../../core/contexts/SettingsProvider";
import AdminDrawer from "../components/AdminDrawer";

const AdminLayout = () => {
    const [settingsOpen, setSettingsOpen] = useState(false);

    const {collapsed, open, toggleDrawer, toggleMode} = useSettings();

    return (
        <Box sx={{display: "flex"}}>
            <AdminDrawer
                collapsed={collapsed}
                mobileOpen={open}
                onDrawerToggle={toggleDrawer}
                onModeToggle={toggleMode}
            />
            <Box component="main" sx={{flexGrow: 1, pb: 3, px: {xs: 3, sm: 6}}}>
                <Toolbar/>
                <QueryWrapper>
                    <Outlet/>
                </QueryWrapper>
            </Box>
        </Box>
    );
};

export default AdminLayout;
