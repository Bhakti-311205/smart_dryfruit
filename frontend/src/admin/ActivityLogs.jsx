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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
} from "@mui/material";
import { getActivityLogsApi } from "../api/activityLogApi";

const ACTION_COLORS = {
    LOGIN: "info",
    LOGOUT: "default",
    CREATE_ORDER: "success",
    UPDATE_ORDER_STATUS: "warning",
    UPDATE_PAYMENT_STATUS: "warning",
    CREATE_PRODUCT: "success",
    UPDATE_PRODUCT: "info",
    DELETE_PRODUCT: "error",
    UPDATE_STOCK: "warning",
    CREATE_SUPPLIER: "success",
    UPDATE_SUPPLIER: "info",
    DELETE_SUPPLIER: "error",
    CREATE_USER: "success",
    UPDATE_USER: "info",
    DELETE_USER: "error",
    BULK_ORDER_INQUIRY: "info",
    OTHER: "default",
};

const ACTION_OPTIONS = [
    "LOGIN",
    "LOGOUT",
    "CREATE_ORDER",
    "UPDATE_ORDER_STATUS",
    "UPDATE_PAYMENT_STATUS",
    "CREATE_PRODUCT",
    "UPDATE_PRODUCT",
    "DELETE_PRODUCT",
    "UPDATE_STOCK",
    "CREATE_SUPPLIER",
    "UPDATE_SUPPLIER",
    "DELETE_SUPPLIER",
    "CREATE_USER",
    "BULK_ORDER_INQUIRY",
];

const ActivityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [actionFilter, setActionFilter] = useState("");

    useEffect(() => {
        fetchLogs();
    }, [page, actionFilter]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const res = await getActivityLogsApi(page, actionFilter);
            setLogs(res.data.logs || []);
            setTotalPages(res.data.totalPages || 1);
        } catch (err) {
            setError("Failed to load activity logs");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container sx={{ py: 4, textAlign: "center" }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading activity logs...</Typography>
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
                    background: "linear-gradient(135deg, #1e3c72, #2193b0)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                }}
            >
                Activity Logs
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Filter */}
            <Box sx={{ mb: 3, display: "flex", gap: 2, alignItems: "center" }}>
                <FormControl sx={{ minWidth: 200 }} size="small">
                    <InputLabel>Filter by Action</InputLabel>
                    <Select
                        value={actionFilter}
                        onChange={(e) => {
                            setActionFilter(e.target.value);
                            setPage(1);
                        }}
                        label="Filter by Action"
                    >
                        <MenuItem value="">All Actions</MenuItem>
                        {ACTION_OPTIONS.map((opt) => (
                            <MenuItem key={opt} value={opt}>
                                {opt.replace(/_/g, " ")}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {logs.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3, boxShadow: 3 }}>
                    <Typography variant="h6" color="text.secondary">
                        No activity logs found
                    </Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#f5f8ff" }}>
                                <TableCell><strong>User</strong></TableCell>
                                <TableCell><strong>Role</strong></TableCell>
                                <TableCell><strong>Action</strong></TableCell>
                                <TableCell><strong>Details</strong></TableCell>
                                <TableCell><strong>Date & Time</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow
                                    key={log._id}
                                    sx={{ "&:hover": { backgroundColor: "#f9fbff" } }}
                                >
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {log.user?.name || "Unknown"}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {log.user?.email || ""}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={log.user?.role || "N/A"}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={log.action?.replace(/_/g, " ") || "N/A"}
                                            color={ACTION_COLORS[log.action] || "default"}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {log.details || "-"}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {log.createdAt
                                            ? new Date(log.createdAt).toLocaleString()
                                            : "-"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
                    <Button
                        variant="outlined"
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Previous
                    </Button>
                    <Typography sx={{ display: "flex", alignItems: "center" }}>
                        Page {page} of {totalPages}
                    </Typography>
                    <Button
                        variant="outlined"
                        disabled={page >= totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </Button>
                </Box>
            )}
        </Container>
    );
};

export default ActivityLogs;
