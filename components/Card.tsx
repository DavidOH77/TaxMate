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
      className={`bg-white rounded-[24px] p-6 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all ${onClick ? 'cursor-pointer hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] active:scale-[0.99]' : ''} ${className}`}
    >
      {(title || action) && (
        <div className="flex justify-between items-center mb-6">
          {title && <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};