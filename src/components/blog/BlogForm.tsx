'use client'
import React, { useState, useEffect } from "react";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import type { Blog } from "./BlogList";

interface BlogFormProps {
  initialData?: Blog | null;
  onSubmit: (blog: Blog) => void;
  onCancel: () => void;
  categories: string[];
}

export default function BlogForm({ initialData, onSubmit, onCancel, categories }: BlogFormProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setAuthor(initialData.author);
      setCategory(initialData.category);
      setTags(initialData.tags);
      setContent(initialData.detail);
    } else {
      setTitle(""); setAuthor(""); setCategory(""); setTags(""); setContent("");
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialData?.id || 0,
      title,
      author,
      category,
      tags,
      detail: content,
      createdAt: initialData?.createdAt || "",
    });
  };

  return (
    <form className="mb-4 w-full p-4 border rounded bg-gray-50" onSubmit={handleSubmit}>
      <h2 className="font-semibold mb-2">{initialData ? "Sửa bài viết" : "Thêm bài viết"}</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Tiêu đề</label>
          <input className="w-full border px-2 py-1 rounded" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Nhập tiêu đề" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Tác giả</label>
          <input className="w-full border px-2 py-1 rounded" type="text" value={author} onChange={e => setAuthor(e.target.value)} placeholder="Nhập tên tác giả" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Danh mục</label>
          <select className="w-full border px-2 py-1 rounded" value={category} onChange={e => setCategory(e.target.value)} required>
            <option value="">Chọn danh mục</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Từ khóa</label>
          <input className="w-full border px-2 py-1 rounded" type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="Nhập từ khóa" />
        </div>
      </div>
      <div className="mt-2">
        <label className="block text-sm mb-1">Nội dung</label>
        <CKEditor
          editor={ClassicEditor}
          data={content}
          onChange={(_: unknown, editor: ClassicEditor) => {
            const data = editor.getData();
            setContent(data);
          }}
          config={{ placeholder: "Nhập nội dung bài viết" }}
        />
      </div>
      <div className="flex gap-2 mt-3">
        <button type="submit" className="px-4 py-1 bg-[#e17101] text-white rounded">{initialData ? "Lưu" : "Thêm"}</button>
        <button type="button" className="px-4 py-1 bg-gray-300 text-gray-800 rounded" onClick={onCancel}>Hủy</button>
      </div>
    </form>
  );
} 