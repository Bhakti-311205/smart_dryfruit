import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, CircularProgress, Alert, Box } from "@mui/material";
import { getWishlistApi } from "../api/wishlistApi";
import ProductCard from "../components/ProductCard";

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const res = await getWishlistApi();
        setItems(res.data || []);
      } catch (err) {
        setError("Failed to load wishlist. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <Container sx={{ py: 5, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading wishlist...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          mb: 4,
          background: "linear-gradient(135deg, #1e3c72, #2193b0)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        My Wishlist
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {items.length === 0 ? (
        <Box>
          <Typography variant="body1" color="text.secondary">
            You have no items in your wishlist yet.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {items.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <ProductCard product={product} isFavorite />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Wishlist;

