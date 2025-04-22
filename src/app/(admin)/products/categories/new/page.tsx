'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import Input from '@/components/form/input';
import { Card, CardContent } from '@/components/ui/card';

export default function NewCategoryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to create category
    console.log('Creating category:', formData);
    router.push('/products');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Thêm danh mục mới</h1>
      </div>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 p-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Tên danh mục
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhập tên danh mục"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Mô tả
              </label>
              <textarea
                className="w-full px-3 py-2 border rounded-md"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả danh mục"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit">
                Thêm danh mục
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 