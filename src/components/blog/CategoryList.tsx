'use client'
import React, {  useState } from "react";
import { Button } from "../ui/button";
import Input from "../form/input";

const mockCategories = [
  { id: 1, name: "Thành lập doanh nghiệp" },
  { id: 2, name: "Kế toán thuế" },
  { id: 3, name: "Ngành nghề có điều kiện" },
  { id: 4, name: "Ký kết hợp tác" },
];

export default function CategoryList() {
    const [data, setData] = useState(mockCategories);
    const [value, setValue] = useState("");
    const handleAdd = () => {
        setData([...data, { id: data.length + 1, name: value }]);
        setValue("");
    }
    // useEffect(() => {
    //     setValue("");
    // }, [data]);

  return (
    <div className="bg-gray-50 p-4 rounded border">
      <div className="flex mb-3 gap-2">
        <Input onChange={(e) => setValue(e.target.value)} value={value} className="flex-1 border px-2 py-1 rounded" type="text" placeholder="Thêm danh mục" />
        <Button onClick={handleAdd} className="bg-[#e17101] text-white px-3 py-1 rounded">Thêm</Button>
      </div>
      <ul>
        {data.map((cat) => (
          <li key={cat.id} className="flex items-center justify-between py-1 border-b last:border-b-0">
            <span>{cat.name}</span>
            <button className="text-red-500 text-sm">Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
} 