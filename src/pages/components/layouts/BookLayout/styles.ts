// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import {css} from "@emotion/react";

const innerBookFrame_css = (paddingLeft: number, isTOCDisplayed: boolean) => css({
    width: "100%", paddingLeft: paddingLeft,
    paddingTop: isTOCDisplayed ? 20 : 10,
    paddingBottom: isTOCDisplayed ? 20 : 0,
})


const innerBookRightDiv_css = (isTOCDisplayed: boolean) => css({
    width: "100%",
    borderRadius: isTOCDisplayed ? 12 : "5px 5px 0 0",
    backgroundColor: "white",
    overflow: "hidden",
    borderStyle: "solid",
    borderColor: "#d0d0d0",
    borderWidth: isTOCDisplayed ? 1 : 0,
    display: "block",
})

const articleMainFrame_css = (paddingX: number) => css({
    width: "100%",
    paddingLeft: paddingX,
    paddingRight: paddingX
})
const btmNavigatorFrame_css = css({
    display: "flex",
    paddingLeft: 20,
    width: "100%",
    marginBottom: 20,
    marginTop: 60,
    justifyContent: "space-between",
    paddingRight: 20
})

export default {innerBookFrame_css, innerBookRightDiv_css, btmNavigatorFrame_css,articleMainFrame_css}