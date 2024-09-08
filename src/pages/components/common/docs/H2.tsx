import {ReactNode} from "react";
import googleColors from "@assets/styles/googleColors.ts";

const H2 = (props: { children: ReactNode, }) => {
	return <div
		style={{
			fontSize: 20, textAlign: "left", color: googleColors.gray700,
			marginBottom: 5, marginTop: 15,
			borderBottom: `4px ${googleColors.gray50} solid`
		}}>{props.children}</div>
}

export default H2