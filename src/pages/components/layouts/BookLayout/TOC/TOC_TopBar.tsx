import {ReactNode, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {css} from "@emotion/react";
import ReactIcon from "@comps/common/ReactIcon/ReactIcon.tsx";
import cssPresets from "@/styles/static/cssPresets.ts";
import {IconType} from "react-icons";
import {BiSolidDownArrow, BiSolidUpArrow} from "react-icons/bi";
import colorPresets from "@/styles/static/colorPresets.ts";
import useGlobalConfig from "@/configs/useGlobalConfig.ts";
import {TOC_type} from "@comps/layouts/BookLayout/types.ts";
import {useLocation, useWindowSize} from "react-use";

const b = <div>s</div>
const a: TOC_type = [
    {title: "nihao", link: "/ts-lib/introduction", content: b, indentLevel: 0,},
    {title: "nihao", link: "/home", content: b, indentLevel: 1,},
    {title: "nihao", link: "/home", content: b, indentLevel: 2,},
    {title: "nihao", link: "/home", content: b, indentLevel: 2,},
    {title: "nihao", link: "/home", content: b, indentLevel: 2,},
    {title: "nihao", link: "/home", content: b, indentLevel: 2,},
    {title: "nihao", link: "/home", content: b, indentLevel: 2,},
    {title: "nihao", link: "/home", content: b, indentLevel: 2,},
    {title: "nihao", link: "/home", content: b, indentLevel: 2,},
    {title: "nihao", link: "/home", content: b, indentLevel: 2,},
    {title: "nihao", link: "/home", content: b, indentLevel: 2,},
    {title: "nihao", link: "/home", content: b, indentLevel: 2,},
    {title: "nihao", link: "/home", content: b, indentLevel: 2,},
    {title: "nihao", link: "/home", content: b, indentLevel: 2,},
    {title: "nihao", link: "/home", content: b, indentLevel: 2,},
    {title: "nihao", link: "/home", content: b, indentLevel: 2,},
    {title: "nihao", link: "/home", content: b, indentLevel: 2,},
    {title: "nihao", link: "/home", content: b, indentLevel: 2,},
    {title: "nihao", link: "/home", content: b, indentLevel: 2,},
    {title: "nihao", link: "/home", content: b, indentLevel: 2,},
    {title: "nihao", link: "/home", content: b, indentLevel: 2,},
    {title: "nihao", link: "/home", content: b, indentLevel: 2,},
    {title: "nihao", link: "/home", content: b, indentLevel: 2,},
    {title: "nihao", link: "/home", content: b, indentLevel: 2,},
    {title: "nihao", link: "/home", content: b, indentLevel: 2,},
    {title: "nihao", link: "/home", content: b, indentLevel: 2,},
    {title: "nihao", link: "/home", content: b, indentLevel: 2,},
    {title: "nihao", link: "/home", content: b, indentLevel: 3,},
    {title: "nihao", link: "/home", content: b, indentLevel: 4,},
    {title: "nihao", link: "/home", content: b, indentLevel: 1,},

]
const topBarCenter_css = (isBarTOC: boolean) => css({
    ...cssPresets.flexCenter,
    paddingRight: 17, paddingLeft: 17,
    paddingTop: 12, paddingBottom: 12,
    borderRadius: 10,
    transition: "all ease 0.1s",
    gap: 10,
    cursor: isBarTOC ? "pointer" : "default",
    userSelect: "none",
    "& .pageTitle": {
        fontSize: isBarTOC ? 18 : 20,
        color: "222222"
    },
    "&:hover": {
        backgroundColor: isBarTOC ? "#efefef" : ""
    }

})
const TOC_TopBar = (props: {
    imgSrc?: ReactNode | any
    iconComp?: IconType | any
    title: string
    isBarTOC: boolean,
    tocContent: TOC_type
}): ReactNode => {
    const globalConfig: any = useGlobalConfig()
    const topTOCContent_css = css({
        width: "100%",
        height: "calc(100vh - 68px)",
        overflowY: "hidden",
        overflowX: "hidden",
        backgroundColor: "#ffffff",
        zIndex: 999,
        position: "fixed",
        top: globalConfig.topBarHeight,
        left: 0
    })
    const topTOCTitle_css = css({
        fontSize: 18,
        height: 50,
        ...cssPresets.flexCenter,
        backgroundColor: "#f5f5f5",
        borderTopWidth: 1,
        borderTopStyle: "solid",
        borderTopColor: "#d5d5d5",
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
        borderBottomColor: "#d5d5d5"
    })

    const topTOCUnderTitleFrame_css = css({
        height: `calc(100vh - ${globalConfig.topBarHeight}px - 50px)`,
        width: "100%",
        backgroundColor: globalConfig.backgroundColor,
        overflowY: "scroll",
        display: "block"
    })

    const eachTOCTitle_css = (isSelected: boolean, indentLevel: number) => css({
        width: "100%",
        height: 45,
        ...cssPresets.flexCenter,
        justifyContent: "start",
        paddingLeft: 15 + indentLevel * 20,
        color: isSelected ? "#ffffff" : "#444444",
        borderBottomStyle: "solid",
        borderBottomWidth: 1,
        borderBottomColor: "#efefef",
        backgroundColor: isSelected ? colorPresets.logoLightBlue : "white",
        transition: "all ease 0.2s",
        "&:hover": {
            backgroundColor: "#efefef",
            color: "#444444"
        }
    })
    const [isTopTOCOpen, setIsTopTOCOpen] = useState(false)
    const windowSize = useWindowSize()
    useEffect(() => {
        setIsTopTOCOpen(false)
    }, [windowSize])

    const switchTopBarTOC = () => setIsTopTOCOpen(!isTopTOCOpen)
    const WhenShowInBar = (props: { isShow: boolean, toc: TOC_type }) => {
        const navigate = useNavigate()
        const now = useLocation()
        console.log(now.hash.slice(1, now.hash.length))
        return <div>
            {!props.isShow && <BiSolidDownArrow size={14} color={colorPresets.logoDarkBlue}/>}
            {props.isShow && <BiSolidUpArrow size={14} color={colorPresets.logoDarkBlue}/>}
            <div hidden={!props.isShow} css={topTOCContent_css}>
                <div css={topTOCTitle_css}>目录</div>
                <div css={topTOCUnderTitleFrame_css}>
                    {props.toc && props.toc.map((x, y) => {
                        return <div css={eachTOCTitle_css(x.link === now.hash.slice(1, now.hash.length), x.indentLevel)}
                                    key={y} onClick={() => {
                            navigate(x.link)
                            setIsTopTOCOpen(false)
                        }}>
                            {x.title}
                        </div>
                    })}
                </div>
            </div>
        </div>
    }
    return <div css={topBarCenter_css(props.isBarTOC)}>
        <ReactIcon imgSrc={props.imgSrc} iconComp={props.iconComp} size={35}/>
        <div className="pageTitle" onClick={switchTopBarTOC}>{props.title}</div>
        {props.isBarTOC && <WhenShowInBar isShow={isTopTOCOpen} toc={a}/>}
    </div>
}

export default TOC_TopBar