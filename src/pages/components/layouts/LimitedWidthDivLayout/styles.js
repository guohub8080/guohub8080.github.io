import {css} from "@emotion/react";
import global from "@/configs/useGlobalConfig.ts";
import cssPresets from "@/styles/static/cssPresets.ts";

const outerBlock = (outFrameBgColor = "none") => {
    return css({
        backgroundColor: outFrameBgColor,
        // backgroundColor: "blueviolet",
        height:"fit-content",
        width: "100%",
        overflowX: "hidden"
    })
}

const innerBlock = global => css({
    // backgroundColor: "blueviolet",
    marginTop: 0,
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    maxWidth: global.projectMaxWidth,
    paddingLeft: global.pagePaddingX,
    paddingRight: global.pagePaddingX,
})

export default {outerBlock, innerBlock}