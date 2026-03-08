import React from "react";
import { Container, Box, Typography, Grid, Paper, Chip } from "@mui/material";
import PageNavigator from "../components/PageNavigator";

const Offers = () => {
  const offers = [
    {
      title: "Festive Gift Box Offer",
      description: "Flat 10% off on premium mixed dry fruit gift boxes.",
      tag: "Gift Box",
    },
    {
      title: "Healthy Morning Combo",
      description: "Save on almonds, raisins and figs combo packs.",
      tag: "Combo",
    },
    {
      title: "Bulk Order Discount",
      description: "Special pricing for wholesale orders above 25 Kg.",
      tag: "Wholesale",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box className="sd-page-section">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 3,
            background:
              "linear-gradient(135deg, #6B3E26 0%, #8BC34A 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Special Offers
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Explore current offers and promotions on NutHub dry fruits. Ideal for
          exam demos and showcasing practical business logic.
        </Typography>

        <Grid container spacing={3}>
          {offers.map((offer, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 3,
                  bgcolor: "rgba(234, 219, 200, 0.95)",
                  height: "100%",
                }}
              >
                <Chip
                  label={offer.tag}
                  size="small"
                  color="primary"
                  sx={{ mb: 1 }}
                />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                  {offer.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {offer.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
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

export default Offers;
