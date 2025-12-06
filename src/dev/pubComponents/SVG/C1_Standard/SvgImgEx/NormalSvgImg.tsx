import { CSSProperties } from "react";
import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx";
import { mpBlank, mpBlankCss } from "../../../../styles/funcs/mp.ts";

const NormalSvgImg = (props: { url: string }) => {
  return <>
    <SectionEx
      style={{ ...mpBlankCss, marginLeft: "auto", marginRight: "auto", pointerEvents: "none", }}
      important={[["max-width", "100%"], ["width", "100%"], ["height", "auto"]]}
      {...{ "enable-z-optimization": "true" }}
    >
      <section style={{ overflow: "hidden", WebkitTapHighlightColor: "transparent" as any, ...mpBlankCss }}>
        <section style={{ fontSize: 0, height: 0, opacity: 0, ...mpBlankCss, lineHeight: 0 }}>
          <p style={{ ...mpBlankCss, fontSize: "inherit", lineHeight: "inherit" }}><span style={{ ...mpBlankCss }}>&nbsp;</span></p>
        </section>
        <section style={{ pointerEvents: "none", fontSize: 0, lineHeight: 0, ...mpBlankCss }}>
          <section style={{ fontSize: 0, ...mpBlankCss }}>
            <section style={{ fontSize: 0 }}>
              <section style={{ lineHeight: 0, fontSize: 0, marginTop: 0, ...mpBlankCss }}>
                <span style={{ fontSize: "inherit", lineHeight: "inherit", ...mpBlankCss }}>
                  <img
                    style={{
                      display: "block",
                      fontSize: "inherit",
                      lineHeight: "inherit",
                      width: "100%",
                      pointerEvents: "painted" as unknown as CSSProperties["pointerEvents"],
                      verticalAlign: "top",
                      opacity: 1,
                    }}
                    src={props.url}
                    data-src={props.url}
                    alt=""
                    referrerPolicy="no-referrer"
                  />
                </span>
              </section>
            </section>
          </section>
        </section>
        <section style={{ height: 1, marginTop: -1 }}>
          <span><br /></span>
        </section>
      </section>
    </SectionEx>
    <section style={{ fontSize: 0, visibility: "hidden", marginBottom: 0, maxHeight: 0, maxWidth: 0, overflow: "hidden" }}>
      <span ><br />&nbsp;</span>
    </section>
  </>
}

export default NormalSvgImg
