import {css} from "@emotion/react";


const underBarContent = (global, bgColor) => {
    const height = `calc(100vh - ${global.topBarHeight}px)`
    return css({
        // backgroundColor: "gray",
        marginTop: global.topBarHeight,
        backgroundColor: bgColor ? bgColor : "white",
        width: "100%",
        minHeight: height,
        height: height,
        maxHeight: height,
        overflowY: "auto",
    })
}


export default {underBarContent}