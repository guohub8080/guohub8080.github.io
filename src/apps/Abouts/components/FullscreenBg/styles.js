import {css} from "@emotion/react";

const bgFrame = css({
    position: "fixed",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: "100%",
    height: "calc(100vh)",
    overflowX: "hidden",
    overflowY: "hidden",
    zIndex: -1,
    // backgroundColor: "aqua"
})

const mask = (maskTransparency = 0.2) => {
    return css({
        width: "100%",
        height: "100%",
        backgroundColor: "black",
        opacity: maskTransparency,
        position: "absolute",
        transition: "opacity ease 0.5s"
    })
}

const bgPicFrame = css({
    userSelect: "none",
    // backgroundColor:"white",
    // zIndex: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "100%",
    height: "100%"
})
const bgPic = (w, h) => {
    return css({
        width: w,
        height: h,
        userSelect: "none",
    })
}
export default {bgFrame, mask, bgPic, bgPicFrame}
