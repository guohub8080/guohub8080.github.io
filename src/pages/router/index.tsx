import {createHashRouter, Navigate} from 'react-router-dom'
import Home from "@views/home/Home.tsx";
import App from "@pages/App.tsx";
import Intro_Music96 from "@views/music96/welcome/Intro_Music96.tsx";
import Music96_S1 from "@views/music96/s1_interval_and_note/Music96_S1.tsx";
import Music96_S2 from "@views/music96/s2_chord/Music96_S2.tsx";
import Music96_S3 from "@views/music96/s3_scale/Music96_S3.tsx";
import MagicScore from "@views/magicScore/MagicScore.tsx";

/**
 * eslint-disable-next-line @typescript-eslint/ban-ts-comment
 * @ts-expect-error
 * eslint-disable-next-line react-refresh/only-export-components
 */
// eslint-disable-next-line react-refresh/only-export-components
export default createHashRouter([
	{
		path: "",
		element: <Navigate to="/home"></Navigate>,
	},
	{
		path: "/",
		element: <App/>,
		children: [
			{
				path: "home",
				element: <Home/>
			},
			{
				path: "score",
				element: <MagicScore/>
			},
			{
				path: "music96/intro",
				element: <Intro_Music96/>
			}, {
				path: "music96/interval_and_note",
				element: <Music96_S1/>
			}, {
				path: "music96/chord",
				element: <Music96_S2/>
			}, {
				path: "music96/scale",
				element: <Music96_S3/>
			},
		]
	},
	{
		path: "*",
		element: <App/>
	}
])
