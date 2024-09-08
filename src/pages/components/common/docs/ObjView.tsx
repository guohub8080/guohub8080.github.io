/* eslint-disable no-mixed-spaces-and-tabs */
import googleColors from "@assets/styles/googleColors.ts";
import ReactJson from 'react-json-view'
import cssPresets from "@assets/styles/cssPresets.ts";
import 'react18-json-view/src/style.css'
import ByDefault from "@pages/utils/byDefault.ts";

const ObjView = (props: {
	data: any,
	name?: string | boolean
	isSort?: boolean
}) => {
	const name = props.name || false
	return <div style={{
		backgroundColor: googleColors.gray50,
		marginBottom: 5,
		borderRadius: 8,
		textAlign: "left",
		paddingTop: 16,
		paddingBottom: 16,
	}}>
		<ReactJson src={props.data} enableClipboard={false}
		           shouldCollapse={false}
		           quotesOnKeys={false}
		           displayDataTypes={false}
		           name={name as any}
		           displayObjectSize={true}
		           theme="rjv-default"
		           indentWidth={3}
		           sortKeys={ByDefault(props.isSort, false)}
		           collapsed={false}
		           style={{textAlign: "left", ...cssPresets.flexCenter, justifyContent: "left"}}/>

	</div>
}

export default ObjView
