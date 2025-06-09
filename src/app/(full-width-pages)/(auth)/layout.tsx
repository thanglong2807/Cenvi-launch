import Image from "next/image";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen w-full flex justify-center items-stretch bg-cover bg-center"
      style={{ backgroundImage: "url('/images/Section.png')" }}
    >
   
        <div className="flex-1">
            {children}
        </div>
      
        <div className="hidden lg:flex flex-1 flex-col justify-center items-center relative">
            <Image src="/images/Logotext.png" alt="logo" width={472} height={220} className="mb-6" />
        </div>
  
    </div>
  );
}