import { CSSProperties } from "react"
import svgURL from "../../../PubUtils/common/svgURL.ts"
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx"

const SeamlessImg7 = (props: { w: number, h: number, url: string, mpResult: CSSProperties }) => {
    return <section
        data-label="seamless-img-long-press-only"
        style={{
            WebkitTouchCallout: 'none',
            userSelect: 'text',
            overflow: 'hidden',
            textAlign: 'center',
            lineHeight: 0,
            ...props.mpResult
        }}
    >
        {/* 透明的 img，用于长按识别 */}
        <section style={{ 
            lineHeight: 0, 
            fontSize: 0, 
            height: 0, 
            position: 'relative' 
        }}>
            <img 
                style={{ 
                    width: '100%', 
                    pointerEvents: 'painted',
                    verticalAlign: 'top', 
                    opacity: 0 
                }} 
                src={props.url} 
            />
        </section>
        
        {/* 实际显示的 svg 背景图，不可点击弹出 */}
        <SvgEx
            style={{
                backgroundImage: svgURL(props.url),
                backgroundSize: '100%',
                backgroundRepeat: 'no-repeat',
                display: 'block',
                lineHeight: 0,
                transform: 'scale(1)',
                marginTop: 0,
                pointerEvents: 'none'
            }}
            viewBox={`0 0 ${props.w} ${props.h}`}
        />
    </section>
}

export default SeamlessImg7

