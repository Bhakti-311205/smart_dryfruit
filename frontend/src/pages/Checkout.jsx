import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button } from "@mui/material";
import { useCart } from "../context/CartContext";
import PageNavigator from "../components/PageNavigator";

const Checkout = () => {
  const { items } = useCart();
  const navigate = useNavigate();

  // Redirect to payment page if cart has items
  useEffect(() => {
    if (items.length > 0) {
      navigate("/payment");
    }
  }, [items.length, navigate]);

  // Show empty cart message if no items
  if (!items.length) {
    return (
      <Container sx={{ py: 5, textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Your cart is empty.
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/products")}
          sx={{
            mt: 2,
            bgcolor: "#6B3E26",
            "&:hover": {
              bgcolor: "#3E2723",
            },
          }}
        >
          Browse Products
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 5, textAlign: "center" }}>
      <Typography>Redirecting to payment...</Typography>

      <PageNavigator
        backTo="/cart"
        backLabel="Back to Cart"
        nextTo="/payment"
        nextLabel="Go to Payment"
        sx={{ mt: 3, justifyContent: "center", gap: 2 }}
      />
    </Container>
  );
};

export default Checkout;
