/* eslint-disable no-mixed-spaces-and-tabs */
import {ConfigProvider, theme} from "antd";
import zhCN from "antd/locale/zh_CN";
import {Outlet} from "react-router-dom";
import React from "react";
import NaviBar from "@comps/homePage/NaviBar.tsx";
import googleColors from "@assets/styles/googleColors.ts";


const App = () => {
	return (<>
		<ConfigProvider autoInsertSpaceInButton={false} locale={zhCN} wave={{disabled: true}}
		                theme={{
			                algorithm: theme.defaultAlgorithm, token: {
				                colorPrimary: googleColors.blue700
			                }
		                }}>
			<div>
				<NaviBar/>
			</div>

			<div style={{
				width: "100%",
				height: "calc(100vh - 45px)",
				minHeight: "calc(100vh - 45px)",
				maxHeight: "calc(100vh - 45px)",
				marginTop: 45,
				overflow: "auto"
			}}
			><Outlet/></div>
		</ConfigProvider>
	</>)
}

export default App