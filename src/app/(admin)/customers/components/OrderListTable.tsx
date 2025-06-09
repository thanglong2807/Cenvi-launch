import React from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHeader, TableRow, } from '@/components/ui/table';
import Pagination from '@/components/ui/pagination/Pagination';

interface OrderItem {
  stt: string | number; // Assuming stt can be string or number based on uuidv4 and 1,2,3...
  ma_don_hang: string;
  ngay_tao: string;
  don_gia: string;
  cong_no: string;
  trang_thai: string;
  chi_tiet?: string; // Optional as it's a Link, not data
}

interface OrderListTableProps {
  orders: OrderItem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const OrderListTable: React.FC<OrderListTableProps> = ({ orders, currentPage, totalPages, onPageChange }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6"> {/* Use consistent card styling */}
      <h3 className="text-xl font-semibold text-amber-500 mb-4">Danh sách đơn hàng</h3> {/* Use color and margin */}
      <Table className="w-full shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"> {/* Use shadow from image */}
        <TableHeader className="bg-gray-100 text-zinc-800 font-bold text-sm"> {/* Header style from image */}
          <TableRow>
            <TableCell isHeader className="px-3 py-4">STT</TableCell>
            <TableCell isHeader className="px-3 py-4">Mã đơn hàng</TableCell>
            <TableCell isHeader className="px-3 py-4">Ngày tạo</TableCell>
            <TableCell isHeader className="px-3 py-4">Đơn giá</TableCell>
            <TableCell isHeader className="px-3 py-4">Công nợ</TableCell>
            <TableCell isHeader className="px-3 py-4">Trạng thái</TableCell>
            <TableCell isHeader className="px-3 py-4">{null}</TableCell>
   
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((item, index) => (
             <TableRow key={item.stt} className="border-b border-gray-200 text-sm text-zinc-800 font-medium"> {/* Row style from image */}
               <TableCell className="px-3 py-4 text-center">{index + 1}</TableCell> {/* STT */}
               <TableCell
                 className="px-3 py-4 text-center font-semibold cursor-pointer flex items-center justify-center gap-1">
                 {item.ma_don_hang}
               </TableCell>
               <TableCell
                 className="px-3 py-4 text-center font-semibold cursor-pointer">
                 {item.ngay_tao}
               </TableCell>
               <TableCell className="px-3 py-4 text-center font-semibold">{item.don_gia}</TableCell>
               <TableCell className="px-3 py-4 text-center font-semibold">{item.cong_no}</TableCell>
               <TableCell className="px-3 py-4 text-center">
                 {/* Conditional rendering for status chip */}
                 {item.trang_thai === 'Đã thanh toán' && (
                   <span className="px-2.5 py-[3px] bg-teal-500/10 rounded-[30px] inline-flex justify-center items-center gap-px">
                     <div className="justify-start text-teal-500 text-sm font-normal font-['Inter'] leading-snug">{item.trang_thai}</div>
                   </span>
                 )}
                 {item.trang_thai === 'Thanh toán 1 phần' && (
                   <span className="px-2.5 py-[3px] bg-cyan-100 rounded-[30px] inline-flex justify-center items-center gap-px">
                     <div className="justify-start text-blue-500 text-xs font-medium font-['Inter'] leading-tight">{item.trang_thai}</div>
                   </span>
                 )}
                 {item.trang_thai === 'Chưa thanh toán' && (
                    <span className="px-2.5 py-[3px] bg-rose-100 rounded-[30px] inline-flex justify-center items-center gap-px">
                      <div className="justify-start text-red-500 text-xs font-medium font-['Inter'] leading-tight">{item.trang_thai}</div>
                    </span>
                 )}
               </TableCell>
               <TableCell className="px-3 py-4 text-center">
                 <Link href={`/orders/${item.ma_don_hang}`} className="text-blue-500 underline text-sm font-normal">Chi tiết</Link>
               </TableCell>
             </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Pagination for Orders */}
       <div className="mt-4 flex justify-end"> {/* Align pagination to the right */}
         <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
       </div>
    </div>
  );
};

export default OrderListTable; 