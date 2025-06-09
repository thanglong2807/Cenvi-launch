"use client";
import React, { useState, useEffect } from "react";
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
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import HeaderItem from "@/layout/HeaderItem";
import AppHeader from "@/layout/AppHeader";
import Image from "next/image";
import Container from "@/components/Container/Container";
import Select from "@/components/form/Select";
import Input from "@/components/form/input";
import axiosInstance from "@/lib/axios";

interface Employee {
  id: number;
  username: string;
  displayname: string;
  email: string;
  phone_number: string;
  address: string;
  role_name: string;
  created_at: string;
}

export default function EmployeesPage() {
  const employees = useSelector((state: RootState) => state.employees);
  
  const [employeesData, setEmployeesData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  // State for sorting and filtering
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch employees data
  useEffect(() => {
    fetchEmployees();
  }, [currentPage, selectedRole, searchQuery]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());
      
      if (selectedRole) {
        params.append('role', selectedRole);
      }
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      if (sortColumn) {
        params.append('sort_by', sortColumn);
        params.append('sort_direction', sortDirection);
      }
      
      const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/staff/getAllStaff`);
      console.log(response.data);
      
      if (response.status === 200) {
        // Assuming the API returns data in the format { data: [...], total: number }
        const responseData = response.data;
        setEmployeesData(responseData.data || []);
        setTotalItems(responseData.total || responseData.data.length);
        setTotalPages(Math.ceil((responseData.total || responseData.data.length) / itemsPerPage));
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Không thể tải danh sách nhân viên. Vui lòng thử lại sau.");
      // Use sample data as fallback if API fails
      setEmployeesData([
        {
          id: 1,
          username: "user1",
          displayname: "Nguyễn Văn A",
          phone_number: "0901234567",
          email: "a@gmail.com",
          address: "Hà Nội",
          created_at: "2024-06-01",
          role_name: "CVPL"
        },
        {
          id: 2,
          username: "user2",
          displayname: "Trần Thị B",
          phone_number: "0912345678",
          email: "b@gmail.com",
          address: "Hồ Chí Minh",
          created_at: "2024-06-02",
          role_name: "Admin"
        },
        {
          id: 3,
          username: "user3",
          displayname: "Lê Văn C",
          phone_number: "0923456789",
          email: "c@gmail.com",
          address: "Đà Nẵng",
          created_at: "2024-06-03",
          role_name: "Bàn giao"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  // Get unique roles for the dropdown
  const uniqueRoles = Array.from(new Set(employeesData.map(employee => employee.role_name)));
  
  // Role options for the Select component
  const roleOptions = [
    { value: "", label: "Xem tất cả" },  // Add "View All" option
    ...uniqueRoles.map(role => ({
      value: role,
      label: role
    }))
  ];
  
  // Calculate indices for display
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1;
  const indexOfLastItem = Math.min(indexOfFirstItem + itemsPerPage - 1, totalItems);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle role filter change
  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle column header click for sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc'); // Default to ascending when changing column
    }
    setCurrentPage(1); // Reset to first page when sorting changes
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle search button click
  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    fetchEmployees();
  };

  return (
    <div className="rounded-2xl h-screen border border-gray-200 bg-white ">
      <AppHeader>

        <HeaderItem
          title="Nhân viên"
          right={
            <Link href="/employees/new">
              <Button variant="default" size="sm" className="shadow-sm bg-[#F89A1C] p-5 text-white">
                Thêm nhân viên
              </Button>
            </Link>
          }
        />
      </AppHeader>

      <Container>
        <div className="mt-4">
          <div className="flex items-center justify-start  mb-4 gap-4">
            <div className=" w-[426px] relative ">
              <Input
                flex="w-[426px]"
                type="text"
                placeholder="Tài khoản, Tên người dùng, mã..."
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={handleSearchChange}
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
            <div className="w-60">
              <Select 
                
                placeholder="Vai trò" 
                options={roleOptions}
                onChange={handleRoleChange}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
          <Table className="w-full shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)] ">
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
                    <span>{sortDirection === 'asc' ? null: <Image src="/images/icons/SortDescending.svg" alt="arrow-up" width={16} height={16}/> }</span>
                  )}
                 </span>
                </TableCell>
                <TableCell isHeader className="font-semibold px-4 py-2">SĐT</TableCell>
                <TableCell isHeader className="font-semibold px-4 py-2">Email</TableCell>
                <TableCell isHeader className="font-semibold px-4 py-2">Địa chỉ</TableCell>
                {/* Ngày tạo header with sorting */}
                <TableCell
                  isHeader
                  className="font-semibold px-4 py-2 cursor-pointer "
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center justify-center gap-1">Ngày tạo
                  {sortColumn === 'created_at' && (
                    <span>{sortDirection === 'asc' ?null: <Image src="/images/icons/SortDescending.svg" alt="arrow-up" width={16} height={16}/> }</span>
                  )}</div>
                </TableCell>
                <TableCell isHeader className="font-semibold px-4 py-2 text-center"> Vai trò </TableCell>
                <TableCell isHeader className="font-semibold px-4 py-2 text-center">{null} </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeesData.map((employee, index) => (
                <TableRow
                  key={employee.id}
                  className="border-b border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <TableCell className="px-4 py-2 text-center">{indexOfFirstItem + index}</TableCell>
                  <TableCell className="px-4 py-2 text-center">
                    {employee.username}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-center">{employee.displayname}</TableCell>
                  <TableCell className="px-4 py-2 text-center">
                    {employee.phone_number}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-center">
                    {employee.email}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-center">
                    {employee.address}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-center">
                    {employee.created_at}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-center">
                    {employee.role_name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/employees/${employee.id}`}
                        className="justify-start text-blue-500 text-sm font-normal font-['Inter'] underline leading-snug"
                      >
                        Chi tiết
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>)}
       
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4" >
          <div className="text-sm text-gray-500">
            Hiển thị {indexOfFirstItem} - {indexOfLastItem} của {totalItems} nhân viên
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
        </div>
      </Container>
    </div>
  );
} 