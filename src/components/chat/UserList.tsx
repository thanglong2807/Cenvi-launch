import React from 'react';
import Image from 'next/image';
import { User } from '@/types/chat';

interface UserListProps {
  users: User[];
  selectedUser: User | null;
  onSelectUser: (user: User | null) => void;
}

export default function UserList({ users, selectedUser, onSelectUser }: UserListProps) {
  return (
    <div className="w-80 border-r dark:border-gray-700">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-semibold">Chats</h2>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-4rem)]">
        {users.map((user) => (
          <div
            key={user.id}
            className={`p-4 border-b dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
              selectedUser?.id === user.id ? 'bg-gray-100 dark:bg-gray-800' : ''
            }`}
            onClick={() => onSelectUser(user)}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src={user.avatar || 'https://i.ibb.co/CsWdrXtc/z6404998099947-038f908df877578c2337104af90cbd8f.jpg'}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${user.online ? 'bg-green-500' : 'bg-gray-400'}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
              </div>
              <div className="text-xs text-gray-500">{user.lastSeen}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
