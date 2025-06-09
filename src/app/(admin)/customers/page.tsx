"use client";
import React, { useState } from "react";
import axiosInstance from '@/lib/axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import Pagination from "@/components/ui/pagination/Pagination";
import { Button } from '@/components/ui/button';

import HeaderItem from "@/layout/HeaderItem";
import AppHeader from "@/layout/AppHeader";
import Image from "next/image";
import Container from "@/components/Container/Container";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  React.useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/customers/`);
        const data = res.data;
        setCustomers(Array.isArray(data) ? data : data?.data || []);
      } catch (err: any) {
        setError(err.message || 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Sorting logic
  const sortedCustomers = [...customers].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    const aString = String(aValue ?? '');
    const bString = String(bValue ?? '');
    if (sortColumn === 'created_at') {
      return sortDirection === 'asc' ? aString.localeCompare(bString) : bString.localeCompare(aString);
    }
    return sortDirection === 'asc' ? aString.localeCompare(bString) : bString.localeCompare(aString);
  });

  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedCustomers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <div className="rounded-2xl h-screen border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <AppHeader>

        <HeaderItem
          title="Khách hàng"
          right={
            <Link href="/customers/new">
              <Button variant="default" size="sm" className="shadow-sm bg-[#F89A1C] p-5 text-white">
                Thêm khách hàng
              </Button>
            </Link>
          }
        />
      </AppHeader>

      <Container>
        <div className="mt-4">
          <div className="flex items-center w-[426px] mb-4 gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tài khoản, Tên người dùng, mã..."
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>

            <div>
              <Button variant="default" size="sm" className="h-10 px-7 py-3 bg-amber-500 rounded-md inline-flex justify-center items-center gap-2.5">
                Tìm kiếm
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-10">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="flex justify-center items-center py-10 text-red-500">{error}</div>
          ) : (
            <Table className="w-full  shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)] ">
              <TableHeader className="bg-gray-100 text-gray-700">
                <TableRow className="border-b border-gray-200">
                  <TableCell isHeader className="font-semibold px-4 py-2 text-center">STT</TableCell>
                  {/* Tài khoản header with sorting */}
                  <TableCell
                    isHeader
                    className="font-semibold px-4 py-2 cursor-pointer flex items-center justify-center gap-1"
                    onClick={() => handleSort('username')}
                  >
                    Tài khoản
                    {sortColumn === 'username' && (
                      <span>{sortDirection === 'asc' ? null:<Image src="/images/icons/SortDescending.svg" alt="arrow-up" width={16} height={16} />}</span>
                    )}
                  </TableCell>
                  <TableCell
                    isHeader
                    className="font-semibold px-4 py-2 cursor-pointer"
                    onClick={() => handleSort('displayname')}
                  >
                    <span className="font-semibold px-4 py-2 cursor-pointer flex items-center justify-center gap-1">
                      Tên người dùng
                      {sortColumn === 'displayname' && (
                        <span>{sortDirection === 'asc' ? null: <Image src="/images/icons/SortDescending.svg" alt="arrow-down" width={16} height={16}/> }</span>
                      )}
                    </span>
                  </TableCell>
                  <TableCell isHeader className="font-semibold px-4 py-2">Mã KH</TableCell>
                  <TableCell isHeader className="font-semibold px-4 py-2">SĐT</TableCell>
                  <TableCell isHeader className="font-semibold px-4 py-2">Gmail</TableCell>
                  <TableCell isHeader className="font-semibold px-4 py-2">Địa chỉ</TableCell>
                  {/* Ngày tạo header with sorting */}
                  <TableCell
                    isHeader
                    className="font-semibold px-4 py-2 cursor-pointer flex items-center justify-center gap-1"
                    onClick={() => handleSort('created_at')}
                  >
                    Ngày tạo
                    {sortColumn === 'created_at' && (
                      <span>{sortDirection === 'asc' ? null: <Image src="/images/icons/SortDescending.svg" alt="arrow-down" width={16} height={16}/> }</span>
                    )}
                  </TableCell>
                  <TableCell isHeader className="font-semibold px-4 py-2 text-center"> </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((customer, index) => (
                  <TableRow
                    key={customer.id}
                    className="border-b border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <TableCell className="px-4 py-2 text-center">{indexOfFirstItem + index + 1}</TableCell>
                    <TableCell className="px-4 py-2 text-center">{customer.username}</TableCell>
                    <TableCell className="px-4 py-2 text-center">{customer.displayname}</TableCell>
                    <TableCell className="px-4 py-2 text-center">{customer.customer_code}</TableCell>
                    <TableCell className="px-4 py-2 text-center">{customer.phone_number}</TableCell>
                    <TableCell className="px-4 py-2 text-center">{customer.email}</TableCell>
                    <TableCell className="px-4 py-2 text-center">{customer.address}</TableCell>
                    <TableCell className="px-4 py-2 text-center">{customer.created_at ? new Date(customer.created_at).toLocaleString() : ''}</TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/customers/${customer.id}`}
                          className="justify-start text-blue-500 text-sm font-normal font-['Inter'] underline leading-snug"
                        >
                          Chi tiết
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div >

        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 px-6 py-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, customers.length)} của {customers.length} khách hàng
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </Container>
    </div >
  );
} 