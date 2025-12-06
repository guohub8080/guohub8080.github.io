import getTextImgPic1 from "../../../../api/placeHolderPic/getTextImgPic1.ts";
import getWechat300x300 from "../../../../api/placeHolderPic/getWechat300x300.ts";
import ImgEx from "../../basicEx/ImgEx.tsx";
import SectionEx from "../../basicEx/SectionEx.tsx"
import { mpBlank, mpGet, mpProps } from "../../../../styles/funcs/mp.ts";
import byDefault from "../../../../utils/common/byDefault.ts";


const WechatMoment = (props: {
    avatarUrl?: string
    mp?: mpProps
    name?: string
    contentText?: string
    pics?: { url: string, align: string }[]
}) => {
    const AVATAR_WIDTH = 50
    const CONTENT_X_GAP = 5
    const MAX_WIDTH = 400
    const avatarUrl = byDefault(props.avatarUrl, getWechat300x300(1))
    const name = byDefault(props.name, "张三")
    const contentText = byDefault(props.contentText, "这是一条朋友圈内容")
    const mpResult = mpGet(byDefault(props.mp, mpBlank))
    return (<SectionEx
        important={[["width", "100%"], ["min-width", "100%"], ["max-width", `${MAX_WIDTH}px`]]}
        style={{ ...mpResult, display: "flex", alignItems: "flex-start", flexWrap: "nowrap", justifyContent: "center", width: "100%", minWidth: "100%" }}>
        {/* 头像 */}
        <SectionEx style={{ width: AVATAR_WIDTH, height: AVATAR_WIDTH, minWidth: AVATAR_WIDTH, minHeight: AVATAR_WIDTH, borderRadius: 7, overflow: "hidden" }}>
            <ImgEx important={[["width", "100%"], ["height", "100%"]]} style={{width: "100%", height: "100%"}} url={avatarUrl}></ImgEx>
        </SectionEx>

        {/* 主区域 */}
        <SectionEx style={{ width: "100%", minHeight: 200, overflow: "hidden", paddingLeft: 10, }}>
            {/* 名字 */}
            <SectionEx style={{ width: "100%", height: 20, fontSize: 17, color: "#526c95", fontWeight: 800 }}>
                {name}
            </SectionEx>

            {/* 正文内容 */}
            <SectionEx style={{ width: "100%", height: "100%", fontSize: 16, marginTop: CONTENT_X_GAP, marginBottom: CONTENT_X_GAP }}>
                {contentText}
            </SectionEx>


        </SectionEx>

    </SectionEx>);
}

export default WechatMoment
