/* eslint-disable no-mixed-spaces-and-tabs */
import {Button, ConfigProvider} from "antd";
import googleColors from "@assets/styles/googleColors.ts";
import byDefault from "@pages/utils/byDefault.ts";
import {ReactNode} from "react";
import {css} from "@emotion/react";

const LightButton = (props: {
  children?: ReactNode
  onClick?: () => any
  width?: number
  disabled?: boolean
}) => {
  return <ConfigProvider
    theme={{
      components: {
        Button: {
          /* 这里是你的组件 token */
          defaultBg: googleColors.blueGray100,
          defaultBorderColor: null,
          defaultColor: googleColors.blue700,
          defaultHoverBg: googleColors.blue100,
          defaultActiveBg: googleColors.gray50,
          defaultHoverColor: googleColors.blue800,
          defaultHoverBorderColor: null,
          defaultShadow: null,
          defaultActiveBorderColor: "null",
          defaultActiveColor: googleColors.blue800,

        },
      },
    }}
  >
    <Button disabled={byDefault(props.disabled, false)}
            size="small"

            css={antd_Css}
            style={{
              width: byDefault(props.width, "fitContent"), borderBottom: `1px ${googleColors.blue400} solid`,
              // borderBottomLeftRadius: 0,
              // borderBottomRightRadius: 0
            }}
            onClick={props.onClick}>{byDefault(props.children, "按钮")}</Button>
  </ConfigProvider>
}
const antd_Css = css({
  "& span": {

    fontSize: 15
  }
})
export default LightButton