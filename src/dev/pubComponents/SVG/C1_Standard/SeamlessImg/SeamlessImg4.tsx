import { CSSProperties } from "react"
import svgURL from "../../../PubUtils/common/svgURL.ts"
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx"

const SeamlessImg4 = (props: { w: number, h: number, url: string, mpResult: CSSProperties }) => {
    return <section
        data-label="seamless-img-popable"
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
                display: 'inline',
                lineHeight: 0,
                marginTop: 0,
                pointerEvents: 'none',
                transform: 'scale(1)'
            }}
            viewBox={`0 0 ${props.w} ${props.h}`}
        >
            <foreignObject width={props.w} height={props.h} x="0" y="0">
                <img
                    src={props.url}
                    style={{
                        width: '100%',
                        height: 'auto',
                        visibility: 'visible',
                        pointerEvents: 'visiblePainted'
                    }}
                />
            </foreignObject>
            <foreignObject width={props.w} height={props.h}>
                <SvgEx
                    style={{
                        backgroundImage: svgURL(props.url),
                        backgroundPosition: '0% 0%',
                        backgroundSize: 'cover'
                    }}
                    viewBox={`0 0 ${props.w} ${props.h}`}
                />
            </foreignObject>
        </SvgEx>
    </section>
}

export default SeamlessImg4

