'use client';

import { useState, useEffect, ChangeEvent, Suspense } from 'react';
import Input from '@/components/form/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter, useSearchParams } from 'next/navigation';
import AppHeader from '@/layout/AppHeader';
import HeaderItem from '@/layout/HeaderItem';
import Link from 'next/link';
import Container from '@/components/Container/Container';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import Image from 'next/image';
import Select from '@/components/form/Select';
import TextArea from '@/components/form/input/TextArea';
import { Modal } from '@/components/ui/modal';

interface FormData {
  username: string;
  code: string;
  phone: string;
  email: string;
  role: string;
  description: string;
}

interface FormErrors {
  username?: string;
  code?: string;
  phone?: string;
  email?: string;
  role?: string;
  description?: string;
}

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
  quantity: number;
  selected?: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

interface Profile {
  id: string;
  code: string;
  name: string;
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
    id: 'product1',
    name: 'Gói Bảo Hành',
    price: 1490000,
    quantity: 0,
    selected: false
  },
  {
    id: 'product2',
    name: 'Biển tên',
    price: 500000,
    quantity: 0,
    selected: false
  },
  {
    id: 'product3',
    name: 'Biển tên phòng',
    price: 500000,
    quantity: 0,
    selected: false
  },
  {
    id: 'product4',
    name: 'Biển chức danh',
    price: 500000,
    quantity: 0,
    selected: false
  },
  {
    id: 'product5',
    name: 'Biển số phòng',
    price: 500000,
    quantity: 0,
    selected: false
  },
  {
    id: 'product6',
    name: 'Dấu chức danh',
    price: 200000,
    quantity: 0,
    selected: false
  },
  {
    id: 'product7',
    name: 'Dấu tên',
    price: 200000,
    quantity: 0,
    selected: false
  },
  {
    id: 'product8',
    name: 'Dấu chữ ký',
    price: 200000,
    quantity: 0,
    selected: false
  }
];

function NewOrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderType = searchParams.get('type') || 'customer';
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [modalProducts, setModalProducts] = useState<Product[]>([]);
  const [totalModalPrice, setTotalModalPrice] = useState(0);

  // Profile specific state
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [profileSearch, setProfileSearch] = useState('');
  
  // Customer specific state
  const [customerCode, setCustomerCode] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [description, setDescription] = useState('');

  // Form data for the new UI
  const [formData, setFormData] = useState<FormData>({
    username: '',
    code: '',
    phone: '',
    email: '',
    role: '',
    description: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Sample role options for the select
  const roleOptions = [
    { label: 'Giảm 10%', value: 'discount10' },
    { label: 'Giảm 20%', value: 'discount20' },
    { label: 'Giảm 30%', value: 'discount30' },
    { label: 'Giảm 50%', value: 'discount50' },
    { label: 'Miễn phí', value: 'free' }
  ];

  const filteredCustomers = sampleCustomers.filter(customer =>
    customer.code.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.phone.includes(customerSearch)
  );

  // Initialize modal products when opening the modal
  useEffect(() => {
    if (isAddModalOpen) {
      // Clone the sample products to avoid modifying the original data
      setModalProducts(JSON.parse(JSON.stringify(sampleProducts)));
      setTotalModalPrice(0);
    }
  }, [isAddModalOpen]);
  
  // Effect to calculate total price in modal
  useEffect(() => {
    const total = modalProducts.reduce((sum, product) => {
      return sum + (product.quantity * product.price);
    }, 0);
    setTotalModalPrice(total);
  }, [modalProducts]);
  
  // Effect to filter products based on search
  useEffect(() => {
    if (productSearch.trim() === '') {
      setModalProducts(JSON.parse(JSON.stringify(sampleProducts)));
    } else {
      const filtered = sampleProducts.filter(product => 
        product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        product.id.toLowerCase().includes(productSearch.toLowerCase())
      );
      setModalProducts(filtered.map(p => ({ ...p })));
    }
  }, [productSearch]);

  // Function to handle quantity changes in the modal
  const handleQuantityChange = (productId: string, increment: boolean) => {
    setModalProducts(prev => {
      return prev.map(product => {
        if (product.id === productId) {
          const newQuantity = increment 
            ? product.quantity + 1 
            : Math.max(0, product.quantity - 1);
          
          return {
            ...product,
            quantity: newQuantity,
            selected: newQuantity > 0
          };
        }
        return product;
      });
    });
  };
  
  // Function to add selected products to cart
  const addSelectedProductsToCart = () => {
    const selectedProducts = modalProducts.filter(p => p.quantity > 0);
    
    // Update cart with selected products
    setCart(prevCart => {
      const newCart = [...prevCart];
      
      selectedProducts.forEach(product => {
        const existingItemIndex = newCart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex >= 0) {
          // Update existing item quantity
          newCart[existingItemIndex].quantity += product.quantity;
        } else {
          // Add new item to cart
          newCart.push({
            ...product,
            quantity: product.quantity
          });
        }
      });
      
      return newCart;
    });
    
    // Close the modal
    setIsAddModalOpen(false);
  };

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



  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCreateOrder = async () => {
    if (orderType === 'customer' && (!selectedCustomer || cart.length === 0)) return;
    if (orderType === 'profile' && (!selectedProfile || cart.length === 0)) return;

    try {
      // Add API call to create order
      router.push('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <div className="rounded-2xl h-screen border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <AppHeader>

        <HeaderItem
          title="Đơn hàng / Đơn hàng mới"
          right={
            <Link href="/orders/new">
              <Button variant="default" size="sm" className="shadow-sm bg-[#F89A1C] p-5 text-white">
                Tạo đơn
              </Button>
            </Link>
          }
          left={<Link href="/orders"><Image src="/images/icons/back.svg" alt="arrow-left" width={24} height={24} /></Link>}
        />
      </AppHeader>

      <Container>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-4">Thông tin chung</h3>

          <div className="px-12 py-5 shadow-[inset_-1px_0px_0px_0px_rgba(0,0,0,0.13)] mb-15 border rounded-xl relative">
            <div className="grid gap-x-40 grid-cols-2  gap-y-3">
              {orderType === 'profile' && (
                <>
                  <Input
                    label="ID hồ sơ:"
                    flex="flex items-center"
                    classNameLabel="w-50 flex item-center"
                    className="border border-gray-300"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    error={errors.code}
                  />
                  <div></div>
                </>
              )}

              <div className='flex flex-col' >
                <Input
                  label="Khách hàng:"
                  flex="flex items-center"
                  classNameLabel="w-50 flex item-center"
                  className="border border-gray-300"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  error={errors.username}
                />
                <div className="flex flex-1   mt-4 mb-4">
                  <div className='w-37.5'></div>
                  <div className='flex flex-1 gap-2'>

                    <button type="button" className="flex-1 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 text-black text-sm font-medium">ID</button>
                    <button type="button" className="flex-1 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 text-black text-sm font-medium">SĐT</button>
                    <button type="button" className="flex-1 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 text-black text-sm font-medium">Email</button>
                  </div>
                </div>
              </div>

              <div>
                <Input
                  label="Mã khách hàng:"
                  flex="flex items-center"
                  classNameLabel="w-50 flex item-center"
                  className="border border-gray-300"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  error={errors.code}
                  disabled={orderType === 'profile'}
                />
              </div>
              <div></div>
              <div>
                <Input
                  label="Số điện thoại:"
                  flex="flex items-center"
                  classNameLabel="w-50 flex item-center"
                  className="border border-gray-300"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                />
              </div>

              <div>
                <Input
                  label="Email:"
                  flex="flex items-center"
                  classNameLabel="w-50 flex item-center"
                  className="border border-gray-300"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />
              </div>
              <div></div>

              <div className="flex items-center">
                <label className="w-[150px] flex item-center text-sm font-medium text-gray-700">Mã giảm giá:</label>
                <Select
                  wrapperClassName="flex-1"
                  options={roleOptions}
                  placeholder="Chọn mã giảm giá"
                  onChange={(value: string) => {
                    setFormData(prev => ({
                      ...prev,
                      role: value
                    }));
                    // Clear error when user selects a value
                    if (errors.role) {
                      setErrors(prev => ({
                        ...prev,
                        role: undefined
                      }));
                    }
                  }}
                  defaultValue={formData.role}
                />
              </div>

              <div></div>
              <div className='flex items-center'>
                <label className="w-[150px] flex item-center text-sm font-medium text-gray-700">Mô tả:</label>
                <textarea
                  placeholder='Mô tả'
                  className='flex-1 w-full p-2 border border-gray-300 rounded-md min-h-[100px] outline-none resize-none focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  style={errors.description ? { borderColor: 'red' } : undefined}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex gap-8 items-center mb-4">
            <h3 className="text-xl text-amber-500 font-semibold">Danh sách sản phẩm</h3>
            <Button variant="outline" onClick={() => setIsAddModalOpen(true)} className="border-amber-500 text-amber-500 hover:bg-amber-50">
              Thêm sản phẩm
            </Button>
          </div>

          <div className=" rounded-xl border border-gray-200 bg-white">
            <Table className="w-full shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]">
              <TableHeader className="bg-gray-100 text-gray-700">
                <TableRow className="border-b border-gray-200">
                  <TableCell className='font-semibold px-4 py-2 text-center'>STT</TableCell>
                  <TableCell className='font-semibold px-4 py-2 text-center'>Mã sản phẩm</TableCell>
                  <TableCell className='font-semibold px-4 py-2 text-center'>Tên sản phẩm</TableCell>
                  <TableCell className='font-semibold px-4 py-2 text-center'>Đơn giá</TableCell>
                  <TableCell className='font-semibold px-4 py-2 text-center'>Số lượng</TableCell>
                  <TableCell className="font-semibold px-4 py-2 text-center">Tổng giá</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">
                      Chưa có sản phẩm nào trong giỏ hàng
                    </TableCell>
                  </TableRow>
                ) : (
                  cart.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className='px-4 py-2 text-center'>{index + 1}</TableCell>
                      <TableCell className='px-4 py-2 text-center'>{item.id}</TableCell>
                      <TableCell className='px-4 py-2 text-center'>{item.name}</TableCell>
                      <TableCell className='px-4 py-2 text-center'>{item.price.toLocaleString()}đ</TableCell>
                      <TableCell>
                        <div className="flex justify-center items-center">
                          <button 
                            className="p-1 rounded-md hover:bg-gray-100"
                            onClick={() => {
                              setCart(prev => prev.map(cartItem => 
                                cartItem.id === item.id 
                                  ? { ...cartItem, quantity: Math.max(1, cartItem.quantity - 1) } 
                                  : cartItem
                              ));
                            }}
                          >
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4.16669 10H15.8334" stroke="#101828" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button 
                            className="p-1 rounded-md hover:bg-gray-100"
                            onClick={() => {
                              setCart(prev => prev.map(cartItem => 
                                cartItem.id === item.id 
                                  ? { ...cartItem, quantity: cartItem.quantity + 1 } 
                                  : cartItem
                              ));
                            }}
                          >
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M10 4.16669V15.8334M4.16669 10H15.8334" stroke="#101828" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold px-4 py-2 text-center">{(item.price * item.quantity).toLocaleString()}đ</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              {cart.length > 0 && (
                <TableBody>
                  <TableRow className="">
                    <TableCell className="py-3 px-4 text-center font-medium" colSpan={1}>Tổng:</TableCell>
                    <TableCell className="py-3 px-4 text-center font-medium" colSpan={4}>{null}</TableCell>
                    <TableCell className="py-3 px-4 text-amber-500 font-medium text-center" >
                      {cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}đ
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4 mb-6">
          <Button variant="outline" className="border-gray-300" onClick={() => router.push('/orders')}>
            Hủy
          </Button>
          <Button
            className="bg-amber-500 hover:bg-amber-600 text-white"
            onClick={handleCreateOrder}
          >
            Tạo đơn
          </Button>
        </div>
      </Container>
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} isFullscreen={true}>
        <div className="w-[752px]  bg-white rounded-xl shadow-md">
          <div className="flex flex-col items-start gap-6 p-6">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-xl font-semibold text-amber-500">Sản phẩm</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="w-full">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Tên sản phẩm, mã sản phẩm..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  onChange={(e) => setProductSearch(e.target.value)}
                  value={productSearch}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.5 17.5L12.5 12.5M14.1667 8.33333C14.1667 11.555 11.555 14.1667 8.33333 14.1667C5.11167 14.1667 2.5 11.555 2.5 8.33333C2.5 5.11167 5.11167 2.5 8.33333 2.5C11.555 2.5 14.1667 5.11167 14.1667 8.33333Z" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
            {modalProducts.map((product, index) => (
              <div className="w-full" key={product.id}>
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div className="flex items-center">
                    <h3 className="text-base font-medium">{product.name}</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-amber-500 font-medium">
                      {product.price.toLocaleString()}<span className="underline">đ</span>
                    </p>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button 
                        className={`px-2 py-1 ${product.quantity > 0 ? 'text-gray-700' : 'text-gray-400'} hover:bg-gray-100`}
                        onClick={() => handleQuantityChange(product.id, false)}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4.16669 10H15.8334" stroke={product.quantity > 0 ? "#101828" : "#98A2B3"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <span className="px-2 py-1">{product.quantity}</span>
                      <button 
                        className="px-2 py-1 text-gray-700 hover:bg-gray-100"
                        onClick={() => handleQuantityChange(product.id, true)}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 4.16669V15.8334M4.16669 10H15.8334" stroke="#101828" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* Product list is now dynamically generated in the previous section */}
            </div>
            <div className="flex justify-between p-6 rounded-b-2xl bg-amber-50 w-full mt-6">
              <div className="flex items-center gap-2">
                <span className="text-amber-500 font-medium">Tổng:</span>
                <span className="text-amber-500 font-medium text-lg">{totalModalPrice.toLocaleString()}<span className="underline">đ</span></span>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="border border-amber-500 text-amber-500 hover:bg-amber-50 px-6"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  className="bg-amber-500 text-white hover:bg-amber-600 px-6"
                  onClick={addSelectedProductsToCart}
                  disabled={modalProducts.every(p => p.quantity === 0)}
                >
                  Thêm
                </Button>
              </div>
            </div>
          
          </div>
      </Modal>
    </div >
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