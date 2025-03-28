import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // lấy từ .env
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // nếu dùng cookie
})

export default axiosInstance
