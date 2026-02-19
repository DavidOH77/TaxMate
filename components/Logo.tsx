import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
  textColor?: string;
  id?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 28, 
  showText = true, 
  showTagline = true,
  className = '',
  textColor = 'text-gray-900',
  id = 'app-logo-svg'
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-2">
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
            style={{ fontSize: size * 0.85, letterSpacing: '-0.05em' }}
          >
            세정
          </span>
        )}
      </div>
      {showTagline && (
        <p className="text-[10px] font-black text-gray-400 mt-1 tracking-tighter">
          <span className="text-blue-600">세</span>금을 쉽게 <span className="text-blue-600">정</span>리하다
        </p>
      )}
    </div>
  );
};