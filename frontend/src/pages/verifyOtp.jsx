import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtpApi, resendOtpApi } from "../api/authApi";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  const email = location.state?.email || "";

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp.trim()) {
      setError("Please enter the OTP sent to your email");
      return;
    }

    if (!email) {
      setError("Missing email. Please register again.");
      return;
    }

    try {
      await verifyOtpApi({ email, otp });
      setSuccess("OTP verified successfully! You can now login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid or expired OTP. Please try again."
      );
    }
  };

  const handleResend = useCallback(async () => {
    if (resendCooldown > 0 || resending) return;

    if (!email) {
      setError("Missing email. Please register again.");
      return;
    }

    setResending(true);
    setError("");
    setSuccess("");

    try {
      await resendOtpApi({ email });
      setSuccess("A new OTP has been sent to your email.");
      setResendCooldown(60); // 60-second cooldown
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to resend OTP. Please try again."
      );
    } finally {
      setResending(false);
    }
  }, [email, resendCooldown, resending]);

  return (
    <Container
      sx={{
        py: 8,
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        sx={{
          maxWidth: 420,
          mx: "auto",
          p: 4,
          borderRadius: 3,
          boxShadow: 6,
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(230,245,255,0.95))",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 2,
            fontWeight: 700,
            background:
              "linear-gradient(135deg, #6B3E26, #8BC34A)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Verify OTP
        </Typography>

        <Typography variant="body2" sx={{ mb: 2 }}>
          Enter the one-time password sent to your registered email{email ? ` (${email})` : ""}.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="OTP"
            margin="normal"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            inputProps={{ maxLength: 6 }}
          />

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          {success && (
            <Typography color="success.main" variant="body2" sx={{ mt: 1 }}>
              {success}
            </Typography>
          )}

          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              mt: 3,
              borderRadius: 2,
              py: 1.2,
              fontWeight: 600,
              background:
                "linear-gradient(90deg, #6B3E26, #8BC34A)",
              boxShadow: "0 6px 18px rgba(33,147,176,0.4)",
              "&:hover": {
                background:
                  "linear-gradient(90deg, #3E2723, #1e88a8)",
              },
            }}
          >
            Verify & Continue
          </Button>

          <Button
            fullWidth
            variant="text"
            disabled={resendCooldown > 0 || resending}
            onClick={handleResend}
            sx={{
              mt: 1.5,
              textTransform: "none",
              fontWeight: 500,
              color: resendCooldown > 0 ? "text.disabled" : "#6B3E26",
            }}
          >
            {resending
              ? "Sending..."
              : resendCooldown > 0
                ? `Resend OTP in ${resendCooldown}s`
                : "Didn't receive the code? Resend OTP"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default VerifyOtp;
