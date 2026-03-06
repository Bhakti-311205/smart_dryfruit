import axiosClient from "./axiosClient";

export const getSuppliersApi = () => axiosClient.get("/suppliers");
export const getSupplierApi = (id) => axiosClient.get(`/suppliers/${id}`);
export const createSupplierApi = (data) => axiosClient.post("/suppliers", data);
export const updateSupplierApi = (id, data) => axiosClient.put(`/suppliers/${id}`, data);
export const deleteSupplierApi = (id) => axiosClient.delete(`/suppliers/${id}`);
export const addProductToSupplierApi = (supplierId, data) => 
  axiosClient.post(`/suppliers/${supplierId}/products`, data);
