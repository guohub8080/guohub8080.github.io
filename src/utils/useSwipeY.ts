import {useSwipeable} from "react-swipeable";
import {useEffect, useMemo, useState} from "react";
import {useList} from "react-use";
import byDefault from "./byDefault";
import {isUndefined} from "lodash";

const useSwipeY = (config?: {
  mobileDistanceTrigger?: number,
  mouseDistanceTrigger?: number,
  onSwipeTrigger?: (i: boolean) => any
}) => {

  //以某个坐标作为比较的basePoint
  const [y, setY] = useState(0);
  //决定是否是移动端，如果是移动端，就启用touch事件，否则就启用mouse事件
  const [isMobile, setIsMobile] = useState(false)
  //触发的像素距离，越大越难触发
  const [pxTrigger, setPxTrigger] = useState(0)
  //滑动的距离，用来计算触发的次数
  const [distance, setDistance] = useState(0)
  //是否正在滑动
  const [isSwipping, setIsSwiping] = useState(false)
  //滑动的方向，true为向上，false为向下
  const [isUpward, setIsUpward] = useState(false)
  // 每次滑动的坐标记录在listY中
  const [listY, listYMethods] = useList<any>([])
  const handlers = useSwipeable({
    onTouchStartOrOnMouseDown: () => {
      setIsSwiping(true)
    },
    onSwiping: e => {
      if (!isUndefined(window.TouchEvent) && e.event instanceof TouchEvent) {
        setIsMobile(true)
        // 如果是触摸事件，访问 touches
        const cy = e.event.touches[0].clientY as any;
        if (listY.length === 0) setY(cy)
        listYMethods.push(cy as any)
      } else if (e.event instanceof MouseEvent) {
        setIsMobile(false)
        // 如果是鼠标事件，使用鼠标的坐标
        const cy = e.event.clientY as any;
        if (listY.length === 0) setY(cy)
        listYMethods.push(cy as any)
      }
      //前两个值确定了方向
      if (listY.length === 2) {
        if (listY[0] >= listY[1]) {
          return setIsUpward(true)
        }
        return setIsUpward(false)
      }
      if (listY.length >= 3) {
        if (isUpward) {
          if (listY[listY.length - 1] <= listY[listY.length - 2]) {
            return setDistance(Math.abs(listY[listY.length - 1] - y))
          }
          setY(listY[listY.length - 1])
          listYMethods.clear()
          return
        }
        if (listY[listY.length - 1] >= listY[listY.length - 2]) {
          return setDistance(Math.abs(listY[listY.length - 1] - y))
        }
        setY(listY[listY.length - 1])
        listYMethods.clear()
      }
    },
    onTouchEndOrOnMouseUp: () => {
      setY(0)
      setDistance(0)
      setIsSwiping(false)
      listYMethods.clear()
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
    trackTouch: true,
  });
  useEffect(() => {
    if (isMobile) {
      setPxTrigger(byDefault(config?.mobileDistanceTrigger, 20))
    } else {
      setPxTrigger(byDefault(config?.mouseDistanceTrigger, 20))
    }
  }, [config, isMobile])
  const triggerTimes = useMemo(() => {
    if (pxTrigger === 0) return 0
    return Math.floor(distance / pxTrigger)
  }, [distance, pxTrigger])
  useEffect(() => {
    if (triggerTimes !== 0) config?.onSwipeTrigger && config?.onSwipeTrigger(isUpward)
    //不提示下一行
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerTimes])
  return {handlers, isUpward, distance, isSwipping}
}
export default useSwipeY