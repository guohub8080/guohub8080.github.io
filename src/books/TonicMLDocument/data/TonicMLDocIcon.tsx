import React from 'react';

interface TonicMLDocIconProps {
  className?: string;
  fill?: string;
  useGradient?: boolean;
}

const TonicMLDocIcon: React.FC<TonicMLDocIconProps> = ({ 
  className = "w-6 h-6", 
  fill = "#757B8C",
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
        <linearGradient id="tonicdoc-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="30%" stopColor="#F472B6" />
          <stop offset="60%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#C084FC" />
        </linearGradient>
      </defs>
      <path 
        fill={useGradient ? "url(#tonicdoc-gradient)" : fill}
        d="M53.4,69.2v359.5c0,24.2,21.2,40.2,45.4,40.2H444v-24.1H98.8c-9.1,0-15.2-5.4-15.2-13.4c0-8,6-13.4,15.2-13.4
        H444V39.7H86.7C71.6,42.4,56.4,55.8,53.4,69.2z"
      />
      <path 
        fill="#FFFFFF"
        d="M321.8,98.3c0,0-128.8,58.1-130.9,58.9c-0.5,0.2-2.6,1.3-2.6,3.6v138.5c-4.8-2.8-10.3-4.3-16.3-4.3
        c-17.9,0-32.5,14.5-32.5,32.5s14.6,32.5,32.5,32.5s32.5-14.5,32.5-32.5c0-1.3-0.1-2.6-0.2-3.9c0.2-0.5,0.2-1,0.2-1.5V208.1
        l113.8-54.8V232c-4.8-2.8-10.3-4.3-16.3-4.3c-17.9,0-32.5,14.5-32.5,32.5c0,17.9,14.6,32.5,32.5,32.5c17.9,0,32.5-14.5,32.5-32.5
        c0-1.9,0-5.4,0-5.4V103.3C334.4,96.7,326.5,96.9,321.8,98.3z M237.1,317h116.3v39.1H237.1V317z"
      />
    </svg>
  );
};

export default TonicMLDocIcon;

