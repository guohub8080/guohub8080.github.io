/* eslint-disable no-mixed-spaces-and-tabs */
import {css} from "@emotion/react";
import {useCallback, useEffect, useMemo, useRef} from "react";
import byDefault from "@/utils/byDefault.ts";
import {OpenSheetMusicDisplay} from "opensheetmusicdisplay";
import cssPresets from "@/assets/styles/cssPresets.ts";

const ClefWindow = (props: {
  keySignature: number,
  clef: string,
}) => {
  const clef = useMemo(() => {
    const propsClef = byDefault(props.clef, "C").toUpperCase().trim()
    switch (propsClef) {
      case "C":
        return `<sign>C</sign><line>3</line>`
      case "M":
        return `<sign>C</sign><line>3</line>`
      case "F":
        return `<sign>F</sign><line>4</line>`
      case "B":
        return `<sign>F</sign><line>4</line>`
      default:
        return `<sign>G</sign><line>2</line>`
    }
  }, [props])
  const divRef = useRef(null)
  const renderRef = useCallback(async () => {
    const container = divRef.current;
    container.innerHTML = ""; // 清空容器内容
    // 初始化 OpenSheetMusicDisplay，并传入配置
    const osmd = new OpenSheetMusicDisplay(container, {
      autoResize: true,
      drawTitle: false, // 不显示标题
      drawComposer: false, // 不显示作曲者
      drawCredits: false, // 不显示额外信息（包括副标题、版权等）
      drawMetronomeMarks: false,
      drawPartNames: false,
      drawSubtitle: false,
      drawTimeSignatures: false,
      drawLyricist: false,
      renderSingleHorizontalStaffline: false,
    });

    // 修改 EngravingRules 来缩减空白
    const rules = osmd.EngravingRules;
    rules.PageTopMargin = 1; // 页面顶部空白
    rules.PageBottomMargin = 1; // 页面底部空白
    rules.PageLeftMargin = 6; // 页面左侧空白
    rules.PageRightMargin = 6; // 页面右侧空白

    await osmd.load(getMusicXMLString(clef, props.keySignature)); // 加载 MusicXML 字符串
    osmd.render(); // 渲染五线谱
  }, [props, clef])
  useEffect(() => {
    renderRef().then()
  }, [props, clef, renderRef])

  return <div css={clef_window_css}>
    <div className="frame">
      <div ref={divRef} className="svg_frame"></div>
    </div>
  </div>
}

export default ClefWindow

const clef_window_css = css({
  "& .frame": {
    width: 240,
    height: 150,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "white",
    paddingTop: 5,
    userSelect: "none",
    cursor: "pointer",
    ...cssPresets.flexCenter,
  },
  "& .svg_frame": {
    width: "100%",
    transform:"scale(1.3)",
    "& svg": {
      width: "100%",
      height: "100%",
    }
  }
})

// MusicXML 字符串（可以替换为你的实际 XML 数据）
const getMusicXMLString = (clef: string, keys: number) => `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <part-list>
    <score-part id="P1">
      <part-name></part-name>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>1</divisions>
        <key>
          <fifths>${keys}</fifths>
        </key>
        <clef>
         ${clef}
        </clef>
      </attributes>
    </measure>
  </part>
</score-partwise>
`;
