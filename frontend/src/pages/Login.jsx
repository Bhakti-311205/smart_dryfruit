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
    setError("");
    setLoading(true);

    try {
      const res = await loginApi({
        email: form.email,
        password: form.password
      });

      // Enforce role based on selection
      const userRole = res.data.user.role;

      if (selectedRole && userRole !== selectedRole) {
        setError(
          `This account is a "${userRole}" account, but you selected "${selectedRole}". Please choose the correct role or use the right account.`
        );
        return;
      }

      login(res.data);

      if (userRole === "admin") {
        navigate("/admin");
      } else if (userRole === "staff") {
        navigate("/staff");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
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
                "linear-gradient(90deg, #1e3c72, #2193b0)",
              boxShadow: "0 6px 18px rgba(33,147,176,0.4)",
              "&:hover": {
                background:
                  "linear-gradient(90deg, #162c54, #1e88a8)",
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
