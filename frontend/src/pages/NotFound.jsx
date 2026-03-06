import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => (
  <Container
    sx={{
      py: 8,
      minHeight: "70vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Box
      sx={{
        textAlign: "center",
        p: 4,
        borderRadius: 3,
        boxShadow: 6,
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(230,245,255,0.95))",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          mb: 1,
          fontWeight: 800,
          background:
            "linear-gradient(135deg, #1e3c72, #2193b0)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        404
      </Typography>

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Page Not Found
      </Typography>

      <Button
        variant="contained"
        component={Link}
        to="/"
        sx={{
          mt: 1,
          borderRadius: 2,
          py: 1.1,
          px: 3,
          fontWeight: 600,
          background:
            "linear-gradient(90deg, #1e3c72, #2193b0)",
          "&:hover": {
            background:
              "linear-gradient(90deg, #162c54, #1e88a8)",
          },
        }}
      >
        Go Home
      </Button>
    </Box>
  </Container>
);

export default NotFound;
