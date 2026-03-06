import React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Avatar,
  Rating,
} from "@mui/material";
import { Link } from "react-router-dom";
import { FormatQuote } from "@mui/icons-material";
import StatCard from "../components/StatCard";

const Home = () => {
  return (
    <Box>
      {/* ================= HERO SECTION ================= */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          minHeight: "75vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          color: "white",
          backgroundImage:
            "linear-gradient(135deg, rgba(15,32,39,0.9) 0%, rgba(32,58,67,0.92) 45%, rgba(44,83,100,0.95) 100%), url('https://images.pexels.com/photos/4109942/pexels-photo-4109942.jpeg?auto=compress&cs=tinysrgb&w=1600')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: "inset 0 0 120px rgba(0,0,0,0.55)",
        }}
      >
        <Container>
          <Grid container spacing={4} alignItems="center">
            {/* LEFT CONTENT */}
            <Grid item xs={12} md={7}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  mb: 2,
                  fontSize: { xs: "2.2rem", md: "3.5rem" },
                  lineHeight: 1.2,
                  letterSpacing: "1px",
                  textShadow: "0px 4px 20px rgba(0,0,0,0.4)",
                }}
              >
                NutHub – Dry Fruit Business
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  fontSize: { xs: "1.3rem", md: "1.9rem" },
                  textShadow: "0px 2px 10px rgba(0,0,0,0.3)",
                }}
              >
                Management System
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  opacity: 0.97,
                  fontSize: { xs: "0.95rem", md: "1.1rem" },
                  lineHeight: 1.8,
                }}
              >
                Manage premium dry fruit inventory, customer orders, staff and
                suppliers in one smart dashboard. NutHub helps wholesalers,
                retailers and students demonstrate a complete dry‑fruit
                business workflow – from browsing products to final invoice.
              </Typography>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  to="/products"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    borderRadius: 3,
                    background: "linear-gradient(45deg, #2193b0, #6dd5ed)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
                    },
                  }}
                >
                  Shop Now
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  to="/products"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    borderRadius: 3,
                    borderColor: "#6dd5ed",
                    color: "#ffffff",
                    borderWidth: 2,
                    "&:hover": {
                      borderWidth: 2,
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  Browse Products
                </Button>
              </Box>
            </Grid>

            {/* RIGHT STAT CARDS */}
            <Grid item xs={12} md={5}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <StatCard
                    label="Premium Quality"
                    value="100%"
                    subtext="Certified products"
                  />
                </Grid>
                <Grid item xs={6}>
                  <StatCard
                    label="Happy Customers"
                    value="500+"
                    subtext="Satisfied buyers"
                  />
                </Grid>
                <Grid item xs={6}>
                  <StatCard
                    label="Products"
                    value="50+"
                    subtext="Varieties available"
                  />
                </Grid>
                <Grid item xs={6}>
                  <StatCard
                    label="Fast Delivery"
                    value="24hrs"
                    subtext="Quick shipping"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>

        {/* Blue Glow Effect */}
        <Box
          sx={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: 300,
            height: 300,
            background: "rgba(0, 183, 255, 0.25)",
            borderRadius: "50%",
            filter: "blur(120px)",
          }}
        />

        {/* NEXT BUTTON */}
        <Box
          sx={{
            position: "absolute",
            bottom: 30,
            right: 40,
          }}
        >
          <Button
            component={Link}
            to="/products"
            sx={{
              px: 4,
              py: 1.3,
              fontSize: "1rem",
              fontWeight: 700,
              borderRadius: 4,
              color: "#fff",
              background: "linear-gradient(45deg, #2193b0, #6dd5ed)",
              boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
              transition: "0.3s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
              },
            }}
          >
            NEXT →
          </Button>
        </Box>
      </Box>

      {/* ================= FEATURES SECTION ================= */}
      <Container sx={{ py: 8 }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            fontWeight: 700,
            mb: 6,
            color: "#203a43",
          }}
        >
          Why Choose NutHub?
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              title: "🥜 Premium Quality Stock",
              text: "Handpicked dry fruits from trusted sources, with stock levels, min / max thresholds and low‑stock alerts managed automatically.",
            },
            {
              title: "📦 Smart Order Flow",
              text: "Customer cart, checkout and payment simulation with automatic stock deduction and inventory history for every sale.",
            },
            {
              title: "📊 Analytics for Admins",
              text: "Admin dashboard with order analytics, revenue charts and staff / supplier management to demonstrate real‑world business logic.",
            },
          ].map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "#ffffff",
                  boxShadow: 2,
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 5,
                  },
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, mb: 2, color: "#203a43" }}
                >
                  {item.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {item.text}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ================= MODULES / USE‑CASES SECTION ================= */}
      <Container sx={{ pb: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: "#203a43",
              }}
            >
              Built for Real Dry‑Fruit Workflows
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              NutHub covers all the key modules you typically describe in a
              project report or demo:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • <strong>Customer side</strong> – product browsing, wishlist,
              cart, OTP‑based login, order history and PDF invoices.
              <br />
              • <strong>Staff side</strong> – view all orders, update statuses,
              manage stock levels and see low‑stock alerts in the inventory
              dashboard.
              <br />
              • <strong>Admin side</strong> – add products, manage suppliers,
              create staff / admin users, and monitor analytics and revenue.
              <br />
              • <strong>Database layer</strong> – MongoDB collections for
              users, products, orders, suppliers, inventory history and contact
              messages.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: 4,
                minHeight: 260,
                backgroundImage:
                  "url('https://images.pexels.com/photos/137119/pexels-photo-137119.jpeg?auto=compress&cs=tinysrgb&w=1600')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* ================= TESTIMONIALS SECTION ================= */}
      <Box
        sx={{
          py: 8,
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
        }}
      >
        <Container>
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              mb: 2,
              color: "#203a43",
            }}
          >
            What Our Customers Say
          </Typography>
          <Typography
            variant="body1"
            sx={{ textAlign: "center", color: "text.secondary", mb: 5 }}
          >
            Trusted by hundreds of happy customers across India
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                name: "Priya Sharma",
                rating: 5,
                text: "Best quality almonds and cashews! The packaging was excellent and delivery was super fast. Will definitely order again.",
                avatar: "P",
              },
              {
                name: "Rajesh Patel",
                rating: 5,
                text: "I ordered in bulk for my shop and the prices were very competitive. The inventory management system made it easy to track everything.",
                avatar: "R",
              },
              {
                name: "Sneha Kulkarni",
                rating: 4,
                text: "Great variety of premium dry fruits. The walnut quality was outstanding. Loved the easy ordering process through the website.",
                avatar: "S",
              },
            ].map((review, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: "#ffffff",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    transition:
                      "transform 0.25s ease, box-shadow 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                    },
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <FormatQuote
                    sx={{
                      fontSize: 40,
                      color: "#2193b0",
                      opacity: 0.3,
                      mb: 1,
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{ flex: 1, mb: 2, fontStyle: "italic", color: "#555" }}
                  >
                    "{review.text}"
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mt: "auto",
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "#1e3c72",
                        width: 40,
                        height: 40,
                        fontWeight: 700,
                      }}
                    >
                      {review.avatar}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600 }}
                      >
                        {review.name}
                      </Typography>
                      <Rating
                        value={review.rating}
                        size="small"
                        readOnly
                      />
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
