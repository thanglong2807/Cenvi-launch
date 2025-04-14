"use client";

import React, { useEffect, useState } from 'react';
import { User, Message } from '@/types/chat';
import UserList from '@/components/chat/UserList';
import ChatHeader from '@/components/chat/ChatHeader';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import UserDetails from '@/components/chat/UserDetails';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface ZaloUser {
  id: string;
  avatar: string;
  name: string;
  status: string;
}

interface ZaloApiResponse {
  data: {
    followers: Array<{
      user_id: string;
      display_name: string;
    }>;
  };
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isShowUserDetails, setIsShowUserDetails] = useState(false);
  const [zaloToken, setZaloToken] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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

  const getZaloUsers = async () => {
    try {
      const response = await axios.get<ZaloApiResponse>('https://openapi.zalo.me/v3.0/oa/user/getlist', {
        params: {
          data: JSON.stringify({
            offset: 0,
            count: 15,
            last_interaction_period: "TODAY",
            is_follower: "true"
          })
        },
        headers: {
          'access_token': zaloToken
        }
      });
      
      if (response.data.data?.followers) {
        const zaloUsers: ZaloUser[] = response.data.data.followers.map(user => ({
          id: user.user_id,
          avatar: '',
          name: user.display_name || 'Unknown User',
          status: ''
        }));
        const users: User[] = zaloUsers.map(user => ({
          id: user.id,
          name: user.name,
          lastMessage: '',
          lastSeen: new Date().toLocaleTimeString(),
          online: true,
          zaloLink: `https://zalo.me/${user.id}`
        }));
        setUsers(users);
        if (users.length > 0 && !selectedUser) {
          setSelectedUser(users[0]);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching Zalo users:', error.message);
      } else {
        console.error('Error fetching Zalo users');
      }
    }
  };

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

  // Fetch users khi có token
  useEffect(() => {
    if (zaloToken) {
      getZaloUsers();
    }
  }, [zaloToken]);

  return (
    <div className="h-[calc(100vh-120px)] flex">
      <UserList
        users={users}
        selectedUser={selectedUser}
        onSelectUser={(user: User | null) => setSelectedUser(user)}
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
          onClose={toggleUserDetails}
        />
      )}
    </div>
  );
}
