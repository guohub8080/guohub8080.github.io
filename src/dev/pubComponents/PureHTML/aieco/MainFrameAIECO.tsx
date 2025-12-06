/* eslint-disable no-mixed-spaces-and-tabs */
import {ReactNode, useEffect, useRef} from "react";
import HeadAIECO from "./heads/HeadAIECO.tsx";


const MainFrameAIECO = (props: {
    children?: ReactNode,
    bgColor?: string,
    headNode?: ReactNode,
    footNode?: ReactNode
}) => {
    const ref = useRef(null)
    useEffect(() => {
        if (ref) {
            ref.current.style.setProperty("max-width", "650px", "important")
        }
    }, [])
    return <section className="Wechat HTML Edit Tool powered by guozhongtian."
                    data-tool-by="gzt"
                    ref={ref}
                    html-editor-name="guo zhongtian"
                    style={{maxWidth: 650, margin: "0 auto"}}>
        {props.headNode || <HeadAIECO/>}
        <section>
            {props.children}
        </section>
        <section>
            {props.footNode}
        </section>

    </section>
}

export default MainFrameAIECO

