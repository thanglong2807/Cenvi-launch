"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Input from "@/components/form/input";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { deleteCustomer } from "@/redux/slices/customersSlice";
import Link from "next/link";
import AppHeader from "@/layout/AppHeader";
import HeaderItem from "@/layout/HeaderItem";
import Image from "next/image";
import Container from "@/components/Container/Container";
import { Table, TableBody, TableCell, TableHeader, TableRow, } from "@/components/ui/table";
import Pagination from "@/components/ui/pagination/Pagination";
import { v4 as uuidv4 } from "uuid";
import OrderListTable from "../components/OrderListTable";
import ProfileListTable from "../components/ProfileListTable";
import PopupDelete from "@/components/ui/PopupDelete";
import { deleteEmployee } from "@/redux/slices/employeesSlice";
import Select from "@/components/form/Select";
import axiosInstance from "@/lib/axios";

interface EmployeeData {
  username: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  role: string;
  idCard: string;
  issuePlace: string;
  issueDate: string;
  expiryDate: string;
  createdAt: string;
}

// Add missing fields to Employee interface
// This is a module augmentation to extend the Employee type
declare module "@/redux/slices/employeesSlice" {
  interface Employee {
    id: number;
    username: string;
    fullName: string;
    phone: string;
    email: string;
    address: string;
    role?: string;
    idCard?: string;
    issuePlace?: string;
    issueDate?: string;
    expiryDate?: string;
    createdAt: string;
  }
}
interface listOfProfiles {
  stt: number;
  ten_cong_ty: string;
  nguoi_phu_trach: string;
  ngay_tao: string;
  trang_thai: string;
}


