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

export function createAppTheme(direction: "ltr" | "rtl", mode: "light" | "dark" = "light") {
  const isDark = mode === "dark";

  return createTheme({
    direction,
    palette: {
      mode,
      primary: {
        main: isDark ? blue[400] : blue[600],
        light: isDark ? blue[300] : blue[400],
        dark: isDark ? blue[600] : blue[800],
        contrastText: "#fff",
      },
      secondary: {
        main: "#9c27b0",
        light: "#ba68c8",
        dark: "#7b1fa2",
      },
      success: {
        main: isDark ? "#6AE79C" : "#1AA251",
        light: "#6AE79C",
        dark: "#1AA251",
      },
      warning: {
        main: isDark ? "#FFE070" : "#DEA500",
        light: "#FFE070",
        dark: "#AB6800",
      },
      error: {
        main: isDark ? "#FF505F" : "#EB0014",
        light: "#FF505F",
        dark: "#C70011",
      },
      neutral: {
        main: isDark ? grey[400] : grey[600],
        light: isDark ? grey[300] : grey[400],
        dark: isDark ? grey[600] : grey[800],
      },
      background: {
        default: isDark ? "#0A1929" : "#fff",
        paper: isDark ? "#0F2744" : "#fff",
      },
      text: {
        primary: isDark ? "#E7EBF0" : grey[900],
        secondary: isDark ? grey[400] : grey[700],
      },
      divider: isDark ? alpha(grey[500], 0.2) : grey[200],
      gradients: {
        hero: isDark
          ? "linear-gradient(180deg, #0A1929, #0F2744)"
          : "linear-gradient(180deg, #CEE5FD, #fff)",
        heroText: isDark
          ? `linear-gradient(135deg, ${blue[300]} 0%, #ce93d8 100%)`
          : `linear-gradient(135deg, ${blue[600]} 0%, #9c27b0 100%)`,
        primaryButton: isDark
          ? `linear-gradient(135deg, ${blue[400]} 0%, ${blue[600]} 100%)`
          : `linear-gradient(135deg, ${blue[500]} 0%, ${blue[700]} 100%)`,
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
            borderColor: isDark ? alpha(grey[500], 0.3) : grey[300],
            "&:hover": {
              borderColor: isDark ? blue[300] : blue[400],
              backgroundColor: isDark ? alpha(blue[400], 0.08) : alpha(blue[50], 0.5),
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
            borderColor: isDark ? alpha(grey[500], 0.2) : grey[200],
            backgroundColor: isDark ? "#0F2744" : "#fff",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              borderColor: isDark ? alpha(grey[400], 0.3) : grey[300],
              boxShadow: isDark
                ? `0 4px 20px ${alpha("#000", 0.3)}`
                : `0 4px 20px ${alpha(grey[900], 0.08)}`,
            },
          },
        },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundColor: isDark ? alpha("#0A1929", 0.8) : alpha("#fff", 0.8),
            backdropFilter: "blur(20px)",
            color: isDark ? "#E7EBF0" : grey[900],
            borderBottom: `1px solid ${isDark ? alpha(grey[500], 0.2) : grey[200]}`,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? "#071A2F" : "#F8F8F8",
            borderRight: `1px solid ${isDark ? alpha(grey[500], 0.15) : grey[200]}`,
            borderLeft: `1px solid ${isDark ? alpha(grey[500], 0.15) : grey[200]}`,
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
              backgroundColor: alpha(isDark ? blue[400] : blue[600], 0.08),
              color: isDark ? blue[300] : blue[600],
              "&:hover": { backgroundColor: alpha(isDark ? blue[400] : blue[600], 0.12) },
              "& .MuiListItemIcon-root": { color: isDark ? blue[300] : blue[600] },
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: isDark ? alpha(grey[500], 0.15) : grey[200],
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: isDark ? alpha(grey[500], 0.15) : grey[200],
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? "#0F2744" : "#fff",
          },
        },
      },
    },
  });
}
