"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Input from "@/components/form/input";
import { useDispatch } from "react-redux";
import Link from "next/link";
import AppHeader from "@/layout/AppHeader";
import HeaderItem from "@/layout/HeaderItem";
import Image from "next/image";
import Select from "@/components/form/Select";
import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";
import axios from "axios";
interface FormData {
  username: string;
  displayname: string;
  phone_number: string;
  email: string;
  address: string;
  role_name: string;
  cccd: string;
  issue_date: string;
  expiry_date: string;
  place_of_issue: string;
  password: string;
}

const initialFormData: FormData = {
  username: "",
  displayname: "",
  phone_number: "",
  email: "",
  address: "",
  role_name: "",
  cccd: "",
  place_of_issue: "",
  issue_date: "",
  expiry_date: "",
  password: ""
};

export default function NewEmployeePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Tài khoản không được để trống";
    }

    if (!formData.displayname.trim()) {
      newErrors.displayname = "Tên không được để trống";
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Số điện thoại không được để trống";
    } else if (!/^[0-9]{10}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Số điện thoại không hợp lệ";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Địa chỉ không được để trống";
    }

    if (!formData.role_name.trim()) {
      newErrors.role_name = "Vai trò không được để trống";
    }

    if (!formData.cccd.trim()) {
      newErrors.cccd = "CCCD không được để trống";
    }

    if (!formData.issue_date.trim()) {
      newErrors.issue_date = "Ngày cấp không được để trống";
    }

    if (!formData.expiry_date.trim()) {
      newErrors.expiry_date = "Ngày hết hạn không được để trống";
    }

    if (!formData.place_of_issue.trim()) {
      newErrors.place_of_issue = "Nơi cấp không được để trống";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Mật khẩu không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Generate a random password
  const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(password);
    // Also update the formData
    setFormData(prev => ({
      ...prev,
      password: password
    }));
  };

  // Handle password change
  const handlePasswordChange = () => {
    if (newPassword.trim()) {
      setFormData(prev => ({
        ...prev,
        password: newPassword
      }));
      setShowPasswordModal(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare API payload
      const staffData = {
        username: formData.username,
        displayname: formData.displayname,
        phone_number: formData.phone_number,
        email: formData.email,
        address: formData.address,
        role_name: formData.role_name,
        cccd: formData.cccd,
        issue_date: formData.issue_date,
        expiry_date: formData.expiry_date,
        place_of_issue: formData.place_of_issue,
        password: formData.password
      };
      // Call API to create new staff
      const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/staff/createStaff`, staffData);
      if (response.status === 200 || response.status === 201) {
        // Success - redirect to employees list
        router.push("/employees");
        router.refresh();
      } else {
        // Handle unexpected success status
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error creating employee:", error);
      // You could set an error state here to show to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const roleOptions = [
    { value: "Admin", label: "Admin" },
    { value: "Quản lý/bàn giao", label: "Quản lý/bàn giao" },
    { value: "Chuyên viên pháp lý", label: "Chuyên viên pháp lý" },
    { value: "SEO", label: "SEO" },
    { value: "backoffice", label: "backoffice" },
    { value: "Thực tập sinh", label: "Thực tập sinh" }
  ];



  const handleCancel = () => {
    router.push("/employees");
  };

  return (
    <div>
      <AppHeader>
        <HeaderItem
          title="Nhân viên / Thêm nhân viên"
          right={
            <div className="flex gap-2">
              <Button onClick={handleCancel} className="text-center justify-center bg-transparent border border-amber-500 text-amber-500 text-sm font-normal font-['Inter'] leading-snug">Hủy</Button>
              <Button onClick={handleSubmit} className="text-center justify-center text-white text-sm font-normal font-['Inter'] leading-snug">Lưu</Button>
            </div>
          }
          left={
            <Link href="/employees">
              <Image src="/images/icons/back.svg" alt="arrow-left" width={24} height={24} />
            </Link>
          }
        />
      </AppHeader>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Thêm nhân viên mới
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Điền thông tin nhân viên vào form bên dưới
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="px-12 py-5 shadow-[inset_-1px_0px_0px_0px_rgba(0,0,0,0.13)] mb-15 border rounded-xl relative">
            <div className="grid grid-cols-2 gap-x-35 gap-y-3">
              <Input
                label="Tài khoản:"
                flex="flex items-center"
                classNameLabel="w-50 flex item-center"
                className="border border-gray-300"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
              />
              <Input
                label="Tên người dùng:"
                flex="flex items-center"
                classNameLabel="w-50 flex item-center"
                className="border border-gray-300"
                name="displayname"
                value={formData.displayname}
                onChange={handleChange}
                error={errors.displayname}
              />
              <div className="flex items-center">
                <label className="w-[150px] flex item-center text-sm font-medium text-gray-700">Vai trò:</label>
                <Select
                  wrapperClassName="flex-1"
                  options={roleOptions}
                  placeholder="Chọn vai trò"
                  onChange={(value) => {
                    setFormData(prev => ({
                      ...prev,
                      role_name: value
                    }));
                    // Clear error when user selects a value
                    if (errors.role_name) {
                      setErrors(prev => ({
                        ...prev,
                        role_name: undefined
                      }));
                    }
                  }}
                  defaultValue={formData.role_name}
                />
              </div>
              <Input
                label="SĐT:"
                flex="flex items-center"
                classNameLabel="w-50 flex item-center"
                className="border border-gray-300"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                error={errors.phone_number}
              />
              <Input
                label="Email:"
                flex="flex items-center"
                classNameLabel="w-50 flex item-center"
                className="border border-gray-300"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              <Input
                label="Địa chỉ:"
                flex="flex items-center"
                classNameLabel="w-50 flex item-center"
                className="border border-gray-300"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
              />
              <Input
                label="CCCD:"
                flex="flex items-center"
                classNameLabel="w-50 flex item-center"
                className="border border-gray-300"
                name="cccd"
                value={formData.cccd}
                onChange={handleChange}
                error={errors.cccd}
              />
              <Input
                label="Nơi cấp:"
                flex="flex items-center"
                classNameLabel="w-50 flex item-center"
                className="border border-gray-300"
                name="place_of_issue"
                value={formData.place_of_issue}
                onChange={handleChange}
                error={errors.place_of_issue}
              />
              <Input
                label="Ngày cấp:"
                flex="flex items-center"
                classNameLabel="w-50 flex item-center"
                className="border border-gray-300"
                name="issue_date"
                value={formData.issue_date}
                onChange={handleChange}
                error={errors.issue_date}
                type="date"
              />
              <Input
                label="Ngày hết hạn:"
                flex="flex items-center"
                classNameLabel="w-50 flex item-center"
                className="border border-gray-300"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                error={errors.expiry_date}
                type="date"
              />
              <div className="bg-white flex rounded-lg relative">
                <label className="w-[150px] flex items-center">Mật khẩu</label>

                <Input
                  flex="flex-1"
                  type="text"
                  placeholder="Nhập mật khẩu"
                  className="border border-gray-300"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    // Also update the formData
                    setFormData(prev => ({
                      ...prev,
                      password: e.target.value
                    }));
                    // Clear error when user types
                    if (errors.password) {
                      setErrors(prev => ({
                        ...prev,
                        password: undefined
                      }));
                    }
                  }}
                  error={errors.password}
                />
                <Button variant="none" onClick={generateRandomPassword} className="absolute top-[50%] right-0 translate-y-[-50%] bg-transparent">Tạo mật khẩu</Button>
              </div>
            </div>
          </div>
        </form>
      </div>

    </div>
  );
}