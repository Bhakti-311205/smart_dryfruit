import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { createOrderApi, createRazorpayOrderApi, verifyRazorpayPaymentApi } from "../api/orderApi";
import { useCart } from "../context/CartContext";
import PageNavigator from "../components/PageNavigator";

const steps = ["Shipping Details", "Payment Method", "Confirmation"];

const Payment = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();

  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [shippingDetails, setShippingDetails] = useState({
    address: "",
    city: "",
    pincode: "",
    phone: "",
  });

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState(null);

  // Snackbar notifications
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (!items.length && activeStep < 2) navigate("/cart");
  }, [items, navigate, activeStep]);

  const handleShippingChange = (e) => {
    setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
  };

  const showNotification = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!shippingDetails.address || !shippingDetails.city || !shippingDetails.pincode || !shippingDetails.phone) {
        setError("Please fill all shipping details");
        return;
      }
      setError("");
    }

    if (activeStep === 1) {
      // User selected a payment method — process it
      if (paymentMethod === "COD") {
        handleCODPayment();
      } else {
        handleRazorpayPayment();
      }
      return;
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  // COD Payment — same as before
  const handleCODPayment = async () => {
    setProcessing(true);
    setError("");

    try {
      const orderData = {
        items: items.map((it) => ({
          product_id: it._id,
          quantity: it.quantity,
        })),
        ...shippingDetails,
        paymentMethod: "COD",
        paymentStatus: "Pending",
        totalAmount: total,
      };

      const response = await createOrderApi(orderData);
      setOrderId(response.data._id);
      clearCart();
      showNotification("Order placed successfully with Cash on Delivery!");
      setActiveStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
      showNotification("Order failed. Please try again.", "error");
    } finally {
      setProcessing(false);
    }
  };

  // Razorpay Payment
  const handleRazorpayPayment = async () => {
    setProcessing(true);
    setError("");

    try {
      // Step 1: Create Razorpay order on backend
      const { data } = await createRazorpayOrderApi({ amount: total });

      // Step 2: Open Razorpay Checkout modal
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "NutHub",
        description: "Order Payment",
        order_id: data.orderId,
        handler: async function (response) {
          // Step 3: Verify payment on backend
          try {
            const verifyData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              items: items.map((it) => ({
                product_id: it._id,
                quantity: it.quantity,
              })),
              totalAmount: total,
              ...shippingDetails,
            };

            const verifyResponse = await verifyRazorpayPaymentApi(verifyData);
            setOrderId(verifyResponse.data._id);
            clearCart();
            showNotification("Payment successful! Order placed.");
            setActiveStep(2);
          } catch (verifyErr) {
            setError("Payment was received but order creation failed. Please contact support.");
            showNotification("Payment verification failed.", "error");
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
            setError("Payment was cancelled. You can try again.");
            showNotification("Payment cancelled.", "warning");
          },
        },
        prefill: {
          name: JSON.parse(localStorage.getItem("user") || "{}")?.name || "",
          email: JSON.parse(localStorage.getItem("user") || "{}")?.email || "",
          contact: shippingDetails.phone,
        },
        theme: {
          color: "#6B3E26",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response) {
        setProcessing(false);
        setError(`Payment failed: ${response.error.description}`);
        showNotification("Payment failed. Please try again.", "error");
      });
      razorpay.open();
    } catch (err) {
      setProcessing(false);
      setError(err.response?.data?.message || "Failed to initiate payment. Please try again.");
      showNotification("Failed to initiate payment.", "error");
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Address" name="address" value={shippingDetails.address} onChange={handleShippingChange} multiline rows={3} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="City" name="city" value={shippingDetails.city} onChange={handleShippingChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Pincode" name="pincode" value={shippingDetails.pincode} onChange={handleShippingChange} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Phone" name="phone" value={shippingDetails.phone} onChange={handleShippingChange} required />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              {[
                { value: "COD", label: "Cash on Delivery", desc: "Pay when your order is delivered" },
                { value: "Razorpay", label: "Pay Online (UPI / Card / Net Banking)", desc: "Secure payment via Razorpay" },
              ].map((method) => (
                <Card
                  key={method.value}
                  sx={{
                    mb: 2,
                    border: paymentMethod === method.value ? "2px solid #6B3E26" : "1px solid #ddd",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": { boxShadow: 3 },
                  }}
                  onClick={() => setPaymentMethod(method.value)}
                >
                  <CardContent>
                    <FormControlLabel
                      value={method.value}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="h6">{method.label}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {method.desc}
                          </Typography>
                        </Box>
                      }
                    />
                  </CardContent>
                </Card>
              ))}
            </RadioGroup>

            <Paper
              sx={{
                p: 2,
                mt: 2,
                background: "linear-gradient(135deg, #f0f7ff, #e8f4f8)",
                borderRadius: 2,
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Total Amount: <span style={{ color: "#6B3E26", fontSize: "1.2em" }}>₹{total.toFixed(2)}</span>
              </Typography>
            </Paper>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 3, textAlign: "center" }}>
            {/* Success Icon */}
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #4caf50, #66bb6a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
                boxShadow: "0 8px 32px rgba(76, 175, 80, 0.35)",
              }}
            >
              <CheckCircle sx={{ fontSize: 60, color: "#fff" }} />
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 700, color: "#2e7d32", mb: 1 }}>
              Payment Successful!
            </Typography>

            <Typography variant="h6" sx={{ color: "#555", mb: 3 }}>
              Your order has been placed successfully 🎉
            </Typography>

            {/* Order Details Card */}
            <Paper
              sx={{
                p: 3,
                mx: "auto",
                maxWidth: 380,
                borderRadius: 3,
                background: "linear-gradient(135deg, #f0f7ff, #e8f4f8)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                mb: 3,
              }}
            >
              {orderId && (
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                  Order ID: <span style={{ color: "#6B3E26" }}>#{orderId.slice(-8).toUpperCase()}</span>
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Payment Mode: <strong>{paymentMethod === "COD" ? "Cash on Delivery" : "Razorpay (Online)"}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Status: <strong style={{ color: paymentMethod === "COD" ? "#ed6c02" : "#2e7d32" }}>
                  {paymentMethod === "COD" ? "Pending (Pay on Delivery)" : "Paid ✓"}
                </strong>
              </Typography>
            </Paper>

            {/* Navigation Buttons */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, alignItems: "center" }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/my-orders")}
                sx={{
                  minWidth: 260,
                  py: 1.3,
                  fontWeight: 600,
                  borderRadius: 2,
                  background: "linear-gradient(90deg, #6B3E26, #8BC34A)",
                  boxShadow: "0 6px 18px rgba(33,147,176,0.4)",
                  "&:hover": { background: "linear-gradient(90deg, #3E2723, #1e88a8)" },
                }}
              >
                View My Orders
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/products")}
                sx={{
                  minWidth: 260,
                  py: 1.3,
                  fontWeight: 600,
                  borderRadius: 2,
                  borderColor: "#6B3E26",
                  color: "#6B3E26",
                  "&:hover": { borderColor: "#3E2723", bgcolor: "rgba(30,60,114,0.04)" },
                }}
              >
                Continue Shopping
              </Button>
              <Button
                variant="text"
                onClick={() => navigate("/")}
                sx={{ color: "#888", textTransform: "none" }}
              >
                ← Back to Home
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, textAlign: "center" }}>
          Checkout
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {renderStepContent()}

        {activeStep < 2 && (
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button disabled={activeStep === 0 || processing} onClick={handleBack}>
              Back
            </Button>

            <Button
              variant="contained"
              onClick={handleNext}
              disabled={processing}
              sx={{
                bgcolor: "#6B3E26",
                "&:hover": { bgcolor: "#3E2723" },
              }}
            >
              {processing ? (
                <CircularProgress size={20} sx={{ color: "#fff" }} />
              ) : activeStep === 1 ? (
                paymentMethod === "COD" ? "Place Order" : `Pay ₹${total.toFixed(2)}`
              ) : (
                "Next"
              )}
            </Button>
          </Box>
        )}

        {activeStep === 2 && (
          <PageNavigator
            backTo="/products"
            backLabel="Back to Products"
            nextTo="/my-orders"
            nextLabel="Go to My Orders"
          />
        )}
      </Paper>

      {/* Success / Error Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Payment;
