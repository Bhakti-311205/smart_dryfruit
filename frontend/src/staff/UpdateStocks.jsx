import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  Inventory,
  Warning,
  CheckCircle,
  TrendingUp,
} from "@mui/icons-material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  getInventoryApi,
  updateStockApi,
  getLowStockApi,
  getInventorySummaryApi,
} from "../api/inventoryApi";

const UpdateStocks = () => {
  const [products, setProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState({
    quantity: "",
    type: "Purchase",
    reason: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, lowStockRes, summaryRes] = await Promise.all([
        getInventoryApi(),
        getLowStockApi(),
        getInventorySummaryApi(),
      ]);
      setProducts(productsRes.data);
      setLowStockProducts(lowStockRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      setError("Failed to load inventory data");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (product) => {
    setSelectedProduct(product);
    setForm({
      quantity: "",
      type: "Purchase",
      reason: "",
    });
    setOpen(true);
    setError("");
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
    setError("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (!form.quantity || form.quantity <= 0) {
        setError("Please enter a valid quantity");
        return;
      }

      await updateStockApi(selectedProduct._id, {
        quantity: parseFloat(form.quantity),
        type: form.type,
        reason: form.reason,
      });

      handleClose();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update stock");
    }
  };

  const getStockStatus = (product) => {
    if (product.stock === 0) return { label: "Out of Stock", color: "error" };
    if (product.stock <= product.minStockLevel)
      return { label: "Low Stock", color: "warning" };
    if (product.stock >= product.maxStockLevel)
      return { label: "Overstocked", color: "info" };
    return { label: "In Stock", color: "success" };
  };

  const categoryStockData =
    summary?.categoryWise?.map((c) => ({
      category: c._id || "Unknown",
      totalStock: c.totalStock,
      productCount: c.productCount,
    })) || [];

  const stockStatusData = [
    {
      name: "Out of Stock",
      value: products.filter((p) => p.stock === 0).length,
    },
    {
      name: "Low Stock",
      value: products.filter((p) => p.stock > 0 && p.stock <= p.minStockLevel).length,
    },
    {
      name: "In Stock",
      value: products.filter((p) => p.stock > p.minStockLevel && p.stock < p.maxStockLevel).length,
    },
    {
      name: "Overstocked",
      value: products.filter((p) => p.stock >= p.maxStockLevel).length,
    },
  ].filter((x) => x.value > 0);

  const lowStockChartData = lowStockProducts
    .slice(0, 8)
    .map((p) => ({
      name: p.name.length > 14 ? `${p.name.slice(0, 14)}…` : p.name,
      stock: p.stock,
      min: p.minStockLevel,
    }));

  const PIE_COLORS = ["#f44336", "#ff9800", "#4caf50", "#2196f3"];

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Loading inventory...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Inventory Management
      </Typography>

      {/* Summary Cards */}
      {summary && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Inventory sx={{ fontSize: 40, color: "#1e3c72" }} />
                  <Box>
                    <Typography variant="h4">
                      {summary.totalProducts}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Products
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <TrendingUp sx={{ fontSize: 40, color: "success.main" }} />
                  <Box>
                    <Typography variant="h4">
                      {summary.totalStock} Kg
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Stock
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Warning sx={{ fontSize: 40, color: "warning.main" }} />
                  <Box>
                    <Typography variant="h4">
                      {summary.lowStockCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Low Stock Items
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <CheckCircle sx={{ fontSize: 40, color: "error.main" }} />
                  <Box>
                    <Typography variant="h4">
                      {summary.outOfStockCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Out of Stock
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Charts */}
      {summary && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={7}>
            <Card sx={{ height: 360 }}>
              <CardContent sx={{ height: "100%" }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                  Category-wise Stock Summary
                </Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={categoryStockData}>
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalStock" name="Total Stock (Kg)" fill="#1e3c72" />
                    <Bar dataKey="productCount" name="Products" fill="#2193b0" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={5}>
            <Card sx={{ height: 360 }}>
              <CardContent sx={{ height: "100%" }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                  Stock Health Distribution
                </Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie
                      data={stockStatusData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={110}
                      label
                    >
                      {stockStatusData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ height: 320 }}>
              <CardContent sx={{ height: "100%" }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                  Low Stock (Top 8)
                </Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={lowStockChartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="stock" name="Current Stock (Kg)" fill="#ff9800" />
                    <Bar dataKey="min" name="Min Level (Kg)" fill="#1e3c72" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Alerts */}
      {lowStockProducts.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <strong>{lowStockProducts.length} products</strong> are running low on stock!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Product Name</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>Current Stock</strong></TableCell>
              <TableCell><strong>Min Level</strong></TableCell>
              <TableCell><strong>Max Level</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Supplier</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {
              const status = getStockStatus(product);
              return (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color:
                          product.stock === 0
                            ? "error.main"
                            : product.stock <= product.minStockLevel
                            ? "warning.main"
                            : "text.primary",
                      }}
                    >
                      {product.stock} Kg
                    </Typography>
                  </TableCell>
                  <TableCell>{product.minStockLevel} Kg</TableCell>
                  <TableCell>{product.maxStockLevel} Kg</TableCell>
                  <TableCell>
                    <Chip label={status.label} color={status.color} size="small" />
                  </TableCell>
                  <TableCell>
                    {product.supplier?.name || "N/A"}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleOpen(product)}
                      sx={{
                        borderColor: "#1e3c72",
                        color: "#1e3c72",
                        "&:hover": {
                          borderColor: "#162c54",
                          backgroundColor: "rgba(30,60,114,0.05)",
                        },
                      }}
                    >
                      Update Stock
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Update Stock - {selectedProduct?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Current Stock: <strong>{selectedProduct?.stock} Kg</strong>
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Update Type</InputLabel>
              <Select
                name="type"
                value={form.type}
                onChange={handleChange}
                label="Update Type"
              >
                <MenuItem value="Purchase">Purchase (Add Stock)</MenuItem>
                <MenuItem value="Adjustment">Adjustment (Set Stock)</MenuItem>
                <MenuItem value="Return">Return (Add Stock)</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label={form.type === "Adjustment" ? "New Stock Quantity" : "Quantity"}
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Reason (Optional)"
              name="reason"
              value={form.reason}
              onChange={handleChange}
              multiline
              rows={2}
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              bgcolor: "#1e3c72",
              "&:hover": { bgcolor: "#162c54" },
            }}
          >
            Update Stock
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UpdateStocks;
