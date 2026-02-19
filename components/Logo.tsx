import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
  textColor?: string;
  id?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 28, 
  showText = true, 
  className = '',
  textColor = 'text-gray-900',
  id = 'app-logo-svg'
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div style={{ width: size, height: size }} className="flex-shrink-0 relative">
        <svg
          id={id}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path
            d="M20 80H80"
            stroke="#111827"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M25 80V25H75"
            stroke="#111827"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="82" cy="18" r="10" fill="#3B82F6" />
        </svg>
      </div>
      
      {showText && (
        <span 
          className={`font-black tracking-tighter ${textColor} leading-none`} 
          style={{ fontSize: size * 0.8, letterSpacing: '-0.05em' }}
        >
          세정
        </span>
      )}
    </div>
  );
};