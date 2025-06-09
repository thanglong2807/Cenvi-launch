'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Product {
  id: number;
  name: string;
  price: number;
  details?: string[];
}

// Dữ liệu mẫu cho danh mục "Thành lập doanh nghiệp"
const sampleProducts: Product[] = [
  {
    id: 1,
    name: 'Gói nền tảng',
    price: 399000,
    details: [
      'Tư vấn thủ tục',
      'Soạn hồ sơ cơ bản',
      'Đăng ký MST'
    ]
  },
  {
    id: 2,
    name: 'Gói cơ bản',
    price: 1299000,
    details: [
      'Tất cả dịch vụ của gói nền tảng',
      'Thiết kế logo cơ bản',
      'Đăng ký con dấu'
    ]
  },
  {
    id: 3,
    name: 'Gói nâng cao',
    price: 3499000,
    details: [
      'Tất cả dịch vụ của gói cơ bản',
      'Thiết kế logo cao cấp',
      'Đăng ký BHXH',
      'Tư vấn thuế 1 năm'
    ]
  }
];

export default function CategoryDetailPage() {
  const router = useRouter();
  const [products] = useState<Product[]>(sampleProducts);
  const [showDetails, setShowDetails] = useState<number | null>(null);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Home\Product\Danh mục: Thành lập doanh nghiệp
          </h3>
          <Button
            className="flex items-center gap-2"
            onClick={() => router.push('/products/new')}
          >
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-4 py-2 text-left">STT</th>
                <th className="px-4 py-2 text-left">Tên sản phẩm</th>
                <th className="px-4 py-2 text-left">Giá</th>
                <th className="px-4 py-2 text-left">Sản phẩm kèm theo</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id} className="border-b border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'decimal',
                      minimumFractionDigits: 0
                    }).format(product.price)}
                  </td>
                  <td className="px-4 py-2">
                    <Button
                      variant="secondary"
                      onClick={() => setShowDetails(showDetails === product.id ? null : product.id)}
                    >
                      Chi tiết
                    </Button>
                    {showDetails === product.id && (
                      <div className="absolute mt-2 p-4 bg-white border rounded-lg shadow-lg z-10">
                        <ul className="list-disc list-inside">
                          {product.details?.map((detail, i) => (
                            <li key={i}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                    )}
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