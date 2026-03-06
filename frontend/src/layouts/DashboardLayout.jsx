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

import { useTheme } from "@mui/material/styles";

const DRAWER_WIDTH = 280;

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
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);

  const items = useMemo(() => navForRole(role), [role]);

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 2.5, py: 2.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          NutHub ERP
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {role?.toUpperCase()} Console
        </Typography>
      </Box>

      <Divider />

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
                ...(active && {
                  bgcolor: "rgba(30,60,114,0.06)",
                }),
              }}
            >
              <ListItemIcon sx={{ minWidth: 42 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: active ? 700 : 600 }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ flex: 1 }} />

      <Divider />

      <Box sx={{ px: 2.5, py: 2, display: "flex", gap: 1, alignItems: "center" }}>
        <Chip
          label={user?.name ? `${user.name} (${user.role})` : role}
          size="small"
          sx={{ maxWidth: 200 }}
        />
        <Box sx={{ flex: 1 }} />

        <IconButton
          onClick={() => {
            logout();
            navigate("/login");
          }}
          sx={{
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
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
          zIndex: (t) => t.zIndex.drawer + 1,
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
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
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
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` } }}>
        <Toolbar />
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout;

