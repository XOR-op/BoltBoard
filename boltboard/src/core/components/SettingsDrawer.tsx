import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import {useTranslation} from "react-i18next";
import {drawerWidth} from "../config/layout";
import {useSettings} from "../contexts/SettingsProvider";

type SettingsDrawerProps = {
    onDrawerToggle: () => void;
    open: boolean;
};

const SettingsDrawer = ({onDrawerToggle, open}: SettingsDrawerProps) => {
    const {
        changeCollapsed,
        changeMode,
        collapsed,
        mode,
    } = useSettings();
    const {t} = useTranslation();


    const handleModeChange = (_: any, mode: string) => {
        changeMode(mode);
    };

    const handleSidebarChange = (_: any, collapsed: boolean) => {
        changeCollapsed(collapsed);
    };

    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={onDrawerToggle}
            sx={{
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                },
            }}
            variant="temporary"
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                }}
            >
                <Typography variant="h5">{t("Settings")}</Typography>
                <IconButton color="inherit" onClick={onDrawerToggle} edge="end" size="large">
                    <CloseIcon/>
                </IconButton>
            </Box>
            <Box sx={{pl: 2, pr: 2}}>

                <Typography gutterBottom id="settings-mode" marginTop={3} variant="h6">
                    {"Mode"}
                </Typography>
                <ToggleButtonGroup
                    color="primary"
                    value={mode}
                    exclusive
                    fullWidth
                    onChange={handleModeChange}
                >
                    <ToggleButton value="light">
                        {"Light"}
                    </ToggleButton>
                    <ToggleButton value="dark">
                        {"Dark"}
                    </ToggleButton>
                </ToggleButtonGroup>

                <Typography
                    gutterBottom
                    id="settings-sidebar"
                    marginTop={3}
                    variant="h6"
                >
                    {"Sidebar"}
                </Typography>
                <ToggleButtonGroup
                    color="primary"
                    value={collapsed}
                    exclusive
                    fullWidth
                    onChange={handleSidebarChange}
                >
                    <ToggleButton value={true}>
                        {"Collapsed"}
                    </ToggleButton>
                    <ToggleButton value={false}>
                        {"Full"}
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
        </Drawer>
    );
};

export default SettingsDrawer;
