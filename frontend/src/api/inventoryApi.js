import axiosClient from "./axiosClient";

export const getInventoryApi = () => axiosClient.get("/inventory");
export const getInventoryHistoryApi = (productId) => 
  axiosClient.get(`/inventory/history/${productId}`);
export const updateStockApi = (productId, data) => 
  axiosClient.put(`/inventory/stock/${productId}`, data);
export const getLowStockApi = () => axiosClient.get("/inventory/low-stock");
export const updateStockLevelsApi = (productId, data) => 
  axiosClient.put(`/inventory/levels/${productId}`, data);
export const getInventorySummaryApi = () => axiosClient.get("/inventory/summary");
