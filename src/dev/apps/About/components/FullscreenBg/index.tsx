import React from "react";
import snowCss from "./snow.module.css";

interface FullscreenBgProps {
  maskTransparency?: number;
  picSrc?: string;
}

/**
 * Fullscreen background component
 * @param props.maskTransparency - Mask transparency (1 = fully opaque, 0 = fully transparent)
 * @param props.picSrc - Image URL
 */
const FullscreenBg: React.FC<FullscreenBgProps> = ({ maskTransparency = 0.2 }) => {
  return (
    <div className="fixed inset-0 w-full h-screen overflow-hidden -z-10">
      <div className="select-none flex justify-center items-center absolute w-full h-full">
        <div className={snowCss.bgFrame}></div>
      </div>
      <div 
        className="w-full h-full bg-black absolute transition-opacity duration-500 ease-in-out" 
        style={{ opacity: maskTransparency }}
      />
    </div>
  );
};

export default FullscreenBg;

