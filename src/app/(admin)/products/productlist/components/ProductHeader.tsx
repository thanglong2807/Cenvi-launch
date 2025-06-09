import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import AppHeader from "@/layout/AppHeader";
import HeaderItem from "@/layout/HeaderItem";
import { useRouter } from "next/navigation";

interface ProductHeaderProps {
  title: string;
  onSave: () => void;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ title, onSave }) => {
  const router = useRouter();
  
  return (
    <AppHeader>
      <HeaderItem
        title={title}
        right={
          <div className="flex gap-2">
            <Button
              className="text-center justify-center bg-transparent border border-amber-500 text-amber-500 text-sm font-normal font-['Inter'] leading-snug"
              onClick={() => router.back()}
            >
              Hủy
            </Button>
            <Button
              className="text-center justify-center text-white text-sm font-normal font-['Inter'] leading-snug"
              onClick={onSave}
            >
              Lưu
            </Button>
          </div>
        }
        left={
          <Link href="/products/productlist">
            <Image src="/images/icons/back.svg" alt="arrow-left" width={24} height={24} />
          </Link>
        }
      />
    </AppHeader>
  );
};

export default ProductHeader;
