"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { useState, useMemo } from "react";
import Pagination from "../ui/pagination/Pagination";
import Select from "../ui/select/Select";

// Define the TypeScript interface for the table rows
interface Product {
  id: number; // Unique identifier for each product
  name: string; // Product name
  variants: string; // Number of variants (e.g., "1 Variant", "2 Variants")
  category: string; // Category of the product
  price: string; // Price of the product (as a string with currency symbol)
  // status: string; // Status of the product
  image: string; // URL or path to the product image
  status: "Complete" | "Pending" | "Canceled"; // Status of the product
}

// Define the table data using the interface
const tableData: Product[] = [
  {
    id: 1,
    name: "Gói nền tảng",
    variants: "Công ty trách nhiệm hữu hạn 1 TV",
    category: "ĐKKD",
    price: "2.900.000",
    status: "Complete",
    image: "/images/product/product-01.jpg",
  },
  {
    id: 2,
    name: "Gói Bảo Hành",
    variants: "Công ty Cổ phần",
    category: "ĐKKD",
    price: "5.900.000",
    status: "Pending",
    image: "/images/product/product-01.jpg",
  },
  {
    id: 3,
    name: "Tài khoản Biểu mẫu",
    variants: "6 tháng",
    category: "Biểu mẫu",
    price: "400.000",
    status: "Complete",
    image: "/images/product/product-01.jpg",
  },
  {
    id: 4,
    name: "Con dấu tròn doanh nghiệp",
    variants: "",
    category: "SPVL",
    price: "250.000",
    status: "Canceled",
    image: "/images/product/product-01.jpg",
  },
  {
    id: 5,
    name: "Dịch vụ làm website",
    variants: "",
    category: "Website",
    price: "10.000.000",
    status: "Complete",
    image: "/images/product/product-01.jpg",
  },
  {
    id: 6,
    name: "Tư vấn thành lập doanh nghiệp",
    variants: "Online",
    category: "ĐKKD",
    price: "1.500.000",
    status: "Pending",
    image: "/images/product/product-01.jpg",
  },
  {
    id: 7,
    name: "Chữ ký số CA",
    variants: "1 năm",
    category: "SPVL",
    price: "1.200.000",
    status: "Complete",
    image: "/images/product/product-01.jpg",
  },
  {
    id: 8,
    name: "Bộ hóa đơn điện tử",
    variants: "500 số",
    category: "Hóa đơn",
    price: "800.000",
    status: "Pending",
    image: "/images/product/product-01.jpg",
  },
  {
    id: 9,
    name: "Dịch vụ kế toán trọn gói",
    variants: "12 tháng",
    category: "Dịch vụ",
    price: "12.000.000",
    status: "Complete",
    image: "/images/product/product-01.jpg",
  },
  {
    id: 10,
    name: "Gói quảng cáo Facebook",
    variants: "10 triệu ngân sách",
    category: "Marketing",
    price: "3.000.000",
    status: "Pending",
    image: "/images/product/product-01.jpg",
  },
  {
    id: 11,
    name: "Thiết kế logo thương hiệu",
    variants: "3 concept",
    category: "Thiết kế",
    price: "2.500.000",
    status: "Complete",
    image: "/images/product/product-01.jpg",
  },
  {
    id: 12,
    name: "Dịch vụ bảo vệ thương hiệu",
    variants: "Nhãn hiệu",
    category: "Pháp lý",
    price: "5.000.000",
    status: "Pending",
    image: "/images/product/product-01.jpg",
  },
  {
    id: 13,
    name: "Hosting SSD Business",
    variants: "5GB",
    category: "Website",
    price: "1.200.000",
    status: "Complete",
    image: "/images/product/product-01.jpg",
  },
  {
    id: 14,
    name: "Dịch vụ SEO Website",
    variants: "Từ khóa TOP 10",
    category: "Marketing",
    price: "8.000.000",
    status: "Canceled",
    image: "/images/product/product-01.jpg",
  },
  {
    id: 15,
    name: "Email doanh nghiệp theo tên miền",
    variants: "5 user",
    category: "Website",
    price: "2.000.000",
    status: "Complete",
    image: "/images/product/product-01.jpg",
  },
];


export default function RecentOrders() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const itemsPerPage = 5;

  // Get unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(tableData.map(item => item.category)));
  }, []);

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    return tableData.filter(item => {
      const statusMatch = selectedStatus === "all" || item.status === selectedStatus;
      const categoryMatch = selectedCategory === "all" || item.category === selectedCategory;
      return statusMatch && categoryMatch;
    });
  }, [selectedStatus, selectedCategory]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Calculate the current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Đơn hàng gần đây
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Select
              value={selectedStatus}
              onChange={handleStatusChange}
              options={[
                { value: "all", label: "Tất cả trạng thái" },
                { value: "Complete", label: "Hoàn thành" },
                { value: "Pending", label: "Đang chờ" },
                { value: "Canceled", label: "Đã hủy" },
              ]}
              className="w-[180px]"
            />
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              options={[
                { value: "all", label: "Tất cả loại" },
                ...categories.map(category => ({
                  value: category,
                  label: category,
                })),
              ]}
              className="w-[180px]"
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Xem tất cả
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Sản phẩm
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Doanh thu
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Loại
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Trạng thái
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {currentItems.map((product) => (
              <TableRow key={product.id} className="">
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                      <Image
                        width={50}
                        height={50}
                        src={product.image}
                        className="h-[50px] w-[50px]"
                        alt={product.name}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {product.name}
                      </p>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {product.variants}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {product.price} VND
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {product.category}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      product.status === "Complete"
                        ? "success"
                        : product.status === "Pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {product.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredData.length)} của {filteredData.length} mục
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
