/* eslint-disable no-mixed-spaces-and-tabs */
import {css} from "@emotion/react";
import googleColors from "@/assets/colors/googleColors.ts";
import cssPresets from "@/assets/styles/cssPresets.ts";
import {isMobile} from "react-device-detect";
import {ReactNode} from "react";
import byDefault from "@/utils/byDefault.ts";

type configType = {
  whiteKeyWidth?: number
  whiteKeyHeight?: number
  blackKeyWidthRatio?: number
  blackKeyHeightRatio?: number
  whiteKeyBorderRadius?: number[][]
  blackKeyBorderRadius?: number[][]
  whiteKeyBorderWidth?: number
  blackKeyBorderWidth?: number
  whiteKeyGap?: number
  defaultBlackKeyColor?: string
  defaultWhiteKeyColor?: string
  defaultBlackKeyBorderColor?: string
  defaultWhiteKeyBorderColor?: string

  keyBgColorList?: any[],
}

const OctavePiano = (props: {
  config?: configType
  isPureDisplay?: boolean
  onClick?: (x) => any
  keyNodeList?: ReactNode[]
  ml?: number
}) => {
  const config = {...defaultConfig, ...props.config}
  const isPureDisplay = byDefault(props.isPureDisplay, false)
  const ml = byDefault(props.ml, 0)
  const getNode = (i: number) => {
    try {
      return props.keyNodeList[i]
    } catch {
      return void 0
    }
  }
  return <>
    <div css={base_piano(config, isPureDisplay, ml)}>
      <div className="white_keys_frame">
        <div className="wk k0" onClick={() => props.onClick && props.onClick(0)}>
          {getNode(0)}
        </div>
        <div className="wk k2" onClick={() => props.onClick && props.onClick(2)}>
          {getNode(2)}
        </div>
        <div className="wk k4" onClick={() => props.onClick && props.onClick(4)}>
          {getNode(4)}
        </div>
        <div className="wk k5" onClick={() => props.onClick && props.onClick(5)}>
          {getNode(5)}
        </div>
        <div className="wk k7" onClick={() => props.onClick && props.onClick(7)}>
          {getNode(7)}
        </div>
        <div className="wk k9" onClick={() => props.onClick && props.onClick(9)}>
          {getNode(9)}
        </div>
        <div className="wk k11" onClick={() => props.onClick && props.onClick(11)}>
          {getNode(11)}
        </div>
      </div>
      <div className="black_keys_frame">
        <div className="bk k1" onClick={() => props.onClick && props.onClick(1)}>
          {getNode(1)}
        </div>
        <div className="bk k3" onClick={() => props.onClick && props.onClick(3)}>
          {getNode(3)}
        </div>
        <div className="bk k6" onClick={() => props.onClick && props.onClick(6)}>
          {getNode(6)}
        </div>
        <div className="bk k8" onClick={() => props.onClick && props.onClick(8)}>
          {getNode(8)}
        </div>
        <div className="bk k10" onClick={() => props.onClick && props.onClick(10)}>
          {getNode(10)}
        </div>
      </div>
    </div>
  </>
}

export default OctavePiano

