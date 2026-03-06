import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Fade,
} from "@mui/material";
import { Search, FilterList } from "@mui/icons-material";
import { getProducts } from "../api/productApi";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import PageNavigator from "../components/PageNavigator";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVariety, setSelectedVariety] = useState("all");
  const [selectedQuality, setSelectedQuality] = useState("all");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await getProducts();
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (err) {
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = ["all", ...new Set(products.map((p) => p.category))];
  const varieties = ["all", ...new Set(products.map((p) => p.variety))];
  const qualities = ["all", ...new Set(products.map((p) => p.quality))];

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.variety.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (selectedVariety !== "all") {
      filtered = filtered.filter((p) => p.variety === selectedVariety);
    }

    if (selectedQuality !== "all") {
      filtered = filtered.filter((p) => p.quality === selectedQuality);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, selectedVariety, selectedQuality]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedVariety("all");
    setSelectedQuality("all");
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3, md: 4 }, py: 4 }}>
        <ProductSkeleton count={6} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3, md: 4 }, py: 4 }}>
      <Box
        sx={{
          position: "relative",
          borderRadius: 4,
          overflow: "hidden",
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 4 },
          boxShadow: 4,
          bgcolor: "rgba(255,255,255,0.97)",
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 1,
              background:
                "linear-gradient(135deg, #1e3c72, #2193b0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Our Products
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explore our premium collection of dry fruits
          </Typography>
        </Box>

        {/* Filters Section */}
        <Box
          sx={{
            mb: 4,
            p: 3,
            bgcolor: "rgba(255,255,255,0.98)",
            borderRadius: 3,
            boxShadow: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <FilterList sx={{ mr: 1, color: "#1e3c72" }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filters
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Search sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
                sx={{ bgcolor: "white", borderRadius: 2 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Category"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Variety</InputLabel>
                <Select
                  value={selectedVariety}
                  onChange={(e) => setSelectedVariety(e.target.value)}
                  label="Variety"
                >
                  {varieties.map((varie) => (
                    <MenuItem key={varie} value={varie}>
                      {varie === "all" ? "All Varieties" : varie}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Quality</InputLabel>
                <Select
                  value={selectedQuality}
                  onChange={(e) => setSelectedQuality(e.target.value)}
                  label="Quality"
                >
                  {qualities.map((qual) => (
                    <MenuItem key={qual} value={qual}>
                      {qual === "all" ? "All Qualities" : qual}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Box
                onClick={clearFilters}
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#1e3c72",
                  color: "white",
                  borderRadius: 2,
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "#162c54",
                  },
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Clear Filters
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Products Grid */}
        <Grid container spacing={3} alignItems="stretch">
          {filteredProducts.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} key={product._id} sx={{ display: "flex" }}>
              <Fade
                in
                timeout={400}
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <Box sx={{ display: "flex", width: "100%" }}>
                  <ProductCard product={product} />
                </Box>
              </Fade>
            </Grid>
          ))}
        </Grid>

        <PageNavigator
          backTo="/"
          backLabel="Back to Home"
          nextTo="/cart"
          nextLabel="Go to Cart"
        />
      </Box>
    </Box>
  );
};

export default Products;
