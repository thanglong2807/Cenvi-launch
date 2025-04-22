"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Button from "@/components/ui/button";
import { AddIcon } from "@/icons";
import Link from "next/link";
import Pagination from "@/components/ui/pagination/Pagination";

interface Customer {
  id: number;
  username: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
}

const mockData: Customer[] = [
  {
    id: 1,
    username: "user1",
    fullName: "Nguyễn Văn A",
    phone: "0123456789",
    email: "nguyenvana@gmail.com",
    address: "Hà Nội",
    createdAt: "2024-03-15",
  },
  {
    id: 2,
    username: "user2", 
    fullName: "Trần Thị B",
    phone: "0987654321",
    email: "tranthib@gmail.com",
    address: "Hồ Chí Minh",
    createdAt: "2024-03-14",
  },
  // Thêm dữ liệu mẫu khác nếu cần
];

export default function CustomersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(mockData.length / itemsPerPage);

  // Tính toán dữ liệu cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = mockData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Danh sách khách hàng
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Quản lý thông tin khách hàng của bạn
          </p>
        </div>
        <Link href="/customers/new">
          <Button variant="primary" size="md" className="shadow-sm">
            <AddIcon className="h-5 w-5" />
            <span className="ml-2">Thêm Khách hàng mới</span>
          </Button>
        </Link>
      </div>

      <div className="">
        <Table className="w-full border border-gray-200 rounded-md overflow-hidden shadow-sm text-sm">
          <TableHeader className="bg-gray-100 text-gray-700">
            <TableRow className="border-b border-gray-200">
              <TableCell isHeader className="font-semibold px-4 py-2 text-center">STT</TableCell>
              <TableCell isHeader className="font-semibold px-4 py-2">Tài khoản</TableCell>
              <TableCell isHeader className="font-semibold px-4 py-2">Tên người dùng</TableCell>
              <TableCell isHeader className="font-semibold px-4 py-2">SĐT</TableCell>
              <TableCell isHeader className="font-semibold px-4 py-2">Gmail</TableCell>
              <TableCell isHeader className="font-semibold px-4 py-2">Địa chỉ</TableCell>
              <TableCell isHeader className="font-semibold px-4 py-2">Ngày tạo</TableCell>
              <TableCell isHeader className="font-semibold px-4 py-2 text-center">Action</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((customer, index) => (
              <TableRow 
                key={customer.id}
                className="border-b border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <TableCell className="px-4 py-2 text-center">{indexOfFirstItem + index + 1}</TableCell>
                <TableCell className="px-4 py-2 text-center">
                 
                    {customer.username}
                  
                </TableCell>
                <TableCell className="px-4 py-2 text-center">{customer.fullName}</TableCell>
                <TableCell className="px-4 py-2 text-center">
                  
                    {customer.phone}
                  
                </TableCell>
                <TableCell className="px-4 py-2 text-center">
                  
                    {customer.email}
                  
                </TableCell>
                <TableCell className="px-4 py-2 text-center">
                  
                    {customer.address}
                  
                </TableCell>
                <TableCell className="px-4 py-2 text-center">
                 
                    {customer.createdAt}
                  
                </TableCell>
                <TableCell className="px-4 py-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Link 
                      href={`/customers/${customer.id}`}
                      className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Chi tiết
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, mockData.length)} của {mockData.length} khách hàng
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