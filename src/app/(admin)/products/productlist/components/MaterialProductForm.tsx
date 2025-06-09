import Input from "@/components/form/input";
import InputSelectCreatable from "@/components/form/input/InputSelectCreatable";
import Image from "next/image";
import { Product } from "./types";
import Select from "@/components/form/Select";

interface MaterialProductFormProps {
  productId: string;
  productDetail: Product;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  supplierOptions: Array<{label: string, value: string}>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function MaterialProductForm({productId, productDetail, onChange, supplierOptions, handleImageUpload }: MaterialProductFormProps) {
  return (
    <div className="w-full gap-4">
      <div className="grid grid-cols-2 gap-x-35 border border-gray-300 rounded-2xl px-14 py-8 gap-y-3">
        <Input
          label="Mã sản phẩm*:"
          flex="flex items-center"
          classNameLabel="w-50 flex item-center"
          className="border border-gray-300"
          name="maSP"
          value={productId || ""}
          onChange={onChange}
          required
        />
        <Input
          label="Tên sản phẩm*:"
          flex="flex items-center"
          classNameLabel="w-50 flex item-center"
          className="border border-gray-300"
          name="tenSP"
          value={productDetail.product_name || ""}
          onChange={onChange}
          required
        />
        <Input
          label="Danh mục:"
          flex="flex items-center"
          classNameLabel="w-50 flex item-center"
          className="border border-gray-300"
          name="tenSP"
          value={productDetail.category_name || ""}
          onChange={onChange}
          required
        />
        <div></div>
       
        <InputSelectCreatable
          label="Tùy chọn 1"
          placeholder="Nhập..."
          initialOptions={[]}
        />
        <InputSelectCreatable
          label="Tùy chọn 2"
          placeholder="Nhập..."
          initialOptions={[]}
        />
        <InputSelectCreatable
          label="Tùy chọn 3"
          placeholder="Nhập..."
          initialOptions={[]}
        />
        <InputSelectCreatable
          label="Tùy chọn 4"
          placeholder="Nhập..."
          initialOptions={[]}
        />
        <InputSelectCreatable
          label="Tùy chọn 5"
          placeholder="Nhập..."
          initialOptions={[]}
        />
        <InputSelectCreatable
          label="Thông số 6"
          placeholder="Nhập..."
          initialOptions={[]}
        />
        <InputSelectCreatable
          label="Thông số 7"
          placeholder="Nhập..."
          initialOptions={[]}
        />
        <InputSelectCreatable
          label="Tùy chọn 8"
          placeholder="Nhập..."
          initialOptions={[]}
        />
        <InputSelectCreatable
          label="Tùy chọn 9"
          placeholder="Nhập..."
          initialOptions={[]}
        />
       
       <InputSelectCreatable
          label="Tùy chọn 10"
          placeholder="Nhập..."
          initialOptions={[]}
        />
        <Input
          label="Giá bán(VND):"
          flex="flex items-center"
          classNameLabel="w-50 flex item-center"
          className="border border-gray-300"
          name="giaSP"
          value={productDetail.price || ""}
          onChange={onChange}
          required
        />
        <div></div>
        <div className="flex items-center">
          <label className="w-[150px] flex item-center text-sm font-medium text-gray-700">Nhà cung cấp:</label>
          <div className="flex-1">
            <Select
              className="w-full"
              options={supplierOptions}
              placeholder="Chọn..."
              onChange={(value) => {
                // Handle supplier change
              }}
              defaultValue={productDetail.supplier_id || ""}
            />
          </div>
        </div>
        
        <Input
          label="Tỷ lệ chiết khấu(%):"
          flex="flex items-center"
          classNameLabel="w-50 flex item-center"
          className="border border-gray-300"
          name="tenSP"
          placeholder="nhập"
          value={productDetail.product_description || ""}
          onChange={onChange}
          required
        />

        <div className="flex order-9 items-start col-span-1">
          <label className="w-[150px] flex item-center text-sm font-medium text-gray-700 pt-2">Mô tả:</label>
          <textarea
            className="flex-1 border border-gray-300 rounded p-2 min-h-[120px]"
            name="mota"
            value={productDetail.product_description || ""}
            onChange={onChange}
            placeholder="Nhập..."
          />
        </div>
        <div className="flex items-center col-span-1">
          <label className="w-[150px] flex item-center text-sm font-medium text-gray-700">Ảnh:</label>
          <div className="flex-1">
            <label htmlFor="product-image" className="cursor-pointer">
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
              id="product-image"
              type="file"
              className="hidden"
              accept="image/svg+xml,image/png,image/jpeg,image/gif"
              onChange={handleImageUpload}
            />
          </div>
        </div>
      </div>
    </div>
  );
};