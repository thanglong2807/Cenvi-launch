'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import Input from '@/components/form/input';
import Button from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { ChangeEvent } from 'react';

interface Customer {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
}

// Sample data - replace with API calls
const sampleCustomers: Customer[] = [
  {
    id: '1',
    code: 'KH001',
    name: 'Nguyễn Văn A',
    phone: '0123456789',
    email: 'a@example.com'
  },
  {
    id: '2',
    code: 'KH002',
    name: 'Trần Thị B',
    phone: '0987654321',
    email: 'b@example.com'
  },
  {
    id: '3',
    code: 'KH003',
    name: 'Lê Văn C',
    phone: '0369852147',
    email: 'c@example.com'
  },
  {
    id: '4',
    code: 'KH004',
    name: 'Phạm Thị D',
    phone: '0741852963',
    email: 'd@example.com'
  },
  {
    id: '5',
    code: 'KH005',
    name: 'Hoàng Văn E',
    phone: '0951753684',
    email: 'e@example.com'
  }
];

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Đăng ký kinh doanh cơ bản',
    price: 1800000
  },
  {
    id: '2',
    name: 'Đăng ký kinh doanh cao cấp',
    price: 2500000
  },
  {
    id: '3',
    name: 'Dịch vụ kế toán tháng',
    price: 1200000
  },
  {
    id: '4',
    name: 'Tư vấn thuế doanh nghiệp',
    price: 3000000
  },
  {
    id: '5',
    name: 'Giấy phép con',
    price: 4500000
  },
  {
    id: '6',
    name: 'Báo cáo thuế năm',
    price: 5000000
  },
  {
    id: '7',
    name: 'Dịch vụ BHXH',
    price: 800000
  },
  {
    id: '8',
    name: 'Thay đổi đăng ký kinh doanh',
    price: 1500000
  }
];

function NewOrderContent() {
  const router = useRouter();
  const [customerSearch, setCustomerSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  const filteredCustomers = sampleCustomers.filter(customer => 
    customer.code.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.phone.includes(customerSearch)
  );

  const filteredProducts = sampleProducts.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCreateOrder = async () => {
    if (!selectedCustomer || cart.length === 0) return;

    try {
      // Add API call to create order
      router.push('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tạo đơn hàng mới</h1>
      
      <div className="grid grid-cols-3 gap-6">
        {/* Customer Selection */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Chọn khách hàng</h2>
            <Input
              type="text"
              placeholder="Tìm theo mã KH hoặc SĐT"
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerSearch(e.target.value)}
            />
            <div className="mt-4 space-y-2">
              {filteredCustomers.map(customer => (
                <div
                  key={customer.id}
                  className={`p-2 rounded cursor-pointer ${
                    selectedCustomer?.id === customer.id
                      ? 'bg-blue-100 dark:bg-blue-900'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {customer.code} - {customer.phone}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Product Selection */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Chọn sản phẩm</h2>
            <Input
              type="text"
              placeholder="Tìm sản phẩm"
              onChange={(e: ChangeEvent<HTMLInputElement>) => setProductSearch(e.target.value)}
            />
            <div className="mt-4 space-y-2">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() => addToCart(product)}
                >
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {product.price.toLocaleString('vi-VN')}đ
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Checkout */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Thanh toán</h2>
            
            {selectedCustomer && (
              <div className="mb-4 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                <div className="font-medium">{selectedCustomer.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedCustomer.code} - {selectedCustomer.phone}
                </div>
              </div>
            )}

            <div className="space-y-2 mb-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <div>{item.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {item.quantity} x {item.price.toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Xóa
                  </Button>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between items-center font-semibold">
                <span>Tổng tiền:</span>
                <span>{total.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            <Button
              className="w-full"
              disabled={!selectedCustomer || cart.length === 0}
              onClick={handleCreateOrder}
            >
              Tạo đơn
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function NewOrder() {
  return (
    <Suspense fallback={
      <div className="p-6">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <div className="mt-2">Đang tải...</div>
        </div>
      </div>
    }>
      <NewOrderContent />
    </Suspense>
  );
} 