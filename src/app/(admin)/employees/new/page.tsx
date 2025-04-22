'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import Input from '@/components/form/input';
import { Card, CardContent } from '@/components/ui/card';

interface EmployeeForm {
  username: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  role: string;
  password: string;
  confirmPassword: string;
}

export default function NewEmployeePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<EmployeeForm>({
    username: '',
    fullName: '',
    phone: '',
    email: '',
    address: '',
    role: 'Staff',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }
    // TODO: Implement API call to create employee
    console.log('Creating employee:', formData);
    router.push('/employees');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Thêm nhân viên mới</h1>
      </div>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 p-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tài khoản
                </label>
                <Input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Nhập tài khoản"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tên người dùng
                </label>
                <Input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Nhập tên người dùng"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Số điện thoại
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Nhập email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Địa chỉ
                </label>
                <Input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Nhập địa chỉ"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Vai trò
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value="Staff">Nhân viên</option>
                  <option value="Manager">Quản lý</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Mật khẩu
                </label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Xác nhận mật khẩu
                </label>
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Nhập lại mật khẩu"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit">
                Thêm nhân viên
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 