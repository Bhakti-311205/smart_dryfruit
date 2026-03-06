import React, { useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getDesignTokens } from "../theme/theme";

export const ColorModeProvider = ({ children }) => {
  const theme = useMemo(() => createTheme(getDesignTokens()), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
