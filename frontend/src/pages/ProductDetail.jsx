import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Chip,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  TextField,
  Rating,
  Avatar,
} from "@mui/material";
import {
  ShoppingCart,
  ArrowBack,
  Inventory,
} from "@mui/icons-material";
import { getProducts } from "../api/productApi";
import { getProductReviewsApi, createReviewApi } from "../api/reviewApi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import QuantitySelector from "../components/QuantitySelector";
import PageNavigator from "../components/PageNavigator";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProducts();
        const found = res.data.find((p) => p._id === id);
        if (!found) setError("Product not found");
        else setProduct(found);
      } catch {
        setError("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchReviews = async () => {
    try {
      const res = await getProductReviewsApi(id);
      setReviews(res.data.reviews || []);
      setAvgRating(res.data.averageRating || 0);
      setTotalReviews(res.data.totalReviews || 0);
    } catch {
      // silently fail — reviews are non-critical
    }
  };

  const handleSubmitReview = async () => {
    setReviewError("");
    setReviewSuccess("");
    if (!newRating || newRating < 1) {
      setReviewError("Please select a rating");
      return;
    }
    if (!newComment.trim()) {
      setReviewError("Please write a comment");
      return;
    }
    try {
      await createReviewApi({
        productId: id,
        rating: newRating,
        comment: newComment.trim(),
      });
      setReviewSuccess("Review submitted successfully!");
      setNewRating(0);
      setNewComment("");
      fetchReviews();
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review");
    }
  };

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      setSnackbarMessage("Product is out of stock!");
      setSnackbarOpen(true);
      return;
    }
    if (quantity > product.stock) {
      setSnackbarMessage(`Only ${product.stock} Kg available!`);
      setSnackbarOpen(true);
      return;
    }
    addToCart(product, quantity);
    setSnackbarMessage(`${quantity} Kg of ${product.name} added to cart!`);
    setSnackbarOpen(true);
  };

  const BASE_URL = process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL.replace("/api", "")
    : "http://localhost:8000";

  const imageUrl = product?.image?.startsWith("http")
    ? product.image
    : `${BASE_URL}/uploads/${product?.image}`;

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress size={60} color="primary" />
        <Typography sx={{ mt: 2 }}>Loading product...</Typography>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">{error || "Product not found"}</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/products")}
          sx={{ mt: 2 }}
        >
          Back to Products
        </Button>
      </Container>
    );
  }

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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/products")}
        sx={{ mb: 3 }}
      >
        Back to Products
      </Button>

      <Grid container spacing={4}>
        {/* Image */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
            <Box
              component="img"
              src={imageUrl}
              alt={product.name}
              sx={{
                width: "100%",
                height: "500px",
                objectFit: "cover",
                borderRadius: 2,
                bgcolor: "#f5f5f5",
              }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/500x500?text=No+Image";
              }}
            />
          </Paper>
        </Grid>

        {/* Details */}
        <Grid item xs={12} md={6}>
          <Box>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <Chip
                label={product.quality}
                color={getQualityColor(product.quality)}
                sx={{ fontWeight: 600 }}
              />
              {product.stock <= 10 && product.stock > 0 && (
                <Chip label="Low Stock" color="warning" sx={{ fontWeight: 600 }} />
              )}
              {product.stock === 0 && (
                <Chip label="Out of Stock" color="error" sx={{ fontWeight: 600 }} />
              )}
            </Box>

            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              {product.name}
            </Typography>

            <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
              <Chip label={product.category} variant="outlined" />
              <Chip label={product.variety} variant="outlined" />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Price */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Price per Kg
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: "#1e3c72",
                }}
              >
                ₹{product.pricePerKg}
              </Typography>
            </Box>

            {/* Stock */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <Inventory />
              <Typography>
                {product.stock > 0
                  ? `${product.stock} Kg available`
                  : "Out of stock"}
              </Typography>
            </Box>

            {product.description && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  Description
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {product.description}
                </Typography>
              </>
            )}

            <Divider sx={{ my: 3 }} />

            {product.stock > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ mb: 1, fontWeight: 600 }}>
                  Quantity (Kg)
                </Typography>
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  max={product.stock}
                  min={1}
                />
              </Box>
            )}

            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              sx={{
                bgcolor: "#1e3c72",
                fontWeight: 600,
                py: 1.5,
                borderRadius: 2,
                fontSize: "1.1rem",
                "&:hover": {
                  bgcolor: "#162c54",
                },
                "&:disabled": {
                  bgcolor: "#ccc",
                },
              }}
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Reviews Section */}
      <Paper sx={{ mt: 5, p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Customer Reviews
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <Rating value={avgRating} precision={0.1} readOnly />
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {avgRating} / 5
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Existing Reviews */}
        {reviews.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            No reviews yet. Be the first to review this product!
          </Typography>
        ) : (
          <Box sx={{ mb: 3 }}>
            {reviews.map((review) => (
              <Box
                key={review._id}
                sx={{
                  mb: 2,
                  pb: 2,
                  borderBottom: "1px solid #eee",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: "#1e3c72", fontSize: 14 }}>
                    {review.user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </Avatar>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {review.user?.name || "Anonymous"}
                  </Typography>
                  <Rating value={review.rating} size="small" readOnly />
                  <Typography variant="caption" color="text.secondary">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ ml: 5.5 }}>
                  {review.comment}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* Write a Review */}
        {user ? (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Write a Review
            </Typography>
            {reviewError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {reviewError}
              </Alert>
            )}
            {reviewSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {reviewSuccess}
              </Alert>
            )}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Your Rating
              </Typography>
              <Rating
                value={newRating}
                onChange={(e, val) => setNewRating(val)}
                size="large"
              />
            </Box>
            <TextField
              multiline
              rows={3}
              fullWidth
              placeholder="Share your experience with this product..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleSubmitReview}
              sx={{
                bgcolor: "#1e3c72",
                "&:hover": { bgcolor: "#162c54" },
              }}
            >
              Submit Review
            </Button>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Please <strong>login</strong> to write a review.
          </Typography>
        )}
      </Paper>

      <PageNavigator
        backTo="/products"
        backLabel="Back to Products"
        nextTo="/cart"
        nextLabel="Go to Cart"
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetail;
