import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import {
  ShoppingCart,
  Visibility,
  Inventory,
  FavoriteBorder,
  Favorite,
} from "@mui/icons-material";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
  addToWishlistApi,
  removeFromWishlistApi,
} from "../api/wishlistApi";

const ProductCard = ({ product, isFavorite: initialFavorite }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isFavorite, setIsFavorite] = useState(Boolean(initialFavorite));

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product.stock <= 0) {
      setSnackbarMessage("Product is out of stock!");
      setSnackbarOpen(true);
      return;
    }
    addToCart(product, 1);
    setSnackbarMessage(`${product.name} added to cart!`);
    setSnackbarOpen(true);
  };

  const handleViewDetails = () => {
    navigate(`/product/${product._id}`);
  };

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    if (!user) {
      setSnackbarMessage("Please login to use wishlist.");
      setSnackbarOpen(true);
      return;
    }
    try {
      if (isFavorite) {
        await removeFromWishlistApi(product._id);
        setIsFavorite(false);
        setSnackbarMessage("Removed from wishlist");
      } else {
        await addToWishlistApi(product._id);
        setIsFavorite(true);
        setSnackbarMessage("Added to wishlist");
      }
      setSnackbarOpen(true);
    } catch {
      setSnackbarMessage("Failed to update wishlist");
      setSnackbarOpen(true);
    }
  };

  const getQualityColor = (quality) => {
    switch (quality?.toLowerCase()) {
      case "premium":
        return "success";
      case "standard":
        return "info";
      default:
        return "default";
    }
  };

  const BASE_URL = process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL.replace("/api", "")
    : "https://smart-dryfruit.onrender.com";

  const imageUrl = product.image?.startsWith("http")
    ? product.image
    : `${BASE_URL}/uploads/${product.image}`;

  return (
    <>
      <Card
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid rgba(15,23,42,0.06)",
          boxShadow: "0 4px 20px rgba(15,23,42,0.08)",
          transition: "transform 0.28s cubic-bezier(.4,0,.2,1), box-shadow 0.28s cubic-bezier(.4,0,.2,1)",
          "&:hover": {
            transform: "translateY(-6px) scale(1.015)",
            boxShadow: "0 16px 48px rgba(15,23,42,0.15)",
          },
          cursor: "pointer",
        }}
        onClick={handleViewDetails}
      >
        {/* Image */}
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            image={imageUrl}
            alt={product.name}
            sx={{
              aspectRatio: "16 / 10",
              width: "100%",
              objectFit: "cover",
              bgcolor: "#f5f5f5",
            }}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x220?text=No+Image";
            }}
          />

          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              display: "flex",
              gap: 1,
            }}
          >
            <IconButton
              size="small"
              onClick={handleToggleWishlist}
              sx={{
                bgcolor: alpha("#ffffff", 0.92),
                border: `1px solid ${alpha("#ffffff", 0.35)}`,
                "&:hover": {
                  bgcolor: "#ffffff",
                },
              }}
            >
              {isFavorite ? (
                <Favorite sx={{ color: "#e53935" }} />
              ) : (
                <FavoriteBorder sx={{ color: "#e53935" }} />
              )}
            </IconButton>
            <Chip
              label={product.quality}
              color={getQualityColor(product.quality)}
              size="small"
              sx={{ fontWeight: 600 }}
            />

            {product.stock <= 10 && product.stock > 0 && (
              <Chip
                label="Low Stock"
                color="warning"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            )}

            {product.stock === 0 && (
              <Chip
                label="Out of Stock"
                color="error"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
          {/* Product Name */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: "#1e293b",
              fontSize: "1.15rem",
              lineHeight: 1.3,
            }}
          >
            {product.name}
          </Typography>

          {/* Category & Variety */}
          <Box sx={{ display: "flex", gap: 1, mb: 1.5, flexWrap: "wrap" }}>
            <Chip
              label={product.category}
              size="small"
              variant="outlined"
              sx={{ fontSize: "0.75rem" }}
            />
            <Chip
              label={product.variety}
              size="small"
              variant="outlined"
              sx={{ fontSize: "0.75rem" }}
            />
          </Box>

          {/* Stock Info */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              mb: 1.5,
              color: "text.secondary",
            }}
          >
            <Inventory sx={{ fontSize: 16 }} />
            <Typography variant="body2">
              {product.stock > 0
                ? `${product.stock} Kg available`
                : "Out of stock"}
            </Typography>
          </Box>

          {/* Price */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: "#6B3E26",
                display: "inline",
              }}
            >
              ₹{product.pricePerKg}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: "inline", ml: 0.5 }}
            >
              / Kg
            </Typography>
          </Box>

          {/* Actions */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              sx={{
                bgcolor: "primary.main",
                fontWeight: 600,
                py: 1,
                borderRadius: 2,
                "&:hover": {
                  bgcolor: "primary.dark",
                },
                "&:disabled": {
                  bgcolor: "#ccc",
                },
              }}
            >
              Add to Cart
            </Button>

            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails();
              }}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.06),
                },
              }}
            >
              <Visibility />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={product.stock === 0 ? "warning" : "success"}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductCard;
