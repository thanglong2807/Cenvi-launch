"use client";

import React, { useState, useEffect } from "react";
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
import { useSearchParams } from 'next/navigation';
import MaterialProductForm from "../components/MaterialProductForm";
import ServicePackageForm from "../components/ServicePackageForm";

// Type definitions for different product types
interface MaterialProductData {
  maSP: string;
  tenSP: string;
  thongso: string;
  giaSP: string;
  mausac: string;
  tuychon: string;
  ncc: string;
  mota: string;
  unit: string;
  supplier: string;
}

interface ServiceProductData {
  maSP: string;
  tenSP: string;
  thongso: string;
  giaSP: string;
  tuychon: string;
  ncc: string;
  mota: string;
  unit: string;
  supplier: string;
  mausac: string;
}

interface BankAccountProductData {
  stk: string;
  ncc: string;
  tuychon: string;
  giaban: string;
}

interface DocumentProductData {
  masp: string;
  tensp: string;
  tuychon: string;
  giaban: string;
  ncc: string;
  mota: string;
}

interface FormErrors {
  [key: string]: string;
}
interface Product {
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
interface compareRow{
  content:string,
  type:string,
  value:string

}
interface productRow{
  code:string,
  name:string,
  category:string
}
export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  const [productType, setProductType] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const searchParams = useSearchParams();
  // Initialize product data for each type
  const [compareRows, setCompareRows] = useState <compareRow[]>([
    { content: '', type: 'Text', value: '' },
    { content: '', type: 'Checkbox', value: '' },
    { content: '', type: 'Checkbox', value: '' },
  ]);
  const [productRows, setProductRows] = useState <productRow[]>([
    { code: 'SP00002', name: 'Giấy đăng ký kinh doanh', category: 'Giấy tờ/ Thủ tục' },
    { code: 'SP00003', name: 'Biển tên', category: 'Vật tư văn phòng' },
    { code: 'SP00004', name: 'Dấu tròn', category: 'Vật tư văn phòng' },
    { code: 'SP00005', name: 'Dấu chức danh', category: 'Vật tư văn phòng' },
    { code: 'SP00006', name: 'Dấu chữ ký', category: 'Vật tư văn phòng' },
    { code: 'SP00007', name: 'Chữ ký số', category: 'Dịch vụ' },
  ])
  const [materialProductData, setMaterialProductData] = useState<MaterialProductData>({
    maSP: "",
    tenSP: "",
    thongso: "",
    giaSP: "",
    mausac: "",
    tuychon: "",
    ncc: "",
    mota: "",
    unit: "",
    supplier: ""
  });

  const [serviceProductData, setServiceProductData] = useState<ServiceProductData>({
    maSP: "",
    tenSP: "",
    thongso: "",
    giaSP: "",
    tuychon: "",
    ncc: "",
    mota: "",
    unit: "",
    supplier: "",
    mausac: ""
  });

  const [bankAccountProductData, setBankAccountProductData] = useState<BankAccountProductData>({
    stk: "",
    ncc: "",
    tuychon: "",
    giaban: ""
  });

  const [documentProductData, setDocumentProductData] = useState<DocumentProductData>({
    masp: "",
    tensp: "",
    tuychon: "",
    giaban: "",
    ncc: "",
    mota: ""
  });

  // Sample options for dropdowns
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

  const productTypeOptions = [
    { label: "Dịch vụ", value: "PACKAGE_001" },
    { label: "Tài khoản ngân hàng", value: "BANK_001" },
    { label: "Biểu mẫu", value: "TEMPLATE_001" },
    { label: "Vật tư", value: "PRODUCT_001" }
  ];

