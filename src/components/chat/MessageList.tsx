import React from 'react';
import Image from 'next/image';
import { Message } from '@/types/chat';

interface MessageListProps {
  messages: Message[];
  currentUser: {
    id: string;
    name: string;
    avatar: string;
  };
}

export default function MessageList({ messages, currentUser }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-start gap-3 mb-4 ${
            message.sender === currentUser.id ? 'flex-row-reverse' : ''
          }`}
        >
          <Image
            src={currentUser.avatar || '/default-avatar.png'}
            alt={currentUser.name}
            width={32}
            height={32}
            className="rounded-full"
          />
          <div
            className={`max-w-[70%] p-3 rounded-lg ${
              message.sender === currentUser.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
          >
            <p>{message.content}</p>
            <span className="text-xs opacity-70 mt-1 block">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
