/* eslint-disable no-mixed-spaces-and-tabs */
import {Button, ConfigProvider} from "antd";
import googleColors from "@assets/styles/googleColors.ts";
import byDefault from "@pages/utils/byDefault.ts";
import {ReactNode} from "react";

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
          defaultBg: googleColors.lightBlue50,
          defaultBorderColor: null,
          defaultColor: googleColors.blue700,
          defaultHoverBg: googleColors.blue100,
          defaultActiveBg: googleColors.blueGray50,
          defaultHoverColor: googleColors.blue800,
          defaultHoverBorderColor: null,
          defaultShadow: null,
          defaultActiveBorderColor: "null",
          defaultActiveColor: googleColors.blue800
        },
      },
    }}
  >
    <Button disabled={byDefault(props.disabled, false)} style={{width: byDefault(props.width, "fitContent")}}
            onClick={props.onClick}>{byDefault(props.children, "按钮")}</Button>
  </ConfigProvider>
}

export default LightButton