import React from "react";
import { Box, Typography, Grid, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: 6,
        py: 4,
        px: { xs: 3, md: 6 },
        background: "#3E2723",
        color: "#EADBC8",
        boxShadow: "0 -4px 18px rgba(0,0,0,0.15)",
        "& a": {
          transition: "color 0.2s ease"
        },
        "& a:hover": {
          color: "#8BC34A",
        }
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box sx={{ mb: 1.5, display: 'inline-block' }}>
            <Link to="/">
              <Logo sx={{ height: 48, filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.2))" }} />
            </Link>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.9, mb: 1.5 }}>
            Smart Dry Fruit Business Management System to manage products,
            orders, inventory and suppliers in one modern dashboard.
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Ideal for real businesses and final‑year project demonstrations.
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Quick Links
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <MuiLink component={Link} to="/products" color="inherit" underline="hover">
              Browse Products
            </MuiLink>
            <MuiLink component={Link} to="/offers" color="inherit" underline="hover">
              Offers & Combos
            </MuiLink>
            <MuiLink component={Link} to="/about" color="inherit" underline="hover">
              About NutHub
            </MuiLink>
            <MuiLink component={Link} to="/contact" color="inherit" underline="hover">
              Contact & Support
            </MuiLink>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Business Details
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Email: support@nuthub-demo.com
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Phone: +91‑9876543210
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
            Location: Demo Address, India
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.75 }}>
            Open to customisation: add your logo, address and branding easily
            in this footer for your college or client demo.
          </Typography>
        </Grid>
      </Grid>

      <Box
        sx={{
          mt: 3,
          pt: 2,
          borderTop: "1px solid rgba(255,255,255,0.15)",
          textAlign: "center",
        }}
      >
        <Typography variant="body2" sx={{ opacity: 0.85 }}>
          © {year} Smart Dry Fruit Business Management System · Built with MERN
          stack
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
