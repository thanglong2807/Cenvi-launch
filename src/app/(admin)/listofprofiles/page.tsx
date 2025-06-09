import Container from '@/components/Container/Container';
import Input from '@/components/form/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import AppHeader from '@/layout/AppHeader';
import HeaderItem from '@/layout/HeaderItem';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

export default function ListOfProfilesPage() {
    return (
        <div className="space-y-6 bg-[#fff]">
            <AppHeader>
                <HeaderItem
                    title="Danh sách bộ hồ sơ"
                />
            </AppHeader>
            {/* Employee Information Section */}
            <div className="rounded-2xl">
                <Container>
                    <div>
                        <h2 className="text-xl text-amber-500 font-semibold">Danh sách hồ sơ</h2>
                        <Table className="w-full mt-3.5 shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)] ">
                            <TableHeader className="bg-gray-100 text-gray-700">
                                <TableRow className="border-b border-gray-200">
                                    <TableCell isHeader className="font-semibold px-4 py-2 text-center">STT</TableCell>
                                    <TableCell
                                        isHeader
                                        className="font-semibold px-4 py-2 cursor-pointer flex items-center justify-center gap-1"
                                    >
                                        Tên công ty
                                    </TableCell>

                                    <TableCell
                                        isHeader
                                        className="font-semibold px-4 py-2 cursor-pointer"

                                    >
                                        Khách hàng


                                    </TableCell>
                                    <TableCell isHeader className="font-semibold px-4 py-2">Chuyên viên pháp lý</TableCell>
                                    <TableCell isHeader className="font-semibold px-4 py-2">Gói dịch vụ</TableCell>
                                    <TableCell isHeader className="font-semibold px-4 py-2">Trạng thái</TableCell>
                                    <TableCell
                                        isHeader
                                        className="font-semibold px-4 py-2 cursor-pointer "
                                    >
                                       Thời gian cập nhật
                                    </TableCell>
                                    <TableCell isHeader className="font-semibold px-4 py-2 text-center"> {null} </TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>

                                <TableRow
                                    className="border-b border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <TableCell className="px-4 py-2 text-center">1</TableCell>
                                    <TableCell className="px-4 py-2 text-center">
                                        1
                                    </TableCell>
                                    <TableCell className="px-4 py-2 text-center">1</TableCell>
                                    <TableCell className="px-4 py-2 text-center">
                                        1
                                    </TableCell>
                                    <TableCell className="px-4 py-2 text-center">
                                        1
                                    </TableCell>
                                    <TableCell className="px-4 py-2 text-center">
                                        1
                                    </TableCell>
                                    <TableCell className="px-4 py-2 text-center">
                                        1
                                    </TableCell>
                                  
                                    <TableCell className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Link
                                                href={`/listofprofiles/1`}
                                                className="justify-start text-blue-500 text-sm font-normal font-['Inter'] underline leading-snug"
                                            >
                                                Chi tiết
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>

                            </TableBody>
                        </Table>
                    </div>
                </Container>
            </div >
        </div>
    )
}
