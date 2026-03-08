import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { registerApi } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // For UX: single registration page, three role options
  const [selectedRole, setSelectedRole] = useState("customer"); // customer | staff | admin

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await registerApi({
        name: form.name,
        email: form.email,
        password: form.password,
        role: selectedRole,
      });
      setSuccess("Registered successfully! Please verify the OTP sent to your email.");
      setTimeout(
        () =>
          navigate("/verify-otp", {
            state: { email: form.email },
          }),
        1500
      );
    } catch (err) {
      setError("Unable to register. Email may already exist.");
    }
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
          maxWidth: 480,
          mx: "auto",
          p: 4,
          borderRadius: 3,
          boxShadow: 6,
          background:
            "rgba(234, 219, 200, 0.95)",
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
          Create Account
        </Typography>

        {/* Role selector - single registration page, three role options */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            mb: 2.5,
            justifyContent: "space-between",
          }}
        >
          <Button
            variant={selectedRole === "customer" ? "contained" : "outlined"}
            size="small"
            onClick={() => {
              setSelectedRole("customer");
              setError("");
            }}
            sx={{
              flex: 1,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Customer
          </Button>
          <Button
            variant={selectedRole === "staff" ? "contained" : "outlined"}
            size="small"
            onClick={() => {
              setSelectedRole("staff");
              setError("");
            }}
            sx={{
              flex: 1,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Staff
          </Button>
          <Button
            variant={selectedRole === "admin" ? "contained" : "outlined"}
            size="small"
            onClick={() => {
              setSelectedRole("admin");
              setError("");
            }}
            sx={{
              flex: 1,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Admin
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mb: 2 }}>
          You are registering a <strong>{selectedRole}</strong> account.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            margin="normal"
            required
            value={form.name}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            margin="normal"
            required
            value={form.email}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            margin="normal"
            required
            value={form.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            margin="normal"
            required
            value={form.confirmPassword}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }>
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          {success && (
            <Typography color="success.main" variant="body2">
              {success}
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
                "linear-gradient(90deg, #6B3E26, #8BC34A)",
              boxShadow: "0 6px 18px rgba(107,62,38,0.4)",
              "&:hover": {
                background:
                  "linear-gradient(90deg, #3E2723, #6B3E26)",
              },
            }}
          >
            Sign Up
          </Button>

          <Typography variant="body2" sx={{ textAlign: "center" }}>
            Already have an account? <Link to="/login">Login here</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
