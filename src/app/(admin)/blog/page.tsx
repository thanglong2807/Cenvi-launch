"use client";
import React from "react";
import BlogList, { Blog } from "@/components/blog/BlogList";
import CategoryList from "@/components/blog/CategoryList";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { deleteBlog } from "@/redux/slices/blogSlice";
import { useRouter } from "next/navigation";

export default function BlogPage() {
  const blogs = useSelector((state: RootState) => state.blogs);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleDelete = (id: number) => {
    dispatch(deleteBlog(id));
  };

  const handleEdit = (blog: Blog) => {
    router.push(`/blog/edit/${blog.id}`);
  };

  const handleAdd = () => {
    router.push("/blog/add");
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Blog</h1>
          <button className="px-4 py-1 bg-[#e17101] text-white rounded" onClick={handleAdd}>Thêm bài viết</button>
        </div>
        <BlogList blogs={blogs} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      <div className="col-span-4">
        <h2 className="text-xl font-bold mb-4">Danh mục</h2>
        <CategoryList />
      </div>
    </div>
  );
} 