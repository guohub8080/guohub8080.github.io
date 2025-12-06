import React from 'react';

interface Music12IconProps {
  className?: string;
  fill?: string;
  useGradient?: boolean;
}

const Music12Icon: React.FC<Music12IconProps> = ({ 
  className = "w-6 h-6", 
  fill = "currentColor",
  useGradient = false
}) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 493 493" 
      xmlns="http://www.w3.org/2000/svg" 
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="music12-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="25%" stopColor="#0891B2" />
          <stop offset="50%" stopColor="#0D9488" />
          <stop offset="75%" stopColor="#059669" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
      <path 
        d="M281.3,45.6c-55.4-27.2-110.4-22-160,13.4c-38.4,27.5-50.4,66.7-43.2,110.1c5.3,32.3,43.5,55,77.9,48.9
        c29.2-5.2,45.8-33.5,38.7-66.1c-7.4-33.5-30-45-72.3-37c-5.1,1-10.3,1.3-25,3.1c12.7-18.9,19-34.7,30.6-45.7
        c56.1-51.2,127.1-32,148.4,39c34.4,115.2-30.6,260.2-142.4,316.5c-25.1,12.6-51.6,22.8-77.4,34.2l0.9,6.6
        c15.3-2.6,30.7-4.6,45.7-7.9c145.7-32,253.9-146.3,260.9-277C367.4,121.9,339.6,74.3,281.3,45.6z
        M386.8,254.3c0,16.9,12.4,30.6,27.7,30.6c15.3,0,27.7-13.7,27.7-30.6c0,0,0,0,0,0c0-16.9-12.4-30.6-27.7-30.6
        C399.3,223.7,386.9,237.4,386.8,254.3C386.8,254.3,386.8,254.3,386.8,254.3z
        M386.8,102.5c0,16.9,12.4,30.6,27.7,30.6c15.3,0,27.7-13.7,27.7-30.6c0,0,0,0,0,0c0-16.9-12.4-30.6-27.7-30.6
        C399.3,71.9,386.9,85.6,386.8,102.5C386.8,102.5,386.8,102.5,386.8,102.5z
        M424.7,462.2L179.5,462.2L179.5,452.2L442.2,397.8Z" 
        fill={useGradient ? "url(#music12-gradient)" : fill}
      />
    </svg>
  );
};

export default Music12Icon;
