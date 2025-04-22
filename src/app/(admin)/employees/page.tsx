'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import Input from '@/components/form/input';
import { PlusIcon } from '@heroicons/react/24/outline';

interface Employee {
  id: number;
  username: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
  role: string;
}

const initialEmployees: Employee[] = [
  {
    id: 1,
    username: 'Cenvi_1',
    fullName: 'Lê Thăng Long',
    phone: '0342223605',
    email: 'lethanglong2807@gmail.com',
    address: 'Hải Phòng',
    createdAt: 'Ngày tạo',
    role: 'Manager'
  },
  {
    id: 2,
    username: 'Cenvi_2',
    fullName: 'Nguyễn Văn A',
    phone: '0987654321',
    email: 'nguyenvana@gmail.com',
    address: 'Hà Nội',
    createdAt: '15/03/2024',
    role: 'Staff'
  },
  {
    id: 3,
    username: 'Cenvi_3',
    fullName: 'Trần Thị B',
    phone: '0123456789',
    email: 'tranthib@gmail.com',
    address: 'Hồ Chí Minh',
    createdAt: '16/03/2024',
    role: 'Staff'
  }
];

export default function EmployeesPage() {
  const router = useRouter();
  const [employees] = useState<Employee[]>(initialEmployees);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = employees.filter(employee =>
    employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.phone.includes(searchTerm)
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Nhân viên
          </h3>
          <Button
            className="flex items-center gap-2"
            onClick={() => router.push('/employees/new')}
          >
            <PlusIcon className="h-5 w-5" />
            Thêm NV
          </Button>
        </div>
        <div className="w-64">
          <Input
            type="text"
            placeholder="Tìm kiếm nhân viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-4 py-2 text-left">STT</th>
                <th className="px-4 py-2 text-left">Tài khoản</th>
                <th className="px-4 py-2 text-left">Tên người dùng</th>
                <th className="px-4 py-2 text-left">SĐT</th>
                <th className="px-4 py-2 text-left">Gmail</th>
                <th className="px-4 py-2 text-left">Địa chỉ</th>
                <th className="px-4 py-2 text-left">Ngày tạo</th>
                <th className="px-4 py-2 text-left">Vai trò</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee, index) => (
                <tr key={employee.id} className="border-b border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{employee.username}</td>
                  <td className="px-4 py-2">{employee.fullName}</td>
                  <td className="px-4 py-2">{employee.phone}</td>
                  <td className="px-4 py-2">{employee.email}</td>
                  <td className="px-4 py-2">{employee.address}</td>
                  <td className="px-4 py-2">{employee.createdAt}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      employee.role === 'Manager'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {employee.role}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <Button
                      variant="secondary"
                      onClick={() => router.push(`/employees/${employee.id}`)}
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
  );
} 