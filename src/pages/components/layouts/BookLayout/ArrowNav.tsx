import {TOC_type} from "@comps/layouts/BookLayout/types.ts";
import {useLocation} from "react-use";
import {collect} from "collect.js";
import ReactIcon from "@comps/common/ReactIcon/ReactIcon.tsx";
import {BiChevronRight} from "react-icons/bi";
import colorPresets from "@/styles/static/colorPresets.ts";
import {css} from "@emotion/react";
import cssPresets from "@/styles/static/cssPresets.ts";
import {Divider} from "antd";


const TitleWithArrow = (props: {
    isShowRight: boolean,
    title: string
}) => {
    return <div css={css({...cssPresets.flexCenter})}>
        <div style={{fontSize: 15}}>{props.title}</div>
        {props.isShowRight && <div css={css({
            width: 25, ...cssPresets.flexCenter
        })}>
            <ReactIcon color={colorPresets.logoDarkBlue} iconComp={BiChevronRight} size={25}/>
        </div>}
    </div>
}
const arrowFrame_css = css({
    display: "flex",
    marginTop: 10,
    width: "fit-content",
    flexWrap: "wrap",
    paddingTop: 5,
    color: colorPresets.logoDarkBlue,
    paddingBottom: 5,
    // backgroundColor: "#f6f6f6",
    borderWidth: 1,
    // borderStyle: "solid",
    // borderColor: "#d7d7d7",
    // marginBottom: 15,
    justifyContent: "start",
    // paddingLeft: 15,
    paddingRight: 15,
    userSelect: "none",
    marginLeft: 20,
    marginRight: 15,
    borderRadius: 7,
    alignItems: "center"
})

const articleTitle_css = css({
    textAlign: "left",
    marginLeft: 20,
    marginRight: 20,
    paddingRight: 20,
    marginTop: 20,
    marginBottom: -10,
    fontSize: 40,
    fontWeight: 700,
    color: "#343434",

})
const ArrowNav = (props: {
    mainTitle: string,
    toc: TOC_type
}) => {
    const location = useLocation()
    const currentLink = location.hash.slice(1)
    const currentTOC = collect(props.toc).where("link", currentLink).first()
    if (!currentTOC) return <div></div>
    if (currentTOC.indentLevel === 0) {
        return <div>
            <div css={arrowFrame_css}>
                <TitleWithArrow title={props.mainTitle} isShowRight={true}/>
                <TitleWithArrow title={currentTOC.title} isShowRight={false}/>
            </div>
            <div css={articleTitle_css}>{currentTOC.title}</div>
            <Divider/>
        </div>
    }

    const titleList = []

    for (let i = 0; i < props.toc.length; i++) {
        console.log(props.toc[i].title, props.toc[i].indentLevel)
        if (props.toc[i].link === currentLink) {
            titleList[props.toc[i].indentLevel] = props.toc[i].title
            break
        }
        if (props.toc[i].indentLevel <= currentTOC.indentLevel) {
            titleList[props.toc[i].indentLevel] = props.toc[i].title
        }
    }
    console.log(titleList)
    return <div>
        <div css={arrowFrame_css}>
            {[props.mainTitle].concat(titleList).map((x, y) => {
                console.log(titleList.length)
                if (y < titleList.length) return <TitleWithArrow key={y} title={x} isShowRight={true}/>
                return <TitleWithArrow key={y} title={x} isShowRight={false}/>
            })}
        </div>
        <div css={articleTitle_css}>{currentTOC.title}</div>
        <Divider/>
    </div>

}

export default ArrowNav