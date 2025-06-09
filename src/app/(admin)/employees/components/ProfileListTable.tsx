import React from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHeader, TableRow, } from '@/components/ui/table';
import Pagination from '@/components/ui/pagination/Pagination';

interface ProfileItem {
  stt: number; // Assuming stt is a number
  ten_cong_ty: string;
  nguoi_phu_trach: string;
  ngay_tao: string;
  trang_thai: string;
  // Assuming there's a profile ID for the link, using stt for now
}

interface ProfileListTableProps {
  profiles: ProfileItem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ProfileListTable: React.FC<ProfileListTableProps> = ({ profiles, currentPage, totalPages, onPageChange }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6"> {/* Use consistent card styling */}
      <h3 className="text-xl font-semibold text-amber-500 mb-4">Danh sách hồ sơ</h3> {/* Use color and margin */}
      <Table className="w-full shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"> {/* Use shadow from image */}
        <TableHeader className="bg-gray-100 text-zinc-800 font-bold text-sm"> {/* Header style from image */}
          <TableRow>
            <TableCell isHeader className="px-3 py-4">STT</TableCell>
            <TableCell isHeader className="px-3 py-4">Tên công ty</TableCell>
            <TableCell isHeader className="px-3 py-4">Người phụ trách</TableCell>
            <TableCell isHeader className="px-3 py-4">Ngày tạo</TableCell>
            <TableCell isHeader className="px-3 py-4">Trạng thái</TableCell>
                       <TableCell isHeader className="px-3 py-4">{null}</TableCell>
           
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((item, index) => (
             <TableRow key={item.stt} className="border-b border-gray-200 text-sm text-zinc-800 font-medium"> {/* Row style from image */}
               <TableCell className="px-3 py-4 text-center">{index + 1}</TableCell> {/* STT */}
               <TableCell
                 className="px-3 py-4 text-center font-semibold cursor-pointer flex items-center justify-center gap-1">
                 {item.ten_cong_ty}
               </TableCell>
               <TableCell
                 className="px-3 py-4 text-center font-semibold cursor-pointer">
                 {item.nguoi_phu_trach}
               </TableCell>
               <TableCell className="px-3 py-4 text-center font-semibold">{item.ngay_tao}</TableCell>
               <TableCell className="px-3 py-4 text-center font-semibold">{item.trang_thai}</TableCell>
               <TableCell className="px-3 py-4 text-center">
                 {/* Link to profile detail page, assuming item.stt is the ID */}
                 <Link href={`/profiles/${item.stt}`} className="text-blue-500 underline text-sm font-normal">Chi tiết</Link>
               </TableCell>
             </TableRow>
          ))}
        </TableBody>
      </Table>
       <div className="mt-4 flex justify-end"> {/* Align pagination to the right */}
         <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
       </div>
    </div>
  );
};

export default ProfileListTable; 