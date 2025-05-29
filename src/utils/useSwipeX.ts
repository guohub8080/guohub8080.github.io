import {useSwipeable} from "react-swipeable";
import {useEffect, useMemo, useState} from "react";
import {useList} from "react-use";
import byDefault from "./byDefault";
import {isUndefined} from "lodash";

const useSwipeX = (config?: {
  mobileDistanceTrigger?: number,
  mouseDistanceTrigger?: number,
  onSwipeTrigger?: (i: boolean) => any
}) => {
  //以某个坐标作为比较的basePoint
  const [x, setX] = useState(0);
  //决定是否是移动端，如果是移动端，就启用touch事件，否则就启用mouse事件
  const [isMobile, setIsMobile] = useState(false)
  //触发的像素距离，越大越难触发
  const [pxTrigger, setPxTrigger] = useState(0)
  //滑动的距离，用来计算触发的次数
  const [distance, setDistance] = useState(0)
  //是否正在滑动
  const [isSwipping, setIsSwiping] = useState(false)
  //滑动的方向，true为向右，false为向左
  const [isRight, setIsRight] = useState(false)
  // 每次滑动的坐标记录在listX中
  const [listX, listXMethods] = useList<any>([])
  const handlers = useSwipeable({
    onTouchStartOrOnMouseDown: () => {
      setIsSwiping(true)
    },
    onSwiping: e => {
      if (!isUndefined(window.TouchEvent) && e.event instanceof TouchEvent) {
        setIsMobile(true)
        // 如果是触摸事件，访问 touches
        const cx = e.event.touches[0].clientX as any;
        if (listX.length === 0) setX(cx)
        listXMethods.push(cx as any)
      } else if (e.event instanceof MouseEvent) {
        setIsMobile(false)
        // 如果是鼠标事件，使用鼠标的坐标
        const cx = e.event.clientX as any;
        if (listX.length === 0) setX(cx)
        listXMethods.push(cx as any)
      }
      //前两个值确定了方向
      if (listX.length === 2) {
        if (listX[0] <= listX[1]) {
          return setIsRight(true)
        }
        return setIsRight(false)
      }
      if (listX.length >= 3) {
        if (isRight) {
          if (listX[listX.length - 1] >= listX[listX.length - 2]) {
            return setDistance(Math.abs(listX[listX.length - 1] - x))
          }
          setX(listX[listX.length - 1])
          listXMethods.clear()
          return
        }
        if (listX[listX.length - 1] <= listX[listX.length - 2]) {
          return setDistance(Math.abs(listX[listX.length - 1] - x))
        }
        setX(listX[listX.length - 1])
        listXMethods.clear()
      }
    },
    onTouchEndOrOnMouseUp: () => {
      setX(0)
      setDistance(0)
      setIsSwiping(false)
      listXMethods.clear()
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
    trackTouch: true,
  });
  useEffect(() => {
    if (isMobile) {
      setPxTrigger(byDefault(config?.mobileDistanceTrigger, 20))
    } else {
      setPxTrigger(byDefault(config?.mouseDistanceTrigger, 40))
    }
  }, [config, isMobile])
  const triggerTimes = useMemo(() => {
    if (pxTrigger === 0) return 0
    return Math.floor(distance / pxTrigger)
  }, [distance, pxTrigger])
  useEffect(() => {
    if (triggerTimes !== 0) config?.onSwipeTrigger && config?.onSwipeTrigger(isRight)
    //不提示下一行
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerTimes])
  return {handlers, isRight, distance, isSwipping}
}
export default useSwipeX