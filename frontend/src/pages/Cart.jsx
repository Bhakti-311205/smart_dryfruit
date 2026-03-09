import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  IconButton,
  Divider,
  Chip,
} from "@mui/material";
import {
  Delete,
  Add,
  Remove,
  ShoppingCart,
  ArrowForward,
} from "@mui/icons-material";
import { useCart } from "../context/CartContext";
import PageNavigator from "../components/PageNavigator";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, total } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (id, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    } else {
      removeFromCart(id);
    }
  };

  if (cart.length === 0) {
    return (
      <Container sx={{ py: 8 }}>
        <Box sx={{ textAlign: "center" }}>
          <ShoppingCart sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Add some products to get started!
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/products")}
            sx={{
              bgcolor: "#6B3E26",
              "&:hover": { bgcolor: "#3E2723" },
            }}
          >
            Browse Products
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Shopping Cart
      </Typography>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          {cart.map((item) => {
            const itemTotal = (item.pricePerKg || 0) * (item.quantity || 0);
            return (
              <Paper
                key={item._id}
                sx={{
                  p: 3,
                  mb: 2,
                  borderRadius: 2,
                  boxShadow: 2,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <Box
                      component="img"
                      src={
                        item.image?.startsWith("http")
                          ? item.image
                          : `${process.env.REACT_APP_API_URL ? (process.env.REACT_APP_API_URL.endsWith("/api") ? process.env.REACT_APP_API_URL.slice(0, -4) : process.env.REACT_APP_API_URL) : "https://smart-dryfruit.onrender.com"}/uploads/${item.image}`
                      }
                      alt={item.name}
                      sx={{
                        width: "100%",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: 2,
                        bgcolor: "#f5f5f5",
                      }}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/150x120?text=No+Image";
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {item.name}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                      <Chip label={item.category} size="small" variant="outlined" />
                      <Chip label={item.variety} size="small" variant="outlined" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      ₹{item.pricePerKg} / Kg
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid #ddd",
                          borderRadius: 2,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleQuantityChange(item._id, item.quantity, -1)
                          }
                        >
                          <Remove fontSize="small" />
                        </IconButton>

                        <Typography
                          sx={{ px: 2, minWidth: "40px", textAlign: "center" }}
                        >
                          {item.quantity}
                        </Typography>

                        <IconButton
                          size="small"
                          onClick={() =>
                            handleQuantityChange(item._id, item.quantity, 1)
                          }
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      ₹{itemTotal.toFixed(2)}
                    </Typography>

                    <Button
                      startIcon={<Delete />}
                      onClick={() => removeFromCart(item._id)}
                      color="error"
                      size="small"
                    >
                      Remove
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            );
          })}
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: 3,
              position: "sticky",
              top: 20,
              background: "rgba(234, 219, 200, 0.95)",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Order Summary
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography>Subtotal</Typography>
                <Typography>₹{total.toFixed(2)}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography>Shipping</Typography>
                <Typography color="success.main">Free</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#6B3E26" }}
                >
                  ₹{total.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate("/checkout")}
              sx={{
                bgcolor: "#6B3E26",
                fontWeight: 600,
                py: 1.5,
                borderRadius: 2,
                "&:hover": {
                  bgcolor: "#3E2723",
                },
              }}
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <PageNavigator
        backTo="/products"
        backLabel="Back to Products"
        nextTo="/checkout"
        nextLabel="Proceed to Checkout"
      />
    </Container>
  );
};

export default Cart;
