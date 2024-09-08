import {css} from "@emotion/react";
import colorPresets from "@/styles/static/colorPresets.ts";

const eachLink_css = (indentLevel = 0, isSelected: boolean = false) => {
    return css({
        paddingLeft: 10,
        marginLeft: 3 + indentLevel * 13,
        marginRight: 0,
        color: isSelected ? "white" : "#444444",
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: isSelected ? colorPresets.logoLightBlue : "",
        borderRadius: 5,
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
        borderBottom: "1px #eeeeee solid",
        transition: "0.2s all ease",
        textAlign: "left",
        fontSize:15,
        "&:hover": {
            cursor: "pointer",
            backgroundColor: isSelected ? colorPresets.logoLightBlue : "#eeeeee",

        }
    })
}
const tocFrame_css = (tocWidth: number, topBarHeight: number) => css({
    width: tocWidth,
    backgroundColor: "#ffffff",
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
    borderColor: "#d3d3d3",
    boxSizing: "border-box",
    borderStyle: "solid",
    height: `calc(100vh - ${topBarHeight + 40}px)`,
    position: "fixed",
    "& h1": {
        fontSize: 17, fontWeight: "normal", marginBottom: 10,
        height: 45,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        userSelect: "none",
        backgroundColor: "#f1f2f5",
        borderBottomWidth:1,
        borderBottomStyle:"solid",
        borderBottomColor:"#d3d3d3",
        color: colorPresets.logoDarkBlue,
        boxSizing: "border-box",
    },
})

export default {eachLink_css, tocFrame_css}