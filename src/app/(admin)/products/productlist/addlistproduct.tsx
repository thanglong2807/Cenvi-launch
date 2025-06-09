"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { Modal } from '@/components/ui/modal';
import Input from '@/components/form/input';
import TextArea from '@/components/form/input/TextArea';
import Select from '@/components/form/Select';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface AddCatalogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

function AddProduct({ isOpen, onClose, onSave }: AddCatalogProps) {
  const router = useRouter();
  const [productType, setProductType] = useState<string>("");
  
  // Form data state
  const [formData, setFormData] = useState({
    productCode: "",
    productName: "",
    specification: "",
    unit: "",
    options: "",
    color: "",
    supplier: "",
    price: "",
    description: "",
    image: null as File | null
  });
  
  // Form errors state
  const [errors, setErrors] = useState<Record<string, string | undefined>>({
    productCode: undefined,
    productName: undefined,
    specification: undefined,
    unit: undefined,
    options: undefined,
    color: undefined,
    supplier: undefined,
    price: undefined
  });
  
  // Options for dropdowns
  const unitOptions = [
    { label: "Cái", value: "cai" },
    { label: "Bộ", value: "bo" },
    { label: "Chiếc", value: "chiec" },
    { label: "Gói", value: "goi" },
    { label: "Tháng", value: "thang" }
  ];
  
  const supplierOptions = [
    { label: "Nhà cung cấp 1", value: "ncc1" },
    { label: "Nhà cung cấp 2", value: "ncc2" },
    { label: "Nhà cung cấp 3", value: "ncc3" }
  ];

  // Handle product type selection
  const handleProductTypeChange = (value: string) => {
    setProductType(value);
  };

  // Handle next step
  const handleNext = () => {
    if (!productType) {
      alert("Vui lòng chọn loại sản phẩm");
      return;
    }
    // Navigate to the appropriate page based on product type
    router.push(`/products/productlist/add?type=${productType}`);
    onClose(); // Close the modal after navigation
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  // Render product type selection
  const renderProductTypeSelection = () => {
    return (
      <div className="grid w-full gap-6">
        <Select
          onChange={(value) => handleProductTypeChange(value)}
          className=""
          options={[
            { label: "Loại sản phẩm vật tư", value: "loaiSanPhamVT" },
            { label: "Loại sản phẩm dịch vụ", value: "loaiSanPhamDV" },
            { label: "Loại sản phẩm tài khoản ngân hàng", value: "loaiSanPhamTK" },
            { label: "Loại sản phẩm giấy tờ thủ tục", value: "loaiSanPhamGT" }
          ]}
          placeholder="Loại sản phẩm"
          defaultValue={productType}
        />
      </div>
    );
  };



  return (
    <Modal isOpen={isOpen} className='' isFullscreen onClose={onClose}>
      <div className="bg-[#fff] rounded-t-xl w-[800px] min-h-96 flex pt-8 flex-col justify-between">
        <div className="py-3 px-8">
          <h2 className="text-amber-500 text-xl font-medium">Chọn loại sản phẩm</h2>
        </div>

        <div className="p-6 px-8 flex-1">
          <div className=" gap-6 items-center flex">
            <h2 className="text-zinc-800 text-sm font-medium">Loại sản phẩm</h2>
            <Select
              onChange={(value) => handleProductTypeChange(value)}
              className=""
              options={[
                { label: "Loại sản phẩm thủ tục", value: "loaiSanPhamVT" },
                { label: "Loại sản phẩm Gói dịch vụ", value: "loaiSanPhamDV" },
                { label: "Loại sản phẩm vật tư văn phòng", value: "PRODUCT_001" },
                { label: "Loại sản phẩm dịch vụ", value: "PACKAGE_001" },
                { label: "Loại sản phẩm biểu mẫu", value: "TEMPLATE_001" },
                { label: "Loại sản phẩm tài khoản ngân hàng", value: "BANK_001" },
              ]}
              placeholder="Loại sản phẩm"
              defaultValue={productType}
            />
          </div>
        </div>
      </div>

      <div className="bg-amber-50 p-4 px-8 flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={onClose}
          className="border-amber-500 text-amber-500 hover:bg-amber-50 hover:text-amber-600"
        >
          Hủy
        </Button>
        <Button
          onClick={handleNext}
          className="bg-amber-500 text-white hover:bg-amber-600"
        >
          Tiếp
        </Button>
      </div>
    </Modal>
  );
}

export default AddProduct;