export default function EmployeeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  // const employees = useSelector((state: RootState) => state.employees);
  // const employee = employees.find(c => c.id === Number(params.id)); // Data will be fetched from API
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [employeeData, setEmployeeData] = useState<EmployeeData>({
    username: "",
    fullName: "",
    phone: "",
    email: "",
    address: "",
    role: "",
    idCard: "",
    issuePlace: "",
    issueDate: "",
    expiryDate: "",
    createdAt: ""
  });
  const [listOfProfilesData, setListOfProfilesData] = useState<listOfProfiles[]>([]);
  const datalistorder = [
    {
      "stt": uuidv4(),
      "ma_don_hang": "1830310",
      "ngay_tao": "12/12/2024",
      "don_gia": "1.000.000",
      "cong_no": "100.000",
      "trang_thai": "Đã thanh toán",
      "chi_tiet": "Chi tiết"
    },
    {
      "stt": uuidv4(),
      "ma_don_hang": "1830310",
      "ngay_tao": "12/12/2024",
      "don_gia": "1.000.000",
      "cong_no": "100.000",
      "trang_thai": "Đã thanh toán",
      "chi_tiet": "Chi tiết"
    },
    {
      "stt": uuidv4(),
      "ma_don_hang": "1830310",
      "ngay_tao": "12/12/2024",
      "don_gia": "1.000.000",
      "cong_no": "100.000",
      "trang_thai": "Thanh toán 1 phần",
      "chi_tiet": "Chi tiết"
    },
    {
      "stt": uuidv4(),
      "ma_don_hang": "1830310",
      "ngay_tao": "12/12/2024",
      "don_gia": "1.000.000",
      "cong_no": "100.000",
      "trang_thai": "Thanh toán 1 phần",
      "chi_tiet": "Chi tiết"
    },
    {
      "stt": uuidv4(),
      "ma_don_hang": "1830310",
      "ngay_tao": "12/12/2024",
      "don_gia": "1.000.000",
      "cong_no": "100.000",
      "trang_thai": "Chưa thanh toán",
      "chi_tiet": "Chi tiết"
    }
  ]

  const listOfProfiles = [
    {
      "stt": 1,
      "ten_cong_ty": "pdl123",
      "nguoi_phu_trach": "Pham Linh",
      "ngay_tao": "12/12/2024",
      "trang_thai": "Hồ sơ mới"
    },
    {
      "stt": 2,
      "ten_cong_ty": "pdl123",
      "nguoi_phu_trach": "Pham Linh",
      "ngay_tao": "12/12/2024",
      "trang_thai": "Bổ sung/Chỉnh sửa"
    },
    {
      "stt": 3,
      "ten_cong_ty": "pdl123",
      "nguoi_phu_trach": "Pham Linh",
      "ngay_tao": "12/12/2024",
      "trang_thai": "Nhận hồ sơ giấy"
    },
    {
      "stt": 4,
      "ten_cong_ty": "pdl123",
      "nguoi_phu_trach": "Pham Linh",
      "ngay_tao": "12/12/2024",
      "trang_thai": "Bổ sung biên bản"
    },
    {
      "stt": 5,
      "ten_cong_ty": "pdl123",
      "nguoi_phu_trach": "Pham Linh",
      "ngay_tao": "12/12/2024",
      "trang_thai": "Hoàn thành"
    }
  ]

  const roleOptions = [
    { value: "admin", label: "Quản trị viên" },
    { value: "manager", label: "Quản lý" },
    { value: "sales", label: "Nhân viên kinh doanh" },
    { value: "support", label: "Nhân viên hỗ trợ" },
    { value: "accounting", label: "Kế toán" },
    { value: "technical", label: "Kỹ thuật" }
  ];

  useEffect(() => {
    setListOfProfilesData(listOfProfiles); // Assuming listOfProfiles is static or fetched elsewhere

    if (params.id) {
      const fetchEmployeeDetails = async () => {
        try {
          const response = await axiosInstance.get(`http://103.98.152.69:8086/api/v1/staff/detailStaff/${params.id}`);
          // Assuming the API response data is directly in response.data
          // You might need to adjust this based on your API's response structure (e.g., response.data.data)
          const apiData = response.data.data;
          console.log(apiData);
          if (apiData) {
            setEmployeeData({
              username: apiData.username || "",
              fullName: apiData.displayname || "",
              phone: apiData.phone_number || "",
              email: apiData.email || "",
              address: apiData.address || "",
              role: apiData.role_name || "admin", // Default to 'admin' if not provided
              idCard: apiData.cccd || "",
              issuePlace: apiData.place_of_issue || "",
              issueDate: apiData.issue_date || "",
              expiryDate: apiData.expiry_date || "",
              createdAt: apiData.createdAt || apiData.created_at || "" // Keep existing fallback for createdAt
            });
          } else {
            console.error("Employee data not found in API response");
            router.push("/employees");
          }
        } catch (error) {
          console.error("Error fetching employee details:", error);
          // Optionally, redirect or show an error message to the user
          // For example, if the employee is not found (404), you might want to redirect
          // if (axios.isAxiosError(error) && error.response?.status === 404) {
          //   router.push("/employees");
          // }
          // For now, logging the error and potentially redirecting for any error
          router.push("/employees");
        }
      };
      fetchEmployeeDetails();
    } else {
      // If there's no ID in params, redirect to the employees list
      console.error("No employee ID found in URL params");
      router.push("/employees");
    }
  }, [params.id, router]);
  const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(password);
  };

  const handlePasswordChange = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Password changed to:", newPassword);
    setShowPasswordModal(false);
    setNewPassword("");
  };

  const handleSaveChanges = async () => {
    if (!params.id) {
      console.error("Employee ID not found, cannot save changes.");
      return;
    }
    setIsSubmitting(true);
    try {
      // Map frontend state to API expected payload
      const payload = {
        username: employeeData.username,
        displayname: employeeData.fullName, // Maps from fullName
        phone_number: employeeData.phone,   // Maps from phone
        email: employeeData.email,
        address: employeeData.address,
        role_name: employeeData.role,     // Maps from role
        cccd: employeeData.idCard,        // Maps from idCard
        place_of_issue: employeeData.issuePlace, // Maps from issuePlace
        issue_date: employeeData.issueDate,     // Maps from issueDate
        expiry_date: employeeData.expiryDate,   // Maps from expiryDate
        // id is part of the URL, not usually in the PUT payload for updates
      };

      const response = await axiosInstance.put(`http://103.98.152.69:8086/api/v1/staff/editStaff/${params.id}`, payload);
      
      if (response.status === 200 || response.status === 204) { // 204 No Content is also a success for PUT
        console.log("Employee data saved successfully:", response.data);
        setIsEditing(false);
        // Optionally, you might want to re-fetch data or update Redux store if applicable
      } else {
        console.error("Error saving employee data:", response);
        // Handle non-2xx success responses if necessary
      }
    } catch (error) {
      console.error("Failed to save employee data:", error);
      // Handle network errors or other exceptions
      // You might want to show a notification to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!params.id) {
      console.error("Cannot delete: Employee ID not found.");
      setShowDeleteModal(false); // Close modal even if ID is missing
      return;
    }
    // Consider adding a loading state for the delete button in the modal if needed
    try {
      const response = await axiosInstance.delete(`http://103.98.152.69:8086/api/v1/staff/deleteStaff/${params.id}`);
      
      if (response.status === 200 || response.status === 204) { // 204 No Content is also a success for DELETE
        console.log("Employee deleted successfully");
        setShowDeleteModal(false);
        router.push("/employees");
        router.refresh(); // To ensure the list is updated if the user navigates back
      } else {
        console.error("Error deleting employee:", response);
        // Handle non-2xx success responses if necessary
        setShowDeleteModal(false); // Close modal on error too
      }
    } catch (error) {
      console.error("Failed to delete employee:", error);
      // Handle network errors or other exceptions
      // You might want to show a notification to the user
      setShowDeleteModal(false); // Close modal on error too
    }
  };

  // const handleResetPassword = async () => {
  //   // Simulate API call to reset password
  //   await new Promise(resolve => setTimeout(resolve, 1000));
  //   console.log("Password reset successfully");
  // };

  return (
    <div className="space-y-6 bg-[#fff]">
      <AppHeader>

        <HeaderItem
          title="Nhân viên / Thông tin nhân viên"
          right={
            <div className="flex gap-2">
              <Button onClick={() => setShowDeleteModal(true)} className="text-center justify-center bg-transparent border border-amber-500 text-amber-500 text-sm font-normal font-['Inter'] leading-snug">Xóa tài khoản</Button>
              {isEditing ? (
                <Button onClick={handleSaveChanges} disabled={isSubmitting} className="text-center justify-center text-white text-sm font-normal font-['Inter'] leading-snug">
                  {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                </Button>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="text-center justify-center text-white text-sm font-normal font-['Inter'] leading-snug">Sửa</Button>
              )}
            </div>
          }
          left={
            <Link href="/employees">
              <Image src="/images/icons/back.svg" alt="arrow-left" width={24} height={24} />
            </Link>
          }
        />
      </AppHeader>
      {/* Employee Information Section */}
      <div className="rounded-2xl  ">

        <Container>
          <div>
            <h2 className="text-amber-500 text-xl mb-3 font-semibold">
              Thông tin chi tiết
            </h2>
            <div className="px-12 py-5 shadow-[inset_-1px_0px_0px_0px_rgba(0,0,0,0.13)] mb-15 border  rounded-xl relative">
              <div className="grid grid-cols-2 gap-x-35 gap-y-3">
                <Input
                  label="Tài khoản:"
                  flex="flex items-center"
                  classNameLabel="w-50 flex item-center"
                  className={isEditing ? "border border-gray-300" : ""}
                  value={employeeData.username}
                  disabled={!isEditing}
                  onChange={(e) => setEmployeeData(prev => ({ ...prev, username: e.target.value }))}
                />
                <Input
                  label="Tên người dùng:"
                  flex="flex items-center"
                  classNameLabel="w-50 flex item-center"
                  className={isEditing ? "border border-gray-300" : ""}
                  value={employeeData.fullName}
                  disabled={!isEditing}
                  onChange={(e) => setEmployeeData(prev => ({ ...prev, fullName: e.target.value }))}
                />
                <div className="flex items-center">
                  <label className="w-[150px] flex item-center text-sm font-medium text-gray-700">Vai trò:</label>
                  <Select
                    wrapperClassName="flex-1"

                    options={[
                      { value: "admin", label: "Quản trị viên" },
                      { value: "manager", label: "Quản lý" },
                      { value: "sales", label: "Nhân viên kinh doanh" },
                      { value: "support", label: "Nhân viên hỗ trợ" },
                      { value: "accounting", label: "Kế toán" },
                      { value: "technical", label: "Kỹ thuật" }
                    ]}
                    placeholder="Quản trị viên"
                    onChange={(value) => {
                      setEmployeeData(prev => ({
                        ...prev,
                        role: value
                      }));
                    }}
                    defaultValue={employeeData.role}
                    className={!isEditing ? "opacity-70 pointer-events-none" : ""}
                  />
                </div>
                <Input
                  label="SĐT:"
                  flex="flex items-center"
                  classNameLabel="w-50 flex item-center"
                  className={isEditing ? "border border-gray-300" : ""}
                  value={employeeData.phone}
                  disabled={!isEditing}
                  onChange={(e) => setEmployeeData(prev => ({ ...prev, phone: e.target.value }))}
                />
                <Input
                  label="Email:"
                  flex="flex items-center"
                  classNameLabel="w-50 flex item-center"
                  className={isEditing ? "border border-gray-300" : ""}
                  value={employeeData.email}
                  disabled={!isEditing}
                  onChange={(e) => setEmployeeData(prev => ({ ...prev, email: e.target.value }))}
                />
                <Input
                  label="Địa chỉ:"
                  flex="flex items-center"
                  classNameLabel="w-50 flex item-center"
                  className={isEditing ? "border border-gray-300" : ""}
                  value={employeeData.address}
                  disabled={!isEditing}
                  onChange={(e) => setEmployeeData(prev => ({ ...prev, address: e.target.value }))}
                />
                <Input
                  label="CCCD:"
                  flex="flex items-center"
                  classNameLabel="w-50 flex item-center"
                  className={isEditing ? "border border-gray-300" : ""}
                  value={employeeData.idCard || "000000000000000"}
                  disabled={!isEditing}
                  onChange={(e) => setEmployeeData(prev => ({ ...prev, idCard: e.target.value }))}
                />
                <Input
                  label="Nơi cấp:"
                  flex="flex items-center"
                  classNameLabel="w-50 flex item-center"
                  className={isEditing ? "border border-gray-300" : ""}
                  value={employeeData.issuePlace || "Hải Phòng"}
                  disabled={!isEditing}
                  onChange={(e) => setEmployeeData(prev => ({ ...prev, issuePlace: e.target.value }))}
                />
                <Input
                  label="Ngày cấp:"
                  flex="flex items-center"
                  classNameLabel="w-50 flex item-center"
                  className={isEditing ? "border border-gray-300" : ""}
                  value={employeeData.issueDate || ""}
                  disabled={!isEditing}
                  onChange={(e) => setEmployeeData(prev => ({ ...prev, issueDate: e.target.value }))}
                  type="date"
                />
                <Input
                  label="Ngày hết hạn:"
                  flex="flex items-center"
                  classNameLabel="w-50 flex item-center"
                  className={isEditing ? "border border-gray-300" : ""}
                  value={employeeData.expiryDate || ""}
                  disabled={!isEditing}
                  onChange={(e) => setEmployeeData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  type="date"
                />
              </div>
              {isEditing && (
                <div className="">
                  <div className="flex items-center mt-7 pb-6 w-1/2 pr-16 justify-between">
                    <h3 className="text-zinc-800 text-xl">Đổi mật khẩu</h3>
                    <Button className="bg-white text-amber-500 text-sm px-7 py-3 outline outline-1 outline-offset-[-1px] outline-amber-500 " >Xác nhận</Button>
                  </div>
                  <div className="space-y-4  w-1/2 pr-16 relative">
                    <Input
                      type="text"
                      label="Mật khẩu mới"
                      flex="flex  items-center "
                      classNameLabel="w-40 flex item-center"
                      className="border border-gray-300"
                      placeholder="Nhập mật khẩu mới"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Button

                      variant="outline"
                      onClick={generateRandomPassword}
                      className="text-xs px-2 py-1 border-none h-auto absolute text-blue-600 right-18 top-1/2 -translate-y-1/2"
                    >
                      Tạo mật khẩu
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <OrderListTable orders={datalistorder} currentPage={1} onPageChange={() => { }} totalPages={5} />

            <ProfileListTable profiles={listOfProfilesData} currentPage={1} onPageChange={() => { }} totalPages={5} />
          </div>

        </Container>
      </div >

      {/* Password Change Modal */}
      {
        showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
              <h3 className="text-lg font-semibold mb-4">Đổi mật khẩu</h3>
              <div className="space-y-4">
                <Input
                  type="text"
                  label="Mật khẩu mới"
                  placeholder="Nhập mật khẩu mới"
                  className="border border-gray-300"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={generateRandomPassword}
                    className="text-xs px-2 py-1 h-auto"
                  >
                    Tạo mật khẩu ngẫu nhiên
                  </Button>
                  {newPassword && (
                    <div className="text-sm text-gray-600 bg-gray-100 p-2 rounded flex-1 overflow-x-auto">
                      {newPassword}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => {
                  setShowPasswordModal(false);
                  setNewPassword("");
                }}>
                  Hủy
                </Button>
                <Button onClick={handlePasswordChange}>
                  Xác nhận
                </Button>
              </div>
            </div>
          </div>
        )
      }

      {/* Delete Confirmation Modal */}
      <PopupDelete
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa tài khoản"
        message="Nếu bạn xóa tài khoản, thông tin về tài khoản này sẽ không được lưu trong hệ thống. Bạn chắc chắn muốn xóa tài khoản chứ?"
        cancelText="Hủy"
        confirmText="Xóa"
      />
    </div >
  );
} 
