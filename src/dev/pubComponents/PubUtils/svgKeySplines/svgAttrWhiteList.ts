/**
 * SVG 动画属性白名单
 * 
 * 定义了支持的SVG动画元素及其可动画属性
 * 用于校验和约束动画配置的合法性
 */

/**
 * SVG 动画元素类型
 */
export type SvgAnimationElement = 'animate' | 'set' | 'animateTransform' | 'animateMotion';

/**
 * SVG 动画属性配置项
 */
export interface SvgAnimationAttr {
  /** 序号 */
  id: number;
  /** 元素类型 */
  element: SvgAnimationElement;
  /** 属性名 */
  name: string;
  /** 备注说明 */
  description: string;
}

/**
 * SVG 动画属性白名单
 * 
 * 包含所有支持的SVG动画元素及其可动画属性
 * 每个配置项包含元素类型、属性名和详细说明
 */
export const SVG_ANIMATION_WHITELIST: readonly SvgAnimationAttr[] = [
  // ====== animate 元素 ======
  {
    id: 1,
    element: 'animate',
    name: 'x',
    description: '控制简单几何体 x 轴方向移动，创意应用如柱状图等'
  },
  {
    id: 2,
    element: 'animate',
    name: 'y',
    description: '控制简单几何体 y 轴方向移动，创意应用如柱状图等'
  },
  {
    id: 3,
    element: 'animate',
    name: 'width',
    description: '控制简单几何体宽度变化，创意应用如伸长式图文（宽度自适应）'
  },
  {
    id: 4,
    element: 'animate',
    name: 'height',
    description: '控制简单几何体高度变化，创意应用如伸长式图文、预占位等'
  },
  {
    id: 5,
    element: 'animate',
    name: 'opacity',
    description: '控制透明度变化，数值为 0 到 1'
  },
  {
    id: 6,
    element: 'animate',
    name: 'd',
    description: '控制贝塞尔曲线补间行为，但表现具有随机性'
  },
  {
    id: 7,
    element: 'animate',
    name: 'points',
    description: '控制多边形补间行为，但表现具有随机性'
  },
  {
    id: 8,
    element: 'animate',
    name: 'stroke-width',
    description: '描边宽度、描边端点和描边偏移量，创意应用如遮罩动画、饼/分图、进度线等'
  },
  {
    id: 9,
    element: 'animate',
    name: 'stroke-linecap',
    description: '描边宽度、描边端点和描边偏移量，创意应用如遮罩动画、饼/分图、进度线等'
  },
  {
    id: 10,
    element: 'animate',
    name: 'stroke-dashoffset',
    description: '描边宽度、描边端点和描边偏移量，创意应用如遮罩动画、饼/分图、进度线等'
  },
  {
    id: 11,
    element: 'animate',
    name: 'fill',
    description: '控制填充色过渡变化'
  },

  // ====== set 元素 ======
  {
    id: 12,
    element: 'set',
    name: 'visibility',
    description: '控制可见性效果的表达，数值包括 visible | hidden | collapse | inherit，创意应用如防误触等'
  },

  // ====== animateTransform 元素 ======
  {
    id: 13,
    element: 'animateTransform',
    name: 'translate',
    description: '控制路径和编组的位移'
  },
  {
    id: 14,
    element: 'animateTransform',
    name: 'scale',
    description: '控制路径和编组的 x、y 轴缩放，创意应用如伪翻转等'
  },
  {
    id: 15,
    element: 'animateTransform',
    name: 'rotate',
    description: '控制路径和编组的旋转'
  },
  {
    id: 16,
    element: 'animateTransform',
    name: 'skewX',
    description: '控制路径和编组的 x 轴倾斜，创意应用如台历翻阅等'
  },
  {
    id: 17,
    element: 'animateTransform',
    name: 'skewY',
    description: '控制路径和编组的 y 轴倾斜，创意应用如书籍翻阅等'
  },

  // ====== animateMotion 元素 ======
  {
    id: 28,
    element: 'animateMotion',
    name: 'path',
    description: '单行/复杂的轨迹动画，可通过 rotate 定义朝向，创意应用如轨迹飞行等'
  }
] as const;

/**
 * 按元素类型分组的白名单索引
 * 用于快速查找某个元素支持的所有属性
 */
export const WHITELIST_BY_ELEMENT = {
  animate: SVG_ANIMATION_WHITELIST.filter(item => item.element === 'animate'),
  set: SVG_ANIMATION_WHITELIST.filter(item => item.element === 'set'),
  animateTransform: SVG_ANIMATION_WHITELIST.filter(item => item.element === 'animateTransform'),
  animateMotion: SVG_ANIMATION_WHITELIST.filter(item => item.element === 'animateMotion')
} as const;

/**
 * 所有支持的属性名集合（用于快速查找）
 */
const ATTR_NAME_SET = new Set(SVG_ANIMATION_WHITELIST.map(item => item.name));

/**
 * 元素-属性组合的索引映射
 * 格式：`${element}:${name}` -> SvgAnimationAttr
 */
const ELEMENT_ATTR_MAP = new Map(
  SVG_ANIMATION_WHITELIST.map(item => [`${item.element}:${item.name}`, item])
);

// ====== 导出的工具函数 ======

/**
 * 检查属性名是否在白名单中（不区分元素类型）
 * 
 * @param attrName - 属性名
 * @returns 是否在白名单中
 * 
 * @example
 * isAttrInWhitelist('opacity')  // true
 * isAttrInWhitelist('invalid')  // false
 */
export function isAttrInWhitelist(attrName: string): boolean {
  return ATTR_NAME_SET.has(attrName);
}

/**
 * 检查元素-属性组合是否在白名单中
 * 
 * @param element - 元素类型
 * @param attrName - 属性名
 * @returns 是否在白名单中
 * 
 * @example
 * isElementAttrValid('animate', 'opacity')          // true
 * isElementAttrValid('animateTransform', 'scale')   // true
 * isElementAttrValid('animate', 'translate')        // false - translate只能用于animateTransform
 */
export function isElementAttrValid(
  element: SvgAnimationElement,
  attrName: string
): boolean {
  return ELEMENT_ATTR_MAP.has(`${element}:${attrName}`);
}

/**
 * 获取属性的详细信息
 * 
 * @param element - 元素类型
 * @param attrName - 属性名
 * @returns 属性配置项，如果不存在则返回 undefined
 * 
 * @example
 * const info = getAttrInfo('animate', 'opacity');
 * // { id: 5, element: 'animate', name: 'opacity', description: '...' }
 */
export function getAttrInfo(
  element: SvgAnimationElement,
  attrName: string
): SvgAnimationAttr | undefined {
  return ELEMENT_ATTR_MAP.get(`${element}:${attrName}`);
}

/**
 * 获取指定元素支持的所有属性名
 * 
 * @param element - 元素类型
 * @returns 属性名数组
 * 
 * @example
 * getSupportedAttrs('animate')
 * // ['x', 'y', 'width', 'height', 'opacity', 'd', 'points', ...]
 */
export function getSupportedAttrs(element: SvgAnimationElement): string[] {
  return WHITELIST_BY_ELEMENT[element].map(item => item.name);
}

/**
 * 默认导出白名单数组
 */
export default SVG_ANIMATION_WHITELIST;


