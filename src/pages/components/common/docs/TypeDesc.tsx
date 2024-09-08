import {ReactNode} from "react";
import googleColors from "@assets/styles/googleColors.ts";

const B1 = (props: { children?: ReactNode }) => {
	return <span style={{
		fontSize: "inherit",
		marginLeft: 2,
		marginRight: 2,
		borderRadius: 4,
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 2,
		paddingBottom: 2,
		color:googleColors.green800,
		backgroundColor: googleColors.lightGreen100,
		boxDecorationBreak:"clone"
	}}>{props.children}</span>
}

export default B1
