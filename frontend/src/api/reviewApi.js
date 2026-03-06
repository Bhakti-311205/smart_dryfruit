import axiosClient from "./axiosClient";

export const getProductReviewsApi = (productId) =>
    axiosClient.get(`/reviews/${productId}`);

export const createReviewApi = (data) =>
    axiosClient.post("/reviews", data);
