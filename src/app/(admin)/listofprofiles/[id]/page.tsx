"use client";

import React from "react";
import AppHeader from "@/layout/AppHeader";
import HeaderItem from "@/layout/HeaderItem";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Container from "@/components/Container/Container";
import Status from "../components/status/page";
import Link from "next/link";
import Input from "@/components/form/input";

export default function ListOfProfilesDetailPage() {
    const router = useRouter();
    return (
        <div>
            <AppHeader>
                <HeaderItem
                    title="Tổng quan hồ sơ"
                    left={
                        <div className="flex gap-2">
                            <Button
                                variant="none"
                                className="text-center justify-center bg-transparent  border-amber-500 text-amber-500 text-sm font-normal"
                                onClick={() => router.back()}
                            >
                                <Image src="/images/icons/back.svg" alt="back" width={26} height={26} />
                            </Button>
                        </div>
                    }
                />
            </AppHeader>
            <Container>
                <div className="p-4">
                    <Status status={'hồ sơ mới'} />
                    <div className="my-15">
                        <div className="flex items-center justify-between">
                            <h3 className=" text-amber-500 text-xl font-semibold leading-normal">Thông tin cơ bản</h3>
                            <Link href={``} className="text-blue-500 text-sm font-normal">Xem hồ sơ</Link>
                        </div>
                        <div className="grid w-full mt-3 gap-4">
                            <div className="grid grid-cols-2 gap-x-35 border border-gray-300 rounded-2xl px-14 py-8 gap-y-4">
                                <Input
                                    label="Tên công ty:"
                                    flex="flex items-center"
                                    classNameLabel="w-50 flex item-center"
                                    className="border border-gray-300"
                                    name="stk"


                                    required

                                />
                                <Input
                                    label="Gói dịch vụ:"
                                    flex="flex items-center"
                                    classNameLabel="w-50 flex item-center"
                                    className="border border-gray-300"
                                    name="ncc"


                                    required
                                />
                                <Input
                                    label="Khách hàng:"
                                    flex="flex items-center"
                                    classNameLabel="w-50 flex item-center"
                                    className="border border-gray-300"
                                    name="tuychon"


                                    required
                                />
                                <Input
                                    label="Chuyên viên pháp lý:"
                                    flex="flex items-center"
                                    classNameLabel="w-50 flex item-center"
                                    className="border border-gray-300"
                                    name="giaban"


                                    required

                                />
                                <Input
                                    label="Loại hình"
                                    flex="flex items-center"
                                    classNameLabel="w-50 flex item-center"
                                    className="border border-gray-300"
                                    name="giaban"


                                    required

                                />
                                <Input
                                    label="Nhân viên bàn giao"
                                    flex="flex items-center"
                                    classNameLabel="w-50 flex item-center"
                                    className="border border-gray-300"
                                    name="giaban"


                                    required

                                />
                                <Input
                                    label="Ngày tạo"
                                    flex="flex items-center"
                                    classNameLabel="w-50 flex item-center"
                                    className="border border-gray-300"
                                    name="giaban"


                                    required

                                />
                                <Input
                                    label="Thực tập sinh"
                                    flex="flex items-center"
                                    classNameLabel="w-50 flex item-center"
                                    className="border border-gray-300"
                                    name="giaban"


                                    required

                                />
                            </div>
                        </div>
                    </div>


                    {/* lịch sử sửa đổi */}
                    <div className="my-15">
                        <div className="flex items-center justify-between">
                            <h3 className=" text-amber-500 text-xl font-semibold leading-normal">Lịch sử sửa đổi</h3>
                        </div>
                        <div className="mt-4 px-6 gap-4 flex items-start mb-8 relative">
                            <div className=" flex items-center justify-center p-2.5 bg-yellow-50 border-2 border-amber-200 rounded-full">
                                <Image
                                    src="/images/icons/user.svg"
                                    alt="Timeline Icon"
                                    width={28}
                                    height={28}
                                />
                            </div>
                            <div className="flex gap-2.5 flex-col">
                                <Input
                                    flex="w-[528px]"
                                    placeholder="Thêm ghi chú"
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-5 outline-none"
                                />
                                <Button className="bg-white w-fit border border-amber-400 text-amber-500 px-7 py-3 rounded-lg hover:bg-amber-50 transition">
                                    Thêm
                                </Button>
                            </div>
                        </div>
                        <div className="mt-6   pl-6">
                            <div className="flex gap-4 items-start mb-8">
                                <div className="flex items-center justify-center p-2.5 bg-yellow-50 border-2 border-amber-200 rounded-full relative">
                                <div className="w-0.5 h-6.5 absolute  top-[-90%] left-[45%] transform translate-x-1/2 translate-y-1/2 bg-amber-500 rounded-sm z-50" />
                                    <Image
                                        src="/images/icons/user.svg"
                                        alt="Timeline Icon"
                                        width={28}
                                        height={28}
                                    />
                                </div>
                                <div className="">
                                    <div className="text-slate-700 text-base font-medium">Hệ thống cập nhật trạng thái hồ sơ “Chưa thanh toán” thành “Đã huỷ”</div>
                                    <div className="text-gray-500 text-base  mt-1">28/04/2025 - 9:04</div>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start mb-8">
                                <div className="flex items-center justify-center p-2.5 bg-yellow-50 border-2 border-amber-200 rounded-full relative">
                                <div className="w-0.5 h-6.5 absolute  top-[-90%] left-[45%] transform translate-x-1/2 translate-y-1/2 bg-amber-500 rounded-sm z-50" />
                                    <Image
                                        src="/images/icons/user.svg"
                                        alt="Timeline Icon"
                                        width={28}
                                        height={28}
                                    />
                                </div>
                                <div className="">
                                    <div className="text-slate-700 text-base font-medium">Hệ thống cập nhật trạng thái hồ sơ “Chưa thanh toán” thành “Đã huỷ”</div>
                                    <div className="text-gray-500 text-base  mt-1 ">28/04/2025 - 9:04</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </Container>
        </div>
    );
}