import axiosClient from "./axiosClient";

export const submitBulkOrderApi = (data) =>
    axiosClient.post("/bulk-orders", data);

export const getBulkOrdersApi = () =>
    axiosClient.get("/bulk-orders");

export const updateBulkOrderStatusApi = (id, status) =>
    axiosClient.put(`/bulk-orders/${id}`, { status });
