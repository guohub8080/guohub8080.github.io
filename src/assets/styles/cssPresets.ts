import {isMobile} from "react-device-detect";
import googleColors from "@/assets/colors/googleColors.ts";

export default {
  flexCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  mxAuto:{
    marginLeft: "auto",
    marginRight: "auto"
  },
  flexCenterColumn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  flexCenterTopColumn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
    flexDirection: "column",
  },
  flex: {
    display: "flex",
  },
  flexOnlyColumnCenter: {
    display: "flex",
    alignItems: "center",
  },
  mainBgColor: "#e5e7ee",
  transition: {transition: "all ease 0.1s"},
  defaultBlur: {backdropFilter: "blur(4px)",},
  defaultHoverAndActive: {
    cursor: "pointer",
    userSelect: "none",
    "&:hover": isMobile ? void 0 : {
      backgroundColor: googleColors.gray200,
    },
    "&:active": {
      backgroundColor: googleColors.gray300,
    }
  }
}
