import { isNull, isUndefined } from 'lodash';
import { useImageSize } from 'react-image-size';

const getImgSizeAsync = (url: string): {
    w: number,
    h: number,
    status: string
    isSuccess: boolean
} => {
    const [dimensions, { loading, error }] = useImageSize(url)
    if (loading) return { w: 0, h: 0, isSuccess: false, status: "loading" }
    if (error) return { w: 0, h: 0, isSuccess: false, status: "error" }
    if (isUndefined(dimensions?.width) || isNull(dimensions?.width)) return { w: 0, h: 0, isSuccess: false, status: "loading" }
    if (isUndefined(dimensions?.height) || isNull(dimensions?.height)) return { w: 0, h: 0, isSuccess: false, status: "loading" }
    return { w: dimensions.width, h: dimensions.height, isSuccess: true, status: "success" }
}
export default getImgSizeAsync
