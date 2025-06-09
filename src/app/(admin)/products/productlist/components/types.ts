// Type definitions for different product types
export interface MaterialProductData {
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

export interface ServiceProductData {
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

export interface BankAccountProductData {
  stk: string;
  ncc: string;
  tuychon: string;
  giaban: string;
}

export interface DocumentProductData {
  masp: string;
  tensp: string;
  tuychon: string;
  giaban: string;
  ncc: string;
  mota: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface Product {
  product_code?: string;
  product_name?: string;
  category_id?: string;
  category_name?: string;
  option1?: string;
  option2?: string;
  option3?: string;
  option4?: string;
  option5?: string;
  parameter1?: string;
  parameter1_unit?: string;
  parameter2?: string;
  parameter2_unit?: string;
  parameter3?: string;
  parameter3_unit?: string;
  parameter4?: string;
  parameter4_unit?: string;
  parameter5?: string;
  parameter5_unit?: string;
  price?: string;
  supplier_id?: string;
  product_description?: string;
  image_file?: string;
}

export interface CompareRow {
  content: string;
  type: string;
  value: string;
}

export interface ProductRow {
  code: string;
  name: string;
  category: string;
}

export type ProductType = "PRODUCT_001" | "PACKAGE_001" | "BANK_001" | "TEMPLATE_001" | "LGDV_001" | "loaiSanPhamGT" | "loaiSanPhamDV" | "loaiSanPhamTK";
