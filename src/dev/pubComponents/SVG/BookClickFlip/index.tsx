/* eslint-disable no-mixed-spaces-and-tabs */
import SectionEx from "../../PureHTML/basicEx/SectionEx.tsx";
import SvgEx from "../../PureHTML/basicEx/SvgEx.tsx";
import getTextImgPic1 from "../../../api/placeHolderPic/getTextImgPic1.ts";
import byDefault from "../../../utils/common/byDefault.ts";
import { CSSProperties, useMemo } from "react";
import { mpBlank, mpGet, mpProps } from "../../../styles/funcs/mp.ts";
import getImgSizeByDefault from "../../PubUtils/common/getImgSizeByDefault.tsx";
import svgURL from "../../PubUtils/common/svgURL.ts";

/**
 * 图书翻页组件 - 模拟3D翻页效果
 * 
 * 原理：
 * 1. 多层图片叠加（底层到顶层）
 * 2. 点击顶层后：skewY倾斜 + scale横向收缩 + opacity淡出
 * 3. 模拟书页翻过去的3D效果
 * 4. 支持N页，逐层点击翻页
 * 
 * @param pics - 页面图片URL数组，第一个元素是底层（最后显示）
 * @param skewDegree - 倾斜角度（度），默认 30
 * @param duration - 翻页动画总时长（秒），默认 3
 * @param fadeStartDelay - 淡出动画延迟开始时间（秒），默认 1
 * @param viewBoxW - ViewBox 宽度
 * @param viewBoxH - ViewBox 高度
 * @param mp - margin/padding 配置
 */
const BookClickFlip = (props: {
  pics?: string[]
  skewDegree?: number
  duration?: number
  fadeStartDelay?: number
  viewBoxW?: number
  viewBoxH?: number
  mp?: mpProps
}) => {
  const pics = useMemo(() => {
    return byDefault(props.pics, [
      getTextImgPic1(450, 750, "第1页"),
      getTextImgPic1(450, 750, "第2页"),
      getTextImgPic1(450, 750, "第3页"),
    ])
  }, [props.pics])

  const skewDegree = byDefault(props.skewDegree, 30)
  const duration = byDefault(props.duration, 3)
  const fadeStartDelay = byDefault(props.fadeStartDelay, 1)
  const mpResult = mpGet(byDefault(props.mp, mpBlank))

  // 计算 viewBox 尺寸
  const imgSize = getImgSizeByDefault(pics[0], props.viewBoxW, props.viewBoxH)
  
  // 计算隐藏时间（淡出完成后）
  const hideTime = fadeStartDelay + (duration - fadeStartDelay)

  const rootStyle: CSSProperties = {
    ...frameStyle,
    ...mpResult
  };

  return (
    <SectionEx data-label="book-click-flip" style={rootStyle}>
      <SectionEx style={innerSectionStyle}>
        <SvgEx 
          viewBox={`0 0 ${imgSize.w} ${imgSize.h}`}
          style={svgStyle}
        >
          {pics.map((url, index) => {
            // 第一页（底层）：无翻页动画，只有热区
            if (index === 0) {
              return (
                <g key={index}>
                  <foreignObject 
                    x="0" 
                    y="0" 
                    width={imgSize.w} 
                    height={imgSize.h} 
                    style={foreignObjectStyle}
                  >
                    <SvgEx
                      style={{
                        ...pageImageStyle,
                        backgroundImage: svgURL(url),
                      }}
                      viewBox={`0 0 ${imgSize.w} ${imgSize.h}`}
                    />
                  </foreignObject>
                  
                  {/* 热区：点击后失效 */}
                  <rect 
                    opacity="0" 
                    width={imgSize.w} 
                    height={imgSize.h} 
                    style={hotAreaStyle}
                  >
                    <set 
                      attributeName="visibility" 
                      to="hidden" 
                      begin="click" 
                      dur="0.01s" 
                      fill="freeze" 
                    />
                  </rect>
                </g>
              )
            }

            // 其他页：完整翻页动画
            return (
              <g key={index}>
                {/* 1. 倾斜变换：模拟3D透视 */}
                <animateTransform
                  attributeName="transform"
                  type="skewY"
                  values={`0;${skewDegree}`}
                  begin="click"
                  dur={`${duration}s`}
                  fill="freeze"
                  additive="sum"
                />
                
                {/* 2. 淡出动画：延迟开始 */}
                <animate 
                  attributeName="opacity" 
                  values="1;0" 
                  begin={`click+${fadeStartDelay}s`}
                  dur={`${duration - fadeStartDelay}s`}
                  fill="freeze" 
                />
                
                {/* 3. 横向缩放：模拟页面收缩 */}
                <animateTransform
                  attributeName="transform"
                  type="scale"
                  values="1 1;0 1"
                  begin="click"
                  dur={`${duration}s`}
                  fill="freeze"
                  additive="sum"
                />
                
                {/* 4. 平移动画（占位，可扩展） */}
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0 0;0 0"
                  begin="click"
                  dur={`${duration}s`}
                  fill="freeze"
                  additive="sum"
                />
                
                {/* 5. 完全隐藏：动画结束后 */}
                <set 
                  attributeName="visibility" 
                  to="hidden" 
                  begin={`click+${hideTime}s`}
                  dur="1ms" 
                  fill="freeze" 
                />
                
                {/* 页面图片 */}
                <foreignObject 
                  x="0" 
                  y="0" 
                  width={imgSize.w} 
                  height={imgSize.h}
                  style={foreignObjectStyle}
                >
                  <SvgEx
                    style={{
                      ...pageImageStyle,
                      backgroundImage: svgURL(url),
                    }}
                    viewBox={`0 0 ${imgSize.w} ${imgSize.h}`}
                  />
                </foreignObject>
                
                {/* 透明热区：接收点击并立即失效 */}
                <rect 
                  opacity="0" 
                  width={imgSize.w} 
                  height={imgSize.h}
                  style={hotAreaStyle}
                >
                  <set 
                    attributeName="visibility" 
                    to="hidden" 
                    begin="click" 
                    dur="0.01s" 
                    fill="freeze" 
                  />
                </rect>
              </g>
            )
          })}
        </SvgEx>
      </SectionEx>
    </SectionEx>
  );
};

export default BookClickFlip;


/** ================================================== Styles ===================================================== */
const frameStyle: CSSProperties = {
  WebkitTouchCallout: "none",
  userSelect: "text",
  overflow: "hidden",
  textAlign: "center",
  lineHeight: 0,
  transform: "rotateZ(0deg)",
  isolation: "isolate",
  marginTop: "-1px",
};

const innerSectionStyle: CSSProperties = {
  lineHeight: 0,
};

const svgStyle: CSSProperties = {
  display: "block",
  pointerEvents: "none",
};

const foreignObjectStyle: CSSProperties = {
  overflow: "hidden",
};

const pageImageStyle: CSSProperties = {
  backgroundSize: "100%",
  display: "block",
};

const hotAreaStyle: CSSProperties = {
  pointerEvents: "visible",
};

