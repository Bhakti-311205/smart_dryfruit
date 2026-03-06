import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Button,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  CheckCircle,
  LocalShipping,
  Inventory,
  ShoppingCart,
  Cancel,
} from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { getUserOrdersApi, downloadInvoiceApi } from "../api/orderApi";

const ORDER_STEPS = ["Placed", "Processing", "Shipped", "Delivered"];

const getActiveStep = (status) => {
  if (status === "Cancelled") return -1;
  const idx = ORDER_STEPS.indexOf(status);
  return idx >= 0 ? idx : 0;
};

const StepIcon = ({ step, activeStep, cancelled }) => {
  const icons = {
    0: <ShoppingCart />,
    1: <Inventory />,
    2: <LocalShipping />,
    3: <CheckCircle />,
  };

  const isCompleted = step < activeStep;
  const isActive = step === activeStep;

  return (
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: cancelled
          ? "#ffebee"
          : isCompleted
            ? "#e8f5e9"
            : isActive
              ? "#e3f2fd"
              : "#f5f5f5",
        color: cancelled
          ? "#d32f2f"
          : isCompleted
            ? "#2e7d32"
            : isActive
              ? "#1565c0"
              : "#bdbdbd",
        fontSize: 20,
      }}
    >
      {cancelled ? <Cancel /> : icons[step]}
    </Box>
  );
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();
  const successMessage = location.state?.successMessage;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getUserOrdersApi();
      setOrders(res.data || []);
    } catch (err) {
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const res = await downloadInvoiceApi(orderId);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download invoice. Please try again.");
    }
  };

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
      <Container sx={{ py: 5, textAlign: "center" }}>
        <CircularProgress color="primary" />
        <Typography sx={{ mt: 2 }}>Loading orders...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 5 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          mb: 4,
          background:
            "linear-gradient(135deg, #1e3c72, #2193b0)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        My Orders
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3, boxShadow: 3 }}>
          <Typography variant="h6" color="text.secondary">
            No orders found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Start shopping to see your orders here!
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order._id}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Order #{order._id.slice(-8).toUpperCase()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Box>
                    <Chip
                      label={order.orderStatus || "Placed"}
                      color={getStatusColor(order.orderStatus)}
                      sx={{ mb: 1 }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: "#1e3c72",
                      }}
                    >
                      ₹{order.totalAmount?.toFixed(2) || 0}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Payment:</strong> {order.paymentMode} –{" "}
                    <Chip
                      label={order.paymentStatus}
                      size="small"
                      color={
                        order.paymentStatus === "Completed"
                          ? "success"
                          : "warning"
                      }
                    />
                  </Typography>

                  {order.address && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      <strong>Address:</strong> {order.address},{" "}
                      {order.city} – {order.pincode}
                    </Typography>
                  )}
                </Box>

                {/* Order Tracking Timeline */}
                <Box sx={{ my: 3 }}>
                  {order.orderStatus === "Cancelled" ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Cancel sx={{ color: "#d32f2f" }} />
                      <Typography variant="body2" sx={{ color: "#d32f2f", fontWeight: 600 }}>
                        Order Cancelled
                      </Typography>
                    </Box>
                  ) : (
                    <Stepper
                      activeStep={getActiveStep(order.orderStatus)}
                      alternativeLabel
                      sx={{
                        "& .MuiStepConnector-line": {
                          borderColor: "#e0e0e0",
                        },
                        "& .Mui-completed .MuiStepConnector-line": {
                          borderColor: "#4caf50",
                        },
                        "& .Mui-active .MuiStepConnector-line": {
                          borderColor: "#1e3c72",
                        },
                      }}
                    >
                      {ORDER_STEPS.map((label, index) => (
                        <Step key={label} completed={index < getActiveStep(order.orderStatus)}>
                          <StepLabel
                            StepIconComponent={() => (
                              <StepIcon
                                step={index}
                                activeStep={getActiveStep(order.orderStatus)}
                                cancelled={false}
                              />
                            )}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight:
                                  index <= getActiveStep(order.orderStatus) ? 600 : 400,
                                color:
                                  index <= getActiveStep(order.orderStatus)
                                    ? "#1e3c72"
                                    : "text.secondary",
                              }}
                            >
                              {label}
                            </Typography>
                          </StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  )}
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 600 }}
                  >
                    Items ({order.items?.length || 0}):
                  </Typography>

                  {order.items?.map((item, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        py: 0.5,
                        borderBottom:
                          idx < order.items.length - 1
                            ? "1px solid #eee"
                            : "none",
                      }}
                    >
                      <Typography variant="body2">
                        {item.product_name || item.name} × {item.quantity} Kg
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600 }}
                      >
                        ₹
                        {item.totalPrice?.toFixed(2) ||
                          (item.pricePerKg * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ mt: 2, textAlign: "right" }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleDownloadInvoice(order._id)}
                  >
                    Download Invoice (PDF)
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyOrders;
