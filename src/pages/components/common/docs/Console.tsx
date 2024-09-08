import {Button, Space} from "antd";

const Console = (props: {
	log: any
}) => {
	return <div style={{marginTop:5,marginBottom:40}}>
		<Space>
			<Button  onClick={() => console.clear()}>console.clear</Button>
			<Button type="primary" onClick={() => console.log(props.log)}>console.log</Button>

		</Space>


	</div>
}

export default Console
