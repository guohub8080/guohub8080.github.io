import type { CSSProperties } from "react";
import byDefault from "../../../../utils/common/byDefault.ts";
import SectionEx from "../../../PureHTML/basicEx/SectionEx.tsx";
import SvgEx from "../../../PureHTML/basicEx/SvgEx.tsx";
import ImgEx from "../../../PureHTML/basicEx/ImgEx.tsx";
import { mpBlank, mpGet, mpProps } from "../../../../styles/funcs/mp.ts";
import svgURL from "../../../PubUtils/common/svgURL.ts";

/**
 * 高阶二维码组件
 * 
 * @description
 * 深色模式对抗的二维码组件，只接受方形图片，否则会被裁剪。
 * 
 * @example
 * ```tsx
 * // 基础用法
 * <BetterQRCode url="https://example.com/qrcode.jpg" />
 * 
 * // 自定义背景色
 * <BetterQRCode url="..." bgColor="#f0f0f0" />
 * 
 * // 带边距
 * <BetterQRCode url="..." mp={{ mt: 10, mb: 10 }} />
 * ```
 * 
 * @param props - 组件属性
 * @param props.url - 二维码图片URL
 * @param props.bgColor - 背景颜色，默认 "white"
 * @param props.mp - 边距配置（marginTop, marginBottom, marginLeft, marginRight）
 * 
 * @returns React 组件
 */
const BetterQRCode = (props: {
  url?: string
  bgColor?: string
  mp?: mpProps
}) => {
  const url = byDefault(props.url, "https://cdn.britannica.com/17/155017-050-9AC96FC8/Example-QR-code.jpg")
  const QRCodeSize = 300; // 使用 300x300 保持方形比例（二维码必须是正方形）
  const bgColor = byDefault(props.bgColor, "white")
  const mpResult = mpGet(byDefault(props.mp, mpBlank))

  return (
    <SectionEx data-label="better-qrcode" style={{ ...rootSectionStyle, ...mpResult }}>
      <SectionEx style={innerSectionStyle} important={[["height", "0px"]]}>
        <ImgEx url={url} style={imgStyle}
          important={[["visibility", "visible"], ["width", "100%"], ["height", "auto"]]}
        />
      </SectionEx>
      <SvgEx viewBox={`0 0 ${QRCodeSize} ${QRCodeSize}`}
        style={{
          ...svgBaseStyle,
          backgroundImage: svgURL(url),
          backgroundColor: bgColor
        }}

      />
    </SectionEx>
  );
}

export default BetterQRCode;

/** ================================================== Style ===================================================== */
const rootSectionStyle: CSSProperties = {
  WebkitTouchCallout: 'none',
  userSelect: 'text',
  overflow: 'hidden',
  textAlign: 'center',
  lineHeight: 0,
  marginBottom: 0
};

const innerSectionStyle: CSSProperties = {
  display: 'block',
  height: 0
};

const imgStyle: CSSProperties = {
  borderWidth: 0,
  borderStyle: 'initial',
  borderColor: 'initial',
  opacity: 0,
  visibility: "visible",
  width: "100%",
  height: "auto",
  pointerEvents: 'visible'
};

const svgBaseStyle: CSSProperties = {
  display: "block",
  width: "100%",
  height: "auto",
  backgroundSize: "100% auto",
  backgroundRepeat: "no-repeat",
  transform: "scale(1)",
  pointerEvents: "none"
};
