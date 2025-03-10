// services/axios-config.ts
import axios from "axios";

const BASE_URL = "https://breadfund.onrender.com";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("access_token");
//       localStorage.removeItem("token_expiration");
//       window.location.href = "/auth/login";
//     }
//     return Promise.reject(error);
//   }
// );

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export const clientRequest = {
  campaign: {
    create: async (data: any) => {
      const response = await axiosInstance.post("/campaign/", data);
      return response.data;
    },
    // Add other campaign-related methods here
  },
  // Add other API endpoints here
};
