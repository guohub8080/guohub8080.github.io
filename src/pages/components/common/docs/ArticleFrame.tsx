import {ReactNode, useEffect} from "react";
import hljs from "highlight.js/lib/core";
import {css} from "@emotion/react";

const ArticleFrame = (props: {
    children?: ReactNode
}) => {
    useEffect(() => {
        hljs.configure({ignoreUnescapedHTML: true})

        const codes = document.querySelectorAll("pre code")
        codes.forEach((el) => {
            hljs.highlightElement(el as HTMLElement)
        })
        // hljs.highlightAll()
    }, [])
    return <div css={homeBg_css}>
        {props.children}
    </div>
}
export default ArticleFrame
const homeBg_css = css({
    maxWidth: 700,
    display: "block",
    textAlign: "justify",
    margin: "0 auto",
    backgroundColor: "white",
    padding: 10,
    paddingLeft: 30, paddingRight: 30,
    "& p": {
        textAlign: "justify",
        lineHeight: 1.7,
    }
})