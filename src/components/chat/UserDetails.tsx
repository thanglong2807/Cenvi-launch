import React from 'react';
import Image from 'next/image';
import { User } from '@/types/chat';

interface UserDetailsProps {
  user: User;
}

export default function UserDetails({ user }: UserDetailsProps) {
  return (
    <div className="w-80 border-l dark:border-gray-700 flex flex-col">
      <div className="p-4 flex flex-col items-center border-b dark:border-gray-700">
        <Image
          src={user.avatar || '/default-avatar.png'}
          alt={user.name}
          width={100}
          height={100}
          className="rounded-full mb-3"
        />
        <h2 className="font-medium text-lg">{user.name}</h2>
        
        <div className="w-full mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Link hội thoại:</span>
            <a href={user.zaloLink} className="text-blue-500 hover:underline flex items-center gap-1">
              https://oa.zalo...hare
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Địa chỉ:</span>
            <span>{user.address}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Số điện thoại:</span>
            <span>{user.phone}</span>
          </div>
        </div>

        <div className="w-full mt-4 space-y-2">
          <button className="w-full py-2 px-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
            Gửi yêu cầu chia sẻ thông tin
          </button>
          <button className="w-full py-2 px-4 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            Cập nhật thông tin
          </button>
        </div>
      </div>

      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Quản lý nhân</h3>
          <a href="#" className="text-blue-500 hover:underline text-sm">Quản lý</a>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Chọn hoặc tìm kiếm nhãn"
            className="w-full pl-3 pr-10 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700"
          />
          <svg className="w-5 h-5 absolute right-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div className="p-4 flex-1">
        <h3 className="font-medium mb-4">Hoạt động</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Image
              src={user.avatar || '/default-avatar.png'}
              alt=""
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-sm">
                <span className="font-medium">{user.name}</span>
                <span className="text-gray-500 ml-2">17:28, Thứ năm</span>
              </p>
              <p className="text-sm font-medium">Quan tâm</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Image
              src={user.avatar || '/default-avatar.png'}
              alt=""
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-sm">
                <span className="font-medium">{user.name}</span>
                <span className="text-gray-500 ml-2">17:28, Thứ năm</span>
              </p>
              <p className="text-sm">
                <span className="font-medium">Tương tác đầu</span>
                <br />
                <span className="text-gray-500">Nhắn tin</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Ghi chú</h3>
          <button className="text-blue-500 hover:underline text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Tạo mới
          </button>
        </div>
      </div>
    </div>
  );
}
