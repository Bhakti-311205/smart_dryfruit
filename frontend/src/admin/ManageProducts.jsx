import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import PageNavigator from "../components/PageNavigator";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";
        const res = await axios.get(`${API_URL}/products`);
        setProducts(res.data || []);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading products...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Blue Title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          mb: 4,
          color: "#6B3E26",
        }}
      >
        Manage Products
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f8ff" }}>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>Price / Kg</strong></TableCell>
              <TableCell><strong>Stock</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((p) => (
              <TableRow
                key={p._id}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f9fbff",
                  },
                }}
              >
                <TableCell>{p.name}</TableCell>

                <TableCell>{p.category}</TableCell>

                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#6B3E26",
                  }}
                >
                  ₹ {p.pricePerKg}
                </TableCell>

                <TableCell>{p.stock} Kg</TableCell>

                <TableCell>
                  <Chip
                    label={
                      p.stock === 0
                        ? "Out of Stock"
                        : p.stock <= 10
                          ? "Low Stock"
                          : "In Stock"
                    }
                    color={
                      p.stock === 0
                        ? "error"
                        : p.stock <= 10
                          ? "warning"
                          : "success"
                    }
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <PageNavigator
        backTo="/admin"
        backLabel="Back to Admin Dashboard"
        nextTo="/admin/add-product"
        nextLabel="Add Product"
      />
    </Container>
  );
};

export default ManageProducts;
