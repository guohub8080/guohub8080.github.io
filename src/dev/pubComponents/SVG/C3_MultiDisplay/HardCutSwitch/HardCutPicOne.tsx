/* eslint-disable no-mixed-spaces-and-tabs */
import { useMemo } from "react";
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx";
import svgURL from "../../../PubUtils/common/svgURL.ts";
import { genAnimateOpacity } from "../../../PubUtils/genSvgAnimateTransform/genAnimateOpacity";

/**
 * 单张图片组件 - 硬切（离散）
 * 显示一段时间后瞬时隐藏，等待到下一个循环
 */
const HardCutPicOne = (props: {
    viewBoxW: number
    viewBoxH: number
    url: string
    totalDuration: number      // 整个循环的总时长（所有 stayDuration 之和）
    stayDuration: number       // 完全显示停留的时长
    picIndex: number           // 当前图片索引
    allPics: {
        url: string
        stayDuration: number
    }[]
}) => {
    const { viewBoxW, viewBoxH, url, totalDuration, stayDuration, picIndex, allPics } = props;

    const getDelayTimeByIndex = (index: number) => {
        let delay = 0;
        for (let i = 0; i < index; i++) {
            delay += allPics[i].stayDuration;
        }
        return delay;
    };


    const anim = useMemo(() => {
        const delay = getDelayTimeByIndex(picIndex);
        const hideTime = totalDuration - stayDuration;
        
        // 所有图都是同样的逻辑：delay -> stay -> hide
        
        return genAnimateOpacity({
            initOpacity: 1,
            timeline:[
                {timeSpanSec:stayDuration, toValue: 0},
                {timeSpanSec:hideTime, toValue: 0},
            ],
            calcMode: 'discrete',
            loopCount: 0,
            delay
        });
    }, [totalDuration, stayDuration, picIndex, allPics]);

    return (
        <g name={`hardcut-pic-${picIndex}`}>
            <foreignObject x={0} y={0} width={viewBoxW} height={viewBoxH}>
                <SvgEx
                    style={{
                        display: "block",
                        backgroundImage: svgURL(url),
                        backgroundSize: "100% auto",
                        backgroundRepeat: "no-repeat",
                    }}
                    viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
                    width="100%"
                />
            </foreignObject>

            {anim}
        </g>
    );
};

export default HardCutPicOne;


