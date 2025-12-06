import { CSSProperties } from "react"
import svgURL from "../../../PubUtils/common/svgURL.ts"
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx"

const SeamlessImg5 = (props: { w: number, h: number, url: string, mpResult: CSSProperties }) => {
    return <section
        data-label="seamless-img-dark-mode-maintain-force-touchable"
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
                backgroundImage: svgURL(props.url),
                backgroundSize: '100% auto',
                backgroundRepeat: 'no-repeat',
                display: 'block',
                lineHeight: 0,
                marginTop: 0,
                pointerEvents: 'visible'
            }}
            viewBox={`0 0 ${props.w} ${props.h}`}
        />
    </section>
}

export default SeamlessImg5

