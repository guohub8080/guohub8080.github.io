/**
 * MDX JPL 组件
 * 支持深色模式适配
 * 模仿 Paragraph 的字体大小、颜色和行高
 */

import useGlobalSettings from '../../../../store/useGlobalSettings';
import React, { CSSProperties } from 'react';
import byDefault from '../../../../utils/common/byDefault.ts';
import { isNil } from 'lodash';
import googleColors from '../../../../assets/colors/googleColors.ts';

interface JPLProps extends React.HTMLProps<HTMLSpanElement> {
  children?: React.ReactNode;
  highlight?: string; // 高亮颜色，默认为空白（不高亮）
  color?: string //字体颜色，默认是空白（无显示）
  preset?: number //预制样式，默认是空白
  fontSize?: string | number; // 字体大小，默认继承父元素
}

// 预制样式配置
const PRESETS: Record<number, { highlight: string; color: string }> = {
  1: { highlight: googleColors.amber100, color: googleColors.brown700 }, // 黄色高亮 + 橙色文字
  2: { highlight: googleColors.blue50, color: googleColors.blue800 }, // 蓝色高亮 + 深蓝文字
  3: { highlight: googleColors.green50, color: googleColors.green800 }, // 绿色高亮 + 深绿文字
  4: { highlight: googleColors.pink50, color: googleColors.pink800 }, // 粉色高亮 + 深粉文字
  5: { highlight: googleColors.purple100, color: googleColors.purple800 }, // 紫色高亮 + 深紫文字
};

const JPL: React.FC<JPLProps> = ({ children, style, highlight = null, color = null, preset, fontSize, ...props }) => {
  const { articleLineHeight } = useGlobalSettings();

  // 如果有 preset，优先使用预制样式
  let finalHighlight: string;
  let finalColor: string | undefined;

  if (!isNil(preset) && PRESETS[preset]) {
    finalHighlight = PRESETS[preset].highlight;
    finalColor = PRESETS[preset].color;
  } else {
    // 没有 preset 时使用原有逻辑
    finalHighlight = byDefault(highlight, "transparent");
    finalColor = color || undefined;
  }

  const fontColorCss = isNil(finalColor) ? {} : { color: finalColor };
  const otherCss: CSSProperties = finalHighlight !== "transparent" ? {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 4,
  } : {
    marginLeft: -1,
    marginRight: -1
  }
  return (
    <span
      className="text-base text-foreground jp-font"
      style={{
        lineHeight: `${articleLineHeight}px`,
        fontFamily: 'jp-font',
        fontSize: fontSize || "inherit",
        backgroundColor: finalHighlight,
        ...otherCss,
        ...fontColorCss,
        ...style,
      }}
      {...props}
    >{children}</span>
  );
};

export default JPL;

