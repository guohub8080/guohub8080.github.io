import {ReactNode} from "react";
import googleColors from "@assets/styles/googleColors.ts";


const ShortCode = (props: {
	children: ReactNode
}) => {
	return <span style={{
		marginLeft: 2, marginRight: 2, borderRadius: 4, paddingLeft: 10, paddingRight: 10, paddingTop: 2, paddingBottom: 2,
		backgroundColor: googleColors.blue50, fontSize: "inherit", color: googleColors.blue800
	}}>
		{props.children}
	</span>
}

export default ShortCode