
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gray-900 text-white hover:bg-black",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    ghost: "text-gray-500 hover:text-gray-900 hover:bg-gray-50",
    danger: "text-red-500 hover:bg-red-50",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
