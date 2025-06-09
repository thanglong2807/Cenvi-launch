import { ReactNode } from 'react';

// Common component props
export interface BaseProps {
  className?: string;
  children?: ReactNode;
}

// Button component props
export interface ButtonProps extends BaseProps {
  variant?: 'default' | 'outline' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

// Input component props
export interface InputProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Modal component props
export interface ModalProps extends BaseProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
}
