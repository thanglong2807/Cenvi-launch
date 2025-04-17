"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Message } from '@/types/chat';
import UserList from '@/components/chat/UserList';
import ChatHeader from '@/components/chat/ChatHeader';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import UserDetails from '@/components/chat/UserDetails';
import axios from 'axios';
import Cookies from 'js-cookie';

interface ZaloUser {
  id: string;
  avatar: string;
  name: string;
  status: string;
  online: boolean;
  address?: string;
  phone?: string;
  lastMessage?: string;
  lastSeen?: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isShowUserDetails, setIsShowUserDetails] = useState(false);
  const [zaloToken, setZaloToken] = useState('');
  const [users, setUsers] = useState<ZaloUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ZaloUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleUserDetails = () => {
    setIsShowUserDetails(prev => !prev);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageText = newMessage.trim();
    if (!messageText || !selectedUser) return;

    const messageToSend: Message = {
      id: Date.now().toString(),
      content: messageText,
      sender: 'admin',
      timestamp: new Date().toISOString(),
      status: 'sending'
    };

    try {
      setLoading(true);
      setMessages(prev => [...prev, messageToSend]);
      setNewMessage('');

      // Gửi tin nhắn qua Zalo API
      await axios.post('https://openapi.zalo.me/v3.0/oa/message/cs', {
        recipient: {
          user_id: selectedUser.id
        },
        message: {
          text: messageText
        }
      }, {
        headers: {
          'access_token': zaloToken
        }
      });

      // Cập nhật trạng thái tin nhắn thành công
      setMessages(prev => prev.map(msg => 
        msg.id === messageToSend.id ? { ...msg, status: 'sent' } : msg
      ));
    } catch (error) {
      console.error('Error sending message:', error);
      // Cập nhật trạng thái tin nhắn thất bại
      setMessages(prev => prev.map(msg => 
        msg.id === messageToSend.id ? { ...msg, status: 'failed' } : msg
      ));
    } finally {
      setLoading(false);
    }
  };

  const getZaloUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = Cookies.get('token');
      if (!token) {
        setError('⚠️ Không có token. Không thể lấy dữ liệu.');
        return;
      }

      const res = await axios.get<ZaloUser[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/zalo/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu';
      setError(errorMessage);
      console.error('❌ Error fetching Zalo users:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getZaloUsers();
  }, [getZaloUsers]);

  useEffect(() => {
    const initializeZalo = async () => {
      try {
        // Kiểm tra xem có code từ Zalo redirect không
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (code) {
          // Nếu có code, thực hiện authorization flow
          const response = await axios.post("https://oauth.zaloapp.com/v4/oa/access_token", {
            app_id: process.env.NEXT_PUBLIC_ZALO_CLIENT_ID,
            code: code,
            grant_type: 'authorization_code',
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'secret_key': process.env.NEXT_PUBLIC_ZALO_CLIENT_SECRET
            }
          });

          if (response.data.access_token) {
            Cookies.set('zalo_token', response.data.access_token, { path: '/', expires: 7 });
            if (response.data.refresh_token) {
              Cookies.set('RefreshToken', response.data.refresh_token, { path: '/', expires: 7 });
            }
            setZaloToken(response.data.access_token);
            return;
          }
        }

        // Nếu không có code, kiểm tra token trong cookies
        const existingToken = Cookies.get('zalo_token');
        if (existingToken) {
          setZaloToken(existingToken);
          return;
        }

        // Nếu không có token, chuyển hướng đến trang đăng nhập Zalo
        const redirectUri = encodeURIComponent(`${window.location.origin}/chat`);
        window.location.href = `https://oauth.zaloapp.com/v4/oa/permission?app_id=${process.env.NEXT_PUBLIC_ZALO_CLIENT_ID}&redirect_uri=${redirectUri}`;
      } catch (error) {
        console.error('Error initializing Zalo:', error);
      }
    };

    initializeZalo();
  }, []);

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>⚠️ {error}</p>
          <button 
            onClick={() => getZaloUsers()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex">
      <UserList
        users={users}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
      />
      <div className="flex-1 flex flex-col">
        {selectedUser && (
          <>
            <ChatHeader
              user={selectedUser}
              onToggleUserDetails={toggleUserDetails}
            />
            <MessageList 
              messages={messages} 
              currentUser={selectedUser}
            />
          </>
        )}
        <MessageInput
          value={newMessage}
          onChange={(value: string) => setNewMessage(value)}
          onSubmit={sendMessage}
          loading={loading}
        />
      </div>
      {isShowUserDetails && selectedUser && (
        <UserDetails 
          user={selectedUser}
        />
      )}
    </div>
  );
}
