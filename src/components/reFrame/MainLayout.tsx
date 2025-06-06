/* eslint-disable no-mixed-spaces-and-tabs */

import useMIDIPortsStore from "@/assets/stores/useMidiPortsStore.ts";
import routerPath from "@/router/routerPath.ts";
import useMIDIPorts from "@/utils/useMIDI/useMIDIPorts.ts";
import useMIDIReady from "@/utils/useMIDI/useMIDIReady.ts";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {css} from "@emotion/react";
import NaviBar from "@/components/reFrame/NaviBar/NaviBar.tsx";
import cssPresets from "@/assets/styles/cssPresets.ts";
import {useWindowSize} from "react-use";
import {useEffect, useState} from "react";
import TooShortWindow from "@/components/common/TooShortWindow.tsx";
import useGlobalSettings from "@/assets/stores/useGlobalSettings.ts";
import LandScreen from "@/components/common/LandScreen.tsx";
import {ErrorBoundary} from "react-error-boundary";
import {isEmpty} from "lodash";

const FBR = () => {
	const navigator = useNavigate();
	useEffect(() => {
		navigator("/error", {replace: true})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return <></>
}

const fallbackRender = ({error}) => {
	// Call resetErrorBoundary() to reset the error boundary and retry the render.
	console.log(error)
	return <FBR/>
}


const MainLayout = () => {
	const {height, width} = useWindowSize()
	const {
		naviBarHeight,
		setNaviWindowOpen,
		setLastViewURL,
		isNaviBarHidden,
		setIsNaviBarHidden,
		mainBgColor
	} = useGlobalSettings()
	const [tooShortWindow, setTooShortWindow] = useState(false)
	const [isLandScreen, setIsLandScreen] = useState(false)
	const pathName = useLocation().pathname


	useEffect(() => {
		if (pathName === "/") return;
		if (pathName === `/${routerPath.home}`) {
			console.log("1")
			setIsNaviBarHidden(true)
		} else {
			setIsNaviBarHidden(false)
		}
		setLastViewURL(pathName)
	}, [pathName, setLastViewURL]);
	useEffect(() => {
		document.body.style.zoom = "1"
	}, [])
	useEffect(() => {
		if (width > height) {
			if (height < 450) setIsLandScreen(true)
			else setIsLandScreen(false)
		} else {
			if (width < 355 || height < 550) setTooShortWindow(true)
			else setTooShortWindow(false)
			setIsLandScreen(false)
		}
	}, [height, width])


	return <ErrorBoundary fallbackRender={fallbackRender}>
		{/*如果是横屏，那么只展示提示信息*/}
		{isLandScreen && <LandScreen/>}
		{/*如果屏幕过小，那么只展示二维码*/}
		{tooShortWindow && <TooShortWindow isActive={tooShortWindow} h={height} w={width}/>}

		<div style={{display: tooShortWindow || isLandScreen ? "none" : "block"}}
		     css={main_frame_css({naviBarHeight, isNaviBarHidden, mainBgColor})}>
			{/*导航区，点击可以显示*/}
			{!isNaviBarHidden && <div className="navi_bar" onClick={() => setNaviWindowOpen(true)}>
				<NaviBar/>
			</div>}
			{/*主要操作区*/}
			<div className="main_window">
				<Outlet/>
			</div>
		</div>
	</ErrorBoundary>
}

export default MainLayout

const main_frame_css = (i: {
	naviBarHeight: number,
	isNaviBarHidden: boolean,
	mainBgColor?: string
}) => css({
	width: "calc(100vw)",
	height: "100vh",
	overflow: "hidden",
	overflowX: "hidden",
	userSelect: "none",
	...cssPresets.flexCenter,
	flexDirection: "column",
	"& .navi_bar": {
		width: "calc(100vw)",
		// overflowX: "hidden",
		height: `${i.naviBarHeight}px`,
		userSelect: "none",
		background: "white",
		...cssPresets.flexCenter,
		zIndex: 999,
		position: "sticky", // 使用 sticky 定位
		top: 0, // 滚动到顶部时固定
		left: 0,
		right: 0,
		boxShadow: "0px 0px 9px 0px rgba(0, 0, 0, 0.1)",

	},
	"& .main_window": {
		userSelect: "none",
		width: "100%",
		height: `calc(100vh - ${i.isNaviBarHidden ? 0 : i.naviBarHeight}px)`,
		minHeight: `calc(100vh - ${i.isNaviBarHidden ? 0 : i.naviBarHeight}px)`,
		maxHeight: `calc(100vh - ${i.isNaviBarHidden ? 0 : i.naviBarHeight}px)`,
		overflowY: "auto",
		backgroundColor: i.mainBgColor,
		zIndex: -999
	}
})