const base_piano = (config: configType, isPureDisplay: boolean, ml: number) => {
  const blackKeyWidth = config.whiteKeyWidth * config.blackKeyWidthRatio
  const blackKeyHeight = config.whiteKeyHeight * config.blackKeyHeightRatio
  const wk_radius_css = {}
  const bk_radius_css = {}
  const key_color_css = {}
  config.whiteKeyBorderRadius.map((x, y) => {
    wk_radius_css[`& .wk:nth-of-type(${y + 1})`] = {
      borderTopLeftRadius: config.whiteKeyBorderRadius[y][0],
      borderTopRightRadius: config.whiteKeyBorderRadius[y][1],
      borderBottomRightRadius: config.whiteKeyBorderRadius[y][2],
      borderBottomLeftRadius: config.whiteKeyBorderRadius[y][2],
    }
  })
  config.blackKeyBorderRadius.map((x, y) => {
    bk_radius_css[`& .bk:nth-of-type(${y + 1})`] = {
      borderTopLeftRadius: config.blackKeyBorderRadius[y][0],
      borderTopRightRadius: config.blackKeyBorderRadius[y][1],
      borderBottomRightRadius: config.blackKeyBorderRadius[y][2],
      borderBottomLeftRadius: config.blackKeyBorderRadius[y][2],
    }
  })
  config.keyBgColorList.forEach((x, y) => {
    if ([1, 3, 6, 8, 10].includes(y)) {
      key_color_css[`& .k${y}`] = {
        backgroundColor: byDefault(x, config.defaultBlackKeyColor),
      }
    } else {
      key_color_css[`& .k${y}`] = {
        backgroundColor: byDefault(x, config.defaultWhiteKeyColor)
      }
    }
  })
  return css({
      boxSizing: "border-box",
      height: config.whiteKeyHeight,
      marginLeft: ml,
      display: "block",
      width: config.whiteKeyGap === 0 ? config.whiteKeyWidth * 7 - config.whiteKeyBorderWidth * 6 :
        (config.whiteKeyWidth + config.whiteKeyGap) * 6 + config.whiteKeyWidth,
      ...key_color_css,
      "& .white_keys_frame": {
        display: "flex",
        zIndex: 0,
        height: config.whiteKeyHeight,
        ...wk_radius_css,
        "& .wk": {
          minWidth: config.whiteKeyWidth,
          maxWidth: config.whiteKeyWidth,
          height: config.whiteKeyHeight,
          border: `${config.whiteKeyBorderWidth}px solid ${config.defaultWhiteKeyBorderColor}`,
          marginRight: config.whiteKeyGap === 0 ? -1 * config.whiteKeyBorderWidth : config.whiteKeyGap,
          cursor: "pointer",
          userSelect: "none",
          ...cssPresets.flexCenter as any,
          alignItems: "end",
          paddingBottom: 3,
          "&:hover": {
            backgroundColor: isPureDisplay ? void 0 : isMobile ? void 0 : googleColors.gray200
          },
        },

      },
      "& .black_keys_frame": {
        ...bk_radius_css,
        display: "flex",
        // position: "absolute",
        marginTop: -1 * config.whiteKeyHeight,
        zIndex: 999,
        marginLeft: config.whiteKeyGap === 0 ?
          config.whiteKeyWidth + (config.whiteKeyGap - blackKeyWidth) / 2 - config.whiteKeyBorderWidth / 2
          : config.whiteKeyWidth + (config.whiteKeyGap - blackKeyWidth) / 2,
        "& .bk": {
          height: blackKeyHeight,
          width: blackKeyWidth,
          marginRight: config.whiteKeyGap === 0 ?
            config.whiteKeyWidth - blackKeyWidth - config.whiteKeyBorderWidth :
            config.whiteKeyWidth + config.whiteKeyGap - blackKeyWidth,
          cursor: "pointer",
          userSelect: "none",
          border: `${config.blackKeyBorderWidth}px solid ${config.defaultBlackKeyBorderColor}`,
          ...cssPresets.flexCenter as any,
          alignItems: "end",
          paddingBottom: 3,
          "&:hover": {
            backgroundColor: isPureDisplay ? void 0 : isMobile ? void 0 : googleColors.gray600
          },
        },
        "& div.bk:nth-of-type(2)": {
          marginRight: config.whiteKeyGap === 0 ?
            config.whiteKeyWidth * 2 - config.whiteKeyBorderWidth * 2 - blackKeyWidth :
            config.whiteKeyWidth * 2 + config.whiteKeyGap * 2 - blackKeyWidth,
        },

      },

    }
  )
}
const defaultConfig = {
  whiteKeyWidth: 40,
  whiteKeyHeight: 120,
  blackKeyWidthRatio: 0.7,
  blackKeyHeightRatio: 0.6,
  whiteKeyBorderRadius: Array.from({length: 7}, () => [0, 0, 8, 8]),
  blackKeyBorderRadius: Array.from({length: 6}, () => [0, 0, 4, 4]),
  whiteKeyBorderWidth: 2,
  blackKeyBorderWidth: 2,
  whiteKeyGap: 0,
  defaultBlackKeyColor: googleColors.gray800,
  defaultWhiteKeyColor: "#fff",
  defaultWhiteKeyBorderColor: googleColors.gray700,
  defaultBlackKeyBorderColor: googleColors.gray700,
  keyBgColorList: Array.from({length: 12}, () => void 0),
}