import wechatColors from "../../../../assets/colors/wechatColors.ts";
import FootAIECOWithoutTop from "../foots/FootAIECOWithoutTop.tsx";
import EachMention from "./EachMention.tsx";
import { ArticleBottomProps } from "./types.ts";
import { AIECO_LOGO } from "./constants.ts";
import SectionEx from "../../basicEx/SectionEx.tsx";

const ArticleBottom = (props: ArticleBottomProps) => {
    return (
        <section style={{ width: "100%", margin: "0 auto" }}>
            {/* 局Logo钻石图标 */}
            <section style={{
                width: "100%",
                height: 0,
                translate: "0 14px",
            }}>
                <section style={{
                    width: 25,
                    height: 30,
                    margin: "0 auto",
                    backgroundColor: wechatColors.aiecoDarkBlue,
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

            {/* 横线 */}
            <section style={{ width: "100%", display: "block", marginTop: 25 }}>
                <section style={{
                    width: "100%",
                    height: 3,
                    backgroundColor: props.lightColor
                }}></section>
                <section style={{
                    width: "100%",
                    height: 5,
                    backgroundColor: props.darkColor
                }}></section>
            </section>

            {/* 白色底框 */}
            <SectionEx important={[["background-color", "white"]]} style={{
                width: "100%",
                backgroundColor: "white",
                paddingTop: 35,
                paddingBottom: 5,
                borderStyle: "solid",
                borderWidth: 1,
                borderTop: 0,
                borderColor: props.borderColor,
            }}>
                {/* 编辑栏 */}
                {props.underTitle.map((x, y) => (
                    <EachMention
                        title={x.title}
                        name={x.name}
                        key={y}
                        titleUnderColor={props.titleUnderColor}
                        titleColor={props.darkColor}
                    />
                ))}
            </SectionEx>

            <FootAIECOWithoutTop />
        </section>
    );
};

export default ArticleBottom;

