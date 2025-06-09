'use client'
import React from "react";

export interface Blog {
  id: number;
  title: string;
  author: string;
  category: string;
  createdAt: string;
  tags: string;
  detail: string;
}

interface BlogListProps {
  blogs: Blog[];
  onEdit: (blog: Blog) => void;
  onDelete: (id: number) => void;
}

export default function BlogList({ blogs, onEdit, onDelete }: BlogListProps) {
  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-2 py-1 border">STT</th>
            <th className="px-2 py-1 border">Tiêu đề</th>
            <th className="px-2 py-1 border">Tác giả</th>
            <th className="px-2 py-1 border">Danh mục</th>
            <th className="px-2 py-1 border">Ngày tạo</th>
            <th className="px-2 py-1 border">Từ khóa</th>
            <th className="px-2 py-1 border">Sửa</th>
            <th className="px-2 py-1 border">Xóa</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog, idx) => (
            <tr key={blog.id}>
              <td className="border px-2 py-1">{idx + 1}</td>
              <td className="border px-2 py-1">{blog.title}</td>
              <td className="border px-2 py-1">{blog.author}</td>
              <td className="border px-2 py-1">{blog.category}</td>
              <td className="border px-2 py-1">{blog.createdAt}</td>
              <td className="border px-2 py-1">{blog.tags}</td>
              <td className="border px-2 py-1 text-center"><button className="text-blue-500" onClick={() => onEdit(blog)}>Sửa</button></td>
              <td className="border px-2 py-1 text-center"><button className="text-red-500" onClick={() => onDelete(blog.id)}>Xóa</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 