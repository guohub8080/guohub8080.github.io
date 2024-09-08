import {ReactNode} from "react";
import googleColors from "@assets/styles/googleColors.ts";
import cssPresets from "@assets/styles/cssPresets.ts";

const DefaultValue = (props: { children?: ReactNode }) => {
	return <span style={{
		fontSize: "inherit",
		marginLeft: 2,
		marginRight: 2,
		borderRadius: 4,
		paddingLeft: 8,
		paddingRight: 10,
		paddingTop: 2,
		paddingBottom: 2,
		color: googleColors.deepPurple800,
		backgroundColor: googleColors.pink50,
	}}>
		<span style={{
			color: googleColors.red300,
			marginRight: 10,
			height: "100%",
			fontSize:"75%",
			display: "inline-block",
			verticalAlign:"middle"
		}}>
					Default
	</span>
		{props.children}</span>
}

export default DefaultValue
