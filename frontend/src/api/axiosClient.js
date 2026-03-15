import axios from "axios";

let apiBaseUrl = process.env.REACT_APP_API_URL || "https://smart-dryfruit-3.onrender.com/api";
if (apiBaseUrl) {
  apiBaseUrl = apiBaseUrl.replace(/\/+$/, "");
  if (!apiBaseUrl.endsWith("/api")) {
    apiBaseUrl += "/api";
  }
}

const axiosClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 30000, // 30 seconds
});

// Add token to requests
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (unauthorized)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
