import { alpha } from "@mui/material/styles";

export function getDesignTokens() {
  const brand = {
    primary: "#6B3E26",   // Walnut Brown
    secondary: "#8BC34A", // Pistachio Green
  };

  return {
    palette: {
      mode: "light",
      primary: { main: brand.primary },
      secondary: { main: brand.secondary },
      background: {
        default: "#F3ECE3", // Cream Sand
        paper: "#EADBC8",   // Almond Beige
      },
      text: {
        primary: "#3E2723",
        secondary: "rgba(62,39,35,0.76)",
      },
      divider: "rgba(107,62,38,0.15)",
    },
    shape: { borderRadius: 14 },
    typography: {
      fontFamily: "'Poppins', 'Inter', 'Segoe UI', 'Roboto', sans-serif",
      h1: { fontWeight: 800 },
      h2: { fontWeight: 800 },
      h3: { fontWeight: 800 },
      h4: { fontWeight: 800 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      button: { fontWeight: 650 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage: "none",
            backgroundAttachment: "fixed",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: "#6B3E26",
            color: "#EADBC8",
            backdropFilter: "none",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            backgroundColor: "#EADBC8",
            border: `1px solid rgba(107,62,38,0.08)`,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "50px", // Pill shape
            textTransform: "none",
            fontWeight: 700,
            padding: "10px 24px",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            },
            "&:active": {
              transform: "translateY(0)",
            },
          },
          containedPrimary: {
            background: "#6B3E26",
            color: "#EADBC8",
            boxShadow: "0 4px 15px rgba(107,62,38,0.25)",
            "&:hover": {
              background: "#8BC34A",
              color: "#3E2723",
              boxShadow: "0 6px 20px rgba(139,195,74,0.35)",
            },
          },
          outlinedPrimary: {
            borderWidth: "2px",
            borderColor: "#6B3E26",
            color: "#6B3E26",
            "&:hover": {
              borderWidth: "2px",
              backgroundColor: alpha("#6B3E26", 0.05),
              borderColor: "#8BC34A",
              color: "#3E2723",
            },
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            backgroundColor: "#EADBC8",
            border: `1px solid rgba(107,62,38,0.15)`,
            overflow: "hidden",
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: alpha("#6B3E26", 0.08),
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            transition: "background-color 180ms ease",
            "&:hover": {
              backgroundColor: alpha("#6B3E26", 0.04),
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 700,
            letterSpacing: 0.2,
          },
        },
      },
    },
  };
}
