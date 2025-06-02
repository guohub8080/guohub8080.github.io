import beian from "../icons/beian.svg"
import zone from "../icons/zone.svg"
import webName from "../icons/webName.svg"
import lineRoad from "../icons/lineRoad.svg"
import {css} from "@emotion/react";
import {Divider} from "antd";

const eachCell_css = css({
    borderColor: "#d7d7d7",
    backgroundColor: "white", borderRadius: 8, borderStyle: "solid",
    borderWidth: 1, padding: 10, paddingTop: 12, paddingBottom: 12,
    width: 240
})
const Certificate = () => {
    const iconSize = 40
    const titleFontSize = 15
    return <div>
        <Divider>网站备案公示</Divider>
        <div style={{display: "flex", justifyContent: "center", paddingLeft: 20, paddingRight: 20}}>
            <div style={{
                width: "fit-content",
                padding: 5,
                gap: 15,
                flexWrap: "wrap",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <div css={eachCell_css}>
                    <img src={beian} style={{width: iconSize}} alt=""/>
                    <div style={{fontSize: titleFontSize, marginBottom: 5, marginTop: 2}}>备案号</div>
                    <div style={{color: "gray", fontSize: 14}}>
                        <div>京ICP备2023017358号-1</div>
                    </div>
                </div>
                <div css={eachCell_css}>
                    <img src={zone} style={{width: iconSize}} alt=""/>
                    <div style={{fontSize: titleFontSize, marginBottom: 5, marginTop: 2}}>网站内容</div>
                    <div style={{color: "gray", fontSize: 14}}>
                        <div>博客/个人空间</div>
                    </div>
                </div>
            </div>
        </div>
        <div style={{display: "flex", justifyContent: "center", paddingLeft: 20, paddingRight: 20}}>
            <div style={{
                width: "fit-content",
                padding: 5,
                gap: 15,
                flexWrap: "wrap",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <div css={eachCell_css}>
                    <img src={webName} style={{width: iconSize}} alt=""/>
                    <div style={{fontSize: titleFontSize, marginBottom: 5, marginTop: 2}}>域名</div>
                    <div style={{color: "gray", fontSize: 14}}>
                        <div>guohub.top</div>
                    </div>
                </div>
                <div css={eachCell_css}>
                    <div style={{width:iconSize,height:iconSize,display:"flex",justifyContent:"center",alignItems:"center",margin:"0 auto"}}>
                        <img src={lineRoad} style={{width: 33}} alt=""/>
                    </div>

                    <div style={{fontSize: titleFontSize, marginBottom: 5, marginTop: 2}}>服务类型</div>
                    <div style={{color: "gray", fontSize: 14}}>
                        <div>网站应用服务</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default Certificate