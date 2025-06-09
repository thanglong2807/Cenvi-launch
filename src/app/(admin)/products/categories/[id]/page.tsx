"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Input from "@/components/form/input";
import { useDispatch } from "react-redux";
import Link from "next/link";
import AppHeader from "@/layout/AppHeader";
import HeaderItem from "@/layout/HeaderItem";
import Image from "next/image";
import Container from "@/components/Container/Container";
import Select from "@/components/form/Select";

interface FormData {
  productCode: string;
  productName: string;
  specification: string;
  unit: string;
  options: string;
  color: string;
  supplier: string;
  price: string;
  image?: File | null;
  description: string;
}

interface FormErrors {
  productCode?: string;
  productName?: string;
  specification?: string;
  unit?: string;
  options?: string;
  color?: string;
  supplier?: string;
  price?: string;
  image?: string;
  description?: string;
}

export default function CatalogDetailPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<FormData>({
    productCode: "",
    productName: "",
    specification: "",
    unit: "",
    options: "",
    color: "",
    supplier: "",
    price: "",
    image: null,
    description: ""
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Sample options for dropdowns
  const unitOptions = [
    { label: "Cái", value: "cai" },
    { label: "Bộ", value: "bo" },
    { label: "Chiếc", value: "chiec" },
    { label: "Kg", value: "kg" }
  ];

  const supplierOptions = [
    { label: "Nhà cung cấp A", value: "supplier_a" },
    { label: "Nhà cung cấp B", value: "supplier_b" },
    { label: "Nhà cung cấp C", value: "supplier_c" }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files![0]
      }));
    }
  };

  const handleSubmit = () => {
    // Validation logic would go here
    // For now, just log the form data
    console.log(formData);
  };

  return (
    <div className="space-y-6 bg-[#fff]">
      <AppHeader>
        <HeaderItem
          title="Sản phẩm / Danh sách sản phẩm / Thông tin sản phẩm"
          right={
            <div className="flex gap-2">
              <Button
                className="text-center justify-center bg-transparent border border-amber-500 text-amber-500 text-sm font-normal font-['Inter'] leading-snug"
                onClick={() => router.back()}
              >
                Hủy
              </Button>
              <Button
                className="text-center justify-center text-white text-sm font-normal font-['Inter'] leading-snug"
                onClick={handleSubmit}
              >
                Lưu
              </Button>
            </div>
          }
          left={
            <Link href="/products/productlist">
              <Image src="/images/icons/back.svg" alt="arrow-left" width={24} height={24} />
            </Link>
          }
        />
      </AppHeader>

      <Container>
        <div className="grid grid-cols-2 gap-x-35 border border-gray-300 rounded-2xl px-14 py-8 gap-y-3">
          <Input
            label="Mã sản phẩm:"
            flex="flex items-center"
            classNameLabel="w-50 flex item-center"
            className="border border-gray-300"
            name="productCode"
            value={formData.productCode}
            onChange={handleChange}
            error={errors.productCode}
            required
          />
          <Input
            label="Tên sản phẩm:"
            flex="flex items-center"
            classNameLabel="w-50 flex item-center"
            className="border border-gray-300"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            error={errors.productName}
            required
          />
          <div className="flex items-center">
            <label className="w-[150px] flex item-center text-sm font-medium text-gray-700">Thông số:</label>
            <div className="flex-1 flex items-center gap-2">
              <Input
                className="border border-gray-300 w-full"
                name="specification"
                value={formData.specification}
                onChange={handleChange}
                error={errors.specification}
                required
                flex="flex-1"
              />
              <div className="flex-1">
                <Select
                  className="w-full"
                  options={unitOptions}
                  placeholder="Chọn đơn vị"
                  onChange={(value) => {
                    setFormData(prev => ({
                      ...prev,
                      unit: value
                    }));
                    if (errors.unit) {
                      setErrors(prev => ({
                        ...prev,
                        unit: undefined
                      }));
                    }
                  }}
                  defaultValue={formData.unit}
                />
              </div>
            </div>
          </div>

          <Input
            label="Tùy chọn:"
            flex="flex items-center"
            classNameLabel="w-50 flex item-center"
            className="border border-gray-300"
            name="options"
            value={formData.options}
            onChange={handleChange}
            error={errors.options}
          />
          <Input
            label="Màu sắc:"
            flex="flex items-center"
            classNameLabel="w-50 flex item-center"
            className="border border-gray-300"
            name="color"
            value={formData.color}
            onChange={handleChange}
            error={errors.color}
          />
          <div className="flex items-center">
            <label className="w-[150px] flex item-center text-sm font-medium text-gray-700">Nhà cung cấp:</label>
            <div className="flex-1">
              <Select
                className="w-full"
                options={supplierOptions}
                placeholder="Chọn..."
                onChange={(value) => {
                  setFormData(prev => ({
                    ...prev,
                    supplier: value
                  }));
                  if (errors.supplier) {
                    setErrors(prev => ({
                      ...prev,
                      supplier: undefined
                    }));
                  }
                }}
                defaultValue={formData.supplier}
              />
            </div>
          </div>
          <Input
            label="Giá bán:"
            flex="flex items-center"
            classNameLabel="w-50 flex item-center"
            className="border border-gray-300"
            name="price"
            value={formData.price}
            onChange={handleChange}
            error={errors.price}
            required
          />
          <div></div>
          <div className="flex order-9 items-start col-span-1">
            <label className="w-[150px] flex item-center text-sm font-medium text-gray-700 pt-2">Mô tả:</label>
            <textarea
              className="flex-1 border border-gray-300 rounded p-2 min-h-[120px]"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Nhập..."
            />
          </div>
          <div className="flex items-center col-span-1 ">
            <label className="w-[150px] flex item-center text-sm font-medium text-gray-700">Ảnh:</label>
            <div className="flex-1">
              <label htmlFor="product-image" className="cursor-pointer">
                <div className="w-full h-[120px] bg-amber-50   border-gray-300 rounded-2xl border-0 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center mb-2">
                    <Image src="/images/icons/upload-cloud.svg" alt="upload" width={16} height={16} />
                  </div>
                  <div className="text-center text-amber-500">
                    Nhấn để tải lên ảnh sản phẩm
                    <p className="text-xs text-gray-500">SVG, PNG, JPG hoặc GIF (tối đa 800x400px)</p>
                  </div>
                </div>
              </label>
              <input
                id="product-image"
                type="file"
                className="hidden"
                accept="image/svg+xml,image/png,image/jpeg,image/gif"
                onChange={handleImageUpload}
              />
            </div>
          </div>

        </div>
      </Container>

    </div>
  );
} 
