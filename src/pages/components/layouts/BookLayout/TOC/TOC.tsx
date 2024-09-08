import {css} from "@emotion/react";

import ReactIcon from "../../../common/ReactIcon/ReactIcon.tsx"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import useGlobalConfig from "@/configs/useGlobalConfig.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import {ReactElement} from "react";
import {BiBookContent} from "react-icons/bi";
import {TOC_type} from "@comps/layouts/BookLayout/types.ts";
import {useNavigate} from "react-router-dom";
import {useLocation} from "react-use";
import styles from "./styles.ts"


const toc_title_css = css({
    display: "flex", justifyContent: "center", alignItems: "center", gap: 5
})


const toc_underTitle_css = css({
    top: 48, bottom: 0, left: 0, right: 0, position: "absolute",
    overflowY: "auto", paddingBottom: 5
})

const TOC = (props: {
    tocWidth: number,
    content: TOC_type
}): ReactElement => {
    const globalConfig: any = useGlobalConfig()
    const navigate = useNavigate()
    const location = useLocation()


    return (<>
        <div css={styles.tocFrame_css(props.tocWidth, globalConfig.topBarHeight)}>
            <h1>
                <div css={toc_title_css}>
                    <ReactIcon iconComp={BiBookContent} size={22}/>
                    <span>目录</span>
                </div>
            </h1>
            <div css={toc_underTitle_css}>
                {props.content.map((x, y) => {
                    return <div key={y}
                                css={styles.eachLink_css(x?.indentLevel,
                                    location.hash.slice(1) === x.link)}
                                onClick={() => navigate(x.link)}>
                        {x.title}
                    </div>
                })}
            </div>
        </div>
    </>)
}

// eslint-disable-next-line react-refresh/only-export-components
export default TOC