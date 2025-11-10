import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000",
  headers: { "Content-Type": "application/json" },
});

// ✅ Attach JWT access token automatically to all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle token expiry (401 Unauthorized)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Token expired or invalid — redirecting to login...");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.href = "/login"; // Redirect user to login
    }
    return Promise.reject(error);
  }
);

export default API;
