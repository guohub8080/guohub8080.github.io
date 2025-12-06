import { CSSProperties } from "react"
import svgURL from "../../../PubUtils/common/svgURL.ts"
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx"

const SeamlessImg2 = (props: { w: number, h: number, url: string, mpResult: CSSProperties }) => {
    return <section
        data-label="seamless-img-dark-mode-maintain-natural-priority"
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
                backgroundSize: '100%',
                backgroundRepeat: 'no-repeat',
                display: 'block',
                lineHeight: 0,
                marginTop: 0
            }}
            viewBox={`0 0 ${props.w} ${props.h}`}
        />
    </section>
}

export default SeamlessImg2
