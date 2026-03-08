import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
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
  CartesianGrid,
} from "recharts";
import { getAnalyticsApi } from "../api/orderApi";
import PageNavigator from "../components/PageNavigator";

const COLORS = ["#6B3E26", "#8BC34A", "#ff9800", "#4caf50", "#f44336"];

const ChartCard = ({ title, height = 320, children }) => (
  <Paper
    sx={{
      p: 3,
      borderRadius: 3,
      boxShadow: 3,
      height: height + 64, // card height = chart height + title + padding
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, flexShrink: 0 }}>
      {title}
    </Typography>
    <Box sx={{ flex: 1, minHeight: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </Box>
  </Paper>
);

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
      date: d._id?.slice(5) || d._id, // trim year, show MM-DD
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
      {/* ── Page Title ── */}
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
        Order Analytics
      </Typography>

      {/* ── Summary Cards ── */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: 3,
              borderLeft: "5px solid #6B3E26",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Total Orders
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#6B3E26" }}>
              {totals.totalOrders}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: 3,
              borderLeft: "5px solid #8BC34A",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Total Revenue
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#8BC34A" }}>
              ₹{(totals.totalRevenue || 0).toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* ── Row 1: Line Chart (full width) ── */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <ChartCard title="Revenue & Orders (Last 7 Days)" height={420}>
            <LineChart
              data={dailyData}
              margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                angle={-30}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fontSize: 12 }} width={60} />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue (₹)"
                stroke="#6B3E26"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="orders"
                name="Orders"
                stroke="#ff9800"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartCard>
        </Grid>
      </Grid>

      {/* ── Row 2: Bar Chart + Pie Chart side by side ── */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Orders by Status */}
        <Grid item xs={12} md={6}>
          <ChartCard title="Orders by Status" height={420}>
            <BarChart
              data={statusData}
              margin={{ top: 10, right: 20, left: 10, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                angle={-35}
                textAnchor="end"
                interval={0}
                height={70}
              />
              <YAxis tick={{ fontSize: 12 }} width={40} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" name="Orders" fill="#6B3E26" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartCard>
        </Grid>

        {/* Orders by Payment Mode */}
        <Grid item xs={12} md={6}>
          <ChartCard title="Orders by Payment Mode" height={420}>
            <PieChart margin={{ top: 10, right: 50, left: 50, bottom: 10 }}>
              <Pie
                data={paymentModeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="42%"
                outerRadius={110}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={true}
              >
                {paymentModeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
              />
            </PieChart>
          </ChartCard>
        </Grid>
      </Grid>

      <PageNavigator
        backTo="/admin"
        backLabel="Back to Admin Dashboard"
        nextTo="/"
        nextLabel="Go to Home"
      />
    </Container>
  );
};

export default AnalyticsDashboard;

