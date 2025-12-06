import {CSSProperties, ReactNode, useEffect, useRef, HTMLAttributes} from "react";
import waterMark from "./basicExWatermark.ts";
import { isEmpty } from "lodash";

/***
 * 带有水印的普通框架
 * @param props
 * @constructor
 */
const SectionEx = (props: {
  style?: CSSProperties
  children?: ReactNode
  important?: [string, string | null | undefined][]
} & HTMLAttributes<HTMLElement>) => {
  // 如果需要加important，那么走下面的逻辑
  const ref = useRef(null)
  const { style, children, important, ...rest } = props
  useEffect(() => {
    if (important && ref.current) {
      important.map((x) => {
        ref.current.style.setProperty(x[0], x[1], "important")
      })
    }
  }, [important])
  // 如果没有填入了props.important
  if (isEmpty(important)) {
    return <section style={style} {...waterMark} {...rest}>
      {children}
    </section>
  }
  // 如果填入了important，证明需要强调一些属性
  return <section style={style} ref={ref} {...waterMark} {...rest}>
    {children}
  </section>

}
export default SectionEx

