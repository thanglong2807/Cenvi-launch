"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import Input from '@/components/form/input';
import Select from '@/components/form/Select';
import AppHeader from '@/layout/AppHeader';
import HeaderItem from '@/layout/HeaderItem';
import Container from '@/components/Container/Container';
import Image from 'next/image';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';

export default function AddProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [productType, setProductType] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Options for dropdowns
  const unitOptions = [
    { label: "Cái", value: "cai" },
    { label: "Bộ", value: "bo" },
    { label: "Mét", value: "met" },
    { label: "Kg", value: "kg" }
  ];

  const supplierOptions = [
    { label: "Nhà cung cấp A", value: "ncc_a" },
    { label: "Nhà cung cấp B", value: "ncc_b" },
    { label: "Nhà cung cấp C", value: "ncc_c" }
  ];

  // Get product type from URL query parameter
  useEffect(() => {
    const type = searchParams.get('type');
    if (type) {
      setProductType(type);
    } else {
      // If no product type is specified, redirect back to product list
      router.push('/products/productlist');
    }
  }, [searchParams, router]);

  // Product data
  interface Product {
    id: number;
    product_code: string;
    price: number;
    category_id: string;
    category_name: string | null;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
    product_name: string;
    product_description: string;
    image_url: string;
    option1: string | null;
    parameter1: string | null;
    option2: string | null;
    parameter2: string | null;
    option3: string | null;
    parameter3: string | null;
    option4: string | null;
    parameter4: string | null;
    option5: string | null;
    parameter5: string | null;
    description: string | null;
  }

  interface MaterialProductData {
    product_code: string; // product_code
    product_name: string; // product_name
    category_id: string; // category_id
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    option5: string;
    parameter1: string;
    parameter1_unit: string;
    parameter2: string;
    parameter2_unit: string;
    parameter3: string;
    parameter3_unit: string;
    parameter4: string;
    parameter4_unit: string;
    parameter5: string;
    parameter5_unit: string;
    price: string; // price
    supplier_id: string; // supplier
    description: string; // description
    image_file?: string; // Base64 encoded image for API
  }

  const [materialProductData, setMaterialProductData] = useState<MaterialProductData>({
    product_code: "",
    product_name: "",
    category_id: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    option5: "",
    parameter1: "",
    parameter1_unit: "",
    parameter2: "",
    parameter2_unit: "",
    parameter3: "",
    parameter3_unit: "",
    parameter4: "",
    parameter4_unit: "",
    parameter5: "",
    parameter5_unit: "",
    price: "",
    supplier_id: "",
    description: "",
    image_file: ""
  });

  const [serviceProductData, setServiceProductData] = useState({
    product_code: "",
    product_name: "",
    parameter1: "",
    price: "",
    option1: "",
    supplier_id: "",
    description: "",
    unit: "",
    supplier: "",
    mausac: "",
    image: null as File | null,
    image_binary: "" as string | null
  });

  const [bankAccountProductData, setBankAccountProductData] = useState({
    stk: "",
    ncc: "",
    option1: "",
    price: ""
  });

  const [documentProductData, setDocumentProductData] = useState({
    product_code: '',
    product_name: '',
    option1: "",
    price: "",
    supplier_id: '',
    description: ""
  });

  // Handle product type selection
  const handleProductTypeChange = (value: string) => {
    setProductType(value);
  };

  // Handle back to product list
  const handleBack = () => {
    router.push('/products/productlist');
  };

  // Handle cancel
  const handleCancel = () => {
    router.push("/products/productlist");
  };

  // Handle form submission
  const handleSubmit = async (e?: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    let dataToSubmit;
    let isValid = true;
    switch (productType) {
      case "PRODUCT_001":
        if (!materialProductData.product_name || !materialProductData.product_code) {
          alert("Vui lòng điền đầy đủ thông tin bắt buộc");
          isValid = false;
        }
        dataToSubmit = {
          productType,
          ...materialProductData
        };
        break;
      case "PACKAGE_001":
        if (!serviceProductData.product_name || !serviceProductData.product_code) {
          alert("Vui lòng điền đầy đủ thông tin bắt buộc");
          isValid = false;
        }
        dataToSubmit = {
          productType,
          ...serviceProductData
        };
        break;
      case "loaiSanPhamTK":
        if (!bankAccountProductData.stk || !bankAccountProductData.ncc) {
          alert("Vui lòng điền đầy đủ thông tin bắt buộc");
          isValid = false;
        }
        dataToSubmit = {
          productType,
          ...bankAccountProductData
        };
        break;
      case "loaiSanPhamGT":
        if (!documentProductData.product_code || !documentProductData.product_name) {
          alert("Vui lòng điền đầy đủ thông tin bắt buộc");
          isValid = false;
        }
        dataToSubmit = {
          productType,
          ...documentProductData
        };
        break;
      default:
        isValid = false;
    }
    
  
      // Format data for API
      let apiData = {};
      
      switch (productType) {
        case "PRODUCT_001":
          apiData = {
            product_code: materialProductData.product_code,
            product_name: materialProductData.product_name,
            category_id: productType,
            price: parseFloat(materialProductData.price) || 0,
            product_description : materialProductData.description || "",
            option1: materialProductData.option1 || "",
            parameter1: materialProductData.parameter1 || "",
            option2: materialProductData.option2 || "",
            parameter2: materialProductData.parameter2 || "",
            description: '',
            option3: materialProductData.option3 || "",
            parameter3: materialProductData.parameter3 || "",
            option4: materialProductData.option4 || "",
            parameter4: materialProductData.parameter4 || "",
            option5: materialProductData.option5 || "",
            parameter5: materialProductData.parameter5 || "",
            supplier_id: materialProductData.supplier_id || "",
            image_file : materialProductData.image_file || '' // Include the base64 encoded image
          };
          break;
        case "PACKAGE_001":
          apiData = {
            product_code: serviceProductData.product_code,
            product_name: serviceProductData.product_name,
            category_id: productType,
            price: parseFloat(serviceProductData.price) || 0,
            description: serviceProductData.description || null,
            option1: serviceProductData.option1 || null,
            parameter1: serviceProductData.parameter1 || null
          };
          break;
        case "BANK_001":
          apiData = {
            product_code: bankAccountProductData.stk,
            product_name: bankAccountProductData.stk,
            category_id: productType,
            price: parseFloat(bankAccountProductData.price) || 0,
            option1: bankAccountProductData.option1 || ""
          };
          break;
        case "loaiSanPhamGT":
          apiData = {
            product_code: documentProductData.product_code,
            product_name: documentProductData.product_name,
            category_id: productType,
            price: parseFloat(documentProductData.price) || 0,
            description: documentProductData.description || "",
            option1: documentProductData.option1 || ""
          };
          break;
      }
      console.log(apiData);
      
      try {
        // Create FormData object for file upload
        const formData = new FormData();
        
        // Add all API data fields to the FormData
        Object.entries(apiData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formData.append(key, value as string | Blob);
          }
        });
        
        // Add image file if available
        if (productType === "PRODUCT_001" && materialProductData.image) {
          formData.append('image_file', materialProductData.image);
        } else if (productType === "PACKAGE_001" && serviceProductData.image) {
          formData.append('image_file', serviceProductData.image);
        }
        
        const response = await axiosInstance.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}v1/products/createProduct/`, 
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          }
        );
        
        console.log("Product created successfully:", response.data);
        
        if (response.data.success) {
          alert("Sản phẩm đã được tạo thành công!");
          router.push("/products/productlist");
        } else {
          alert(`Lỗi: ${response.data.message || 'Không thể tạo sản phẩm'}`);
        }
      } catch (error) {
        console.error("Error creating product:", error);
        alert("Đã xảy ra lỗi khi tạo sản phẩm. Vui lòng thử lại.");
      }
    
  };

  // Handle image upload for material products
  const handleMaterialImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Uploaded image:", file.name);
      
      // Format the image data in the required format for the API
      // Format: image_file=@filename.jpg;type=image/jpeg
      const formattedImageData = `@${file.name};type=${file.type}`;
      
      setMaterialProductData(prev => ({
        ...prev,
        image_file: formattedImageData,
     
      }));
      
      // For debugging
      console.log("Formatted image data:", formattedImageData);
    }
  };

  // Handle image upload for service products
  const handleServiceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Uploaded service image:", file.name);
      
      // Format the image data in the required format for the API
      // Format: image_file=@filename.jpg;type=image/jpeg
      const formattedImageData = `@${file.name};type=${file.type}`;
      
      setServiceProductData(prev => ({
        ...prev,
        image: file,
        image_binary: formattedImageData
      }));
      
      // For debugging
      console.log("Formatted image data:", formattedImageData);
    }
  };

  // Handle input change for material products
  const handleMaterialInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMaterialProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle input change for service products
  const handleServiceInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setServiceProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle input change for bank account products
  const handleBankAccountInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBankAccountProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle input change for document products
  const handleDocumentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDocumentProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Get product type title based on type code
  const getProductTypeTitle = () => {
    switch (productType) {
      case "PRODUCT_001":
        return "Sản phẩm";
      case "PACKAGE_001":
        return "dịch vụ";
      case "BANK_001":
        return "tài khoản ngân hàng";
      case "TEMPLATE_001":
        return "giấy tờ thủ tục";
      default:
        return "";
    }
  };

  // Render material product form
  const renderMaterialProductForm = () => {
    return (
      <div className=" w-full gap-4">
        <div className="grid grid-cols-2 gap-x-35 border border-gray-300 rounded-2xl px-14 py-8 gap-y-3">
          <Input
            label="Mã sản phẩm:"
            flex="flex items-center"
            classNameLabel="w-50 flex item-center"
            className="border border-gray-300"
            name="product_code"
            value={materialProductData.product_code}
            onChange={handleMaterialInputChange}
            required
          />
          <Input
            label="Tên sản phẩm:"
            flex="flex items-center"
            classNameLabel="w-50 flex item-center"
            className="border border-gray-300"
            name="product_name"
            value={materialProductData.product_name}
            onChange={handleMaterialInputChange}
            required
          />
           <Input
            label="Danh mục:"
            flex="flex items-center"
            classNameLabel="w-50 flex item-center"
            className="border border-gray-300"
            name="category_id"
            value={searchParams.get('type')|| materialProductData.category_id}
            onChange={handleMaterialInputChange}
            required
          />
          <div>{null}</div>
          <div className="flex items-center">
            <label className="w-[150px] flex item-center text-sm font-medium text-gray-700">Tùy chọn 1:</label>
            <div className="flex-1">
              <Select
                className="w-full"
                options={supplierOptions}
                placeholder="Chọn..."
                onChange={(value) => {
                  setServiceProductData(prev => ({
                    ...prev,
                    supplier: value
                  }));

                }}
                defaultValue={materialProductData.option1}
              />
            </div>
          </div>
          <div className="flex items-center">
            <label className="w-[150px] flex item-center text-sm font-medium text-gray-700">Tùy chọn 2:</label>
            <div className="flex-1">
              <Select
                className="w-full"
                options={supplierOptions}
                placeholder="Chọn..."
                onChange={(value) => {
                  setServiceProductData(prev => ({
                    ...prev,
                    supplier: value
                  }));

                }}
                defaultValue={materialProductData.option2}
              />
            </div>
          </div>
          <div className="flex items-center">
            <label className="w-[150px] flex item-center text-sm font-medium text-gray-700">Tùy chọn 3:</label>
            <div className="flex-1">
              <Select
                className="w-full"
                options={supplierOptions}
                placeholder="Chọn..."
                onChange={(value) => {
                  setServiceProductData(prev => ({
                    ...prev,
                    supplier: value
                  }));

                }}
                defaultValue={materialProductData.option3}
              />
            </div>
          </div>
          <div className="flex items-center">
            <label className="w-[150px] flex item-center text-sm font-medium text-gray-700">Tùy chọn 4:</label>
            <div className="flex-1">
              <Select
                className="w-full"
                options={supplierOptions}
                placeholder="Chọn..."
                onChange={(value) => {
                  setServiceProductData(prev => ({
                    ...prev,
                    supplier: value
                  }));

                }}
                defaultValue={materialProductData.option4}
              />
            </div>
          </div>
          <div className="flex items-center">
            <label className="w-[150px] flex item-center text-sm font-medium text-gray-700">Tùy chọn 5:</label>
            <div className="flex-1">
              <Select
                className="w-full"
                options={supplierOptions}
                placeholder="Chọn..."
                onChange={(value) => {
                  setServiceProductData(prev => ({
                    ...prev,
                    supplier: value
                  }));

                }}
                defaultValue={materialProductData.option5}
              />
            </div>
          </div>
          <div className="flex items-center">
            <label className="w-[150px] flex item-center text-sm font-medium text-gray-700">Thông số 1:</label>
            <div className="flex-1 flex items-center gap-2">
              <Input
                className="border border-gray-300 w-full"
                name="parameter1"
                value={materialProductData.parameter1}
                onChange={handleMaterialInputChange}
                required
                flex="flex-1"
              />
              <div className="flex-1">
                <Select
                  className="w-full"
                  options={unitOptions}
                  placeholder="Chọn đơn vị"
                  onChange={(value) => {
                    setMaterialProductData(prev => ({
                      ...prev,
                      unit: value
                    }));

                  }}
                  defaultValue={materialProductData.parameter1_unit}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <label className="w-[150px] flex item-center text-sm font-medium text-gray-700">Thông số 2:</label>
            <div className="flex-1 flex items-center gap-2">
              <Input
                className="border border-gray-300 w-full"
                name="parameter2"
                value={materialProductData.parameter2}
                onChange={handleMaterialInputChange}
                required
                flex="flex-1"
              />
              <div className="flex-1">
                <Select
                  className="w-full"
                  options={unitOptions}
                  placeholder="Chọn đơn vị"
                  onChange={(value) => {
                    setMaterialProductData(prev => ({
                      ...prev,
                      unit: value
                    }));

                  }}
                  defaultValue={materialProductData.parameter2_unit}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <label className="w-[150px] flex item-center text-sm font-medium text-gray-700">Thông số 3:</label>
            <div className="flex-1 flex items-center gap-2">
              <Input
                className="border border-gray-300 w-full"
                name="parameter3"
                value={materialProductData.parameter3}
                onChange={handleMaterialInputChange}
                required
                flex="flex-1"
              />
              <div className="flex-1">
                <Select
                  className="w-full"
                  options={unitOptions}
                  placeholder="Chọn đơn vị"
                  onChange={(value) => {
                    setMaterialProductData(prev => ({
                      ...prev,
                      unit: value
                    }));

                  }}
                  defaultValue={materialProductData.parameter3_unit}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <label className="w-[150px] flex item-center text-sm font-medium text-gray-700">Thông số 4:</label>
            <div className="flex-1 flex items-center gap-2">
              <Input
                className="border border-gray-300 w-full"
                name="parameter4"
                value={materialProductData.parameter4}
                onChange={handleMaterialInputChange}
                required
                flex="flex-1"
              />
              <div className="flex-1">
                <Select
                  className="w-full"
                  options={unitOptions}
                  placeholder="Chọn đơn vị"
                  onChange={(value) => {
                    setMaterialProductData(prev => ({
                      ...prev,
                      unit: value
                    }));

                  }}
                  defaultValue={materialProductData.parameter4_unit}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <label className="w-[150px] flex item-center text-sm font-medium text-gray-700">Thông số 5:</label>
            <div className="flex-1 flex items-center gap-2">
              <Input
                className="border border-gray-300 w-full"
                name="parameter5"
                value={materialProductData.parameter5}
                onChange={handleMaterialInputChange}
                required
                flex="flex-1"
              />
              <div className="flex-1">
                <Select
                  className="w-full"
                  options={unitOptions}
                  placeholder="Chọn đơn vị"
                  onChange={(value) => {
                    setMaterialProductData(prev => ({
                      ...prev,
                      unit: value
                    }));

                  }}
                  defaultValue={materialProductData.parameter5_unit}
                />
              </div>
            </div>
          </div>

         
        
        
          <Input
            label="Giá bán:"
            flex="flex items-center"
            classNameLabel="w-50 flex item-center"
            className="border border-gray-300"
            name="price"
            value={materialProductData.price}
            onChange={handleMaterialInputChange}
            required
          />
          
          <div className="flex items-center">
            <label className="w-[150px] flex item-center text-sm font-medium text-gray-700">Nhà cung cấp:</label>
            <div className="flex-1">
              <Select
                className="w-full"
                options={supplierOptions}
                placeholder="Chọn..."
                onChange={(value) => {
                  setMaterialProductData(prev => ({
                    ...prev,
                    supplier_id: value
                  }));

                }}
                defaultValue={materialProductData.supplier_id}
              />
            </div>
          </div>

       
          <div className="flex  items-start col-span-1">
            <label className="w-[150px] flex item-center text-sm font-medium text-gray-700 pt-2">Mô tả:</label>
            <textarea
              className="flex-1 border border-gray-300 rounded p-2 min-h-[120px]"
              name="description"
              value={materialProductData.description}
              onChange={handleMaterialInputChange}
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
                onChange={handleMaterialImageUpload}
              />
            </div>
          </div>

        </div>
      </div>
    );
  };

  // Render service product form
  const renderServiceProductForm = () => {
    return (
      <div className="grid w-full gap-4">

        <div className="grid grid-cols-2 gap-x-35 border border-gray-300 rounded-2xl px-14 py-8 gap-y-3">
          <Input
            label="Mã sản phẩm:"
            flex="flex items-center"
            classNameLabel="w-50 flex item-center"
            className="border border-gray-300"
            name="productCode"
            value={serviceProductData.product_code}
            onChange={handleServiceInputChange}

            required
          />
          <Input
            label="Tên sản phẩm:"
            flex="flex items-center"
            classNameLabel="w-50 flex item-center"
            className="border border-gray-300"
            name="productName"
            value={serviceProductData.product_name}
            onChange={handleServiceInputChange}

            required
          />
          <div className="flex items-center">
            <label className="w-[150px] flex item-center text-sm font-medium text-gray-700">Thông số:</label>
            <div className="flex-1 flex items-center gap-2">
              <Input
                className="border border-gray-300 w-full"
                name="parameter1"
                value={serviceProductData.parameter1}
                onChange={handleServiceInputChange}
                required
                flex="flex-1"
              />
              <div className="flex-1">
                <Select
                  className="w-full"
                  options={unitOptions}
                  placeholder="Chọn đơn vị"
                  onChange={(value) => {
                    setServiceProductData(prev => ({
                      ...prev,
                      unit: value
                    }));

                  }}
                  defaultValue={serviceProductData.unit}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <label className="w-[150px] flex item-center text-sm font-medium text-gray-700">Tùy chọn:</label>
            <div className="flex-1">
              <Select
                className="w-full"
                options={supplierOptions}
                placeholder="Chọn..."
                onChange={(value) => {
                  setServiceProductData(prev => ({
                    ...prev,
                    option1: value
                  }));

                }}
                defaultValue={serviceProductData.option1}
              />
            </div>
          </div>
          <Input
            label="Giá bán:"
            flex="flex items-center"
            classNameLabel="w-50 flex item-center"
            className="border border-gray-300"
            name="giaSP"
            value={serviceProductData.price}
            onChange={handleServiceInputChange}
            required
          />
          <div></div>
          
          
          <div className="flex items-center">
            <label className="w-[150px] flex item-center text-sm font-medium text-gray-700">Nhà cung cấp:</label>
            <div className="flex-1">
              <Select
                className="w-full"
                options={supplierOptions}
                placeholder="Chọn..."
                onChange={(value) => {
                  setServiceProductData(prev => ({
                    ...prev,
                    supplier_id: value
                  }));

                }}
                defaultValue={serviceProductData.supplier_id}
              />
            </div>
          </div>
         
          <div></div>
          <div className="flex order-9 items-start col-span-1">
            <label className="w-[150px] flex item-center text-sm font-medium text-gray-700 pt-2">Mô tả:</label>
            <textarea
              className="flex-1 border border-gray-300 rounded p-2 min-h-[120px]"
              name="description"
              value={serviceProductData.description}
              onChange={handleServiceInputChange}
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
                onChange={handleServiceImageUpload}
              />
            </div>
          </div>
          <div></div>
        </div>
      </div>
    );
  };

  // Render bank account product form
  const renderBankAccountProductForm = () => {
    return (
      <div className="grid w-full gap-4">

        <div className="grid grid-cols-2 gap-x-35 border border-gray-300 rounded-2xl px-14 py-8 gap-y-3">
          <Input
            label="Số tài khoản:"
            flex="flex items-center"
            classNameLabel="w-50 flex item-center"
            className="border border-gray-300"
            name="stk"
            value={bankAccountProductData.stk}
            onChange={handleBankAccountInputChange}
            required
          />
          <Input
            label="Nhà cung cấp:"
            flex="flex items-center"
            classNameLabel="w-50 flex item-center"
            className="border border-gray-300"
            name="ncc"
            value={bankAccountProductData.ncc}
            onChange={handleBankAccountInputChange}
            required
          />
          <Input
            label="Tùy chọn:"
            flex="flex items-center"
            classNameLabel="w-50 flex item-center"
            className="border border-gray-300"
            name="option1"
            value={bankAccountProductData.option1}
            onChange={handleBankAccountInputChange}
            required
          />
          <Input
            label="Giá bán:"
            flex="flex items-center"
            classNameLabel="w-50 flex item-center"
            className="border border-gray-300"
            name="price"
            value={bankAccountProductData.price}
            onChange={handleBankAccountInputChange}
            required
          />
        </div>
      </div>
    )
  };

  // Render document product form
  const renderDocumentProductForm = () => {
    return (
      <div className="grid w-full gap-4">
         <div className="grid grid-cols-2 gap-x-35 border border-gray-300 rounded-2xl px-14 py-8 gap-y-3">
          <Input
            label="Mã sản phẩm:"
            flex="flex items-center"
            classNameLabel="w-50 flex item-center"
            className="border border-gray-300"
            name="productCode"
            value={serviceProductData.product_code}
            onChange={handleServiceInputChange}

            required
          />
          <Input
            label="Tên sản phẩm:"
            flex="flex items-center"
            classNameLabel="w-50 flex item-center"
            className="border border-gray-300"
            name="productName"
            value={serviceProductData.product_name}
            onChange={handleServiceInputChange}

            required
          />
       

          <div className="flex items-center">
            <label className="w-[150px] flex item-center text-sm font-medium text-gray-700">Tùy chọn:</label>
            <div className="flex-1">
              <Select
                className="w-full"
                options={supplierOptions}
                placeholder="Chọn..."
                onChange={(value) => {
                  setServiceProductData(prev => ({
                    ...prev,
                    ncc: value
                  }));

                }}
                defaultValue={serviceProductData.option1}
              />
            </div>
          </div>
          <Input
            label="Giá bán:"
            flex="flex items-center"
            classNameLabel="w-50 flex item-center"
            className="border border-gray-300"
            name="giaSP"
            value={serviceProductData.price}
            onChange={handleServiceInputChange}
            required
          />
      
          
          
          <div className="flex items-center">
            <label className="w-[150px] flex item-center text-sm font-medium text-gray-700">Nhà cung cấp:</label>
            <div className="flex-1">
              <Select
                className="w-full"
                options={supplierOptions}
                placeholder="Chọn..."
                onChange={(value) => {
                  setServiceProductData(prev => ({
                    ...prev,
                    supplier_id: value
                  }));

                }}
                defaultValue={serviceProductData.supplier_id}
              />
            </div>
          </div>
         
          <div></div>
          <div className="flex order-9 items-start col-span-1">
            <label className="w-[150px] flex item-center text-sm font-medium text-gray-700 pt-2">Mô tả:</label>
            <textarea
              className="flex-1 border border-gray-300 rounded p-2 min-h-[120px]"
              name="description"
              value={serviceProductData.description}
              onChange={handleServiceInputChange}
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
                onChange={handleServiceImageUpload}
              />
            </div>
          </div>
          <div></div>
        </div>
      </div>
    );
  };

  // Render form based on product type
  const renderProductForm = () => {
    switch (productType) {
      case "PRODUCT_001":
        return renderMaterialProductForm();
      case "PACKAGE_001":
        return renderServiceProductForm();
      case "BANK_001":
        return renderBankAccountProductForm();
      case "loaiSanPhamGT":
        return renderDocumentProductForm();
      default:
        return <div className="text-center text-gray-500">Vui lòng chọn loại sản phẩm</div>;
    }
  };

  return (
    <div className="rounded-2xl h-screen border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <AppHeader>
        <HeaderItem
          title={`Thêm sản phẩm ${getProductTypeTitle()}`}
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
        <div className=" bg-white p-6 rounded-lg ">
          {renderProductForm()}

          {/* <div className="mt-8 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleBack}
              className="border-amber-500 text-amber-500 hover:bg-amber-50 hover:text-amber-600"
            >
              Quay lại
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-amber-500 text-amber-500 hover:bg-amber-50 hover:text-amber-600"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-amber-500 text-white hover:bg-amber-600"
            >
              Lưu
            </Button>
          </div> */}
        </div>
      </Container>
    </div>
  );
}
