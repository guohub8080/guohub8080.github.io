/**
 * genSvgKeys 工具集
 * 
 * 提供 SVG 动画参数生成相关的工具函数
 */

// SVG 动画参数转换器
export { 
  genSvgKeys,
  type SvgTimeline,
  type SvgKeysResult,
  type SvgTimelineSegment
} from './genSvgKeys.ts';

// SVG 动画属性白名单
export {
  SVG_ANIMATION_WHITELIST,
  WHITELIST_BY_ELEMENT,
  isAttrInWhitelist,
  isElementAttrValid,
  getAttrInfo,
  getSupportedAttrs,
  type SvgAnimationElement,
  type SvgAnimationAttr
} from './svgAttrWhiteList.ts';


