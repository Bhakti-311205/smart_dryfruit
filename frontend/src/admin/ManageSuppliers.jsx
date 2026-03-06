import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Alert,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import {
  getSuppliersApi,
  createSupplierApi,
  updateSupplierApi,
  deleteSupplierApi,
} from "../api/supplierApi";

const ManageSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gstNumber: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await getSuppliersApi();
      setSuppliers(res.data);
    } catch (err) {
      setError("Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (supplier = null) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setForm({
        name: supplier.name,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        city: supplier.city,
        state: supplier.state,
        pincode: supplier.pincode,
        gstNumber: supplier.gstNumber || "",
      });
    } else {
      setEditingSupplier(null);
      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        gstNumber: "",
      });
    }
    setOpen(true);
    setError("");
  };

  const handleClose = () => {
    setOpen(false);
    setEditingSupplier(null);
    setError("");
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      setError("");
      if (editingSupplier) {
        await updateSupplierApi(editingSupplier._id, form);
      } else {
        await createSupplierApi(form);
      }
      handleClose();
      fetchSuppliers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save supplier");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        await deleteSupplierApi(id);
        fetchSuppliers();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete supplier");
      }
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Loading suppliers...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, color: "#1e3c72" }}
        >
          Manage Suppliers
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{
            bgcolor: "#1e3c72",
            "&:hover": { bgcolor: "#162c54" },
          }}
        >
          Add Supplier
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, boxShadow: 3 }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f8ff" }}>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>City</strong></TableCell>
              <TableCell><strong>State</strong></TableCell>
              <TableCell><strong>GST Number</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Products</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow
                key={supplier._id}
                sx={{
                  "&:hover": { backgroundColor: "#f9fbff" },
                }}
              >
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.phone}</TableCell>
                <TableCell>{supplier.city}</TableCell>
                <TableCell>{supplier.state}</TableCell>
                <TableCell>{supplier.gstNumber || "N/A"}</TableCell>

                <TableCell>
                  <Chip
                    label={supplier.status}
                    color={
                      supplier.status === "Active"
                        ? "success"
                        : "default"
                    }
                    size="small"
                  />
                </TableCell>

                <TableCell>{supplier.products?.length || 0}</TableCell>

                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpen(supplier)}
                    sx={{ color: "#1e3c72" }}
                  >
                    <Edit />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={() => handleDelete(supplier._id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {[
              { label: "Supplier Name", name: "name" },
              { label: "Email", name: "email", type: "email" },
              { label: "Phone", name: "phone" },
              { label: "GST Number", name: "gstNumber" },
              { label: "City", name: "city" },
              { label: "State", name: "state" },
              { label: "Pincode", name: "pincode" },
            ].map((field, i) => (
              <Grid item xs={12} sm={field.name === "address" ? 12 : 6} key={i}>
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  type={field.type || "text"}
                  value={form[field.name]}
                  onChange={handleChange}
                />
              </Grid>
            ))}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={form.address}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>

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
            {editingSupplier ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageSuppliers;
