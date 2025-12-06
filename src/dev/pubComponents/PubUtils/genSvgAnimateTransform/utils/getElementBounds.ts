

export const getElementBounds = (element: ElementBoundsType) => {
    const { x = 0, y = 0, w, h } = element;
    return {
        x,
        y,
        w,
        h
    }
}

export type ElementBoundsType = { x?: number, y?: number, w: number, h: number }

/**
 * 原点位置类型
 * 支持 9 种快捷位置 + 2 种特殊位置
 */
export type OriginPosition = 
  | 'topLeft'       // 左上角
  | 'topCenter'     // 顶部中心
  | 'topRight'      // 右上角
  | 'centerLeft'    // 左侧中心
  | 'center'        // 中心
  | 'centerRight'   // 右侧中心
  | 'bottomLeft'    // 左下角
  | 'bottomCenter'  // 底部中心
  | 'bottomRight'   // 右下角
  | 'origin';       // 坐标原点 (0, 0)

/**
 * 根据快捷位置文本获取元素的具体坐标
 * 
 * @param originText - 快捷位置文本
 * @param element - 元素边界信息
 * @returns 坐标数组 [x, y]
 * 
 * @example
 * ```ts
 * const bounds = { x: 100, y: 50, w: 200, h: 150 };
 * 
 * getOriginNumByText('topLeft', bounds);      // [100, 50]
 * getOriginNumByText('topCenter', bounds);    // [200, 50]
 * getOriginNumByText('center', bounds);       // [200, 125]
 * getOriginNumByText('bottomRight', bounds);  // [300, 200]
 * getOriginNumByText('origin', bounds);       // [0, 0]
 * ```
 */
export const getOriginNumByText = (
  originText: OriginPosition, 
  element: ElementBoundsType
): [number, number] => {
    // 特殊情况：坐标原点
    if (originText === 'origin') {
        return [0, 0];
    }

    const { x, y, w, h } = getElementBounds(element);
    const centerX = x + w / 2;
    const centerY = y + h / 2;
    const right = x + w;
    const bottom = y + h;

    const positionMap: Record<Exclude<OriginPosition, 'origin'>, [number, number]> = {
        topLeft: [x, y],
        topCenter: [centerX, y],
        topRight: [right, y],
        centerLeft: [x, centerY],
        center: [centerX, centerY],
        centerRight: [right, centerY],
        bottomLeft: [x, bottom],
        bottomCenter: [centerX, bottom],
        bottomRight: [right, bottom],
    };

    return positionMap[originText];
}