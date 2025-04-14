import React from 'react';
import { User } from '@/types/chat';

interface ChatHeaderProps {
  user: User;
  onToggleUserDetails: () => void;
}

export default function ChatHeader({ user, onToggleUserDetails }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
      <div className="flex items-center gap-3">
        <img
          src={user.avatar || '/images/user/z6404998099947_038f908df877578c2337104af90cbd8f.jpg'}
          alt={user.name}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h2 className="font-medium">{user.name}</h2>
          <p className="text-sm text-gray-500">
            {user.online ? 'Đang hoạt động' : 'Không hoạt động'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </button>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        <button onClick={onToggleUserDetails} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
