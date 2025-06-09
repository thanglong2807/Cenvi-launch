"use client";
import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import HeaderItem from "@/layout/HeaderItem";
import AppHeader from "@/layout/AppHeader";
import Container from "@/components/Container/Container";
import axiosInstance from "@/lib/axios";
import Link from "next/link";
interface typeDataCatalog {
    category_code: string;
    category_name: string;
    quantity: number;
}


export default function CategoryesPage() {
   
    const [dataCatalog, setDataCatalog] = useState <typeDataCatalog[]>([]);
    
    useEffect(() => {
        const fetchCategories = async () => {
            try{
                const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/products/getAllProductCategory/`)
                console.log(response.data);
                setDataCatalog(response.data.data)
            }catch{
                console.log("Error");
            }
        }
        fetchCategories();
    }, []);
    return (
        <>
            <div className="rounded-2xl h-screen border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <AppHeader>
                    <HeaderItem
                        title="Sản phẩm / Danh mục sản phẩm"

                    />
                </AppHeader>

                <Container>
                    <div className="mt-4">
                        <div className="mt-4">
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
                        </div>
                        <Table className="w-full shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]">
                            <TableHeader className="bg-gray-100 text-gray-700">
                                <TableRow className="border-b border-gray-200">
                                    <TableCell isHeader className="font-semibold px-4 py-2 text-center">STT</TableCell>
                                    <TableCell
                                        isHeader
                                        className="font-semibold px-4 py-2 cursor-pointer flex items-center justify-center gap-1">Danh mục</TableCell>
                                    <TableCell
                                        isHeader
                                        className="font-semibold px-4 py-2">Số lượng</TableCell>
                                    <TableCell isHeader className="font-semibold px-4 py-2 text-center"> </TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                    {dataCatalog.map((item, index) => (
                                    
                                    <TableRow
                                        key={item.category_code}
                                        className="border-b border-gray-200 hover:bg-gray-50  transition-colors"
                                    >
                                        <TableCell className="px-4 py-2 text-center">{index + 1}</TableCell>
                                        <TableCell className="px-4 flex-1 py-2 text-center">
                                          <Link href={`/products/productlist?category_code=${item.category_code}`}> {item.category_name}</Link> 
                                        </TableCell>
                                        <TableCell className="px-4 py-2 text-center">{item.quantity}</TableCell>
                                        
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Container>
           
            </div>
        </>
    );
}