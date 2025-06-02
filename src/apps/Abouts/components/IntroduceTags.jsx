import {Button, Card, Flex} from "antd";
import {css} from "@emotion/react";
import cssFunctions from "@/assets/styles/cssFunctions.js";

const Tags = (props) => {
	const tag_css = css({
		fontSize: 14,
		backgroundColor: "#ffffff",
		padding: 5,
		...cssFunctions.mx(5),
		...cssFunctions.my(3),
		paddingLeft: 15,
		paddingRight: 15,
		borderRadius: 999,
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: "#dcdcdc",
		color: "#2667bb"
	})
	return <div css={tag_css}>
		{props.content}
	</div>
}
const IntroduceTags = () => {
	return <div style={{marginTop: 10, display: "flex", justifyContent: "center", flexWrap: "wrap"}}>
		<Tags content="INTP"/>
		<Tags content="1996"/>
		<Tags content="水瓶座"/>
		<Tags content="上班族"/>
		<Tags content="宅男"/>
		<Tags content="法学专业"/>
		<Tags content="音乐爱好者"/>
		<Tags content="设计爱好者"/>
		<Tags content="编程爱好者"/>
		<Tags content="DIY爱好者"/>
	</div>
}
export default IntroduceTags
