import { alpha } from "@mui/material/styles";

export function getDesignTokens() {
  const brand = {
    primary: "#1e3c72",
    secondary: "#2193b0",
  };

  return {
    palette: {
      mode: "light",
      primary: { main: brand.primary },
      secondary: { main: brand.secondary },
      background: {
        default: "#f4f8fb",
        paper: "#ffffff",
      },
      text: {
        primary: "#0f172a",
        secondary: "rgba(15,23,42,0.66)",
      },
      divider: "rgba(15,23,42,0.10)",
    },
    shape: { borderRadius: 14 },
    typography: {
      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
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
            backgroundImage:
              "radial-gradient(1000px 500px at 10% -10%, rgba(33,147,176,0.14), transparent 60%), radial-gradient(900px 400px at 90% 0%, rgba(30,60,114,0.12), transparent 55%)",
            backgroundAttachment: "fixed",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background:
              "linear-gradient(90deg, rgba(30,60,114,0.95), rgba(42,82,152,0.92), rgba(77,208,225,0.90))",
            backdropFilter: "blur(14px)",
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
            border: `1px solid rgba(15,23,42,0.08)`,
            boxShadow: "0 10px 30px rgba(15,23,42,0.10)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            textTransform: "none",
          },
          containedPrimary: {
            boxShadow: "0 10px 24px rgba(30,60,114,0.18)",
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            border: `1px solid rgba(15,23,42,0.08)`,
            overflow: "hidden",
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: alpha("#1e3c72", 0.04),
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            transition: "background-color 180ms ease",
            "&:hover": {
              backgroundColor: alpha("#1e3c72", 0.03),
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
