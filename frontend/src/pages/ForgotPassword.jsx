import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your registered email address");
      return;
    }

    setMessage(
      "If this email exists in our system, a password reset link will be sent."
    );
  };

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
              "linear-gradient(135deg, #1e3c72, #2193b0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Forgot Password
        </Typography>

        <Typography variant="body2" sx={{ mb: 2 }}>
          Enter your registered email to receive a password reset link.
          This is a demo screen for the project UI.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          {message && (
            <Typography color="success.main" variant="body2" sx={{ mt: 1 }}>
              {message}
            </Typography>
          )}

          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              mt: 3,
              mb: 1,
              borderRadius: 2,
              py: 1.2,
              fontWeight: 600,
              background:
                "linear-gradient(90deg, #1e3c72, #2193b0)",
              boxShadow: "0 6px 18px rgba(33,147,176,0.4)",
              "&:hover": {
                background:
                  "linear-gradient(90deg, #162c54, #1e88a8)",
              },
            }}
          >
            Send Reset Link
          </Button>

          <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
            Remember your password?{" "}
            <Link to="/login">Back to Login</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
