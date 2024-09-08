import {ReactNode} from "react";
import googleColors from "@assets/styles/googleColors.ts";

const Oot = (props: { children?: ReactNode }) => {
	return <span style={{
		fontSize: "inherit",
		marginLeft: 2,
		marginRight: 2,
		borderRadius: 4,
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 2,
		paddingBottom: 2,
		color: googleColors.pink800,
		backgroundColor: googleColors.amber100,
		boxDecorationBreak: "clone"
	}}>
		<span style={{fontSize:"75%",marginRight:10,color:googleColors.deepOrangeA400}}>Output</span>
		<span>{props.children}</span>
	</span>
}

export default Oot
