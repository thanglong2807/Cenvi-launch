import React from 'react';
import { User } from '@/types/chat';
import SearchInput from './SearchInput';

interface UserListProps {
  users: User[];
  selectedUser: User | null;
  onSelectUser: (user: User | null) => void;
}

export default function UserList({ users, selectedUser, onSelectUser }: UserListProps) {
  return (
    <div className=" border-r dark:border-gray-700 flex flex-col">
      <SearchInput />
      <div className="flex-1 overflow-y-auto">
        {users.map(user => (
          <div
            key={user.id}
            onClick={() => onSelectUser(user)}
            className={`flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
              selectedUser?.id === user.id ? 'bg-gray-50 dark:bg-gray-700' : ''
            }`}
          >
            <div className="relative">
              <img
                src={user.avatar || '/images/user/z6404998099947_038f908df877578c2337104af90cbd8f.jpg'}
                alt={user.name}
                className="w-12 h-12 rounded-full"
              />
              {user.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <h3 className="font-medium truncate">{user.name}</h3>
                <span className="text-xs text-gray-500">{user.lastSeen}</span>
              </div>
              <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
