"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Input from "@/components/form/input";

interface CustomerData {
  username: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  customerSource: string;
  referralCode: string;
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  totalAmount: number;
  debt: number;
  status: string;
}

interface Profile {
  id: string;
  companyName: string;
  responsiblePerson: string;
  createdAt: string;
  progress: string;
  status: string;
}

export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData>({
    username: "",
    fullName: "",
    phone: "",
    email: "",
    address: "",
    customerSource: "",
    referralCode: ""
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fake customer data
        const fakeCustomerData = {
          username: "johndoe",
          fullName: "John Doe",
          phone: "0923456789",
          email: "john.doe@example.com",
          address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
          customerSource: "facebook",
          referralCode: "REF123"
        };
        setCustomerData(fakeCustomerData);

        // Fake orders data
        const fakeOrders = [
          {
            id: "1",
            orderNumber: "ORD001",
            createdAt: "2024-01-15",
            totalAmount: 15000000,
            debt: 5000000,
            status: "Đang xử lý"
          },
          {
            id: "2",
            orderNumber: "ORD002",
            createdAt: "2024-02-01",
            totalAmount: 25000000,
            debt: 0,
            status: "Hoàn thành"
          },
          {
            id: "3",
            orderNumber: "ORD003",
            createdAt: "2024-03-10",
            totalAmount: 30000000,
            debt: 10000000,
            status: "Đang xử lý"
          }
        ];
        setOrders(fakeOrders);

        // Fake profiles data
        const fakeProfiles = [
          {
            id: "1",
            companyName: "Công ty TNHH ABC",
            responsiblePerson: "Nguyễn Văn A",
            createdAt: "2024-01-10",
            progress: "80%",
            status: "Đang xử lý"
          },
          {
            id: "2",
            companyName: "Công ty CP XYZ",
            responsiblePerson: "Trần Thị B",
            createdAt: "2024-02-15",
            progress: "100%",
            status: "Hoàn thành"
          },
          {
            id: "3",
            companyName: "Doanh Nghiệp DEF",
            responsiblePerson: "Lê Văn C",
            createdAt: "2024-03-01",
            progress: "50%",
            status: "Đang xử lý"
          }
        ];
        setProfiles(fakeProfiles);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params.id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Saved customer data:", customerData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving customer:", error);
    }
  };

  const handlePasswordChange = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Password changed");
      setShowPasswordModal(false);
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  const handleDelete = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Customer deleted");
      router.push("/customers");
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Customer Information Section */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Thông tin chi tiết
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Chi tiết thông tin khách hàng
            </p>
          </div>
          <div className="flex space-x-2">
            {!isEditing ? (
              <Button onClick={handleEdit}>Sửa</Button>
            ) : (
              <Button onClick={handleSave}>Lưu</Button>
            )}
            <Button variant="outline" onClick={() => setShowPasswordModal(true)}>
              Đổi mật khẩu
            </Button>
            <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
              Xóa tài khoản
            </Button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-2 gap-6">
          <Input
            label="Tài khoản"
            value={customerData.username}
            disabled={!isEditing}
            onChange={(e) => setCustomerData(prev => ({ ...prev, username: e.target.value }))}
          />
          <Input
            label="Tên người dùng"
            value={customerData.fullName}
            disabled={!isEditing}
            onChange={(e) => setCustomerData(prev => ({ ...prev, fullName: e.target.value }))}
          />
          <Input
            label="Số điện thoại"
            value={customerData.phone}
            disabled={!isEditing}
            onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
          />
          <Input
            label="Email"
            value={customerData.email}
            disabled={!isEditing}
            onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
          />
          <Input
            label="Địa chỉ"
            value={customerData.address}
            disabled={!isEditing}
            onChange={(e) => setCustomerData(prev => ({ ...prev, address: e.target.value }))}
          />
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Nguồn khách hàng
            </label>
            <select
              value={customerData.customerSource}
              disabled={!isEditing}
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              onChange={(e) => setCustomerData(prev => ({ ...prev, customerSource: e.target.value }))}
            >
              <option value="">Chọn nguồn khách hàng</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="threads">Threads</option>
              <option value="twitter">Twitter</option>
              <option value="tiktok">Tiktok</option>
              <option value="website">Website</option>
              <option value="referral">Người quen giới thiệu</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Danh sách đơn hàng
          </h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="px-4 py-2 text-left">STT</th>
                  <th className="px-4 py-2 text-left">Mã đơn hàng</th>
                  <th className="px-4 py-2 text-left">Ngày tạo</th>
                  <th className="px-4 py-2 text-left">Đơn giá</th>
                  <th className="px-4 py-2 text-left">Công nợ</th>
                  <th className="px-4 py-2 text-left">Tình trạng</th>
                  <th className="px-4 py-2 text-left">Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order.id} className="border-b border-gray-200 dark:border-gray-800">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{order.orderNumber}</td>
                    <td className="px-4 py-2">{order.createdAt}</td>
                    <td className="px-4 py-2">{order.totalAmount}</td>
                    <td className="px-4 py-2">{order.debt}</td>
                    <td className="px-4 py-2">{order.status}</td>
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
        </div>
      </div>

      {/* Profiles Section */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Danh sách hồ sơ
          </h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="px-4 py-2 text-left">Tên công ty</th>
                  <th className="px-4 py-2 text-left">Người phụ trách</th>
                  <th className="px-4 py-2 text-left">Ngày tạo</th>
                  <th className="px-4 py-2 text-left">Tiến độ</th>
                  <th className="px-4 py-2 text-left">Trạng thái</th>
                  <th className="px-4 py-2 text-left">Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile) => (
                  <tr key={profile.id} className="border-b border-gray-200 dark:border-gray-800">
                    <td className="px-4 py-2">{profile.companyName}</td>
                    <td className="px-4 py-2">{profile.responsiblePerson}</td>
                    <td className="px-4 py-2">{profile.createdAt}</td>
                    <td className="px-4 py-2">{profile.progress}</td>
                    <td className="px-4 py-2">{profile.status}</td>
                    <td className="px-4 py-2">
                      <Button
                        variant="secondary"
                        onClick={() => router.push(`/profiles/${profile.id}`)}
                      >
                        Chi tiết
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Đổi mật khẩu</h3>
            <Input
              type="password"
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới"
            />
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
                Hủy
              </Button>
              <Button onClick={handlePasswordChange}>
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Xác nhận xóa tài khoản</h3>
            <p>Bạn có chắc chắn muốn xóa tài khoản này không?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Hủy
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Xóa
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 