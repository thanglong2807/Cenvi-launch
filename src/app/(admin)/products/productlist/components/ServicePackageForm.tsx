import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Input from "@/components/form/input";
import Select from "@/components/form/Select";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { CompareRow, ProductRow } from "./types";

interface ServicePackageFormProps {
  compareRows: CompareRow[];
  setCompareRows: React.Dispatch<React.SetStateAction<CompareRow[]>>;
  productRows: ProductRow[];
  setProductRows: React.Dispatch<React.SetStateAction<ProductRow[]>>;
}

const ServicePackageForm: React.FC<ServicePackageFormProps> = ({
  compareRows,
  setCompareRows,
  productRows,
  setProductRows
}) => {
  return (
    <div className="flex flex-col gap-8">
      {/* Thông tin chung */}
      <div className="border rounded-xl p-6 bg-white">
        <div className="font-semibold text-amber-500 mb-3">Thông tin chung</div>
        <div className="grid grid-cols-2 gap-x-36 gap-y-3">
          <Input
            label="Mã sản phẩm:" 
            flex="flex items-center"
            classNameLabel="w-50 flex item-center"
            className="border border-gray-300"
            name="masp"
            defaultValue={''}
            onChange={(e) => e.target.value}
            required
          />
          
          <Input 
            label="Tên sản phẩm:" 
            flex="flex items-center"
            classNameLabel="w-50 flex item-center"
            className="border border-gray-300"
            name="tensp"
            defaultValue={'Gói toàn diện'}
            onChange={(e) => e.target.value}
            required
          />
          
          <Input 
            label="Giá bán:" 
            flex="flex items-center"
            classNameLabel="w-50 flex item-center"
            className="border border-gray-300"
            name="giaban"
            defaultValue={'100000000'}
            onChange={(e) => e.target.value}
            required
          />
          
          <div className="flex items-center">
            <label className="w-[151px]" htmlFor="">Thanh toán: <span className="text-red-500">*</span></label>
            <Select 
              wrapperClassName="flex-1"
              onChange={(e) => {}} 
              options={[
                { label: 'Chuyển khoản', value: 'bank' }, 
                { label: 'Tiền mặt', value: 'cash' }
              ]} 
              placeholder="Nhập..." 
            />
          </div>
        </div>
      </div>

      {/* Thông tin so sánh */}
      <div className="border rounded-xl p-6 bg-white">
        <div className="font-semibold text-amber-500 mb-3">Thông tin so sánh</div>
        <Table className="w-full shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]">
          <TableHeader className="bg-gray-100 text-gray-700">
            <TableRow className="border-b border-gray-200">
              <TableCell isHeader className="font-semibold px-4 py-2 text-center">STT</TableCell>
              <TableCell isHeader className="font-semibold px-4 py-2 text-center">Nội dung so sánh</TableCell>
              <TableCell isHeader className="font-semibold px-4 py-2 text-center">Kiểu dữ liệu</TableCell>
              <TableCell isHeader className="font-semibold px-4 py-2 text-center">Giá trị</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {compareRows.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell className="border px-2 py-1 text-center">{idx + 1}</TableCell>
                <TableCell className="border px-2 py-1">
                  <Input 
                    value={row.content} 
                    onChange={(e) => {
                      const newRows = [...compareRows];
                      newRows[idx].content = e.target.value;
                      setCompareRows(newRows);
                    }} 
                  />
                </TableCell>
                <TableCell className="border px-2 py-1">
                  <Select 
                    options={[
                      { label: 'Text', value: 'Text' },
                      { label: 'Checkbox', value: 'Checkbox' }
                    ]} 
                    defaultValue={row.type} 
                    onChange={(value) => {
                      const newRows = [...compareRows];
                      newRows[idx].type = value;
                      setCompareRows(newRows);
                    }} 
                  />
                </TableCell>
                <TableCell className="border px-2 py-1">
                  <Input 
                    value={row.value} 
                    onChange={(e) => {
                      const newRows = [...compareRows];
                      newRows[idx].value = e.target.value;
                      setCompareRows(newRows);
                    }} 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="border rounded-xl p-6 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold text-amber-500">Danh sách sản phẩm</div>
          <Button variant="outline" className="border-amber-400 text-amber-500 px-4 py-1">Thêm sản phẩm</Button>
        </div>
        <Table className="w-full shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]">
          <TableHeader className="bg-gray-100 text-gray-700">
            <TableRow className="border-b border-gray-200">
              <TableCell isHeader className="font-semibold px-4 py-2 text-center">STT</TableCell>
              <TableCell isHeader className="font-semibold px-4 py-2 text-center">Mã sản phẩm</TableCell>
              <TableCell isHeader className="font-semibold px-4 py-2 text-center">Tên sản phẩm</TableCell>
              <TableCell isHeader className="font-semibold px-4 py-2 text-center">Danh mục sản phẩm</TableCell>
              <TableCell isHeader className="font-semibold px-4 py-2 text-center">{null}</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productRows.map((row, idx) => (
              <TableRow key={row.code}>
                <TableCell className="border px-2 py-1 text-center">{idx + 1}</TableCell>
                <TableCell className="border px-2 py-1">{row.code}</TableCell>
                <TableCell className="border px-2 py-1">{row.name}</TableCell>
                <TableCell className="border px-2 py-1">{row.category}</TableCell>
                <TableCell className="border px-2 py-1 text-center">
                  <Button 
                    variant="none" 
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => {
                      const newRows = productRows.filter((_, i) => i !== idx);
                      setProductRows(newRows);
                    }}
                  >
                    <Image src="/images/icons/trash-can.svg" alt="delete" width={20} height={20} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ServicePackageForm;
