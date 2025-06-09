"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import {  EyeCloseIcon, EyeIcon } from "@/icons";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from 'react-redux'
import { setUser } from "@/redux/slices/authSlice";
import Alert from "../ui/alert/Alert";
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import Image from "next/image";

import axios, { AxiosError } from 'axios';
import axiosInstance from '@/lib/axios';

interface ApiError {
  message: string;
}

interface SignInFormProps {
  callbackUrl?: string;
}

export default function SignInForm({ callbackUrl = '/' }: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const dispatch = useDispatch()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async () => {
    console.log(`username: ${username}`);
    console.log(`password: ${password}`);
    setLoading(true);
    
    // Validate input
    if (!username.trim()) {
      setError('Vui lòng nhập username');
      
      setLoading(false);
      return;
    }
    if (!password) {
      setError('Vui lòng nhập mật khẩu');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/auth/login`, {
        username:username,
        password:password
      },{
        headers: {
         'accept': 'application/json',
         'Content-Type': 'application/x-www-form-urlencoded' 
        }
      }); 
     
      
      const { access_token, token_type, user } = response.data;
      // Lưu token và thông tin user
      Cookies.set('token', access_token, { 
        path: '/', 
        expires: isChecked ? 30 : 7,
        secure: true,
        sameSite: 'strict'
      });

      // Lưu thông tin user vào Redux store
      dispatch(setUser({ 
        token: access_token,
        tokenType: token_type,
        user: {
          id: user.id,
          username: user.username,
          displayname: user.displayname,
          isActive: user.is_active,
          roles: user.roles,
          permissions: user.permissions
        }
      }));
      
      // Chuyển hướng dựa vào role
      const isAdmin = user.roles.some((role: string) => role === 'admin');
      router.push(isAdmin ? '/' : callbackUrl);

    } catch (err) {
      const error = err as AxiosError<ApiError>;
      // Xóa token nếu có
      Cookies.remove('token');
      dispatch(setUser(null));
      console.log(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="flex flex-col  items-center justify-center  min-h-screen">
      <div className=" w-[629px]  bg-white rounded-2xl shadow-xl px-34 py-40 flex flex-col items-center">
        {/* Logo nhỏ phía trên */}
        <div className="flex justify-center mb-6">
          
            <Image src="/images/logoCenvi.png" alt="logo" width={56} height={56} />
          
        </div>
        {/* Tiêu đề và mô tả */}
        <h1 className="text-2xl font-bold text-[#e17101] text-center mb-2">Đăng nhập</h1>
        <p className="text-gray-500 text-center mb-8">Chào mừng bạn đến với trang Admin!</p>
        {/* Form */}
        <div className="w-full flex flex-col gap-3 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tên đăng nhập</label>
            <Input
              placeholder="Vui lòng nhập Tên đăng nhập"
              defaultValue={username}
              onChange={e => setUsername(e.target.value)}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e17101] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu</label>
            <div className="relative">
              <Input
                defaultValue={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e17101] transition pr-10"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-3 top-1/2"
              >
                {showPassword ? (
                  <EyeIcon className="fill-gray-500" />
                ) : (
                  <EyeCloseIcon className="fill-gray-500" />
                )}
              </span>
            </div>
          </div>
          <div className="flex items-center mb-2">
            <Checkbox checked={isChecked} onChange={setIsChecked} />
            <span className="ml-2 text-sm text-gray-700">Lưu mật khẩu</span>
          </div>
          {error && (
            <Alert
              variant="error"
              showLink={false}
              title="Lỗi"
              message={error}
            />
          )}
          <Button
            className="w-full bg-[#F89A1C] hover:bg-[#F89A1C] text-white font-semibold rounded-lg py-2 text-base transition"
            size="lg"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </div>
      </div>
    </div>
  );
}
