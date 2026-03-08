import React, { useMemo, useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Divider,
  Chip,
  Container,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ShoppingCart,
  Inventory2,
  People,
  LocalShipping,
  BarChart,
  Favorite,
  ReceiptLong,
  Logout,
  History,
  BusinessCenter,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

import Footer from "../components/Footer";
import Logo from "../components/Logo";

const DRAWER_WIDTH = 280;
// ... (rest of the code remains the same until return)

function navForRole(role) {
  if (role === "admin") {
    return [
      { label: "Dashboard", to: "/admin", icon: <DashboardIcon /> },
      { label: "Order Analytics", to: "/admin/analytics", icon: <BarChart /> },
      { label: "Add Product", to: "/admin/add-product", icon: <Inventory2 /> },
      { label: "Manage Products", to: "/admin/manage-products", icon: <Inventory2 /> },
      { label: "Orders", to: "/admin/orders", icon: <ShoppingCart /> },
      { label: "Suppliers", to: "/admin/suppliers", icon: <LocalShipping /> },
      { label: "Users", to: "/admin/users", icon: <People /> },
      { label: "Activity Logs", to: "/admin/activity-logs", icon: <History /> },
      { label: "Bulk Orders", to: "/admin/bulk-orders", icon: <BusinessCenter /> },
    ];
  }
  if (role === "staff") {
    return [
      { label: "Dashboard", to: "/staff", icon: <DashboardIcon /> },
      { label: "Orders", to: "/staff/orders", icon: <ShoppingCart /> },
      { label: "Inventory", to: "/staff/update-stocks", icon: <Inventory2 /> },
    ];
  }
  // customer dashboard
  return [
    { label: "Dashboard", to: "/user-dashboard", icon: <DashboardIcon /> },
    { label: "My Orders", to: "/my-orders", icon: <ReceiptLong /> },
    { label: "Wishlist", to: "/wishlist", icon: <Favorite /> },
    { label: "Shop Products", to: "/products", icon: <ShoppingCart /> },
  ];
}

const DashboardLayout = ({ role, title, children }) => {
  const { user, logout } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

  const items = useMemo(() => navForRole(role), [role]);

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 2.5, py: 2.5 }}>
        <Box component={Link} to="/" sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Logo sx={{ height: 36, filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.2))" }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#EADBC8', ml: 1.5 }}>
            NutHub
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: "rgba(234,219,200,0.7)" }}>
          {role?.toUpperCase()} Console
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(234,219,200,0.15)" }} />

      <List sx={{ px: 1.25, py: 1 }}>
        {items.map((item) => {
          const active = location.pathname === item.to;
          return (
            <ListItemButton
              key={item.to}
              component={Link}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: 2,
                mx: 0.75,
                mb: 0.5,
                color: active ? "#8BC34A" : "inherit",
                "&:hover": {
                  bgcolor: "#5A3521",
                },
                ...(active && {
                  bgcolor: "#6B3E26",
                  borderLeft: "4px solid #8BC34A",
                  borderRadius: "0 8px 8px 0",
                  ml: 0,
                }),
              }}
            >
              <ListItemIcon sx={{ minWidth: 42, color: active ? "#8BC34A" : "inherit" }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: active ? 700 : 600 }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ flex: 1 }} />

      <Divider sx={{ borderColor: "rgba(234,219,200,0.15)" }} />

      <Box sx={{ px: 2.5, py: 2, display: "flex", gap: 1, alignItems: "center" }}>
        <Chip
          label={user?.name ? `${user.name} (${user.role})` : role}
          size="small"
          sx={{ maxWidth: 200, bgcolor: "rgba(234,219,200,0.15)", color: "#EADBC8", fontWeight: 600 }}
        />
        <Box sx={{ flex: 1 }} />

        <IconButton
          onClick={() => {
            if (clearCart) clearCart();
            logout();
            navigate("/login");
          }}
          sx={{
            borderRadius: 2,
            border: `1px solid rgba(234,219,200,0.2)`,
            color: "inherit",
            "&:hover": { bgcolor: "rgba(234,219,200,0.1)" }
          }}
        >
          <Logout />
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: "none",
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "inherit" }}>
            {title || "Dashboard"}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              bgcolor: "#3E2723",
              color: "#EADBC8",
            },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              borderRight: `1px solid rgba(107,62,38,0.15)`,
              bgcolor: "#3E2723",
              color: "#EADBC8",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Toolbar />
        <Container maxWidth="xl" sx={{ py: 4, flexGrow: 1 }}>
          {children}
        </Container>
        <Footer />
      </Box>
    </Box>
  );
};

export default DashboardLayout;

