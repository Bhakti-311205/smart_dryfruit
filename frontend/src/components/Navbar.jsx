import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Logo from "./Logo";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Chip,
  Container,
  Divider,
  Badge as MuiBadge,
} from "@mui/material";
import {
  ShoppingCart,
  Person,
  Logout,
  AdminPanelSettings,
  Badge,
  Favorite,
} from "@mui/icons-material";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [elevated, setElevated] = useState(false);

  const handleLogout = () => {
    if (clearCart) clearCart();
    logout();
    navigate("/login");
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "error";
      case "staff":
        return "warning";
      default:
        return "primary";
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "staff":
        return "Staff";
      default:
        return "Customer";
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setElevated(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActivePath = (to) => {
    if (to === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(to);
  };

  const navButtonBase = {
    color: "white",
    textTransform: "none",
    fontWeight: 500,
    borderRadius: 999,
    px: 2.5,
    transition: "background-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease",
    "&:hover": {
      bgcolor: "rgba(255,255,255,0.14)",
      transform: "translateY(-1px)",
      boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
    },
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        boxShadow: elevated
          ? "0 10px 25px rgba(0,0,0,0.2)"
          : "0 4px 14px rgba(0,0,0,0.16)",
        backdropFilter: "blur(14px)",
        transition: "box-shadow 0.25s ease, transform 0.25s ease",
        transform: elevated ? "translateY(0)" : "translateY(0)",
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Container
          maxWidth="xl"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <Logo sx={{ mr: 1, filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.2))" }} />
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  textDecoration: "none",
                  letterSpacing: 0.7,
                  transition: "transform 0.25s ease, opacity 0.25s ease",
                  mr: 1,
                  "&:hover": { opacity: 0.9, transform: "translateY(-1px)" },
                }}
              >
                NutHub
              </Typography>
            </Link>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Button
              color="inherit"
              component={Link}
              to="/"
              sx={{
                ...navButtonBase,
                px: 2,
                ...(isActivePath("/") && {
                  bgcolor: "rgba(255,255,255,0.22)",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.28)",
                }),
              }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/products"
              sx={{
                ...navButtonBase,
                ...(isActivePath("/products") && {
                  bgcolor: "rgba(255,255,255,0.22)",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.28)",
                }),
              }}
            >
              Products
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/offers"
              sx={{
                ...navButtonBase,
                px: 2.2,
                ...(isActivePath("/offers") && {
                  bgcolor: "rgba(255,255,255,0.22)",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.28)",
                }),
              }}
            >
              Offers
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/about"
              sx={{
                ...navButtonBase,
                px: 2.2,
                ...(isActivePath("/about") && {
                  bgcolor: "rgba(255,255,255,0.22)",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.28)",
                }),
              }}
            >
              About
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/contact"
              sx={{
                ...navButtonBase,
                px: 2.2,
                ...(isActivePath("/contact") && {
                  bgcolor: "rgba(255,255,255,0.22)",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.28)",
                }),
              }}
            >
              Contact
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/bulk-order"
              sx={{
                ...navButtonBase,
                px: 2.2,
                ...(isActivePath("/bulk-order") && {
                  bgcolor: "rgba(255,255,255,0.22)",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.28)",
                }),
              }}
            >
              Bulk Order
            </Button>

            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: "rgba(255,255,255,0.22)", mx: 0.5 }}
            />



            {!user ? (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                  sx={{
                    ...navButtonBase,
                    ...(isActivePath("/login") && {
                      bgcolor: "rgba(255,255,255,0.22)",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.28)",
                    }),
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  component={Link}
                  to="/register"
                  sx={{
                    color: "white",
                    borderColor: "white",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 999,
                    px: 2.5,
                    "&:hover": {
                      borderColor: "white",
                      bgcolor: "rgba(255,255,255,0.16)",
                    },
                  }}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/cart"
                  startIcon={
                    <MuiBadge
                      badgeContent={cart.length}
                      color="error"
                      sx={{
                        "& .MuiBadge-badge": {
                          fontSize: 10,
                          minWidth: 18,
                          height: 18,
                        },
                      }}
                    >
                      <ShoppingCart />
                    </MuiBadge>
                  }
                  sx={{
                    ...navButtonBase,
                    px: 2,
                    ...(isActivePath("/cart") && {
                      bgcolor: "rgba(255,255,255,0.22)",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.28)",
                    }),
                  }}
                >
                  Cart
                </Button>

                {user.role === "customer" && (
                  <Button
                    color="inherit"
                    component={Link}
                    to="/wishlist"
                    startIcon={<Favorite />}
                    sx={{
                      ...navButtonBase,
                      px: 2,
                      ...(isActivePath("/wishlist") && {
                        bgcolor: "rgba(255,255,255,0.22)",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.28)",
                      }),
                    }}
                  >
                    Wishlist
                  </Button>
                )}

                {user.role === "admin" && (
                  <Button
                    color="inherit"
                    component={Link}
                    to="/admin"
                    startIcon={<AdminPanelSettings />}
                    sx={{
                      ...navButtonBase,
                      px: 2,
                      ...(isActivePath("/admin") && {
                        bgcolor: "rgba(255,255,255,0.22)",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.28)",
                      }),
                    }}
                  >
                    Admin Dashboard
                  </Button>
                )}

                {user.role === "staff" && (
                  <Button
                    color="inherit"
                    component={Link}
                    to="/staff"
                    startIcon={<Badge />}
                    sx={{
                      ...navButtonBase,
                      px: 2,
                      ...(isActivePath("/staff") && {
                        bgcolor: "rgba(255,255,255,0.22)",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.28)",
                      }),
                    }}
                  >
                    Staff Dashboard
                  </Button>
                )}

                {user.role === "customer" && (
                  <Button
                    color="inherit"
                    component={Link}
                    to="/user-dashboard"
                    startIcon={<Person />}
                    sx={{
                      ...navButtonBase,
                      px: 2,
                      ...(isActivePath("/user-dashboard") && {
                        bgcolor: "rgba(255,255,255,0.22)",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.28)",
                      }),
                    }}
                  >
                    My Account
                  </Button>
                )}

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 1 }}>
                  <Chip
                    icon={<Person />}
                    label={`${user.name} (${getRoleLabel(user.role)})`}
                    color={getRoleColor(user.role)}
                    size="small"
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      bgcolor: "rgba(0,0,0,0.25)",
                      "& .MuiChip-icon": {
                        color: "inherit",
                      },
                    }}
                  />
                  <Button
                    color="inherit"
                    onClick={handleLogout}
                    startIcon={<Logout />}
                    sx={{
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.5)",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                    }}
                  >
                    Logout
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
