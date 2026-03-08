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
import Logo from "../components/Logo";

const Home = () => {
  return (
    <Box>
      {/* floating fruit/leaf elements for interactivity */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        {[...Array(6)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: i % 2 === 0 ? 40 : 60,
              height: i % 2 === 0 ? 40 : 60,
              background: i % 3 === 0
                ? "rgba(139, 195, 74, 0.15)"
                : i % 3 === 1
                  ? "rgba(107, 62, 38, 0.15)"
                  : "rgba(215, 165, 120, 0.2)",
              borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              filter: "blur(2px)",
              animation: `float ${10 + Math.random() * 20}s linear infinite`,
              "@keyframes float": {
                "0%": { transform: "translateY(0) rotate(0deg)", opacity: 0 },
                "10%": { opacity: 1 },
                "90%": { opacity: 1 },
                "100%": { transform: "translateY(-100vh) rotate(360deg)", opacity: 0 },
              }
            }}
          />
        ))}
      </Box>

      {/* ================= HERO SECTION ================= */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          minHeight: "85vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          color: "white",
          backgroundImage:
            "linear-gradient(135deg, rgba(62,39,35,0.85) 0%, rgba(107,62,38,0.88) 45%, rgba(32,20,18,0.92) 100%), url('https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=1600')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: "inset 0 0 120px rgba(0,0,0,0.55)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.4) 100%)",
            zIndex: 0,
          }
        }}
      >
        <Container sx={{ position: "relative", zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            {/* LEFT CONTENT */}
            <Grid item xs={12} md={7}>
              <Box sx={{ mb: { xs: 2, md: 3 }, animation: "fadeInUp 0.8s ease-out" }}>
                <Logo sx={{ height: { xs: 50, md: 70 }, filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.5))" }} />
              </Box>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  mb: 2,
                  fontSize: { xs: "2.5rem", md: "4rem" },
                  lineHeight: 1.1,
                  letterSpacing: "1px",
                  textShadow: "0px 10px 30px rgba(0,0,0,0.5)",
                  animation: "fadeInUp 0.8s ease-out",
                  "@keyframes fadeInUp": {
                    from: { opacity: 0, transform: "translateY(30px)" },
                    to: { opacity: 1, transform: "translateY(0)" }
                  }
                }}
              >
                NutHub Premium <br />
                <span style={{ color: "#8BC34A" }}>Dry Fruits</span>
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  fontSize: { xs: "1.3rem", md: "1.9rem" },
                  textShadow: "0px 2px 10px rgba(0,0,0,0.3)",
                  opacity: 0.9,
                  animation: "fadeInUp 0.8s ease-out 0.2s both",
                }}
              >
                Nature's Best, Delivered to You
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  mb: 5,
                  opacity: 0.85,
                  fontSize: { xs: "1rem", md: "1.2rem" },
                  lineHeight: 1.8,
                  maxWidth: "600px",
                  animation: "fadeInUp 0.8s ease-out 0.4s both",
                }}
              >
                Experience the finest selection of handpicked nuts and dried fruits.
                Our smart management system ensures freshness from the farm
                to your doorstep. Elegant. Fresh. Healthy.
              </Typography>

              <Box sx={{
                display: "flex",
                gap: 3,
                flexWrap: "wrap",
                animation: "fadeInUp 0.8s ease-out 0.6s both",
              }}>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  to="/products"
                  sx={{
                    px: 6,
                    py: 2,
                    fontSize: "1.1rem",
                  }}
                >
                  Shop Best-Sellers
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  to="/products"
                  sx={{
                    px: 5,
                    py: 2,
                    fontSize: "1.1rem",
                    borderColor: "white",
                    color: "white",
                    "&:hover": {
                      borderColor: "#8BC34A",
                      color: "#8BC34A",
                      backgroundColor: "rgba(255,255,255,0.05)",
                    }
                  }}
                >
                  Browse Collection
                </Button>
              </Box>
            </Grid>

            {/* RIGHT STAT CARDS */}
            <Grid item xs={12} md={5} sx={{
              animation: "fadeInRight 1s ease-out 0.8s both",
              "@keyframes fadeInRight": {
                from: { opacity: 0, transform: "translateX(50px)" },
                to: { opacity: 1, transform: "translateX(0)" }
              }
            }}>
              <Grid container spacing={2.5}>
                <Grid item xs={6}>
                  <StatCard
                    label="Grade A Quality"
                    value="100%"
                    subtext="Handpicked Selection"
                  />
                </Grid>
                <Grid item xs={6}>
                  <StatCard
                    label="Happy Clients"
                    value="5000+"
                    subtext="Across the Globe"
                  />
                </Grid>
                <Grid item xs={6}>
                  <StatCard
                    label="Exotic Varieties"
                    value="120+"
                    subtext="Sourced Locally"
                  />
                </Grid>
                <Grid item xs={6}>
                  <StatCard
                    label="Express Delivery"
                    value="🚀"
                    subtext="Same Day Shipping"
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
            top: "10%",
            right: "-5%",
            width: 500,
            height: 500,
            background: "radial-gradient(circle, rgba(139,195,74,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
            zIndex: 1,
          }}
        />

        {/* NEXT BUTTON */}
        <Box
          sx={{
            position: "absolute",
            bottom: 40,
            right: { xs: 20, md: 60 },
            zIndex: 10,
          }}
        >
          <Button
            variant="contained"
            component={Link}
            to="/products"
            sx={{
              px: 4,
              py: 1.5,
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
              "&:hover": {
                background: "rgba(255,255,255,0.2)",
                transform: "translateX(10px)",
              }
            }}
          >
            EXPLORE CATALOG →
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
            color: "#3E2723",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2
          }}
        >
          Why Choose <Logo sx={{ height: 42, filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.1))" }} /> NutHub?
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
                  sx={{ fontWeight: 600, mb: 2, color: "#3E2723" }}
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
                color: "#3E2723",
              }}
            >
              Built for Real Dry‑Fruit Workflows
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Logo sx={{ height: 20, mr: 1 }} /> NutHub covers all the key modules you typically describe in a
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
          background: "linear-gradient(135deg, #F3ECE3 0%, #EADBC8 100%)",
        }}
      >
        <Container>
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              mb: 2,
              color: "#3E2723",
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
                      color: "#8BC34A",
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
                        bgcolor: "#6B3E26",
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
