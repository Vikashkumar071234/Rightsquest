import axios from "axios";

// ✅ Use localhost (not 127.0.0.1) — avoids CORS issues on Windows
const API = axios.create({
  baseURL: "http://localhost:8000", 
});

// ✅ Automatically attach JWT access token to every request
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

// ✅ Optional: Global error handler for expired tokens or unauthorized access
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("⚠️ Token expired or unauthorized — redirecting to login...");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.href = "/login"; // Force redirect to login page
    }
    return Promise.reject(error);
  }
);

export default API;
