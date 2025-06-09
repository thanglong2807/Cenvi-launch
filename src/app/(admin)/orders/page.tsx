"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {  ChevronLeft, ChevronRight } from "lucide-react";
import { DateRange } from "react-day-picker";
import AppHeader from "@/layout/AppHeader";
import HeaderItem from "@/layout/HeaderItem";
import Link from "next/link";
import {Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Container from "@/components/Container/Container";
import Select from "@/components/form/Select";
import { Modal } from "@/components/ui/modal";
import axiosInstance from "@/lib/axios";


interface Order {
  id: string;
  MaDonHang: string;
  KhachHang: string;
  NgayTao: string;
  DonGia: string;
  TrangThai: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Handle search button click
  const handleSearch = () => {
    setSearchTerm(searchInput);
  };
  
  // Handle Enter key press in search input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const statusOptions = [
    { value: "all", label: "Tất cả" },
    { value: "Đã thanh toán", label: "Đã thanh toán" },
    { value: "Thanh toán 1 phần", label: "Thanh toán 1 phần" },
    { value: "Chưa thanh toán", label: "Chưa thanh toán" },
  ];

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/orders/?skip=0&limit=100`);
        console.log(response.data.data);
        // Transform the API response to match our Order interface
        const formattedOrders = response.data.data.items.map((order: any) => ({
          id: order.id || '',
          MaDonHang: order.code || '',
          KhachHang: order.customer?.fullName || 'Không có tên',
          NgayTao: new Date(order.createdAt).toLocaleDateString('vi-VN'),
          DonGia: new Intl.NumberFormat('vi-VN').format(order.totalAmount || 0),
          TrangThai: order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 
                    order.paymentStatus === 'PARTIALLY_PAID' ? 'Thanh toán 1 phần' : 'Chưa thanh toán'
        }));
        setOrders(formattedOrders);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Không thể tải dữ liệu đơn hàng. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(order => 
        (order.MaDonHang && order.MaDonHang.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.KhachHang && order.KhachHang.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(order => order.TrangThai === statusFilter);
    }
    return result;
  }, [orders, searchTerm, statusFilter]);

  // Pagination calculations
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <div className="">
        <AppHeader>
      
              <HeaderItem
                title="Đơn hàng"
                right={
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="shadow-sm bg-[#F89A1C] p-5 text-white"
                    onClick={() => setIsAddModalOpen(true)}
                  >
                    Thêm đơn hàng
                  </Button>
                }
              />
            </AppHeader>
            <Container>
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                        </div>
                    ) : error ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="text-red-500">{error}</div>
                        </div>
                    ) : (
                    <div className="mt-4">
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
                        <Table className="w-full shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]">
                            <TableHeader className="bg-gray-100 text-gray-700">
                                <TableRow className="border-b border-gray-200">
                                    <TableCell isHeader className="font-semibold px-4 py-2 text-center">STT</TableCell>
                                    <TableCell
                                        isHeader
                                        className="font-semibold px-4 py-2 cursor-pointer flex items-center justify-center gap-1">Mã đơn hàng</TableCell>
                                    <TableCell
                                        isHeader
                                        className="font-semibold px-4 py-2">Khác  h hàng</TableCell>
                                    <TableCell isHeader className="font-semibold px-4 py-2 text-center">Ngày tạo</TableCell>
                                    <TableCell isHeader className="font-semibold px-4 py-2 text-center">Đơn giá</TableCell>
                                    <TableCell isHeader className="font-semibold px-4 py-2 text-center">Trạng thái</TableCell>
                                    <TableCell isHeader className="font-semibold px-4 py-2 text-center">{null}</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.map((order, index) => (
                                    <TableRow
                                        key={index}
                                        className="border-b border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <TableCell className="px-4 py-2 text-center">{index + 1}</TableCell>
                                        <TableCell className="px-4 py-2 text-center">{order.MaDonHang}</TableCell>
                                        <TableCell className="px-4 py-2 text-center">{order.KhachHang}</TableCell>
                                        <TableCell className="px-4 py-2 text-center">{order.NgayTao}</TableCell>
                                        <TableCell className="px-4 py-2 text-center">{order.DonGia}</TableCell>
                                        <TableCell className="px-4 py-2 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs ${order.TrangThai === "Đã thanh toán" ? "bg-green-100 text-green-800" : 
                                                order.TrangThai === "Thanh toán 1 phần" ? "bg-blue-100 text-blue-800" : 
                                                "bg-red-100 text-red-800"}`}>
                                                {order.TrangThai}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-4 py-2 text-center">
                                            <Link
                                                href={`/orders/${order.MaDonHang}`}
                                                className=" text-blue-500"
                                            >
                                                Chi tiết  
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    )}
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6">
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "outline"}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-1 rounded-md ${currentPage === page ? "bg-amber-500 text-white hover:bg-amber-600" : "hover:bg-gray-50"}`}
                                    >
                                        {page}
                                    </Button>
                                ))}
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </Container>
    <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} className="" isFullscreen={true}>
      <div className=" p-6 flex w-[400px] bg-white rounded-xl shadow-[0px_8px_8px_-4px_ flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 19.5V18H4.5V4.5H19.5V18H14.5V19.5H9.5ZM9.5 16.5H14.5V13.5H16V6H8V13.5H9.5V16.5ZM12 12.75C12.4142 12.75 12.75 12.4142 12.75 12C12.75 11.5858 12.4142 11.25 12 11.25C11.5858 11.25 11.25 11.5858 11.25 12C11.25 12.4142 11.5858 12.75 12 12.75Z" fill="#F89A1C"/>
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Thêm đơn hàng</h2>
        <p className="text-gray-600 text-center mb-6">Bạn muốn thêm đơn hàng liên kết với hồ sơ đang thực hiện hay với khách hàng?</p>
        
        <div className="flex w-full gap-4">
          <Button 
            variant="outline" 
            className="flex-1 border border-amber-500  outline-amber-500 py-2 rounded-md"
            onClick={() => router.push('/orders/new?type=customer')}
          >
            Khách hàng
          </Button>
          <Button 
            className="flex-1 bg-amber-500 text-white py-2 rounded-md"
            onClick={() => router.push('/orders/new?type=profile')}
          >
            Hồ sơ
          </Button>
        </div>
      </div>
    </Modal>
    </div>
  );
} 