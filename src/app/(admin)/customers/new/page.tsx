"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Input from "@/components/form/input";
import { useDispatch } from "react-redux";
import { addCustomer } from "@/redux/slices/customersSlice";
import Link from "next/link";
import AppHeader from "@/layout/AppHeader";
import HeaderItem from "@/layout/HeaderItem";
import Image from "next/image";
import Select from "@/components/form/Select";
import axiosInstance from "@/lib/axios";

interface FormData {
  username: string;
  displayname: string;
  email: string;
  customer_code: string;
  phone_number: string;
  customer_source: string;
  address: string;
  referral_code: string | null;
}

const initialFormData: FormData = {
  username: "",
  displayname: "",
  email: "",
  customer_code: "",
  phone_number: "",
  customer_source: "",
  address: "",
  referral_code: null
};

export default function NewCustomerPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    console.log(formData);

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
      // Make API call to create customer
      const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/customers/`, formData);
      
      // If API call is successful, update Redux store
      if (response.status === 200 || response.status === 201) {
        dispatch(addCustomer(response.data));
        console.log('Khách hàng đã được tạo thành công!');
        router.push("/customers");
        router.refresh();
      }
    } catch (error) {
      console.error("Error creating customer:", error);
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
    { value: "instagram", label: "Instagram" },
    { value: "threads", label: "Threads" },
    { value: "twitter", label: "Twitter" },
    { value: "tiktok", label: "Tiktok" },
    { value: "website", label: "Website" },
    { value: "referral", label: "Người quen giới thiệu" }
  ];



  const handleCancel = () => {
    router.push("/customers");
  };

  return (
    <div>
      <AppHeader>
        <HeaderItem
          title="Khách hàng / Thêm khách hàng"
          right={
            <div className="flex gap-2">
              <Button onClick={handleCancel} className="text-center justify-center bg-transparent border border-amber-500 text-amber-500 text-sm font-normal font-['Inter'] leading-snug">Hủy</Button>
              <Button onClick={handleSubmit} className="text-center justify-center text-white text-sm font-normal font-['Inter'] leading-snug">Lưu</Button>
            </div>
          }
          left={
            <Link href="/customers">
              <Image src="/images/icons/back.svg" alt="arrow-left" width={24} height={24} />
            </Link>
          }
        />
      </AppHeader>
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
              <Input
                label="Số điện thoại:"
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
                flex="flex items-center flex-1"
                classNameLabel="w-50 flex item-center"
                className="border border-gray-300"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
              />
              <div className="flex items-center">
                <label className="w-[150px] flex item-center text-sm font-medium text-gray-700">Nguồn khách hàng:</label>
                <Select
                wrapperClassName="flex-1"
                  options={customerSourceOptions}
                  placeholder="Chọn nguồn khách hàng"
                  onChange={(value) => {
                    setFormData(prev => ({
                      ...prev,
                      customer_source: value
                    }));
                    // Clear error when user selects a value
                    if (errors.customer_source) {
                      setErrors(prev => ({
                        ...prev,
                        customer_source: undefined
                      }));
                    }
                  }}
                  defaultValue={formData.customer_source}
                />
              </div>   
              
              <Input
                label="Mã giới thiệu:"
                flex="flex items-center"
                classNameLabel="w-50 flex item-center"
                className="border border-gray-300"
                name="referral_code"
                value={formData.referral_code || ''}
                onChange={handleChange}
              /> 
              <Input
                label="Mã khách hàng:"
                flex="flex items-center"
                classNameLabel="w-50 flex item-center"
                className="border border-gray-300"
                name="customer_code"
                value={formData.customer_code}
                onChange={handleChange}
                error={errors.customer_code}
              />
            </div>
            
          </div>
        </form>
      </div>
    </div>
  );
}