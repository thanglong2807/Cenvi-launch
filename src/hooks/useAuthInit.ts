import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/slices/authSlice';
import axiosInstance from '@/lib/axios';

/**
 * Khi load lại trang, kiểm tra token hoặc refresh-token để lấy lại thông tin user.
 * Nếu không có thông tin user thì chuyển đến màn đăng nhập.
 */
export default function useAuthInit() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('token');
      const refreshToken = Cookies.get('refresh_token');
      if (!token && !refreshToken) {
        window.location.href = '/signin';
        return;
      }
      try {
        // Gọi API lấy thông tin user
        const res = await axiosInstance.get('/v1/auth/me');
        dispatch(setUser(res.data.user || res.data));
      } catch (error) {
        // Nếu lỗi (token hết hạn, refresh cũng lỗi), chuyển về signin
        Cookies.remove('token');
        window.location.href = '/signin';
      }
    };
    checkAuth();
  }, [dispatch]);
}
