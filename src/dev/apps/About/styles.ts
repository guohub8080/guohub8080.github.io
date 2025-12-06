import cssPresets from "@/assets/styles/cssPresets.ts";
import {css} from "@emotion/react";


const mainFrame = (globalConfig) => css({
    width: "100%",
    overflowX: "hidden",
    backgroundColor: "#a9a9a9"
})

const bgFrame = (globalConfig) => css({
    width: "100%",
    height: 100,
    // marginTop:globalConfig.topBarHeight,
    top: 0,
    // position: "absolute",
    backgroundColor: "wheat",
    opacity: 0.5
})
const personal = props => {
    return css({
        position: "absolute",
        left: 0,
        right: 0,
        ...cssPresets.flexCenter,
        fontSize: 60,
        paddingTop: 270,
        // marginTop:100,
        textAlign: "center",
        // backgroundColor: "white",
        zIndex: 100,
        // backgroundColor:"#ffffffaa",
        // padding: 20,
        // paddingTop:10,paddingBottom:10,
        color: "#262626",
        borderRadius: 5,

    })
}
const backHome = css({
    position: "absolute",
    marginLeft: 20,
    marginTop: 5, backgroundColor: "#dcdcdc",
    borderRadius: 4,
    padding: 8,
    paddingLeft: 10,
    paddingRight: 10,
    color: "#858585",
    cursor: "pointer",
    fontSize: 13,
    transition: "all ease 0.2s",
    "&:hover": {
        backgroundColor: "#ffffff",
        color: "#0150b4"
    }
})
const navTitle = props => {
    return css({
        fontSize: 22,
        textAlign: "left",
        fontWeight: 500
    })
}
export default {mainFrame, bgFrame, personal, navTitle, backHome}
