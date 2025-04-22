'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import Input from '@/components/form/input';

interface Category {
  id: number;
  name: string;
  productCount: number;
}

const initialCategories: Category[] = [
  { id: 1, name: 'Thành lập doanh nghiệp', productCount: 3 },
  { id: 2, name: 'Biển tên', productCount: 6 },
  { id: 3, name: 'Chữ ký số & Hóa đơn điện tử', productCount: 2 },
  { id: 4, name: 'Biểu mẫu', productCount: 300 },
  { id: 5, name: 'Tài khoản ngân hàng', productCount: 500 },
  { id: 6, name: 'Dịch vụ khác', productCount: 4 },
  { id: 7, name: 'Dấu chức danh', productCount: 4 },
];

export default function ProductsPage() {
  const router = useRouter();
  const [categories] = useState<Category[]>(initialCategories);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Danh mục/Sản phẩm
          </h3>
        </div>
        <div className="flex gap-4">
          <Button
            className="flex items-center gap-2"
            onClick={() => router.push('/products/categories/new')}
          >
            Thêm danh mục
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={() => router.push('/products/new')}
          >
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-4 py-2 text-left">STT</th>
                <th className="px-4 py-2 text-left">Danh mục</th>
                <th className="px-4 py-2 text-left">Số lượng sản phẩm</th>
                <th className="px-4 py-2 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category, index) => (
                <tr key={category.id} className="border-b border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{category.name}</td>
                  <td className="px-4 py-2">{category.productCount}</td>
                  <td className="px-4 py-2">
                    <Button
                      variant="secondary"
                      onClick={() => router.push(`/products/categories/${category.id}`)}
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