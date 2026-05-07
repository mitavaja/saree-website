import axios from "axios";
import API_URL from "../config/api.js";

// Create axios instance with auth header support
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor (for admin token)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken'); // Assuming admin stores token as 'adminToken'
  if (token) {
    config.headers.Token = token; // Backend expects 'token' header as 'Token'
  }
  return config;
});

export default axiosInstance;

