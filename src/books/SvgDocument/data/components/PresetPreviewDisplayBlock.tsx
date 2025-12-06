import React, { ReactNode } from 'react';
import { css } from '@emotion/react';
import { isNumber } from 'lodash';
import SvgEx from '../../../../dev/pubComponents/PureHTML/basicEx/SvgEx.tsx';

interface PresetPreviewDisplayBlockProps {
    children: ReactNode;
    width?: number | string;
    height?: number | string;
    maxWidth?: number | string;
    maxHeight?: number | string;
    viewBoxW?: number;
    viewBoxH?: number;
}

/**
 * SVG 画布显示组件
 * 用于预览和展示 SVG 内容
 */
const PresetPreviewDisplayBlock: React.FC<PresetPreviewDisplayBlockProps> = ({
    children,
    width = '100%',
    height = 'auto',
    maxWidth = 300,
    maxHeight = 'none',
    viewBoxW = 300,
    viewBoxH = 300,
}) => {
    return (
        <div
            css={css`
                width: ${isNumber(width) ? `${width}px` : width};
                height: ${isNumber(height) ? `${height}px` : height};
                max-width: ${isNumber(maxWidth) ? `${maxWidth}px` : maxWidth};
                max-height: ${isNumber(maxHeight) ? `${maxHeight}px` : maxHeight};
                margin: 0 auto;
                border: 1px solid #e0e0e0;
                border-radius: 4px;
                overflow: hidden;
                background-color: #fafafa;
            `}
        >
            <SvgEx
                viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
                css={css`
                    width: 100%;
                    height: auto;
                    display: block;
                    pointer-events: auto;
                `}
            >
                {children}
            </SvgEx>
        </div>
    );
};

export default PresetPreviewDisplayBlock;


