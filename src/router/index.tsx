import Abouts from "@/apps/Abouts/Abouts.tsx";
import AutoRedirect from "@/apps/AutoRedirect/AutoRedirect.tsx";
import ErrorPage from "@/apps/ErrorPage/ErrorPage.tsx";
import MtKit from "@/apps/Mtkit/MtKit.tsx";
import Transcode from "@/apps/Transcode/Transcode.tsx";
// import FindInScale from "@/apps/FindInScale/FindInScale.tsx";
import MainLayout from "@/components/reFrame/MainLayout.tsx";
import routerPath from "@/router/routerPath.ts";
import {createHashRouter, Navigate} from 'react-router-dom'
import Home from "@/apps/Home/Home.tsx";

const r = createHashRouter([
	{
		path: "",
		element: <AutoRedirect/>
	},
	{
		path: "/",
		element: <MainLayout/>,
		caseSensitive: false,
		children: [
			{
				path: routerPath.home,
				element: <Home/>,
			},
			{
				path: routerPath.about,
				element: <Abouts/>,
			},
			{
				path: routerPath.mtkit,
				element: <MtKit/>,
			},
			{
				path: routerPath.code,
				element: <Transcode/>,
			},

		],
	},
	{
		path: "/error",
		element: <ErrorPage/>
	},
	{
		path: "*",
		element: <Navigate to="/error"/>
	}
])

export default r
