/* eslint-disable no-mixed-spaces-and-tabs */
import SectionF from "@comps/frames/SectionF.tsx";

const Blank = (props: {
	h?: number
}) => {
	const h = props.h | 20
	return <div style={{width: "100%", height: h}}></div>
}

export default Blank
