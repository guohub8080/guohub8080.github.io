import {ReactNode} from "react";
import GoogleColors from "@assets/styles/googleColors.ts";
import globalSettings from "@pages/storage/globalSettings.ts";

const P = (props: {
	children: ReactNode,
}) => {
	const globalsettings = globalSettings()
	const align = globalsettings.language==="cn"?"justify":"left"
	return <div
		style={{
			fontSize: "inherit", color: GoogleColors.gray800,
			textAlign:align,
			lineHeight: 1.7, marginBottom: 15,marginTop:15,display:"block"
		}}>{props.children}</div>
}

export default P
