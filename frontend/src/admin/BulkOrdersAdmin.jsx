import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Box,
    CircularProgress,
    Alert,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { getBulkOrdersApi, updateBulkOrderStatusApi } from "../api/bulkOrderApi";
import PageNavigator from "../components/PageNavigator";

const STATUS_COLORS = {
    Pending: "warning",
    Contacted: "info",
    Confirmed: "success",
    Rejected: "error",
};

const BulkOrdersAdmin = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [status, setStatus] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await getBulkOrdersApi();
            setOrders(res.data || []);
        } catch (err) {
            setError("Failed to load bulk orders");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusOpen = (order) => {
        setSelectedOrder(order);
        setStatus(order.status);
        setOpen(true);
    };

    const handleStatusUpdate = async () => {
        try {
            await updateBulkOrderStatusApi(selectedOrder._id, status);
            setOpen(false);
            fetchOrders();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update status");
        }
    };

    if (loading) {
        return (
            <Container sx={{ py: 4, textAlign: "center" }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading bulk orders...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 800,
                    mb: 4,
                    background: "linear-gradient(135deg, #6B3E26, #8BC34A)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                }}
            >
                Bulk Order Inquiries
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {orders.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3, boxShadow: 3 }}>
                    <Typography variant="h6" color="text.secondary">
                        No bulk order inquiries yet
                    </Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#f5f8ff" }}>
                                <TableCell><strong>Company</strong></TableCell>
                                <TableCell><strong>Contact</strong></TableCell>
                                <TableCell><strong>Email / Phone</strong></TableCell>
                                <TableCell><strong>Products</strong></TableCell>
                                <TableCell><strong>Qty</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>Date</strong></TableCell>
                                <TableCell><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow
                                    key={order._id}
                                    sx={{ "&:hover": { backgroundColor: "#f9fbff" } }}
                                >
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {order.companyName}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{order.contactPerson}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{order.email}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {order.phone}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {order.products}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{order.estimatedQuantity}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={order.status}
                                            color={STATUS_COLORS[order.status] || "default"}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => handleStatusOpen(order)}
                                            sx={{
                                                borderColor: "#6B3E26",
                                                color: "#6B3E26",
                                                "&:hover": {
                                                    borderColor: "#3E2723",
                                                    backgroundColor: "rgba(30,60,114,0.05)",
                                                },
                                            }}
                                        >
                                            Update
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Status Update Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Update Inquiry Status</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Company: {selectedOrder?.companyName}
                        </Typography>
                        {selectedOrder?.message && (
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                <strong>Message:</strong> {selectedOrder.message}
                            </Typography>
                        )}
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                label="Status"
                            >
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Contacted">Contacted</MenuItem>
                                <MenuItem value="Confirmed">Confirmed</MenuItem>
                                <MenuItem value="Rejected">Rejected</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleStatusUpdate}
                        variant="contained"
                        sx={{
                            bgcolor: "#6B3E26",
                            "&:hover": { bgcolor: "#3E2723" },
                        }}
                    >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            <PageNavigator
                backTo="/admin"
                backLabel="Back to Admin Dashboard"
                nextTo="/admin/activity-logs"
                nextLabel="Go to Activity Logs"
            />
        </Container>
    );
};

export default BulkOrdersAdmin;
