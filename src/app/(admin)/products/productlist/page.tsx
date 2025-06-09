"use client";
import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';
import Pagination from "@/components/ui/pagination/Pagination";
import { Button } from '@/components/ui/button';
import axiosInstance from "@/lib/axios";
import HeaderItem from "@/layout/HeaderItem";
import AppHeader from "@/layout/AppHeader";
import Image from "next/image";
import Container from "@/components/Container/Container";
import PopupDelete from "@/components/ui/PopupDelete";
import Select from "@/components/form/Select";
import AddProduct from "./addlistproduct";
import {v4 as uuidv4} from 'uuid';
// Define Product interface based on API response
interface Product {
    category_id: string;
    category_name: string;
    created_at: string;
    id: number;
    price: number;
    product_code: string;
    product_name: string;
    type_name: string;
    updated_at: string;
    description?: string;
    option1?: string;
    parameter1?: string;
    option2?: string;
    parameter2?: string;
    option3?: string;
    parameter3?: string;
    option4?: string;
    parameter4?: string;
    option5?: string;
    parameter5?: string;
}

export default function ProductListPage() {
    const searchParams = useSearchParams();
    const categoryCode = searchParams.get('category_code');
    
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    // Handle deleting a catalog item
    const handleDelete = (index: number) => {
        setSelectedItemIndex(index);
        setShowDeleteModal(true);
    };
    
    
    // Confirm delete action
    const confirmDelete = () => {
        if (selectedItemIndex !== null) {
            console.log("Deleting catalog at index:", selectedItemIndex);
            // Here you would typically delete the item from your backend
            // and then refresh the data
            setShowDeleteModal(false);
        }
    };
    
    // Handle saving the product data
    const handleSaveProduct = async (data: {
        product_code: string;
        product_name: string;
        category_id: string;
        price: number;
        description?: string;
        option1?: string | null;
        parameter1?: string | null;
        option2?: string | null;
        parameter2?: string | null;
        option3?: string | null;
        parameter3?: string | null;
        option4?: string | null;
        parameter4?: string | null;
        option5?: string | null;
        parameter5?: string | null;
    }) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}v1/products/createProduct/`,
                data
            );
            
            console.log('Product creation response:', response.data);
            
            if (response.data.success) {
                // Refresh the product list after successful creation
                const fetchProducts = async () => {
                    try {
                        if (categoryCode) {
                            const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/products/getAllProduct/?category_code=${categoryCode}`);
                            if (response.data.success) {
                                setProducts(response.data.data || []);
                            }
                        } else {
                            const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/products/getAllProduct/`);
                            if (response.data.success) {
                                setProducts(response.data.data || []);
                            }
                        }
                    } catch (error) {
                        console.error('Error refreshing products:', error);
                    }
                };
                
                fetchProducts();
            } else {
                setError(response.data.message || 'Failed to create product');
            }
        } catch (error) {
            console.error('Error creating product:', error);
            setError('Failed to create product. Please try again later.');
        } finally {
            setIsLoading(false);
            setIsAddModalOpen(false);
        }
    };
    
    useEffect(() => {
        console.log('Category Code from URL:', categoryCode);
        
        const fetchProducts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                if (categoryCode) {
                    // Call API with category_code if it exists
                    const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/products/getAllProduct/?category_code=${categoryCode}`);
                    console.log('Products for category:', response.data);
                    
                    // Update state with the fetched products
                    if (response.data.success) {
                        setProducts(response.data.data || []);
                    } else {
                        setError(response.data.message || 'Failed to fetch products');
                    }
                } else {
                    // Call API without category_code to get all products
                    const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/products/getAllProduct/`);
                    console.log('All products:', response.data);
                    
                    // Update state with all products
                    if (response.data.success) {
                        setProducts(response.data.data || []);
                    } else {
                        setError(response.data.message || 'Failed to fetch products');
                    }
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Failed to fetch products. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchProducts();
    }, [categoryCode]);
    
    // Sample data for reference - will be replaced by API data
  

    return (
        <>
            <div className="rounded-2xl h-screen border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <AppHeader>
                    <HeaderItem
                        title="Sản phẩm/ Danh sách sản phẩm"
                        right={
                            <Button 
                                variant="default" 
                                size="sm" 
                                className="shadow-sm bg-[#F89A1C] p-5 text-white"
                                onClick={() => setIsAddModalOpen(true)}
                            >
                                Thêm sản phẩm
                            </Button>
                        }
                    />
                </AppHeader>

                <Container>
                    <div className="mt-4">
                        <div className="mt-4 flex gap-2.5">
                            <div className="flex items-center w-[426px] mb-4 gap-4">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        placeholder="Tài khoản, Tên người dùng, mã..."
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </div>

                                <div>
                                    <Button variant="default" size="sm" className="h-10 px-7 py-3 bg-amber-500 rounded-md inline-flex justify-center items-center gap-2.5">
                                        Tìm kiếm
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center w-[426px] mb-4 gap-4">
                                <div className="relative flex-1">
                                    <Select 
                                        onChange={()=> {}}
                                        className=""
                                        options={[]}
                                        placeholder="Danh mục sản phẩm"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center w-[426px] mb-4 gap-4">
                                <div className="relative flex-1">
                                    <Select 
                                        onChange={()=> {}}
                                        className=""
                                        options={[]}
                                        placeholder="Loại sản phẩm"
                                    />
                                </div>
                            </div>
                        </div>
                        <Table className="w-full shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]">
                            <TableHeader className="bg-gray-100 text-gray-700">
                                <TableRow className="border-b border-gray-200">
                                    <TableCell isHeader className="font-semibold px-4 py-2 text-center">STT</TableCell>
                                    <TableCell
                                        isHeader
                                        className="font-semibold px-4 py-2 cursor-pointer flex items-center justify-center gap-1">Mã sản phẩm</TableCell>
                                    <TableCell
                                        isHeader
                                        className="font-semibold px-4 py-2">Tên sản phẩm</TableCell>
                                    <TableCell
                                        isHeader
                                        className="font-semibold px-4 py-2">Loại sản phẩm</TableCell>
                                    <TableCell isHeader className="font-semibold px-4 py-2 text-center"> </TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="px-4 py-8 text-center">
                                            Loading products...
                                        </TableCell>
                                    </TableRow>
                                ) : error ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="px-4 py-8 text-center text-red-500">
                                            {error}
                                        </TableCell>
                                    </TableRow>
                                ) : products.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="px-4 py-8 text-center">
                                            No products found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    products.map((product, index) => (
                                        <TableRow
                                            key={uuidv4()}
                                            className="border-b border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                        >
                                            <TableCell className="px-4 py-2 text-center">{index + 1}</TableCell>
                                            <TableCell className="px-4 py-2 text-center">
                                                {product.product_code}
                                            </TableCell>
                                            <TableCell className="px-4 py-2 text-center">{product.category_name}</TableCell>
                                            <TableCell className="px-4 py-2 text-center">{product.type_name}</TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        href={`/products/productlist/edit?id=${product.product_code}&type=${product.category_id}`}
                                                        className="justify-start text-blue-500 text-sm font-normal font-['Inter'] underline leading-snug"
                                                    >
                                                        <Image src="/images/icons/pencil.svg" alt="pencil" width={20} height={20} />
                                                    </Link>
                                                    <Button
                                                        onClick={() => handleDelete(index)}
                                                        variant="none"
                                                        size="sm"
                                                        className="justify-start text-blue-500 text-sm font-normal font-['Inter'] underline leading-snug"
                                                    >
                                                        <Image src="/images/icons/trash-can.svg" alt="trash" width={20} height={20} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Container>
            </div>
            
            <AddProduct 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleSaveProduct}
            />
            
            <PopupDelete
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Xóa danh mục?"
                message="Nếu bạn xóa danh mục này, tất cả các sản phẩm thuộc danh mục này cũng bị xóa. Bạn chắc chắn muốn xóa danh mục chứ?"
                cancelText="Hủy"
                confirmText="Xóa"
            />
        </>
    );
}