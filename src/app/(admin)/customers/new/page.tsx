"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Input from "@/components/form/input";

interface FormData {
  username: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  customerSource: string;
  referralCode: string;
}

const initialFormData: FormData = {
  username: "",
  fullName: "",
  phone: "",
  email: "",
  address: "",
  customerSource: "",
  referralCode: ""
};

export default function NewCustomerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = "Tài khoản không được để trống";
    }
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Tên không được để trống";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "Địa chỉ không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement API call to create customer
      // const response = await createCustomer(formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push("/customers");
      router.refresh();
    } catch (error) {
      console.error("Error creating customer:", error);
      // Handle error (show error message to user)
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

  const customerSourceOptions = [
    { value: "facebook", label: "Facebook" },
    { value: "Instagram ", label: "Instagram " },
    { value: "Threads ", label: "Threads" },
    { value: "Twitter", label: "Twitter" },
    { value: "Tiktok", label: "Tiktok" },
    { value: "Website", label: "Website" },
    { value: "referral", label: "Người quen giới thiệu" }
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          Thêm khách hàng mới
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Điền thông tin khách hàng vào form bên dưới
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              label="Tài khoản"
              name="username"
              placeholder="Nhập tài khoản"
              onChange={handleChange}
              error={errors.username}
            />
          </div>

          <div>
            <Input
              label="Tên người dùng"
              name="fullName"
              placeholder="Nhập tên người dùng"
              onChange={handleChange}
              error={errors.fullName}
            />
          </div>

          <div>
            <Input
              label="Số điện thoại"
              name="phone"
              type="tel"
              placeholder="Nhập số điện thoại"
              onChange={handleChange}
              error={errors.phone}
            />
          </div>

          <div>
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="Nhập email"
              onChange={handleChange}
              error={errors.email}
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="Địa chỉ"
              name="address"
              placeholder="Nhập địa chỉ"
              onChange={handleChange}
              error={errors.address}
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Nguồn khách hàng
            </label>
            <select
              name="customerSource"
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950"
              onChange={handleChange}
              value={formData.customerSource}
            >
              <option value="">Chọn nguồn khách hàng</option>
              {customerSourceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.customerSource && (
              <p className="mt-1 text-sm text-red-500">{errors.customerSource}</p>
            )}
          </div>

          <div>
            <Input
              label="Mã giới thiệu"
              name="referralCode"
              placeholder="Nhập mã giới thiệu"
              onChange={handleChange}
              error={errors.referralCode}
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
          >
            Thêm khách hàng
          </Button>
        </div>
      </form>
    </div>
  );
} 