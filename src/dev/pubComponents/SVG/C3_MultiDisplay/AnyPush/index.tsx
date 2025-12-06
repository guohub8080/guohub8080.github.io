import getWechat300x500 from "../../../../api/placeHolderPic/getWechat300x500.ts";
import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx";
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx";
import byDefault from "../../../../utils/common/byDefault.ts";
import getImgSizeByDefault from "../../../PubUtils/common/getImgSizeByDefault.tsx";
import { getEaseBezier } from "../../../PubUtils/getBezier";
import { mpBlank, mpGet, mpProps } from "../../../../styles/funcs/mp.ts";
import { isArray } from "lodash";
import { CSSProperties, useMemo } from "react";
import AnyPushLoop from "./AnyPushLoop.tsx";


const AnyPush = (props: {
    mp?: mpProps
    viewBoxW?: number
    viewBoxH?: number
    pics?: {
        url: string,
        direction?: "L" | "R" | "T" | "B",
        switchDuration?: number, // 切换到下一张图片的时长
        stayDuration?: number, // 静止停留的时长
        keySplines?: string // 贝塞尔曲线
    }[]
}) => {
    const mpResult = mpGet(byDefault(props.mp, mpBlank))
    const canvasSize = getImgSizeByDefault(props.pics?.[0]?.url, props.viewBoxW, props.viewBoxH)

    // 默认值常量
    const DEFAULT_SWITCH_DURATION = 0.5;
    const DEFAULT_STAY_DURATION = 0.5;
    const DEFAULT_DIRECTION = "R" as const;
    const DEFAULT_KEY_SPLINES = getEaseBezier({ isIn: true, isOut: true });

    // 标准化单个图片配置
    const normalizePic = (pic: NonNullable<typeof props.pics>[number]) => ({
        url: pic.url,
        direction: byDefault(pic.direction, DEFAULT_DIRECTION),
        switchDuration: byDefault(pic.switchDuration, DEFAULT_SWITCH_DURATION),
        stayDuration: byDefault(pic.stayDuration, DEFAULT_STAY_DURATION),
        keySplines: byDefault(pic.keySplines, DEFAULT_KEY_SPLINES)
    });

    // 图片数组，如果是一个图片，自动复制一份
    const pics = useMemo(() => {
        if (isArray(props.pics)) {
            if (props.pics.length === 1) {
                const normalized = normalizePic(props.pics[0]);
                return [normalized, normalized];
            }
            return props.pics.map(normalizePic);
        }
        // 默认占位图
        return [
            { url: getWechat300x500(1), direction: DEFAULT_DIRECTION, switchDuration: DEFAULT_SWITCH_DURATION, stayDuration: DEFAULT_STAY_DURATION, keySplines: DEFAULT_KEY_SPLINES },
            { url: getWechat300x500(2), direction: "L" as const, switchDuration: DEFAULT_SWITCH_DURATION, stayDuration: DEFAULT_STAY_DURATION, keySplines: DEFAULT_KEY_SPLINES }
        ];
    }, [props.pics])

    return (
        <SectionEx
            style={{ ...rootBaseStyle, ...mpResult }}
            data-label="any-push"
        >
            <section style={innerStyle}>
                <SvgEx
                    viewBox={`0 0 ${canvasSize.w} ${canvasSize.h}`}
                    style={svgStyle}
                    width="100%"
                >
                    <AnyPushLoop
                        viewBoxW={canvasSize.w}
                        viewBoxH={canvasSize.h}
                        pics={pics} />
                </SvgEx>
            </section>
        </SectionEx>
    );
}

export default AnyPush;


/** ================================================== Styles ===================================================== */
const rootBaseStyle: CSSProperties = {
    WebkitTouchCallout: "none",
    userSelect: "text",
    overflow: "hidden",
    textAlign: "center",
    lineHeight: 0,
};

const innerStyle: CSSProperties = {
    overflow: "hidden",
    lineHeight: 0,
    margin: 0,
};

const svgStyle: CSSProperties = {
    display: "block",
    margin: "0 auto",
};


