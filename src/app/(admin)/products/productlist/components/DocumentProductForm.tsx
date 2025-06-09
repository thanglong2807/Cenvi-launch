import React from "react";
import Image from "next/image";
import Input from "@/components/form/input";
import Select from "@/components/form/Select";
import { DocumentProductData, FormErrors } from "./types";

interface DocumentProductFormProps {
  data: DocumentProductData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  supplierOptions: { label: string; value: string }[];
  errors?: FormErrors;
}

const DocumentProductForm: React.FC<DocumentProductFormProps> = ({
  data,
  onChange,
  supplierOptions,
  errors = {}
}) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Handle image upload logic here
      console.log("Image uploaded:", e.target.files[0].name);
    }
  };

  return (
    <div className="grid w-full gap-4">
      <div className="grid grid-cols-2 gap-x-35 border border-gray-300 rounded-2xl px-14 py-8 gap-y-3">
        <Input
          label="Mã sản phẩm:"
          flex="flex items-center"
          classNameLabel="w-50 flex item-center"
          className="border border-gray-300"
          name="masp"
          value={data.masp}
          onChange={onChange}
          required
          error={errors.masp}
        />
        <Input
          label="Tên sản phẩm:"
          flex="flex items-center"
          classNameLabel="w-50 flex item-center"
          className="border border-gray-300"
          name="tensp"
          value={data.tensp}
          onChange={onChange}
          required
          error={errors.tensp}
        />
        <div className="flex items-center">
          <label className="w-[150px] flex item-center text-sm font-medium text-gray-700">Tùy chọn:</label>
          <div className="flex-1">
            <Select
              className="w-full"
              options={supplierOptions}
              placeholder="Chọn..."
              onChange={(value) => {
                // Handle tuychon change
              }}
              defaultValue={data.tuychon}
            />
          </div>
        </div>
        <Input
          label="Giá bán:"
          flex="flex items-center"
          classNameLabel="w-50 flex item-center"
          className="border border-gray-300"
          name="giaban"
          value={data.giaban}
          onChange={onChange}
          required
          error={errors.giaban}
        />
        <div className="flex items-center">
          <label className="w-[150px] flex item-center text-sm font-medium text-gray-700">Nhà cung cấp:</label>
          <div className="flex-1">
            <Select
              className="w-full"
              options={supplierOptions}
              placeholder="Chọn..."
              onChange={(value) => {
                // Handle ncc change
              }}
              defaultValue={data.ncc}
            />
          </div>
        </div>
        <div></div>
        <div className="flex order-9 items-start col-span-1">
          <label className="w-[150px] flex item-center text-sm font-medium text-gray-700 pt-2">Mô tả:</label>
          <textarea
            className="flex-1 border text-gray-700 border-gray-300 rounded p-2 min-h-[120px]"
            name="mota"

            value={data.mota}
            onChange={onChange}
            placeholder="Nhập..."
          />
        </div>
        <div className="flex items-center col-span-1">
          <label className="w-[150px] flex item-center text-sm font-medium text-gray-700">Ảnh:</label>
          <div className="flex-1">
            <label htmlFor="document-image" className="cursor-pointer">
              <div className="w-full h-[120px] bg-amber-50 border-gray-300 rounded-2xl border-0 flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center mb-2">
                  <Image src="/images/icons/upload-cloud.svg" alt="upload" width={16} height={16} />
                </div>
                <div className="text-center text-amber-500">
                  Nhấn để tải lên ảnh sản phẩm
                  <p className="text-xs text-gray-500">SVG, PNG, JPG hoặc GIF (tối đa 800x400px)</p>
                </div>
              </div>
            </label>
            <input
              id="document-image"
              type="file"
              className="hidden"
              accept="image/svg+xml,image/png,image/jpeg,image/gif"
              onChange={handleImageUpload}
            />
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default DocumentProductForm;
