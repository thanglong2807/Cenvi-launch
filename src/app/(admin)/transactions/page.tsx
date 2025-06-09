"use client";

import React, { useState, KeyboardEvent } from 'react';
import Container from '@/components/Container/Container';
import HeaderItem from '@/layout/HeaderItem';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AppHeader from '@/layout/AppHeader';
import Select from '@/components/form/Select';
import Pagination from '@/components/ui/pagination/Pagination';

interface Transaction {
  id: number;
  code: string;
  type: 'Full' | 'Balance' | 'Deposit';
  date: string;
  status: 'Đã thanh toán' | 'Chờ thanh toán';
  amount: number;
}

const TransactionsPage = () => {
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Sample transaction data
  const transactions: Transaction[] = [
    { id: 1, code: 'DK00004', type: 'Full', date: '12/12/2024', status: 'Đã thanh toán', amount: 3800000 },
    { id: 2, code: 'DK00003', type: 'Balance', date: '12/12/2024', status: 'Chờ thanh toán', amount: 2800000 },
    { id: 3, code: 'DK00003', type: 'Deposit', date: '12/12/2024', status: 'Đã thanh toán', amount: 2800000 },
    { id: 4, code: 'DK00001', type: 'Full', date: '12/12/2024', status: 'Đã thanh toán', amount: 1000000 },
  ];

  // Status options for the select dropdown
  const statusOptions = [
    { value: '', label: 'Tất cả' },
    { value: 'Đã thanh toán', label: 'Đã thanh toán' },
    { value: 'Chờ thanh toán', label: 'Chờ thanh toán' }
  ];

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    console.log('Searching for:', searchInput);
    // Implement actual search logic here
  };

  // Filter transactions based on search term and status filter
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.code.toLowerCase().includes(searchInput.toLowerCase());
    const matchesStatus = !statusFilter || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <AppHeader>
        <HeaderItem
          title="Giao dịch"
        />
      </AppHeader>
      <Container>
        <div>
          <div className="mt-4 flex items-center gap-4 mb-4">
            <div className="flex items-center w-[450px]  gap-4">
              <div className="relative flex-1  ">
                <input
                  type="text"
                  placeholder="Tìm theo mã đơn hàng hoặc tên khách hàng..."
                  className="w-full px-4 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>

              <div>
                <Button
                  variant="default"
                  size="sm"
                  className="h-10 px-7 py-3 bg-amber-500 rounded-md inline-flex justify-center items-center gap-2.5"
                  onClick={handleSearch}
                >
                  Tìm kiếm
                </Button>
              </div>
            </div>
            <Select
              wrapperClassName="w-[300px]"
              options={statusOptions}
              defaultValue={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              placeholder="Lọc theo trạng thái"
            />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]">
            <Table className="w-full">
              <TableHeader className="bg-gray-100 text-gray-700">
                <TableRow className="border-b border-gray-200">
                  <TableCell className="font-semibold px-4 py-2 text-center">STT</TableCell>
                  <TableCell className="font-semibold px-4 py-2 text-center">Mã đơn hàng</TableCell>
                  <TableCell className="font-semibold px-4 py-2 text-center">Loại thanh toán</TableCell>
                  <TableCell className="font-semibold px-4 py-2 text-center">Thời gian tạo</TableCell>
                  <TableCell className="font-semibold px-4 py-2 text-center">Trạng thái</TableCell>
                  <TableCell className="font-semibold px-4 py-2 text-center">Giá trị</TableCell>
                  <TableCell className="font-semibold px-4 py-2 text-center">Chi tiết</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                      Không có giao dịch nào
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((transaction) => (
                    <TableRow key={transaction.id} className="border-b border-gray-200">
                      <TableCell className="px-4 py-2 text-center">{transaction.id}</TableCell>
                      <TableCell className="px-4 py-2 text-center">{transaction.code}</TableCell>
                      <TableCell className="px-4 py-2 text-center">{transaction.type}</TableCell>
                      <TableCell className="px-4 py-2 text-center">{transaction.date}</TableCell>
                      <TableCell className="px-4 py-2 text-center">
                        <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${transaction.status === 'Đã thanh toán'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                          }`}>
                          {transaction.status}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-2 text-center">{transaction.amount.toLocaleString()}đ</TableCell>
                      <TableCell className="px-4 py-2 text-center">
                        <Link href={`/transactions/${transaction.id}`} className="text-blue-500 hover:underline">
                          Chi tiết
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="mt-4 w-[284px] mx-auto">
            <Pagination  currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </Container>
    </div>
  );
};

export default TransactionsPage;
