import React from "react";
import { Container, Box, Typography, Grid, Paper } from "@mui/material";
import PageNavigator from "../components/PageNavigator";
import Logo from "../components/Logo";

const About = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box className="sd-page-section">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            color: "#6B3E26",
          }}
        >
          About <Logo sx={{ height: { xs: 32, md: 40 } }} />
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, display: "flex", alignItems: "center", flexWrap: "wrap" }}>
          <Logo sx={{ height: 22, mr: 1 }} /> – Dry Fruit Business Management System is a smart platform
          designed to manage premium dry fruit inventory, orders, suppliers and
          customers in one place. It is built for modern wholesale and retail
          dry fruit businesses.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 3,
                bgcolor: "rgba(234, 219, 200, 0.95)",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center" }}>
                What <Logo sx={{ height: 24, mx: 1 }} /> Manages
              </Typography>

              <Typography variant="body2" color="text.secondary">
                • Product catalog with premium dry fruits and mixes.
                <br />
                • Stock levels, low-stock alerts and inventory history.
                <br />
                • Customer orders, payments and statuses.
                <br />
                • Supplier information and purchase records.
                <br />
                • Role-based access for admins, staff and customers.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 3,
                bgcolor: "rgba(234, 219, 200, 0.95)",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Project Highlights
              </Typography>

              <Typography variant="body2" color="text.secondary">
                • MERN-based full stack project suitable for final-year
                demonstrations.
                <br />
                • Clean dashboards for admin, staff and customers.
                <br />
                • Interactive UI with animations and dry-fruit themed visuals.
                <br />
                • Realistic seed data with product images and order flows.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <PageNavigator
          backTo="/"
          backLabel="Back to Home"
          nextTo="/products"
          nextLabel="Browse Products"
        />
      </Box>
    </Container>
  );
};

export default About;
