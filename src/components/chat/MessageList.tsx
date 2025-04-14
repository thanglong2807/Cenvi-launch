import React from 'react';
import { Message, User } from '@/types/chat';

interface MessageListProps {
  messages: Message[];
  currentUser: User;
}

export default function MessageList({ messages, currentUser }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`flex items-end gap-2 max-w-[70%] ${message.sender === 'admin' ? 'flex-row-reverse' : ''}`}>
            {message.sender === 'user' && (
              <img
                src={currentUser.avatar || '/images/user/z6404998099947_038f908df877578c2337104af90cbd8f.jpg'}
                alt=""
                className="w-8 h-8 rounded-full self-end"
              />
            )}
            <div
              className={`relative p-3 rounded-2xl ${
                message.sender === 'admin'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              <p>{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
