import { CSSProperties } from "react"
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx"

const SeamlessImg6 = (props: { w: number, h: number, url: string, mpResult: CSSProperties }) => {
    return <section
        data-label="seamless-img-replaceable-after-publish"
        style={{
            WebkitTouchCallout: 'none',
            userSelect: 'text',
            overflow: 'hidden',
            textAlign: 'center',
            lineHeight: 0,
            ...props.mpResult
        }}
    >
        <SvgEx
            style={{
                display: 'block',
                lineHeight: 0,
                marginTop: 0,
                transform: 'scale(1)'
            }}
            viewBox={`0 0 ${props.w} ${props.h}`}
        >
            <foreignObject width={props.w} height={props.h} x="0" y="0">
                <img
                    data-src={props.url}
                    src={props.url}
                    style={{
                        width: '100%',
                        pointerEvents: 'painted'
                    }}
                />
            </foreignObject>
        </SvgEx>
    </section>
}

export default SeamlessImg6

