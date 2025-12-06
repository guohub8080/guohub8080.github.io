import { mpBlank, mpGet, mpProps } from "../../../../styles/funcs/mp.ts"
import byDefault from "../../../../utils/common/byDefault.ts"
import type { CSSProperties } from 'react'
import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx"
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx"
import svgURL from "../../../PubUtils/common/svgURL.ts"


const ZeroHeightImg = (props: {
    url: string,
    mp?: mpProps
    isForcePriority?: boolean
}) => {
    const isForcePriority = byDefault(props.isForcePriority, false)
    const mpResult = mpGet(byDefault(props.mp, mpBlank))

    const svgStyle: CSSProperties = {
        backgroundImage: svgURL(props.url),
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat',
        display: 'block',
    }

    // 开启了强制优先
    if (isForcePriority) {
        const innerForcedStyle: CSSProperties = {
            ...innerStyle,
            transform: 'scale(1)'
        }
        return (
            <SectionEx data-label="zero-height-img" style={{ ...mpResult, ...outerStyle }}>
                <section
                    style={innerForcedStyle}
                >
                    <SvgEx style={svgStyle} viewBox="0 0 0 0" />
                </section>
            </SectionEx>
        )
    }

    //未开启强制优先
    return (
        <SectionEx data-label="zero-height-img" style={{ ...mpResult, ...outerStyle }}>
            <section
                style={innerStyle}
            >
                <SvgEx style={svgStyle} viewBox="0 0 0 0" />
            </section>
        </SectionEx>
    )
}

export default ZeroHeightImg




/**  ================================================== Style ===================================================== */
const outerStyle: CSSProperties = {
    WebkitTouchCallout: 'none',
    userSelect: 'text',
    overflow: 'hidden',
    textAlign: 'center',
    lineHeight: 0,
}

const innerStyle: CSSProperties = {
    textAlign: 'center',
    height: 0,
    lineHeight: 0,
    width: '100%',
    margin: '0 auto',
    marginTop: 0,
}
