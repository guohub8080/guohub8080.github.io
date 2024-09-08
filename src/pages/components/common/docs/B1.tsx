import {ReactNode} from "react";
import googleColors from "@assets/styles/googleColors.ts";

const B1 = (props: { children?: ReactNode }) => {
	return <span style={{
		fontSize: "inherit",
		marginLeft: 2,
		marginRight: 2,
		borderRadius: 4,
		paddingLeft: 5,
		paddingRight: 5,
		paddingTop: 2,
		paddingBottom: 2,
		backgroundColor: googleColors.lightGreen100,
		fontWeight: 700
	}}><b>{props.children}</b></span>
}

export default B1
