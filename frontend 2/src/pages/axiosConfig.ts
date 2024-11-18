// src/axiosConfig.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Địa chỉ API của bạn
});

// Cấu hình token mặc định nếu có
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Lấy token từ localStorage hoặc nơi lưu trữ token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Thêm token vào header của request
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
