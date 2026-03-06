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

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");

        const res = await axios.get("http://localhost:8000/api/orders/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(res.data || []);
      } catch (err) {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "Shipped":
        return "info";
      case "Processing":
        return "warning";
      case "Cancelled":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading orders...</Typography>
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
          color: "#1e3c72",
        }}
      >
        All Orders
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {orders.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No orders found
          </Typography>
        </Paper>
      ) : (
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
                <TableCell><strong>Order ID</strong></TableCell>
                <TableCell><strong>User</strong></TableCell>
                <TableCell><strong>Total Amount</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Created At</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.map((o) => (
                <TableRow
                  key={o._id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f9fbff",
                    },
                  }}
                >
                  <TableCell>#{o._id.slice(-8)}</TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {o.user?.email || "N/A"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: "#1e3c72",
                      }}
                    >
                      ₹{o.totalAmount?.toFixed(2) || 0}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={o.orderStatus || "Placed"}
                      color={getStatusColor(o.orderStatus)}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    {o.createdAt
                      ? new Date(o.createdAt).toLocaleString()
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default AdminOrders;
