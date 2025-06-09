import axios from 'axios'
import Cookies from 'js-cookie'
import { refreshAccessToken } from './auth';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // lấy từ .env
  headers: {
    'accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

// Gắn access token vào header cho tất cả các request (GET, POST, PUT, DELETE)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    
    // Add token to Authorization header if it exists
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // For POST, PUT, DELETE requests, ensure content type is set to application/json
    if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase() || '')) {
      config.headers = config.headers || {};
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Tự động refresh token khi gặp 401
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (e) {
        Cookies.remove('token');
        window.location.href = '/signin';
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance
