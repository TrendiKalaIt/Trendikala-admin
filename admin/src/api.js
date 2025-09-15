// src/api.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL: BASE_URL,
});

// Setup interceptor to auto-logout on 401
export const setupInterceptors = (setUser) => {
  API.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (setUser) setUser(null); // update context
        window.location.href = "/login"; // redirect to login
      }
      return Promise.reject(error);
    }
  );
};

export default API;
