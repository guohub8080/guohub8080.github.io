/* eslint-disable no-mixed-spaces-and-tabs */
import wechatColors from "../../../../assets/colors/wechatColors.ts";
import byDefault from "../../../../utils/common/byDefault.ts";
import FootAIECOWithoutTop from "../foots/FootAIECOWithoutTop.tsx";
import EachMention from "./EachMention.tsx";
import { UnderTitleItem } from "./types.ts";
import { AIECO_LOGO } from "./constants.ts";

interface AIECO_OnlyCardProps {
    borderRadius?: number;
    theme?: "red" | undefined;
    underTitle: UnderTitleItem[];
}

/**
 * AIECO 纯卡片组件
 * 只包含底部信息卡片，没有正文内容区域
 * 布局：上部内容区 -> 中间装饰条 -> 底部徽章
 */
const AIECO_OnlyCard = (props: AIECO_OnlyCardProps) => {
    const borderRadius = byDefault(props.borderRadius, 8);
    const borderColor = "#d1d5db";
    
    let lightBarColor = wechatColors.aiecoLightBlue;
    let darkBarColor = wechatColors.aiecoDarkBlue;
    let titleUnderColor = "#bfdbfe";
    
    if (props.theme === "red") {
        lightBarColor = "#fbbf24";
        darkBarColor = wechatColors.titleRed;
        titleUnderColor = "#fde68a";
    }

    return (
        <section style={{ marginBottom: 0 }}>
            {/* 上部白色内容区 - EachMention */}
            <section style={{
                width: "100%",
                backgroundColor: "white",
                paddingTop: 35,
                paddingBottom: 40,
                borderStyle: "solid",
                borderWidth: 1,
                borderColor: borderColor,
                borderTopLeftRadius: borderRadius,
                borderTopRightRadius: borderRadius,
                borderBottom: "none",
                
            }}>
                {props.underTitle.map((x, y) => (
                    <EachMention
                        title={x.title}
                        name={x.name}
                        key={y}
                        titleUnderColor={titleUnderColor}
                        titleColor={darkBarColor}
                    />
                ))}
            </section>

            {/* 钻石徽章容器 - 浮在装饰条上 */}
            <section style={{
                width: "100%",
                height: 0,
                translate: "0 -10px",
            }}>
                <section style={{
                    width: 25,
                    height: 30,
                    margin: "0 auto",
                    backgroundColor: darkBarColor,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                }}>
                    <section style={{
                        width: 19,
                        height: 24,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                        backgroundColor: "#f1f5f9"
                    }}>
                        <img
                            src={AIECO_LOGO}
                            style={{ width: 10, height: "fit-content" }}
                            referrerPolicy="no-referrer"
                            alt=""
                        />
                    </section>
                </section>
            </section>

            {/* 中间装饰条 */}
            <section style={{ width: "100%", display: "block", marginTop: 0 }}>
                <section style={{
                    width: "100%",
                    height: 3,
                    backgroundColor: lightBarColor
                }}></section>
                <section style={{
                    width: "100%",
                    height: 5,
                    backgroundColor: darkBarColor
                }}></section>
            </section>

            {/* 底部白色区域 */}
            <section style={{
                width: "100%",
                backgroundColor: "white",
                paddingTop: 0,
                paddingBottom: 0,
                borderStyle: "solid",
                borderWidth: 1,
                borderTop: 0,
                borderBottom:0,
                borderColor: borderColor,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
            }}>
            </section>

            {/* 页脚 */}
            <FootAIECOWithoutTop />
        </section>
    );
};

export default AIECO_OnlyCard;

