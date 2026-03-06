import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Chip,
} from "@mui/material";
import {
  ShoppingCart,
  Inventory,
  Person,
  TrendingUp,
  Warning,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { getStaffOrdersApi } from "../api/orderApi";
import { getLowStockApi, getInventorySummaryApi } from "../api/inventoryApi";

const StaffDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({

    useEffect(() => {
  fetchStats();
}, []);

const fetchStats = async () => {
  try {
    const [ordersRes, lowStockRes, summaryRes] = await Promise.all([
      getStaffOrdersApi(),
      getLowStockApi(),
      getInventorySummaryApi(),
    ]);

    const orders = ordersRes.data || [];
    const pendingOrders = orders.filter(
      (o) => o.orderStatus === "Placed" || o.orderStatus === "Processing"
    ).length;

    setStats({
      totalOrders: orders.length,
      pendingOrders,
      lowStockCount: lowStockRes.data?.length || 0,
      outOfStockCount: summaryRes.data?.outOfStockCount || 0,
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
  }
};

return (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    {/* User Info Card */}
    <Paper
      sx={{
        p: 3,
        mb: 4,
        background: "linear-gradient(135deg, #1e3c72, #2193b0)",
        color: "white",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Person sx={{ fontSize: 50 }} />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Welcome, {user?.name || "Staff Member"}! 🧑‍💼
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            {user?.email || ""}
          </Typography>
          <Chip
            label={user?.role?.toUpperCase() || "STAFF"}
            sx={{
              mt: 1,
              bgcolor: "rgba(255,255,255,0.2)",
              color: "white",
              fontWeight: 600,
            }}
          />
        </Box>
      </Box>
    </Paper>

    <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
      Dashboard Overview
    </Typography>

    {/* Stats Cards */}
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card
          component={Link}
          to="/staff/orders"
          sx={{
            textDecoration: "none",
            "&:hover": { boxShadow: 4 },
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <ShoppingCart sx={{ fontSize: 40, color: "#1e3c72" }} />
              <Box>
                <Typography variant="h4">{stats.totalOrders}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Orders
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card
          component={Link}
          to="/staff/orders"
          sx={{
            textDecoration: "none",
            "&:hover": { boxShadow: 4 },
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TrendingUp sx={{ fontSize: 40, color: "warning.main" }} />
              <Box>
                <Typography variant="h4">{stats.pendingOrders}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Orders
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card
          component={Link}
          to="/staff/update-stocks"
          sx={{
            textDecoration: "none",
            "&:hover": { boxShadow: 4 },
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Warning sx={{ fontSize: 40, color: "warning.main" }} />
              <Box>
                <Typography variant="h4">{stats.lowStockCount}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Low Stock Items
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card
          component={Link}
          to="/staff/update-stocks"
          sx={{
            textDecoration: "none",
            "&:hover": { boxShadow: 4 },
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Inventory sx={{ fontSize: 40, color: "error.main" }} />
              <Box>
                <Typography variant="h4">{stats.outOfStockCount}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Out of Stock
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>

    {/* Quick Actions */}
    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
      Quick Actions
    </Typography>

    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={4}>
        <Card
          component={Link}
          to="/staff/orders"
          sx={{
            textDecoration: "none",
            "&:hover": { boxShadow: 4 },
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 3 }}>
            <ShoppingCart sx={{ fontSize: 50, color: "#1e3c72", mb: 1 }} />
            <Typography variant="h6">Manage Orders</Typography>
            <Typography variant="body2" color="text.secondary">
              View and update order status
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card
          component={Link}
          to="/staff/update-stocks"
          sx={{
            textDecoration: "none",
            "&:hover": { boxShadow: 4 },
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 3 }}>
            <Inventory sx={{ fontSize: 50, color: "#1e3c72", mb: 1 }} />
            <Typography variant="h6">Update Stocks</Typography>
            <Typography variant="body2" color="text.secondary">
              Manage inventory and stock levels
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Container>
);
};

export default StaffDashboard;
