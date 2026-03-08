import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import PageNavigator from "../components/PageNavigator";

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    variety: "",
    quality: "",
    pricePerKg: "",
    stock: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      Object.keys(form).forEach((key) => data.append(key, form[key]));
      if (image) data.append("image", image);

      const token = localStorage.getItem("accessToken");
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

      await axios.post(`${API_URL}/products`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSnackbar({
        open: true,
        message: "Product added successfully ✅",
        severity: "success",
      });

      setForm({
        name: "",
        category: "",
        variety: "",
        quality: "",
        pricePerKg: "",
        stock: "",
        description: "",
      });

      setImage(null);
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err.response?.data?.message ||
          "Failed to add product. Please try again.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          boxShadow: 4,
          bgcolor: "rgba(234, 219, 200, 0.95)",
        }}
      >
        {/* Blue Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 3,
            color: "#6B3E26",
          }}
        >
          Add Product
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Variety"
                name="variety"
                value={form.variety}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Quality"
                name="quality"
                value={form.quality}
                onChange={handleChange}
              >
                <MenuItem value="Premium">Premium</MenuItem>
                <MenuItem value="Standard">Standard</MenuItem>
                <MenuItem value="Economy">Economy</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price per Kg (₹)"
                name="pricePerKg"
                type="number"
                value={form.pricePerKg}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock (Kg)"
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                sx={{
                  borderColor: "#6B3E26",
                  color: "#6B3E26",
                  "&:hover": {
                    borderColor: "#3E2723",
                    backgroundColor: "rgba(30,60,114,0.05)",
                  },
                }}
              >
                {image ? "Change Image" : "Upload Image"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </Button>

              {image && (
                <Typography variant="caption" sx={{ ml: 2 }}>
                  {image.name}
                </Typography>
              )}
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, textAlign: "right" }}>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.2,
                fontWeight: 600,
                bgcolor: "#6B3E26",
                "&:hover": {
                  bgcolor: "#3E2723",
                },
              }}
            >
              {submitting ? "Saving..." : "Add Product"}
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <PageNavigator
        backTo="/admin/products"
        backLabel="Back to Manage Products"
        nextTo="/admin"
        nextLabel="Go to Admin Dashboard"
      />
    </Container>
  );
};

export default AddProduct;
