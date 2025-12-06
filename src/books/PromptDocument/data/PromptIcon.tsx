import React from "react";

export interface PromptIconProps {
  className?: string;
}

const PromptIcon: React.FC<PromptIconProps> = ({ className }) => {
  return (
    <svg 
      className={className}
      viewBox="-106 -106 1236 1236" 
      version="1.1" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="promptGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#60A5FA', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path 
        d="M819.325977 615.12437l57.949637 146.291339 146.44881 57.910268-146.44881 57.949637-57.949637 146.44881-57.910268-146.44881-146.291339-57.949637 146.291339-57.949636zM839.561109 22.400369l95.979086 96.175926a68.067202 68.067202 0 0 1 0 96.175925L243.293991 908.100727l-240.853177 47.241551 48.895005-239.672138L743.660759 22.400369a67.870363 67.870363 0 0 1 95.979086 0z m-177.155819 177.470762L113.734036 749.211641l-24.290032 119.678598 120.269117-23.620776L758.266272 295.850217zM144.441044 0.157472L185.42309 103.61647l103.458998 40.982046L185.42309 185.580562 144.441044 289.03956 103.458998 185.580562 0.157472 144.441044l103.458998-40.982046z m647.012418 70.42928l-81.019261 81.137365 95.979086 95.979085 81.019261-81.019261-95.979086-96.175925z" 
        fill="url(#promptGradient)"
      />
    </svg>
  );
};

export default PromptIcon;


