import React from 'react';

interface TonicMLScoreIconProps {
  className?: string;
  fill?: string;
  useGradient?: boolean;
}

const TonicMLScoreIcon: React.FC<TonicMLScoreIconProps> = ({ 
  className = "w-6 h-6", 
  fill = "#CCCCCC",
  useGradient = false
}) => {
  return (
    <svg 
      version="1.1" 
      id="uuid-5723cf83-6979-4eda-978e-464a4d685147"
      xmlns="http://www.w3.org/2000/svg" 
      xmlnsXlink="http://www.w3.org/1999/xlink" 
      x="0px" 
      y="0px" 
      viewBox="0 0 482 482"
      xmlSpace="preserve"
      className={className}
    >
      <defs>
        <linearGradient id="tonicscore-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#BE185D" />
          <stop offset="30%" stopColor="#EC4899" />
          <stop offset="60%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
      </defs>
      <g>
        <g>
          <path 
            fill={useGradient ? "url(#tonicscore-gradient)" : fill}
            d="M99.7,29.8h216.7l108.3,108.3v297.9c0,15-12.1,27.1-27.1,27.1H99.7c-15,0-27.1-12.1-27.1-27.1V56.9
            C72.6,41.9,84.7,29.8,99.7,29.8z"
          />
          <path 
            fill="#7C3AED"
            d="M316.4,29.8l108.3,108.3h-81.3c-15,0-27.1-12.1-27.1-27.1V29.8z"
          />
        </g>
        <g>
          <path 
            fill="#FFFFFF"
            d="M277.1,185.8c0,0-127.3,57.5-129.4,58.2c-0.5,0.2-2.6,1.3-2.6,3.5v136.9c-4.7-2.7-10.2-4.3-16.1-4.3
            c-17.7,0-32.1,14.4-32.1,32.1c0,17.7,14.4,32.1,32.1,32.1s32.1-14.4,32.1-32.1c0-1.3-0.1-2.6-0.2-3.8c0.2-0.5,0.2-1,0.2-1.5V294.4
            l112.5-54.2V318c-4.7-2.7-10.2-4.3-16.1-4.3c-17.7,0-32.1,14.4-32.1,32.1s14.4,32.1,32.1,32.1c17.7,0,32.1-14.4,32.1-32.1
            c0-1.8,0-5.4,0-5.4V190.7C289.5,184.3,281.7,184.4,277.1,185.8z"
          />
          <rect x="193.3" y="401.9" fill="#FFFFFF" width="115" height="38.6"/>
        </g>
      </g>
    </svg>
  );
};

export default TonicMLScoreIcon;

