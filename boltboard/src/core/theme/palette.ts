import {PaletteMode} from "@mui/material";

const palette = {
    grey: {
        "50": "#E7E9EB",
        "100": "#CFD8DC",
        "200": "#B0BEC5",
        "300": "#909FA8",
        "400": "#738592",
        "500": "#60707B",
        "600": "#505E6A",
        "700": "#363B3F",
        "800": "#2B3037",
        "900": "#202124",
    },
};

export const darkPalette = {
    ...palette,
    contrastThreshold: 4.5,
    mode: "dark" as PaletteMode,
    error: {
        main: "#FF8A65",
    },
    info: {
        main: "#4FC3F7",
    },
    primary: {
        main: "#64B5F6",
        contrastText: palette.grey[900],
    },
    secondary: {
        main: palette.grey[900],
    },
    success: {
        main: "#81C784",
    },
    warning: {
        main: "#FFD54F",
    },
    text: {
        primary: palette.grey[50],
        secondary: palette.grey[200],
        disabled: palette.grey[500],
    },
    divider: palette.grey[700],
    background: {
        paper: palette.grey[900],
        default: palette.grey[800],
    },
    action: {
        selectedOpacity: 0,
        selected: palette.grey[800],
    },
};

export const lightPalette = {
    ...palette,
    contrastThreshold: 3,
    mode: "light" as PaletteMode,
    error: {
        main: "#FF3D00",
    },
    info: {
        main: "#00B0FF",
    },
    primary: {
        main: "#2962FF",
        contrastText: "#FFF",
    },
    secondary: {
        main: "#FFF",
    },
    success: {
        main: "#00E676",
    },
    warning: {
        main: "#FFC400",
    },
    text: {
        primary: palette.grey[700],
        secondary: palette.grey[500],
        disabled: palette.grey[300],
    },
    divider: palette.grey[100],
    background: {
        paper: "#F0F0F0",
        default: palette.grey[50],
    },
    action: {
        selectedOpacity: 0,
        selected: palette.grey[50],
    },
};
