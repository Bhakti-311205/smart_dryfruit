import axiosClient from "./axiosClient";

export const loginApi = (data) => axiosClient.post("/auth/login", data);
export const registerApi = (data) => axiosClient.post("/auth/register", data);
export const verifyOtpApi = (data) => axiosClient.post("/auth/verify-otp", data);
export const resendOtpApi = (data) => axiosClient.post("/auth/resend-otp", data);
export const getProfileApi = () => axiosClient.get("/auth/profile");
