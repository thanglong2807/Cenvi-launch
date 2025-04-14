// Common types used across the application

// User related types
export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'user';
}

// Theme related types
export type ThemeMode = 'light' | 'dark';

// API Response types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// Common form types
export interface FormStatus {
  loading: boolean;
  error: string | null;
  success: boolean;
}
