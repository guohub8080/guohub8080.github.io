// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

const findFirstIndexLessThanLeft = (arr:any) => {
  // 从数组的第二个元素开始遍历
  for (let i = 1; i < arr.length; i++) {
    // 检查当前元素是否小于它左边的元素
    if (arr[i] < arr[i - 1]) {
      // 如果满足条件，返回当前元素的索引
      return i;
    }
  }
  // 如果没有找到符合条件的元素，返回 -1
  return -1;
}

export default findFirstIndexLessThanLeft