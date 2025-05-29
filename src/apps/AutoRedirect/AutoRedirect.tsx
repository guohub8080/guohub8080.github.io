/* eslint-disable no-mixed-spaces-and-tabs */
import {css} from "@emotion/react";
import {useEffect} from "react";
import useGlobalSettings from "@/assets/stores/useGlobalSettings.ts";
import {useNavigate} from "react-router-dom";
import {isEmpty, isString} from "lodash";
import routerPath from "@/router/routerPath.ts";


const AutoRedirect = () => {
  const {lastViewURL} = useGlobalSettings()
  const navigate = useNavigate()
  useEffect(() => {
    if (isEmpty(lastViewURL)) {
      return navigate(`/${routerPath.home}`, {replace: true})
    }
    if (isString(lastViewURL) && lastViewURL.startsWith("/")) {
      navigate(lastViewURL, {replace: true})
    }
  }, [lastViewURL, navigate])
  return <>
    <div css={AutoRedirect_css}>
    </div>
  </>
}

export default AutoRedirect

const AutoRedirect_css = css({})
