"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Input from "@/components/form/input";
import { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  amount: number;
  paymentType: string;
  status: string;
}

type SortField = 'orderNumber' | 'createdAt' | 'amount' | 'status';

const ITEMS_PER_PAGE = 10;

export default function OrdersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const orders: Order[] = [
    {
      id: "1",
      orderNumber: "DKKD-01",
      createdAt: "15/04/2025",
      amount: 3800000,
      paymentType: "100%",
      status: "Đã hoàn thành"
    },
    {
      id: "2",
      orderNumber: "DKKD-02",
      createdAt: "19/04/2025",
      amount: 4800000,
      paymentType: "50% (công nợ)",
      status: "Thanh toán 1 phần"
    },
    {
      id: "3",
      orderNumber: "DKKD-03",
      createdAt: "20/04/2025",
      amount: 5800000,
      paymentType: "100%",
      status: "Đã hoàn thành"
    },
    {
      id: "4",
      orderNumber: "DKKD-04",
      createdAt: "21/04/2025",
      amount: 6800000,
      paymentType: "50% (công nợ)",
      status: "Thanh toán 1 phần"
    },
    {
      id: "5",
      orderNumber: "DKKD-05",
      createdAt: "22/04/2025",
      amount: 7800000,
      paymentType: "100%",
      status: "Đã hoàn thành"
    },
    {
      id: "6",
      orderNumber: "DKKD-06",
      createdAt: "23/04/2025",
      amount: 2500000,
      paymentType: "100%",
      status: "Đã hoàn thành"
    },
    {
      id: "7",
      orderNumber: "DKKD-07",
      createdAt: "24/04/2025",
      amount: 3200000,
      paymentType: "50% (công nợ)",
      status: "Thanh toán 1 phần"
    },
    {
      id: "8",
      orderNumber: "DKKD-08",
      createdAt: "25/04/2025",
      amount: 4100000,
      paymentType: "100%",
      status: "Đã hoàn thành"
    },
    {
      id: "9",
      orderNumber: "DKKD-09",
      createdAt: "26/04/2025",
      amount: 5500000,
      paymentType: "50% (công nợ)",
      status: "Thanh toán 1 phần"
    },
    {
      id: "10",
      orderNumber: "DKKD-10",
      createdAt: "27/04/2025",
      amount: 6300000,
      paymentType: "100%",
      status: "Đã hoàn thành"
    },
    {
      id: "11",
      orderNumber: "DKKD-11",
      createdAt: "28/04/2025",
      amount: 4200000,
      paymentType: "50% (công nợ)",
      status: "Thanh toán 1 phần"
    },
    {
      id: "12",
      orderNumber: "DKKD-12",
      createdAt: "29/04/2025",
      amount: 3900000,
      paymentType: "100%",
      status: "Đã hoàn thành"
    },
    {
      id: "13",
      orderNumber: "DKKD-13",
      createdAt: "30/04/2025",
      amount: 7100000,
      paymentType: "50% (công nợ)",
      status: "Thanh toán 1 phần"
    },
    {
      id: "14",
      orderNumber: "DKKD-14",
      createdAt: "01/05/2025",
      amount: 8200000,
      paymentType: "100%",
      status: "Đã hoàn thành"
    },
    {
      id: "15",
      orderNumber: "DKKD-15",
      createdAt: "02/05/2025",
      amount: 5900000,
      paymentType: "50% (công nợ)",
      status: "Thanh toán 1 phần"
    }
  ];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(order => order.status === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      let compareValue = 0;
      switch (sortField) {
        case "orderNumber":
          compareValue = a.orderNumber.localeCompare(b.orderNumber);
          break;
        case "createdAt":
          compareValue = new Date(a.createdAt.split('/').reverse().join('-')).getTime() -
                        new Date(b.createdAt.split('/').reverse().join('-')).getTime();
          break;
        case "amount":
          compareValue = a.amount - b.amount;
          break;
        case "status":
          compareValue = a.status.localeCompare(b.status);
          break;
      }
      return sortDirection === "asc" ? compareValue : -compareValue;
    });

    return result;
  }, [orders, searchTerm, statusFilter, sortField, sortDirection]);

  // Pagination calculations
  const totalItems = filteredAndSortedOrders.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filteredAndSortedOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUpIcon className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDownIcon className="w-4 h-4 inline ml-1" />
    );
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Danh sách đơn hàng
          </h3>
          <Button onClick={() => router.push('/orders/new')}>
            Thêm đơn hàng
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-wrap gap-4">
          <div className="w-64">
            <Input
              placeholder="Tìm kiếm đơn hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-48">
            <select
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Đã hoàn thành">Đã hoàn thành</option>
              <option value="Thanh toán 1 phần">Thanh toán 1 phần</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-4 py-2 text-left">STT</th>
                <th 
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort("orderNumber")}
                >
                  Mã đơn hàng
                  <SortIcon field="orderNumber" />
                </th>
                <th 
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  Ngày tạo
                  <SortIcon field="createdAt" />
                </th>
                <th 
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort("amount")}
                >
                  Đơn giá
                  <SortIcon field="amount" />
                </th>
                <th className="px-4 py-2 text-left">Loại thanh toán</th>
                <th 
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Tình trạng
                  <SortIcon field="status" />
                </th>
                <th className="px-4 py-2 text-left">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order, index) => (
                <tr key={order.id} className="border-b border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-2">{startIndex + index + 1}</td>
                  <td className="px-4 py-2">{order.orderNumber}</td>
                  <td className="px-4 py-2">{order.createdAt}</td>
                  <td className="px-4 py-2">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'decimal',
                      minimumFractionDigits: 0
                    }).format(order.amount)}
                  </td>
                  <td className="px-4 py-2">{order.paymentType}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Đã hoàn thành'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <Button
                      variant="secondary"
                      onClick={() => router.push(`/orders/${order.id}`)}
                    >
                      Chi tiết
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Hiển thị {startIndex + 1} đến {Math.min(startIndex + ITEMS_PER_PAGE, totalItems)} trong số {totalItems} đơn hàng
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "primary" : "outline"}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRightIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 