/* eslint-disable no-mixed-spaces-and-tabs */
import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx";
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx";
import svgURL from "../../../PubUtils/common/svgURL.ts";
import { CSSProperties } from "react";
import type { HotAreaConfig } from "../../../PubUtils/svgHotArea";
import { max } from "lodash";
import byDefault from "../../../../utils/common/byDefault.ts";

/**
 * ClickSwitchLayer - 点击切换的单个图层
 * 点击后淡出，显示下一层内容
 * 
 * @param viewBoxW - ViewBox 宽度
 * @param viewBoxH - ViewBox 高度
 * @param url - 图片 URL
 * @param duration - 淡出动画时长
 * @param keySplines - 贝塞尔曲线参数
 * @param hotArea - 热区配置
 * @param hasAnimation - 是否有淡出动画（最底层图片不需要动画）
 */
const ClickSwitchLayer = (props: {
  viewBoxW: number
  viewBoxH: number
  url: string
  duration: number
  keySplines?: string
  hotArea: HotAreaConfig
  hasAnimation?: boolean
}) => {
  // 计算热区移出视野的距离
  const maxDimension = byDefault(max([props.viewBoxW, props.viewBoxH]), props.viewBoxW)
  const outOfView = maxDimension * 50
  
  const hotX = byDefault(props.hotArea.x, 0)
  const hotY = byDefault(props.hotArea.y, 0)
  const hotW = byDefault(props.hotArea.w, props.viewBoxW)
  const hotH = byDefault(props.hotArea.h, props.viewBoxH)
  
  const mainStyle: CSSProperties = {
    backgroundImage: svgURL(props.url),
    backgroundSize: "100% auto", 
    backgroundRepeat: "no-repeat",
    width: "100%", 
    transform: "rotateZ(0.00deg)", 
    WebkitTransform: "rotateZ(0.00deg)",
    pointerEvents: "none",
  }
  
  // 最底层图片：静态显示，无动画
  if (!props.hasAnimation) {
    return <SectionEx style={{pointerEvents: "none", height: 0, lineHeight: 0}}>
      <SvgEx 
           viewBox={`0 0 ${props.viewBoxW} ${props.viewBoxH}`}
           preserveAspectRatio="xMinYMin meet"
           style={mainStyle} 
           width="100%" 
           opacity={1}
      />
    </SectionEx>
  }
  
  // 其他图层：点击后淡出
  // 关键：将 pointerEvents 从 SVG 移到热区矩形，让整个 SVG 能接收点击事件
  return <SectionEx style={{pointerEvents: "none", height: 0, lineHeight: 0}}>
    <SvgEx 
         viewBox={`0 0 ${props.viewBoxW} ${props.viewBoxH}`}
         preserveAspectRatio="xMinYMin meet"
         style={{...mainStyle, pointerEvents: "auto"}}
         width="100%" 
         opacity={1}>
      
      {/* 点击后整个 SVG 淡出 */}
      <animate attributeName="opacity" 
               begin="click"
               restart="never"
               dur={`${props.duration}s`} 
               values="1;0"
               keyTimes="0;1"
               keySplines={props.keySplines}
               calcMode={props.keySplines ? "spline" : "linear"}
               fill="freeze"/>
      
      {/* 热区矩形：透明、可点击 */}
      <rect 
        x={hotX}
        y={hotY}
        width={hotW}
        height={hotH}
        opacity={0}
        style={{ pointerEvents: "painted" }}
      >
        {/* 点击后立即将热区移出视野，防止重复点击 */}
        <animate 
          attributeName="x"
          begin="click+0s"
          dur="1ms"
          values={outOfView.toString()}
          fill="freeze"
          restart="whenNotActive"
        />
        {/* 点击后隐藏热区 */}
        <set 
          attributeName="visibility"
          to="hidden"
          begin="click+0s"
          dur="1ms"
          fill="freeze"
          restart="never"
        />
      </rect>
    </SvgEx>
  </SectionEx>
}

export default ClickSwitchLayer;

