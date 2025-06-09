import Cookies from 'js-cookie';
import axiosInstance from './axios';

/**
 * Gọi API refresh-token để lấy access token mới từ refresh token trong cookie
 * Lưu lại access token vào cookie 'token'
 * Ném lỗi nếu không có refresh token hoặc refresh thất bại
 */
export async function refreshAccessToken() {
  const refreshToken = Cookies.get('refresh_token');
  if (!refreshToken) throw new Error('No refresh token found');
  const res = await axiosInstance.post('/v1/auth/refresh-token', { refresh_token: refreshToken });
  const { access_token } = res.data;
  if (!access_token) throw new Error('No access token returned');
  Cookies.set('token', access_token, { expires: 7, secure: true, sameSite: 'strict' });
  return access_token;
}
