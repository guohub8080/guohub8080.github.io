import { CSSProperties } from "react";
import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx";
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx";
import svgURL from "../../../PubUtils/common/svgURL.ts";

const UnpopButCanLongPress = (props: { url: string ,w:number,h:number}) => {
  return <>
    <SectionEx
      style={{ margin: "0 auto", pointerEvents: "none" }}
      important={[["max-width", "100%"], ["width", "100%"], ["height", "auto"]]}
      {...{ "enable-z-optimization": "true" }}
    >
      <section style={{ overflow: "hidden", WebkitTapHighlightColor: "transparent" as any }}>
        <section style={{ fontSize: 0, height: 0, opacity: 0 }}>
          <p>&nbsp;</p>
        </section>
        <section style={{ pointerEvents: "none" }}>
          <section style={{ fontSize: 0 }}>
            <section style={{ fontSize: 0 }}>
              <section style={{ transform: "scale(1)", marginTop: 0 }}>
                <section style={{ lineHeight: 0, fontSize: 0, height: 0 }}>
                  <section style={{ lineHeight: 0, fontSize: 0, height: 0, textAlign: "left" }}>
                    <section style={{ display: "inline-block", width: "100%", transformOrigin: "top" as any }}>
                      <img style={{ width: "100%", pointerEvents: "painted" as unknown as CSSProperties["pointerEvents"], verticalAlign: "top", opacity: 0 }} src={props.url} />
                    </section>
                  </section>
                </section>
                <section style={{ pointerEvents: "none" }}>
                  <SvgEx opacity={1}
                  
                       style={{
                         transform: "scale(1)",
                         display: "inline-block",
                         verticalAlign: "top",
                         width: "100%",
                         backgroundImage: svgURL(props.url),
                         backgroundSize: "100% 100%",
                         backgroundRepeat: "no-repeat",
                         backgroundAttachment: "scroll" as any,
                         WebkitTapHighlightColor: "transparent" as any,
                         userSelect: "none" as any,
                       }} viewBox={`0 0 ${props.w} ${props.h}`} />
                </section>
              </section>
            </section>
          </section>
        </section>
        <section style={{ height: 1, marginTop: -1 }}>
          <br />
        </section>
      </section>
    </SectionEx>
    <section style={{ fontSize: 0, visibility: "hidden", marginBottom: 0 }}>
      <br />
    </section>
  </>
}

export default UnpopButCanLongPress
