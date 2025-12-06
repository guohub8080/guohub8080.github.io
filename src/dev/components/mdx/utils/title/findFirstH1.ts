/**
 * 递归查找第一个h1元素的文本内容
 * 用于从MDX组件中提取标题
 */

/**
 * 递归查找第一个h1元素的文本内容
 */
export function findFirstH1(element: any): string | null {
  if (!element) return null;
  
  // 如果是数组，遍历每个元素
  if (Array.isArray(element)) {
    for (const item of element) {
      const result = findFirstH1(item);
      if (result) return result;
    }
    return null;
  }
  
  // 如果是React元素
  if (element && typeof element === 'object') {
    // 检查是否是h1元素
    if (element.type === 'h1' || element.props?.className?.includes('h1')) {
      // 提取文本内容
      if (typeof element.props?.children === 'string') {
        return element.props.children;
      }
      if (Array.isArray(element.props?.children)) {
        return element.props.children.join('');
      }
    }
    
    // 递归查找子元素
    if (element.props?.children) {
      return findFirstH1(element.props.children);
    }
  }
  
  return null;
}
