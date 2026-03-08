import React, { useState } from "react";
import {
    Container,
    Typography,
    Paper,
    Box,
    TextField,
    Button,
    Alert,
    Grid,
} from "@mui/material";
import { Business, Send } from "@mui/icons-material";
import { submitBulkOrderApi } from "../api/bulkOrderApi";

const BulkOrder = () => {
    const [form, setForm] = useState({
        companyName: "",
        contactPerson: "",
        email: "",
        phone: "",
        products: "",
        estimatedQuantity: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (
            !form.companyName ||
            !form.contactPerson ||
            !form.email ||
            !form.phone ||
            !form.products ||
            !form.estimatedQuantity
        ) {
            setError("Please fill in all required fields");
            return;
        }

        try {
            setLoading(true);
            await submitBulkOrderApi(form);
            setSuccess(
                "Your bulk order inquiry has been submitted successfully! Our team will contact you within 24–48 hours."
            );
            setForm({
                companyName: "",
                contactPerson: "",
                email: "",
                phone: "",
                products: "",
                estimatedQuantity: "",
                message: "",
            });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit inquiry");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
                <Business sx={{ fontSize: 60, color: "#6B3E26", mb: 1 }} />
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 800,
                        mb: 1,
                        background: "linear-gradient(135deg, #6B3E26, #8BC34A)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    Bulk & Corporate Orders
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Need dry fruits in bulk for your business, events, or gifting?
                    Fill out the form below and our team will get back to you with the
                    best pricing.
                </Typography>
            </Box>

            {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    {success}
                </Alert>
            )}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Paper
                component="form"
                onSubmit={handleSubmit}
                sx={{ p: 4, borderRadius: 3, boxShadow: 3, bgcolor: "rgba(234, 219, 200, 0.95)" }}
            >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Inquiry Form
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Company / Organization Name *"
                            name="companyName"
                            value={form.companyName}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Contact Person Name *"
                            name="contactPerson"
                            value={form.contactPerson}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Email Address *"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Phone Number *"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Products of Interest *"
                            name="products"
                            placeholder="e.g., Almonds, Cashews, Walnuts, Mixed Dry Fruits"
                            value={form.products}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Estimated Quantity (Kg) *"
                            name="estimatedQuantity"
                            placeholder="e.g., 50 Kg, 100 Kg, 500 Kg"
                            value={form.estimatedQuantity}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Additional Message"
                            name="message"
                            placeholder="Any specific requirements, delivery schedule, packaging preferences..."
                            value={form.message}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading}
                    startIcon={<Send />}
                    sx={{
                        mt: 3,
                        bgcolor: "#6B3E26",
                        fontWeight: 600,
                        py: 1.5,
                        borderRadius: 2,
                        fontSize: "1.1rem",
                        "&:hover": { bgcolor: "#3E2723" },
                    }}
                >
                    {loading ? "Submitting..." : "Submit Bulk Order Inquiry"}
                </Button>
            </Paper>
        </Container>
    );
};

export default BulkOrder;
