import axiosClient from "./axiosClient";

export const createOrderApi = (data) => axiosClient.post("/orders", data);
export const createRazorpayOrderApi = (data) => axiosClient.post("/orders/create-razorpay-order", data);
export const verifyRazorpayPaymentApi = (data) => axiosClient.post("/orders/verify-razorpay-payment", data);
export const getUserOrdersApi = () => axiosClient.get("/orders/my");
export const getOrderApi = (id) => axiosClient.get(`/orders/${id}`);
export const getAllOrdersApi = () => axiosClient.get("/orders/all");
export const getStaffOrdersApi = () => axiosClient.get("/orders/staff/all");
export const updateOrderStatusApi = (id, status) =>
  axiosClient.put(`/orders/status/${id}`, { status });
export const updatePaymentStatusApi = (id, paymentStatus) =>
  axiosClient.put(`/orders/payment/${id}`, { paymentStatus });
export const getDashboardStatsApi = () => axiosClient.get("/admin/dashboard");
export const getAnalyticsApi = (days = 7) =>
  axiosClient.get(`/admin/analytics?days=${days}`);
export const downloadInvoiceApi = (id) =>
  axiosClient.get(`/orders/${id}/invoice`, { responseType: "blob" });
