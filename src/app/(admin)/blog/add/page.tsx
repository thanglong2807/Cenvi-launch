"use client";
import React from "react";
import BlogForm from "@/components/blog/BlogForm";
import { useDispatch } from "react-redux";
import { addBlog } from "@/redux/slices/blogSlice";
import { useRouter } from "next/navigation";
import type { Blog } from "@/redux/slices/blogSlice";

const categories = [
  "Thành lập doanh nghiệp",
  "Kế toán thuế",
  "Ngành nghề có điều kiện",
  "Ký kết hợp tác"
];

export default function AddBlogPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = (blog: Omit<Blog, "id" | "createdAt">) => {
    dispatch(addBlog(blog));
    router.push("/blog");
  };

  return (
    <div className=" mx-auto mt-8 p-6 bg-white rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Thêm bài viết</h1>
        <button className="px-4 py-1 bg-gray-200 text-gray-800 rounded" onClick={() => router.push("/blog")}>Quay lại</button>
      </div>
      <BlogForm categories={categories} onSubmit={handleSubmit} onCancel={() => router.push("/blog")} />
    </div>
  );
} 