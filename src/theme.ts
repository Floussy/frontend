import { createTheme, alpha } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    neutral: Palette["primary"];
    gradients: {
      hero: string;
      heroText: string;
      primaryButton: string;
    };
  }
  interface PaletteOptions {
    neutral?: PaletteOptions["primary"];
    gradients?: {
      hero: string;
      heroText: string;
      primaryButton: string;
    };
  }
}

const blue = {
  50: "#F0F7FF",
  100: "#C2E0FF",
  200: "#99CCF3",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0059B2",
  800: "#004C99",
  900: "#003A75",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

export function createAppTheme(direction: "ltr" | "rtl") {
  return createTheme({
    direction,
    palette: {
      primary: {
        main: blue[600],
        light: blue[400],
        dark: blue[800],
        contrastText: "#fff",
      },
      secondary: {
        main: "#9c27b0",
        light: "#ba68c8",
        dark: "#7b1fa2",
      },
      success: {
        main: "#1AA251",
        light: "#6AE79C",
        dark: "#1AA251",
      },
      warning: {
        main: "#DEA500",
        light: "#FFE070",
        dark: "#AB6800",
      },
      error: {
        main: "#EB0014",
        light: "#FF505F",
        dark: "#C70011",
      },
      neutral: {
        main: grey[600],
        light: grey[400],
        dark: grey[800],
      },
      background: {
        default: "#fff",
        paper: "#fff",
      },
      text: {
        primary: grey[900],
        secondary: grey[700],
      },
      divider: grey[200],
      gradients: {
        hero: "linear-gradient(180deg, #CEE5FD, #fff)",
        heroText: `linear-gradient(135deg, ${blue[600]} 0%, #9c27b0 100%)`,
        primaryButton: `linear-gradient(135deg, ${blue[500]} 0%, ${blue[700]} 100%)`,
      },
    },
    typography: {
      fontFamily:
        direction === "rtl"
          ? '"Cairo", "IBM Plex Sans Arabic", sans-serif'
          : '"Inter", "IBM Plex Sans", system-ui, -apple-system, sans-serif',
      h1: {
        fontWeight: 800,
        fontSize: "clamp(2.5rem, 1.5rem + 3.3333vw, 4rem)",
        lineHeight: 1.1,
        letterSpacing: "-0.02em",
      },
      h2: {
        fontWeight: 700,
        fontSize: "clamp(1.75rem, 1.25rem + 1.6667vw, 2.75rem)",
        lineHeight: 1.2,
        letterSpacing: "-0.01em",
      },
      h3: {
        fontWeight: 700,
        fontSize: "clamp(1.375rem, 1.125rem + 0.8333vw, 1.75rem)",
        lineHeight: 1.3,
      },
      h4: { fontWeight: 600, fontSize: "1.5rem", lineHeight: 1.4 },
      h5: { fontWeight: 600, fontSize: "1.25rem", lineHeight: 1.5 },
      h6: { fontWeight: 600, fontSize: "1.125rem", lineHeight: 1.5 },
      subtitle1: { fontSize: "1.125rem", fontWeight: 500, lineHeight: 1.6 },
      body1: { fontSize: "1rem", lineHeight: 1.7 },
      body2: { fontSize: "0.875rem", lineHeight: 1.6 },
      button: { textTransform: "none", fontWeight: 600 },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: "10px 24px",
            fontSize: "0.9375rem",
          },
          sizeLarge: {
            padding: "14px 32px",
            fontSize: "1rem",
          },
          contained: {
            boxShadow: "none",
            "&:hover": {
              boxShadow: `0 2px 12px ${alpha(blue[600], 0.3)}`,
            },
          },
          outlined: {
            borderColor: grey[300],
            "&:hover": {
              borderColor: blue[400],
              backgroundColor: alpha(blue[50], 0.5),
            },
          },
        },
      },
      MuiTextField: {
        defaultProps: { variant: "outlined", size: "small" },
      },
      MuiCard: {
        defaultProps: { variant: "outlined" },
        styleOverrides: {
          root: {
            borderRadius: 16,
            borderColor: grey[200],
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              borderColor: grey[300],
              boxShadow: `0 4px 20px ${alpha(grey[900], 0.08)}`,
            },
          },
        },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundColor: alpha("#fff", 0.8),
            backdropFilter: "blur(20px)",
            color: grey[900],
            borderBottom: `1px solid ${grey[200]}`,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: `1px solid ${grey[200]}`,
            borderLeft: `1px solid ${grey[200]}`,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            marginInline: 8,
            marginBlock: 2,
            "&.Mui-selected": {
              backgroundColor: alpha(blue[600], 0.08),
              color: blue[600],
              "&:hover": { backgroundColor: alpha(blue[600], 0.12) },
              "& .MuiListItemIcon-root": { color: blue[600] },
            },
          },
        },
      },
    },
  });
}
