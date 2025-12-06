import wechatColors from "../../../assets/colors/wechatColors.ts";

const s = "https://ts1.cn.mm.bing.net/th/id/R-C.076b39005527c1885eb0b8656d483b28?rik=u2%2fbeEw6hiBBRA&riu=http%3a%2f%2fpic.ntimg.cn%2ffile%2f20160113%2f18956475_151922511724_2.jpg&ehk=gI09pMG%2fIezIDZh9Mgo%2bFAHZ27tsvmeipiFP7FDwbfU%3d&risl=&pid=ImgRaw&r=0"
const VideoFrame = (props: {
    logoPic?: string
    w?: number
    h?: number
}) => {
    return <section style={{width: "100%", marginBottom: 20}}>
        <section>
            <section style={{height: 50}}>
                <section style={{
                    width: 150,
                    height: 60,
                    borderRadius: 999,
                    backgroundColor: "white",
                    margin: "0 auto",
                    translate: "0 22px",
                    zIndex: 999,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: `5px ${wechatColors.darkBgYellow} solid`,
                    padding: 10

                }}>
                    <img src={props.logoPic || s} style={{width: props.w || 80, height: "fit-content"}} alt=""
                         referrerPolicy="no-referrer"/>
                </section>
            </section>


            <section
                style={{
                    width: "100%",
                    backgroundColor: wechatColors.darkBgYellow,
                    borderRadius: 8,
                    padding: 20,
                    paddingTop: 40,
                    paddingBottom: 30
                }}>
                <section style={{width: "100%", height: "100%", backgroundColor: "white", borderRadius: 8}}>
                    <img
                        style={{width:"100%",height:"fit-content"}}
                        src="http://mmbiz.qpic.cn/sz_mmbiz_jpg/S6lhSUeSxeO6OeSRRuJmicE7L7lkOZZbg2ge50hKtb4ibzn1exib5PH2b7Ih8JCULVQyhP8HO8QtkwaGsgWTgqcAg/0?wx_fmt=jpeg&quot;"
                        alt=""
                        referrerPolicy="no-referrer"/>
                </section>
            </section>
        </section>

    </section>
}

export default VideoFrame
