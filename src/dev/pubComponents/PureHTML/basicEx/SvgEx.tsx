import React from 'react';
import waterMark from "./basicExWatermark.ts";
/**
 * SvgEx - SVG 增强组件
 * 
 * 自动添加必要的 XML 命名空间声明，简化 SVG 使用
 * 
 * @description
 * 默认添加：
 * - xmlns="http://www.w3.org/2000/svg"
 * - xmlnsXlink="http://www.w3.org/1999/xlink"
 * 
 * @example
 * // 使用 SvgEx 替代 svg
 * <SvgEx viewBox="0 0 100 100" style={{ width: 100, height: 100 }}>
 *   <circle cx={50} cy={50} r={40} fill="blue" />
 * </SvgEx>
 */
const SvgEx: React.FC<React.SVGProps<SVGSVGElement>> = ({ children, ...rest }) => {
    return (
        <svg {...waterMark}
            version='1.1'
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            {...rest}
        >
            {children}
        </svg>
    );
};

export default SvgEx;

