/* eslint-disable no-mixed-spaces-and-tabs */

import {useWindowSize} from "react-use";
import {useEffect} from "react";
import useGlobalSettings from "../assets/stores/useGlobalSettings";

const useIsWideScreen = () => {
  const {phoneWidth, isWideScreen, setIsWideScreen} = useGlobalSettings();
  const {width} = useWindowSize();
  useEffect(() => {
    if (width >= phoneWidth) setIsWideScreen(true)
    else setIsWideScreen(false)
  }, [width, phoneWidth, setIsWideScreen])
  return isWideScreen
}

export default useIsWideScreen
