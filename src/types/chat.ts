export interface User {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastSeen?: string;
  online?: boolean;
  zaloLink?: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'admin' | 'user';
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
}

export interface MessageListProps {
  messages: Message[];
  currentUser: User | null;
}

export interface UserListProps {
  users: User[];
  selectedUser: User | null;
  onSelectUser: (user: User | null) => void;
}

export interface ChatHeaderProps {
  user: User;
  onToggleUserDetails: () => void;
}

export interface UserDetailsProps {
  user: User;
  onClose: () => void;
}

export interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
}
