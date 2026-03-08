import React from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  Inventory,
  ShoppingCart,
  People,
  AddCircle,
  BarChart,
  History,
  ListAlt,
} from "@mui/icons-material";

const AdminDashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          mb: 4,
          background:
            "linear-gradient(135deg, #6B3E26, #8BC34A)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Admin Dashboard 👑
      </Typography>

      <Grid container spacing={3}>
        {/* Add Product */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            component={Link}
            to="/admin/add-product"
            sx={{
              textDecoration: "none",
              borderRadius: 3,
              boxShadow: 3,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <AddCircle sx={{ fontSize: 50, color: "#6B3E26", mb: 1 }} />
              <Typography variant="h6">Add Product</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Manage Products */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            component={Link}
            to="/admin/manage-products"
            sx={{
              textDecoration: "none",
              borderRadius: 3,
              boxShadow: 3,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Inventory sx={{ fontSize: 50, color: "#6B3E26", mb: 1 }} />
              <Typography variant="h6">Manage Products</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* View Orders */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            component={Link}
            to="/admin/orders"
            sx={{
              textDecoration: "none",
              borderRadius: 3,
              boxShadow: 3,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <ShoppingCart sx={{ fontSize: 50, color: "#6B3E26", mb: 1 }} />
              <Typography variant="h6">View Orders</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Analytics */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            component={Link}
            to="/admin/analytics"
            sx={{
              textDecoration: "none",
              borderRadius: 3,
              boxShadow: 3,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <BarChart sx={{ fontSize: 50, color: "#6B3E26", mb: 1 }} />
              <Typography variant="h6">Order Analytics</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Manage Suppliers */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            component={Link}
            to="/admin/suppliers"
            sx={{
              textDecoration: "none",
              borderRadius: 3,
              boxShadow: 3,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <People sx={{ fontSize: 50, color: "#6B3E26", mb: 1 }} />
              <Typography variant="h6">Manage Suppliers</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Manage Users + Activity Logs + Bulk Orders */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            component={Link}
            to="/admin/users"
            sx={{
              textDecoration: "none",
              borderRadius: 3,
              boxShadow: 3,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <People sx={{ fontSize: 50, color: "#6B3E26", mb: 1 }} />
              <Typography variant="h6">Manage Users</Typography>
              <Typography variant="body2" color="text.secondary">
                Create staff and admin users
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Logs */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            component={Link}
            to="/admin/activity-logs"
            sx={{
              textDecoration: "none",
              borderRadius: 3,
              boxShadow: 3,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <History sx={{ fontSize: 50, color: "#6B3E26", mb: 1 }} />
              <Typography variant="h6">Activity Logs</Typography>
              <Typography variant="body2" color="text.secondary">
                View all user activity
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Bulk Orders */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            component={Link}
            to="/admin/bulk-orders"
            sx={{
              textDecoration: "none",
              borderRadius: 3,
              boxShadow: 3,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <ListAlt sx={{ fontSize: 50, color: "#6B3E26", mb: 1 }} />
              <Typography variant="h6">Bulk Orders</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage bulk order inquiries
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
