import React, { useEffect, useRef } from "react";
import byDefault from "../../../utils/common/byDefault.ts";
import GetPlaceHolderPic1 from "../../../api/placeHolderPic/getPlaceHolderPic1.ts";
import waterMark from "./basicExWatermark.ts";
import { isEmpty } from "lodash";

interface ImgExProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  /** 图片地址 */
  url?: string;
  /** 需要添加 !important 的样式属性 */
  important?: [string, string | null | undefined][];
  /** 额外的属性（已废弃，请直接使用标准 img 属性） */
  properties?: object;
}

/***
 * 带有水印的普通图片（可加important）
 * @param props
 * @constructor
 */
const ImgEx: React.FC<ImgExProps> = ({ style, important, url, properties, ...rest }) => {
  // 如果需要加important，那么走下面的逻辑
  const ref = useRef<HTMLImageElement>(null)
  useEffect(() => {
    if (important && ref.current) {
      important.map((x) => {
        ref.current!.style.setProperty(x[0], x[1], "important")
      })

      ref.current.style.setProperty("witdh", "100%", "important")
      ref.current.style.setProperty("max-witdh", "100%", "important")
      ref.current.style.setProperty("height", "auto", "important")
    }
  }, [important])

  const imgUrl = byDefault(url, GetPlaceHolderPic1())

  // 如果没有填入了important
  if (isEmpty(important)) {
    return <img
      style={style}
      {...waterMark}
      {...properties}
      {...rest}
      referrerPolicy="no-referrer"
      src={imgUrl}
      data-src={imgUrl}
      alt=""
    />
  }

  // 如果填入了important，证明需要强调一些属性
  return <img ref={ref}
    style={style}
    {...waterMark}
    {...properties}
    {...rest}
    referrerPolicy="no-referrer"
    src={imgUrl}
    data-src={imgUrl}
    alt=""
  />
}
export default ImgEx

