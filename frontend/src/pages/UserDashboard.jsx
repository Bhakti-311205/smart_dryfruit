import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { getUserOrdersApi } from "../api/orderApi";
import StatCard from "../components/StatCard";
import PageNavigator from "../components/PageNavigator";

const UserDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getUserOrdersApi()
      .then((res) => setOrders(res.data || []))
      .catch(() => { });
  }, []);

  const totalSpent = orders.reduce(
    (sum, o) => sum + Number(o.totalAmount || 0),
    0
  );

  return (
    <Container sx={{ py: 5 }}>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 700,
          background:
            "linear-gradient(135deg, #6B3E26, #8BC34A)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Welcome, {user?.name}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard label="Total Orders" value={orders.length} />
        </Grid>

        <Grid item xs={12} md={4}>
          <StatCard label="Total Spent" value={`₹ ${totalSpent}`} />
        </Grid>

        <Grid item xs={12} md={4}>
          <StatCard
            label="Last Order"
            value={
              orders[0]
                ? new Date(orders[0].createdAt).toLocaleDateString()
                : "N/A"
            }
          />
        </Grid>
      </Grid>

      <Paper
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 3,
          boxShadow: 4,
          bgcolor: "rgba(234, 219, 200, 0.95)",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Recent Orders
        </Typography>

        <List>
          {orders.map((o) => (
            <ListItem key={o._id} divider>
              <ListItemText
                primary={`Order #${o._id.slice(-8).toUpperCase()} - ₹ ${o.totalAmount}`}
                secondary={new Date(o.createdAt).toLocaleString()}
              />
            </ListItem>
          ))}
        </List>

        {orders.length === 0 && (
          <Typography variant="body2">
            You have not placed any orders yet.
          </Typography>
        )}
      </Paper>

      <PageNavigator
        backTo="/"
        backLabel="Back to Home"
        nextTo="/products"
        nextLabel="Shop Now"
      />
    </Container>
  );
};

export default UserDashboard;
