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

import { v4 as uuidv4 } from "uuid";
import OrderListTable from "../components/OrderListTable";
import ProfileListTable from "../components/ProfileListTable";
import PopupDelete from "@/components/ui/PopupDelete";
import axiosInstance from "@/lib/axios";


interface CustomerData {
  id: number;
  username: string;
  displayname: string;
  email: string;
  customer_code: string;
  phone_number: string;
  customer_source: string;
  address: string;
  referral_code: string | null;
  created_at?: string;
}
interface listOfProfiles {
  stt: number;
  ten_cong_ty: string;
  nguoi_phu_trach: string;
  ngay_tao: string;
  trang_thai: string;
}


export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  const customers = useSelector((state: RootState) => state.customers);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState<CustomerData>({
    id: 0,
    username: "",
    displayname: "",
    email: "",
    customer_code: "",
    phone_number: "",
    customer_source: "",
    address: "",
    referral_code: null
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

  useEffect(() => {
    setListOfProfilesData(listOfProfiles);
    fetchCustomerData();
  }, [params.id]);
  
  const fetchCustomerData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/customers/${params.id}`);
      if (response.status === 200) {
        setCustomerData(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching customer data:", err);
      setError("Không thể tải thông tin khách hàng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };
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
    try {
      const response = await axiosInstance.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/customers/${params.id}`, customerData);
      if (response.status === 200) {
        console.log("Customer data saved successfully");
        setIsEditing(false);
        // Refresh data after update
        fetchCustomerData();
      }
    } catch (err) {
      console.error("Error updating customer data:", err);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/customers/${params.id}`);
      if (response.status === 200 || response.status === 204) {
        dispatch(deleteCustomer(Number(params.id)));
        router.push("/customers");
      }
    } catch (err) {
      console.error("Error deleting customer:", err);
    }
  };

  return (
    <div className="space-y-6 bg-[#fff]">
      <AppHeader>

        <HeaderItem
          title="Khách hàng / Thông tin khách hàng"
          right={
            <div className="flex gap-2">

              <Button onClick={() => setShowDeleteModal(true)} className="text-center justify-center bg-transparent border border-amber-500 text-amber-500 text-sm font-normal font-['Inter'] leading-snug">Xóa tài khoản</Button>


              {isEditing ? (
                <Button onClick={handleSaveChanges} className="text-center justify-center text-white text-sm font-normal font-['Inter'] leading-snug">Lưu</Button>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="text-center justify-center text-white text-sm font-normal font-['Inter'] leading-snug">Sửa</Button>
              )}

            </div>
          }
          left={
            <Link href="/customers">
              <Image src="/images/icons/back.svg" alt="arrow-left" width={24} height={24} />
            </Link>
          }
        />
      </AppHeader>
      {/* Customer Information Section */}
      <div className="rounded-2xl  ">

        <Container>
          <div>
            <h2 className="text-amber-500 text-xl mb-3 font-semibold">
              Thông tin chi tiết
            </h2>
            <div className="px-12 py-5 shadow-[inset_-1px_0px_0px_0px_rgba(0,0,0,0.13)] mb-15 border  rounded-xl relative">
              <div className=" grid grid-cols-2 gap-x-35 gap-y-3 ">
              {loading ? (
                <div className="col-span-2 py-4 text-center">Đang tải thông tin khách hàng...</div>
              ) : error ? (
                <div className="col-span-2 py-4 text-center text-red-500">{error}</div>
              ) : (
                <>
                  <Input
                    label="Tài khoản:"
                    flex="flex items-center"
                    classNameLabel="w-40 flex item-center"
                    className={isEditing ? "border border-gray-300" : ""}
                    value={customerData.username}
                    disabled={!isEditing}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, username: e.target.value }))}
                  />
                  <Input
                    label="Tên người dùng:"
                    flex="flex items-center"
                    classNameLabel="w-40 flex item-center"
                    className={isEditing ? "border border-gray-300" : ""}
                    value={customerData.displayname}
                    disabled={!isEditing}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, displayname: e.target.value }))}
                  />
                  <Input
                    label="Số điện thoại:"
                    flex="flex items-center"
                    classNameLabel="w-40 flex item-center"
                    className={isEditing ? "border border-gray-300" : ""}
                    value={customerData.phone_number}
                    disabled={!isEditing}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, phone_number: e.target.value }))}
                  />
                  <Input
                    label="Email:"
                    flex="flex items-center"
                    classNameLabel="w-40 flex item-center"
                    className={isEditing ? "border border-gray-300" : ""}
                    value={customerData.email}
                    disabled={!isEditing}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                  />
                  <Input
                    label="Địa chỉ:"
                    flex="flex items-center"
                    classNameLabel="w-40 flex item-center"
                    className={isEditing ? "border border-gray-300" : ""}
                    value={customerData.address}
                    disabled={!isEditing}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, address: e.target.value }))}
                  />
                  <Input
                    label="Nguồn khách hàng:"
                    flex="flex items-center"
                    classNameLabel="w-40 flex item-center"
                    className={isEditing ? "border border-gray-300" : ""}
                    value={customerData.customer_source}
                    disabled={!isEditing}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, customer_source: e.target.value }))}
                  />
                  <Input
                    label="Mã khách hàng:"
                    flex="flex items-center"
                    classNameLabel="w-40 flex item-center"
                    className={isEditing ? "border border-gray-300" : ""}
                    value={customerData.customer_code}
                    disabled={!isEditing}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, customer_code: e.target.value }))}
                  />
                </>
              )}
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
          
         <OrderListTable orders={datalistorder} currentPage={1} onPageChange={()=>{}} totalPages={5}/>

          <ProfileListTable profiles={listOfProfilesData} currentPage={1} onPageChange={()=>{}} totalPages={5}/>
      </div>

    </Container>
      </div >

    {/* Password Change Modal */ }
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

  {/* Delete Confirmation Modal */ }
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
