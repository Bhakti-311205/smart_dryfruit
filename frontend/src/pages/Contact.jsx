import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
} from "@mui/material";
import { submitContactMessage } from "../api/contactApi";
import PageNavigator from "../components/PageNavigator";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFeedback("");

    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all fields before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      await submitContactMessage(form);
      setFeedback("Thank you! Your message has been sent.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send message. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box className="sd-page-section">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 3,
            background:
              "linear-gradient(135deg, #1e3c72 0%, #2193b0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Contact NutHub
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          This contact section shows how our dry fruit business collects
          customer enquiries. Fill the form and we will get back to you.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 3,
                bgcolor: "#ffffff",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Send us a message
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  label="Name"
                  name="name"
                  fullWidth
                  margin="normal"
                  value={form.name}
                  onChange={handleChange}
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  fullWidth
                  margin="normal"
                  value={form.email}
                  onChange={handleChange}
                />
                <TextField
                  label="Message"
                  name="message"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                />

                {error && (
                  <Typography
                    variant="body2"
                    color="error"
                    sx={{ mt: 1 }}
                  >
                    {error}
                  </Typography>
                )}

                {feedback && (
                  <Typography
                    variant="body2"
                    color="success.main"
                    sx={{ mt: 1 }}
                  >
                    {feedback}
                  </Typography>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                  sx={{
                    mt: 2,
                    borderRadius: 2,
                    px: 4,
                    background:
                      "linear-gradient(90deg, #1e3c72, #2193b0)",
                  }}
                >
                  {submitting ? "Submitting..." : "Submit"}
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 3,
                bgcolor: "#ffffff",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Business Details
              </Typography>

              <Typography variant="body2" color="text.secondary">
                <strong>Business Name:</strong> NutHub – Dry Fruit Business
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Location:</strong> Demo Address, India
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Phone:</strong> +91-9876543210
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Email:</strong> support@nuthub-demo.com
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <PageNavigator
          backTo="/"
          backLabel="Back to Home"
          nextTo="/products"
          nextLabel="Browse Products"
        />
      </Box>
    </Container>
  );
};

export default Contact;
