/* eslint-disable no-mixed-spaces-and-tabs */
import SectionF from "@comps/frames/SectionF.tsx";
import {ReactNode} from "react";

const H1 = (props: { children: ReactNode, isTop?: boolean }) => {
	return <div
		style={{fontSize: 26, textAlign: "left", marginBottom: 5, marginTop: props.isTop?10:20}}>{props.children}</div>
}

export default H1
