"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import { Button } from "../ui/button";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/signin");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
      >
        <Image
          src="/images/user/z6404998099947_038f908df877578c2337104af90cbd8f.jpg"
          alt="User"
          width={32}
          height={32}
          className="rounded-full"
        />
        <div className="flex flex-col items-start">
        <span className="text-[12px] font-semibold font-bold">Thăng Long</span>
        <span className="text-[#00000063] text-[10px] hidden md:block">manager</span>
        </div>
        <Button className="bg-transparent shadow-none border-none hover:bg-transparent"  onClick={handleLogout} >
       I <Image src="/images/icons/Logout.svg"  alt="arrow-down" width={16} height={16} />
        </Button>
      </button>
    
    </div>
  );
}
