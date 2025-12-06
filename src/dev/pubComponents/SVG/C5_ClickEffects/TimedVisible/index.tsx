/* eslint-disable no-mixed-spaces-and-tabs */
import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx";
import byDefault from "../../../../utils/common/byDefault.ts";
import { CSSProperties, useMemo } from "react";
import { mpBlank, mpGet, mpProps } from "../../../../styles/funcs/mp.ts";
import getImgSizeByDefault from "@utils/common/getImgSizeByDefault.tsx";
import { HotAreaConfig, getFullScreenHotArea } from "../../../PubUtils/svgHotArea";
import getWechat300x300 from "../../../../api/placeHolderPic/getWechat300x300.ts";
import svgURL from "../../../PubUtils/common/svgURL.ts";

/**
 * 限时可见组件
 * 点击后第二张图片会在指定时间内显示，然后自动消失
 * 
 * @param {string} backgroundUrl - 背景图片URL（一直显示）
 * @param {string} overlayUrl - 叠加图片URL（点击后限时显示）
 * @param {number} duration - 显示持续时间（秒）
 * @param {number} fadeInRatio - 淡入时间占比（0-1）
 * @param {number} fadeOutRatio - 淡出时间占比（0-1）
 * @param {number} viewBoxW - SVG视图框宽度
 * @param {number} viewBoxH - SVG视图框高度
 * @param {HotAreaConfig} hotArea - 热区配置
 * @param {mpProps} mp - margin/padding 配置
 */
const TimedVisible = (props: {
  backgroundUrl?: string
  overlayUrl?: string
  duration?: number
  fadeInRatio?: number
  fadeOutRatio?: number
  viewBoxW?: number
  viewBoxH?: number
  hotArea?: HotAreaConfig
  mp?: mpProps
}) => {
  // 默认配置
  const backgroundUrl = byDefault(props.backgroundUrl, getWechat300x300(2))
  const overlayUrl = byDefault(props.overlayUrl, getWechat300x300(1))
  const duration = byDefault(props.duration, 4)
  const fadeInRatio = byDefault(props.fadeInRatio, 0.2)
  const fadeOutRatio = byDefault(props.fadeOutRatio, 0.2)
  const mpResult = mpGet(byDefault(props.mp, mpBlank))

  // 计算最终的 viewBox 尺寸
  const imgSizeAsViewBox = getImgSizeByDefault(backgroundUrl, props.viewBoxW, props.viewBoxH)

  // 热区配置
  const hotArea = byDefault(
    props.hotArea,
    getFullScreenHotArea({ viewBoxW: imgSizeAsViewBox.w, viewBoxH: imgSizeAsViewBox.h })
  )

  // 计算 keyTimes：[开始, 淡入结束, 淡出开始, 结束]
  const keyTimes = useMemo(() => {
    const fadeOutStart = 1 - fadeOutRatio
    return `0;${fadeInRatio};${fadeOutStart};1`
  }, [fadeInRatio, fadeOutRatio])

  const rootStyle: CSSProperties = {
    ...frameStyle,
    ...mpResult
  };

  return (
    <SectionEx style={rootStyle}>
      <SectionEx
        data-label="timed-visible"
        style={containerStyle}>
        {/* 背景 SVG - 一直显示 */}
        <svg
          viewBox={`0 0 ${imgSizeAsViewBox.w} ${imgSizeAsViewBox.h}`}
          style={{
            backgroundImage: svgURL(backgroundUrl),
            backgroundRepeat: "no-repeat",
            display: "block",
            backgroundSize: "100%",
          }}
          width="100%"
        />

        {/* 零高度容器，用于放置叠加层 */}
        <SectionEx style={zeroHeightContainerStyle}>
          {/* 叠加 SVG - 点击后限时显示 */}
          <svg
            viewBox={`0 0 ${imgSizeAsViewBox.w} ${imgSizeAsViewBox.h}`}
            opacity="0"
            style={{
              backgroundImage: svgURL(overlayUrl),
              backgroundRepeat: "no-repeat",
              display: "block",
              backgroundSize: "100%",
              transform: "rotate(180deg)",
              pointerEvents: "none",
            }}
            width="100%">
            {/* 透明度动画 */}
            <animate
              attributeName="opacity"
              begin="click"
              values="0;1;1;0"
              keyTimes={keyTimes}
              dur={`${duration}s`}
              fill="freeze"
            />
            {/* 热区矩形 */}
            <rect
              className="rect"
              x={hotArea.x}
              y={hotArea.y}
              width={hotArea.width}
              height={hotArea.height}
              style={{
                pointerEvents: "visiblePainted",
                opacity: 0,
              }}
            />
          </svg>
        </SectionEx>
      </SectionEx>
    </SectionEx>
  )
}

export default TimedVisible;

/** ================================================== Styles ===================================================== */
const frameStyle: CSSProperties = {
  WebkitTouchCallout: "none",
  userSelect: "text",
  overflow: "hidden",
  textAlign: "center",
  lineHeight: 0,
};

const containerStyle: CSSProperties = {
  display: "inline-block",
  width: "100%",
  lineHeight: 0,
};

const zeroHeightContainerStyle: CSSProperties = {
  height: "0px",
  transform: "rotate(180deg)",
};

