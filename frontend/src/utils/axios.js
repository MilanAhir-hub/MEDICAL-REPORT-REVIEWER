import axios from "axios";
import Cookies from 'js-cookie';

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Request interceptor (attach token from cookies)
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (handle errors globally)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized – redirect to login");
      // Optionally clear the token cookie on 401
      Cookies.remove("token");
    }
    return Promise.reject(error); 
  }
);

export default api;