  // State for product detail
  const [productDetail, setProductDetail] = useState<Product>({});
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Get product type from params and fetch product detail
  useEffect(() => {
    const fetchProductDetails = async (productId: string, categoryId: string) => {
      setLoadingDetail(true);
      try {
        // Sử dụng axios instance nếu có
        const axiosInstance = (await import('@/lib/axios')).default;
        const res = await axiosInstance.get(
          `http://103.98.152.69:8086/api/v1/products/detailProduct/${productId}?category_id=${categoryId}`
        );
        setProductDetail(res.data.data);
        console.log(res.data.data);

      } catch (error) {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
        setProductDetail({});
      } finally {
        setLoadingDetail(false);
      }
    };

    if (params?.id) {
      const productId = searchParams.get('id');

      const typeParam = searchParams.get('type');
      const typeMapping: { [key: string]: string } = {
        'Vật tư': 'PRODUCT_001',
        'Dịch vụ': 'PACKAGE_001',
        'Tài khoản ngân hàng': 'BANK_001',
        'Giấy tờ': 'loaiSanPhamGT'
      };
      const productTypeCode = typeParam ? (typeMapping[typeParam] || typeParam) : "loaiSanPhamVT";
      setProductType(productTypeCode);
      // Gọi API lấy chi tiết sản phẩm
      fetchProductDetails(productId, productTypeCode);
    }
  }, [params, searchParams]);

  // Handle product type change
  const handleProductTypeChange = (value: string) => {
    setProductType(value);
  };

