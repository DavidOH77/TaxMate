
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  title?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, title, action }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-[28px] p-7 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] active:scale-[0.99]' : ''} ${className}`}
    >
      {(title || action) && (
        <div className="flex justify-between items-center mb-6 px-1">
          {title && <h3 className="text-[16px] font-black text-gray-900 tracking-tight">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
