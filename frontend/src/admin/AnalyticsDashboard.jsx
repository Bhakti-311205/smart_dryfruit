import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { getAnalyticsApi } from "../api/orderApi";

const COLORS = ["#1e3c72", "#2193b0", "#ff9800", "#4caf50", "#f44336"];

const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await getAnalyticsApi(7);
        setData(res.data);
      } catch (err) {
        setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading analytics...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const dailyData =
    data?.daily?.map((d) => ({
      date: d._id,
      revenue: d.totalRevenue,
      orders: d.orderCount,
    })) || [];

  const statusData =
    data?.byStatus?.map((s) => ({
      name: s._id || "Unknown",
      value: s.count,
    })) || [];

  const paymentModeData =
    data?.byPaymentMode?.map((p) => ({
      name: p._id || "Unknown",
      value: p.count,
    })) || [];

  const totals = data?.totals || { totalOrders: 0, totalRevenue: 0 };

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
        Order Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Total Orders
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {totals.totalOrders}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Total Revenue
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              ₹{(totals.totalRevenue || 0).toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, height: 360 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Revenue & Orders (Last 7 Days)
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#1e3c72"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke="#ff9800"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, height: 360 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Orders by Status
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1e3c72" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, height: 360 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Orders by Payment Mode
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentModeData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {paymentModeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AnalyticsDashboard;

