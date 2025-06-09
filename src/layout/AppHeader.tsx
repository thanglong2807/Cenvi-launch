"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";

import { setUser, logout, User } from "@/redux/slices/authSlice";
import axiosInstance from "@/lib/axios";

// Add authorization header to axios instance if token exists
const token = Cookies.get("token");
if (token) {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default function AppHeader({ children }: { children?: React.ReactNode }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
const [dataUser, setDataUser] = useState<User | null>(null);
  // Lấy lại user nếu chưa có trong Redux nhưng có token trong cookie
  useEffect(() => {
    const token = Cookies.get("token");
    const userJson = Cookies.get("user");
    
    // Nếu có token nhưng chưa xác thực trong Redux
    if (token && !isAuthenticated) {
      
      // Thử lấy user từ cookie trước
      if (userJson) {
        try {
          const parsedUser = JSON.parse(userJson);
          dispatch(setUser({
            token,
            tokenType: 'Bearer',
            user: parsedUser
          }));
          return;
        } catch (e) {
          console.error('Failed to parse user from cookies', e);
          // Tiếp tục với API call nếu parse thất bại
        }
      }
      
      // Nếu không có user trong cookie hoặc parse thất bại, gọi API
      axiosInstance.get("/v1/auth/me")
        .then(res => {
          // Đảm bảo đúng cấu trúc dữ liệu
          const userData = res.data.user || res.data;
          
          // Lưu thông tin user vào Redux và cookie
          dispatch(setUser({
            token,
            tokenType: 'Bearer',
            user: userData
          }));
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          // Token không hợp lệ, xóa token và đăng xuất
          dispatch(logout());
          router.push("/signin");
        })
    } else if (!token && !isAuthenticated) {
      // Không có token, chuyển hướng đến trang đăng nhập
      router.push("/signin");
    }
  }, [isAuthenticated, dispatch, router]);

  useEffect(() => {
    const userJson = Cookies.get("user");
    if (userJson) {
      try {
        const parsedUser = JSON.parse(userJson);
        setDataUser(parsedUser);
      } catch (e) {
        console.error('Failed to parse user from cookies', e);
      }
    }
  }, []);

  const handleLogout = () => {
    dispatch(logout()); // This will also remove cookies
    router.push("/signin");
  };

  const handleTest = () => {
    console.log(user)
    console.log(dataUser);
    
  }
  
  
  return (
    <div className="bg-white">
      {/* PHẦN TRÊN: Cố định */}
      <div className="flex items-center justify-between px-6 py-4 border-b-2">
        <div className="flex items-center gap-2">
          {/* Ví dụ: icon, tên trang, breadcrumb */}
        </div>
        <div className="flex items-center gap-2">
          {/* Avatar, tên user, role */}
          <div className="flex items-center gap-2">
            <img src="/images/user/z6404998099947_038f908df877578c2337104af90cbd8f.jpg" className="w-10 h-10 rounded-full" alt="User avatar" />
            <div>
              <div className="font-semibold">
                {dataUser?.displayname || dataUser?.username || 'User'}
              </div>
              <div className="text-xs text-gray-400">
                {Array.isArray(dataUser?.roles) ? dataUser?.roles.join(', ') : 
                 typeof dataUser?.roles === 'string' ? dataUser?.roles : 'Role'}
              </div>
            </div>
            <Button className="bg-transparent border-none shadow-none hover:bg-transparent" onClick={handleLogout}>
              <Image src={"/images/icons/logout.svg"} alt="logout" width={20} height={20} />
            </Button>
          </div>
        </div>
      </div>
      {/* PHẦN DƯỚI: Thay đổi theo từng trang */}
      {children && (
        <div className="px-6 py-4 border-b-1">
          {children}
        </div>
      )}
    </div>
  );
}
