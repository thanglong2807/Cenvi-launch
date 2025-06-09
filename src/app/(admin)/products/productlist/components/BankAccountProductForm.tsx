import React from "react";
import Input from "@/components/form/input";
import { BankAccountProductData, FormErrors } from "./types";

interface BankAccountProductFormProps {
  data: BankAccountProductData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errors?: FormErrors;
}

const BankAccountProductForm: React.FC<BankAccountProductFormProps> = ({
  data,
  onChange,
  errors = {}
}) => {
  return (
    <div className="grid w-full gap-4">
      <div className="grid grid-cols-2 gap-x-35 border border-gray-300 rounded-2xl px-14 py-8 gap-y-3">
        <Input
          label="Số tài khoản:"
          flex="flex items-center"
          classNameLabel="w-50 flex item-center"
          className="border border-gray-300"
          name="stk"
          value={data.stk}
          onChange={onChange}
          required
          error={errors.stk}
        />
        <Input
          label="Nhà cung cấp:"
          flex="flex items-center"
          classNameLabel="w-50 flex item-center"
          className="border border-gray-300"
          name="ncc"
          value={data.ncc}
          onChange={onChange}
          required
        />
        <Input
          label="Tùy chọn:"
          flex="flex items-center"
          classNameLabel="w-50 flex item-center"
          className="border border-gray-300"
          name="tuychon"
          value={data.tuychon}
          onChange={onChange}
          required
        />
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
      </div>
    </div>
  );
};

export default BankAccountProductForm;
