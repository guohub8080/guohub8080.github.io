import {css} from "@emotion/react";
import cssPresets from "@styles/static/cssPresets.ts";
import ReactIcon from "../../common/ReactIcon/ReactIcon.tsx";
import {FiArrowLeft, FiArrowRight} from "react-icons/fi";
import colorPresets from "../../../styles/static/colorPresets.ts";
import {useNavigate} from "react-router-dom";

const btmNavFrame_css = (isForbidden: boolean) => css({
    borderRadius: 5,
    borderWidth: 1,
    position: "relative",
    borderStyle: "solid",
    borderColor: "#ececec",
    boxSizing: "border-box",
    visibility: isForbidden ? "hidden" : "normal",
    backgroundColor: isForbidden ? "#ececec" : "white",
    width: 220,
    minWidth: 200,
    height: 80,
    "transition": "all ease 0.1s",
    ...cssPresets.flexCenter,
    "&:hover": {
        cursor: isForbidden ? "not-allowed" : "pointer",
        borderColor: isForbidden ? "" : "#cccccc",
        backgroundColor: isForbidden ? "" : "#f3f3f3"
    }
})

const btmNavTitleFrame = (isLeft: boolean, isForbidden: boolean) => css({
    width: "100%",
    "& div": {
        textAlign: isLeft ? "right" : "left",
        paddingLeft: 15,
        paddingRight: 15
    },
    "& div:first-of-type": {
        fontSize: 12,
        marginBottom: 3,
        color: "#707070",
    },
    "& div:last-of-type": {
        fontSize: 18,
        color: isForbidden ? "gray" : colorPresets.logoDarkBlue,
    },

})
const BtmNavigator = (props: {
    direction: "pre" | "next",
    title?: string,
    isForbidden: boolean,
    clickLink?: string
}) => {
    const arrowGap = 10
    const arrowColor = props.isForbidden ? "#656565" : colorPresets.logoDarkBlue
    const navigate = useNavigate()
    const handleClick = () => {
        if (props.clickLink) navigate(props.clickLink)
    }
    if (props.direction === "pre") {
        return <div css={btmNavFrame_css(props.isForbidden)} onClick={handleClick}>
            <ReactIcon color={arrowColor} size={30}
                       style={{position: "absolute", left: arrowGap}}
                       iconComp={FiArrowLeft}/>
            <div css={btmNavTitleFrame(true, props.isForbidden)}>
                <div>上一篇</div>
                <div>{props.title ? props.title : "暂无"}</div>
            </div>
        </div>
    }
    return <div css={btmNavFrame_css(props.isForbidden)} onClick={handleClick}>
        <ReactIcon color={arrowColor} size={30}
                   style={{position: "absolute", right: arrowGap}}
                   iconComp={FiArrowRight}/>
        <div css={btmNavTitleFrame(false, props.isForbidden)}>
            <div>下一篇</div>
            <div>{props.title ? props.title : "暂无"}</div>
        </div>
    </div>
}

export default BtmNavigator