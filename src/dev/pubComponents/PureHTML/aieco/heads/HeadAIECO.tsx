/* eslint-disable no-mixed-spaces-and-tabs */
import wechatColors from "../../../../assets/colors/wechatColors.ts";

const aiecoLogo = "https://mmbiz.qpic.cn/sz_mmbiz_png/S6lhSUeSxeNcEj5BE0o1d3EnnEicoplMhTDc0KYoNoLplKb9FiaBSsicDN1Dh7YteR5YuAoMCmbQJlZ76LAJZreibQ/0?wx_fmt=png&from=appmsg"

const HeadAIECO = () => {
    const fontSize = 12
    const fontColor = wechatColors.aiecoDarkBlue
    return <section style={{width: "100%", display: "flex", alignItems: "start", marginBottom: 8}}>

        <section>
            <img src={aiecoLogo} style={{width: 35, margin: 2, marginRight: 5}}
                 referrerPolicy="no-referrer" alt=""/>
        </section>
        <section style={{fontSize: fontSize, color: fontColor, paddingTop: 3}}>
            <span style={{color: "gray", fontSize: fontSize}}>点击上方蓝字关注</span>
            <span style={{fontSize: fontSize}}>商务部经济合作局</span>
        </section>

    </section>
}
export default HeadAIECO
