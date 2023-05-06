import AppBar from "@mui/material/AppBar";
import {drawerCollapsedWidth, drawerWidth} from "../../core/config/layout";
import {useSettings} from "../../core/contexts/SettingsProvider";

type AdminAppBarProps = {
    children: React.ReactNode;
};

const AdminAppBar = ({children}: AdminAppBarProps) => {
    const {collapsed} = useSettings();
    const width = collapsed ? drawerCollapsedWidth : drawerWidth;

    return (
        <AppBar
            color="default"
            position="absolute"
            elevation={0}
            sx={{
                boxShadow: 'none',
                width: {sm: `calc(100% - ${width}px)`},
                marginLeft: {sm: width},
            }}
        >
            {children}
        </AppBar>
    );
};

export default AdminAppBar;
