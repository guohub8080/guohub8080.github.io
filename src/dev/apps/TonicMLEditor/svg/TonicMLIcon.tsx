import React from 'react';

interface TonicMLIconProps {
  className?: string;
  fill?: string;
  useGradient?: boolean;
}

const TonicMLIcon: React.FC<TonicMLIconProps> = ({ 
  className = "w-6 h-6", 
  fill = "#7D7D7D",
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
      viewBox="0 0 493 493"
      xmlSpace="preserve"
      className={className}
    >
      <defs>
        <linearGradient id="tonicml-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="25%" stopColor="#9333EA" />
          <stop offset="50%" stopColor="#A855F7" />
          <stop offset="75%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      <path 
        fill={useGradient ? "url(#tonicml-gradient)" : fill}
        d="M377.9,14.9c0,0-234.1,105.7-237.9,107.1c-0.9,0.3-4.7,2.3-4.7,6.5v251.8c-8.7-5-18.8-7.9-29.6-7.9
        c-32.6,0-59.1,26.4-59.1,59s26.5,59,59.1,59c32.6,0,59.1-26.4,59.1-59c0-2.4-0.1-4.7-0.4-7c0.3-0.9,0.4-1.8,0.4-2.8v-207l206.9-99.7
        V258c-8.7-5-18.8-7.9-29.6-7.9c-32.6,0-59.1,26.4-59.1,59c0,32.6,26.5,59,59.1,59c32.6,0,59.1-26.4,59.1-59c0-3.4,0-9.9,0-9.9V24
        C400.7,12.1,386.4,12.3,377.9,14.9z M223.9,412.4h211.5v71H223.9V412.4z"
      />
    </svg>
  );
};

export default TonicMLIcon;
