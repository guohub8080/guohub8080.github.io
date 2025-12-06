/* eslint-disable no-mixed-spaces-and-tabs */
import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx";
import getTextImgPic1 from "../../../../api/placeHolderPic/getTextImgPic1.ts";
import byDefault from "../../../../utils/common/byDefault.ts";
import { CSSProperties, useMemo } from "react";
import ClickSwitchLayer from "./ClickSwitchLayer.tsx";
import { mpBlank, mpGet, mpProps } from "../../../../styles/funcs/mp.ts";
import getImgSizeByDefault from "../../../PubUtils/common/getImgSizeByDefault.tsx";
import { getLinearBezier } from "../../../PubUtils/getBezier";
import { HotAreaConfig, getFullScreenHotArea } from "../../../PubUtils/svgHotArea";

/**
 * 点击淡出切换组件
 * 
 * @description
 * 点击屏幕后，当前图片淡出消失，显示下一层图片。
 * 支持多张图片依次切换，可自定义每张图片的切换速度、贝塞尔曲线和点击热区。
 * 
 * @example
 * ```tsx
 * // 基础用法
 * <ClickSwitchFade 
 *   pics={[
 *     { url: "图片1.jpg" },
 *     { url: "图片2.jpg" },
 *     { url: "图片3.jpg" }
 *   ]}
 * />
 * 
 * // 自定义切换速度和热区
 * <ClickSwitchFade 
 *   switchDuration={0.8}
 *   pics={[
 *     { 
 *       url: "图片1.jpg", 
 *       duration: 0.5,
 *       hotArea: { x: 100, y: 100, w: 200, h: 200 }
 *     }
 *   ]}
 * />
 * 
 * // 全部消失模式
 * <ClickSwitchFade 
 *   isLastImgMaintained={false}
 *   pics={[
 *     { url: "倒计时3.jpg" },
 *     { url: "倒计时2.jpg" },
 *     { url: "倒计时1.jpg" }
 *   ]}
 * />
 * ```
 * 
 * @param props - 组件属性
 * @param props.pics - 图片配置数组
 * @param props.pics[].url - 图片 URL
 * @param props.pics[].duration - 该图片的淡出时长（秒），默认使用 switchDuration
 * @param props.pics[].keySplines - 贝塞尔曲线，控制淡出动画效果
 * @param props.pics[].hotArea - 点击热区配置，默认全屏
 * @param props.switchDuration - 默认切换时长（秒），默认 0.5
 * @param props.viewBoxW - ViewBox 宽度，默认使用第一张图片的真实宽度
 * @param props.viewBoxH - ViewBox 高度，默认使用第一张图片的真实高度
 * @param props.isLastImgMaintained - 最后一张图片是否保持显示，默认 true
 * @param props.mp - margin/padding 配置
 * 
 * @returns React 组件
 */
const ClickSwitchFade = (props: {
  pics?: { url: string, duration?: number, keySplines?: string, hotArea?: HotAreaConfig }[]
  switchDuration?: number
  viewBoxW?: number
  viewBoxH?: number
  isLastImgMaintained?: boolean
  mp?: mpProps
}) => {
  // 默认切换动画时长（秒）
  const defaultDuration = byDefault(props.switchDuration, 0.5)
  const isLastImgMaintained = byDefault(props.isLastImgMaintained, true)
  const mpResult = mpGet(byDefault(props.mp, mpBlank))

  // 获取第一张图片的 URL，用于计算 viewBox 尺寸
  const firstPicUrl = byDefault(props.pics, [{ url: getTextImgPic1(600, 800, "测试图1") }])[0]?.url
  
  // 计算最终的 viewBox 尺寸：优先使用用户指定的尺寸，否则使用基准图片的真实尺寸
  const imgSizeAsViewBox = getImgSizeByDefault(firstPicUrl, props.viewBoxW, props.viewBoxH)

  // 处理图片配置：为每张图片设置 url、duration、keySplines 和 hotArea
  const pics = useMemo(() => {
    return byDefault(props.pics, [{
      url: firstPicUrl
    }]).map((x) => {
      // 如果未指定 hotArea，则使用全屏热区
      const hotArea = byDefault(
        x?.hotArea, 
        getFullScreenHotArea({ viewBoxW: imgSizeAsViewBox.w, viewBoxH: imgSizeAsViewBox.h })
      )
      return { 
        url: x?.url, 
        duration: byDefault(x?.duration, defaultDuration), 
        keySplines: byDefault(x?.keySplines, getLinearBezier()),
        hotArea
      }
    })
  }, [props.pics, defaultDuration, firstPicUrl, imgSizeAsViewBox.w, imgSizeAsViewBox.h])

  const rootStyle: CSSProperties = {
    ...frameStyle,
    ...mpResult
  };

  // 根据 isLastImgMaintained 决定渲染逻辑
  // - false: 最后一张图片也会点击消失（所有图片都有动画）
  // - true: 最后一张图片保持不消失（底层无动画）

  if (!isLastImgMaintained) {
    // 所有图片都点击消失：从最后一张到第一张，倒序渲染
    return <SectionEx data-label="click-switch-all-disappear" style={rootStyle}>
      {pics.slice().reverse().map((pic, index) => (
        <ClickSwitchLayer
          key={index}
          url={pic.url}
          viewBoxW={imgSizeAsViewBox.w}
          viewBoxH={imgSizeAsViewBox.h}
          duration={pic.duration}
          keySplines={pic.keySplines}
          hotArea={pic.hotArea}
          hasAnimation={true}
        />
      ))}
    </SectionEx>
  }

  // 最后一张图片保持，其他图片点击消失
  // 渲染顺序：最后一张（底层，无动画）→ 中间图片（有动画）→ 第一张（顶层，有动画）
  return <SectionEx data-label="click-switch" style={rootStyle}>
    {/* 倒序渲染，从最后一张到第二张 */}
    {pics.slice().reverse().map((pic, index) => {
      // 最后一张图片（index === pics.length - 1）无动画
      const isLastPic = index === pics.length - 1
      return (
        <ClickSwitchLayer
          key={index}
          url={pic.url}
          viewBoxW={imgSizeAsViewBox.w}
          viewBoxH={imgSizeAsViewBox.h}
          duration={pic.duration}
          keySplines={pic.keySplines}
          hotArea={pic.hotArea}
          hasAnimation={!isLastPic}
        />
      )
    })}
  </SectionEx>
}

export default ClickSwitchFade;


/** ================================================== Styles ===================================================== */
const frameStyle: CSSProperties = {
  WebkitTouchCallout: "none",
  userSelect: "text",
  overflow: "hidden",
  textAlign: "center",
  lineHeight: 0,
  marginBottom: 0,
};

