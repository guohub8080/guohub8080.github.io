import { useMemo } from "react"
import byDefault from "../../../utils/common/byDefault.ts"
import getImgSizeAsync from "./getImgSizeAsync.ts"

const getImgSizeByDefault = (url: string, w?: number, h?: number) => {
    const imgSizeAutoGet = getImgSizeAsync(url)
    const imgSize = useMemo(() => {
        const imgW = byDefault(w, 0)
        const imgH = byDefault(h, 0)
        if (imgW + imgH > 0) return { w: imgW, h: imgH }
        if (imgSizeAutoGet.isSuccess) return { w: imgSizeAutoGet.w, h: imgSizeAutoGet.h }
        return { w: imgW, h: imgH }
    }, [imgSizeAutoGet, w, h])
    return imgSize
}

export default getImgSizeByDefault
