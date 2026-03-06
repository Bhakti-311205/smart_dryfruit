import axiosClient from "./axiosClient";

export const getWishlistApi = () => axiosClient.get("/wishlist");
export const addToWishlistApi = (productId) =>
  axiosClient.post(`/wishlist/${productId}`);
export const removeFromWishlistApi = (productId) =>
  axiosClient.delete(`/wishlist/${productId}`);