  // Handle input change for material products
  const handleMaterialInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMaterialProductData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Handle input change for service products
  const handleServiceInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setServiceProductData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Handle input change for bank account products
  const handleBankAccountInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBankAccountProductData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Handle input change for document products
  const handleDocumentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDocumentProductData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Handle image upload logic here
      // For now, we'll just log the file name
    }
  };

  // Get product type title based on type code
  const getProductTypeTitle = () => {
    switch (productType) {
      case "PRODUCT_001":
        return "Vật tư";
      case "PACKAGE_001":
        return "Dịch vụ";
      case "BANK_001":
        return "Tài khoản ngân hàng";
      case "TEMPLATE_001":
        return "Giấy tờ";
      case "LGDV_001":
        return "loại gói dịch vụ";
      default:
        return "";
    }
  };

  const handleSubmit = () => {
    let isValid = true;
    const newErrors: FormErrors = {};

    // Validate based on product type
    if (productType === "PRODUCT_001") {
      if (!materialProductData.maSP) {
        newErrors.maSP = "Vui lòng nhập mã sản phẩm";
        isValid = false;
      }
      if (!materialProductData.tenSP) {
        newErrors.tenSP = "Vui lòng nhập tên sản phẩm";
        isValid = false;
      }
      if (!materialProductData.giaSP) {
        newErrors.giaSP = "Vui lòng nhập giá sản phẩm";
        isValid = false;
      }
    } else if (productType === "loaiSanPhamDV") {
      if (!serviceProductData.maSP) {
        newErrors.maSP = "Vui lòng nhập mã sản phẩm";
        isValid = false;
      }
      if (!serviceProductData.tenSP) {
        newErrors.tenSP = "Vui lòng nhập tên sản phẩm";
        isValid = false;
      }
      if (!serviceProductData.giaSP) {
        newErrors.giaSP = "Vui lòng nhập giá sản phẩm";
        isValid = false;
      }
    } else if (productType === "loaiSanPhamTK") {
      if (!bankAccountProductData.stk) {
        newErrors.stk = "Vui lòng nhập số tài khoản";
        isValid = false;
      }
      if (!bankAccountProductData.giaban) {
        newErrors.giaban = "Vui lòng nhập giá bán";
        isValid = false;
      }
    } else if (productType === "loaiSanPhamGT") {
      if (!documentProductData.masp) {
        newErrors.masp = "Vui lòng nhập mã sản phẩm";
        isValid = false;
      }
      if (!documentProductData.tensp) {
        newErrors.tensp = "Vui lòng nhập tên sản phẩm";
        isValid = false;
      }
      if (!documentProductData.giaban) {
        newErrors.giaban = "Vui lòng nhập giá bán";
        isValid = false;
      }
    }

    setErrors(newErrors);

    if (isValid) {
      // Submit form data
      // Navigate back to product list
      router.push("/products/productlist");
    }
  };

  // Render material product form
  const renderMaterialProductForm = () => {
    return (
      <MaterialProductForm productId={searchParams.get('type')} productDetail={productDetail} onChange={handleMaterialInputChange} supplierOptions={supplierOptions} handleImageUpload={handleImageUpload} />
    );
  };

  // Render service package form
  const renderServicePackageForm = () => {
    return (
      <ServicePackageForm
        compareRows={compareRows}
        setCompareRows={setCompareRows}
        productRows={productRows}
        setProductRows={setProductRows}
      />
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
            name="tuychon"
            value={bankAccountProductData.tuychon}
            onChange={handleBankAccountInputChange}
            required
          />
          <Input
            label="Giá bán:"
            flex="flex items-center"
            classNameLabel="w-50 flex item-center"
            className="border border-gray-300"
            name="giaban"
            value={bankAccountProductData.giaban}
            onChange={handleBankAccountInputChange}
            required
          />
        </div>
      </div>
    );
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
            name="masp"
            value={documentProductData.masp}
            onChange={handleDocumentInputChange}
            required
          />
          <Input
            label="Tên sản phẩm:"
            flex="flex items-center"
            classNameLabel="w-50 flex item-center"
            className="border border-gray-300"
            name="tensp"
            value={documentProductData.tensp}
            onChange={handleDocumentInputChange}
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
                  setDocumentProductData(prev => ({
                    ...prev,
                    tuychon: value
                  }));
                }}
                defaultValue={documentProductData.tuychon}
              />
            </div>
          </div>
          <Input
            label="Giá bán:"
            flex="flex items-center"
            classNameLabel="w-50 flex item-center"
            className="border border-gray-300"
            name="giaban"
            value={documentProductData.giaban}
            onChange={handleDocumentInputChange}
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
                  setDocumentProductData(prev => ({
                    ...prev,
                    ncc: value
                  }));
                }}
                defaultValue={documentProductData.ncc}
              />
            </div>
          </div>
          <div></div>
          <div className="flex order-9 items-start col-span-1">
            <label className="w-[150px] flex item-center text-sm font-medium text-gray-700 pt-2">Mô tả:</label>
            <textarea
              className="flex-1 border border-gray-300 rounded p-2 min-h-[120px]"
              name="mota"
              value={documentProductData.mota}
              onChange={handleDocumentInputChange}
              placeholder="Nhập..."
            />
          </div>
          <div className="flex items-center col-span-1">
            <label className="w-[150px] flex item-center text-sm font-medium text-gray-700">Ảnh:</label>
            <div className="flex-1">
              <label htmlFor="document-image" className="cursor-pointer">
                <div className="w-full h-[120px] bg-amber-50 border-gray-300 rounded-2xl border-0 flex flex-col items-center justify-center">
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
                id="document-image"
                type="file"
                className="hidden"
                accept="image/svg+xml,image/png,image/jpeg,image/gif"
                onChange={handleImageUpload}
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
      case "PRODUCT_001": // vật tư
      case "PACKAGE_001": // dịch vụ
      case "loaiSanPhamGT": // giấy tờ
        return renderMaterialProductForm();
      case "LGDV_001": // loại gói dịch vụ
        return renderServicePackageForm();
      case "BANK_001":// tài khoản ngân hàng
        return renderBankAccountProductForm();
      default:
        return <div className="text-center text-gray-500">Không tìm thấy loại sản phẩm</div>;
    }
  };


  return (
    <div className="rounded-2xl h-screen border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <AppHeader>
        <HeaderItem
          title={`Chi tiết sản phẩm ${getProductTypeTitle()}`}
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
        <div className="grid grid-cols-1 gap-8">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700 w-[150px]">Loại sản phẩm:</label>
              <div className="flex-1">

              </div>
            </div>
          </div>

          {/* Render form based on product type */}
          {renderProductForm()}
        </div>
      </Container>
    </div>
  );
} 
