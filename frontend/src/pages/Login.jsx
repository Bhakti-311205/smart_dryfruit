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
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { loginApi } from "../api/authApi";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("customer"); // admin | staff | customer

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("[Login] Form submitted", { email: form.email, role: selectedRole });
    setError("");
    setLoading(true);

    try {
      console.log("[Login] Sending API request to /auth/login...");
      const res = await loginApi({
        email: form.email,
        password: form.password
      });

      console.log("[Login] API response received successfully:", res.data);

      // Enforce role based on selection
      const userRole = res.data.user.role;
      console.log("[Login] User role from backend:", userRole, "| Selected role:", selectedRole);

      if (selectedRole && userRole !== selectedRole) {
        console.warn("[Login] Role mismatch blocked login.");
        setError(
          `This account is a "${userRole}" account, but you selected "${selectedRole}". Please choose the correct role or use the right account.`
        );
        return;
      }

      console.log("[Login] Storing user context and navigating...");
      login(res.data);

      if (userRole === "admin") {
        navigate("/admin");
      } else if (userRole === "staff") {
        navigate("/staff");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("[Login] API Error caught:", err);
      if (!err.response) {
        // Network error, CORS error, or server timeout
        console.error("[Login] Network or Timeout error. No response received from server.");
        setError("Network error: Could not connect to the server. Please wait a moment and try again.");
      } else {
        console.error("[Login] Server responded with error status:", err.response.status, err.response.data);
        setError(err.response?.data?.message || "Invalid credentials");
      }
    } finally {
      console.log("[Login] Setting loading to false in finally block.");
      setLoading(false);
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
          maxWidth: 420,
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
          Login
        </Typography>

        {/* Role selector - single page, three different roles */}
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
          Login as <strong>{selectedRole}</strong> with your registered email and password.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
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
                  <IconButton onClick={() =>
                    setShowPassword(!showPassword)
                  }>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Typography
            variant="body2"
            sx={{ textAlign: "right", mt: 1, mb: 1 }}
          >
            <Link to="/forgot-password">Forgot password?</Link>
          </Typography>

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
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
            {loading ? "Logging in..." : "Login"}
          </Button>

          <Typography variant="body2" sx={{ textAlign: "center" }}>
            Don't have an account?{" "}
            <Link to="/register">Create one here</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
