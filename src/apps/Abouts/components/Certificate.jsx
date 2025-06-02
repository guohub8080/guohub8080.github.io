import law from "../icons/law.svg"
import psLogo from "../icons/Adobe.svg"
import {css} from "@emotion/react";
import {Divider} from "antd";

const eachCell_css = css({
	borderColor: "#d7d7d7",
	backgroundColor: "white",
	borderRadius: 8,
	borderStyle: "solid",
	borderWidth: 1,
	padding: 15,
	paddingTop: 20,
	paddingBottom: 20,
	width: 230
})
const Certificate = () => {
	return <div>
		<Divider style={{color:"black"}}>教育 / 资格证书</Divider>
		<div style={{display: "flex", justifyContent: "center", paddingLeft: 20, paddingRight: 20}}>
			<div style={{
				width: "fit-content",
				padding: 5,
				gap: 15,
				flexWrap: "wrap",
				display: "flex",
				justifyContent: "center",
				alignItems: "center"
			}}>
				<div css={eachCell_css}>
					<img src={law} style={{width: 40}} alt=""/>
					<div style={{fontSize: 16, marginBottom: 10, marginTop: 3}}>法律</div>
					<div style={{color: "gray", fontSize: 14}}>
						<div>法学本科 / 国际法学硕士</div>
						<div>法律职业资格证书
							<span style={{wordBreak: "keep-all", whiteSpace: "nowrap"}}>
							   （法考A证）
						     </span>
						</div>
					</div>
				</div>
				<div css={eachCell_css}>
					<img src={psLogo} style={{width: 40}} alt=""/>
					<div style={{fontSize: 16, marginBottom: 10, marginTop: 3}}>设计</div>
					<div style={{color: "gray", fontSize: 14}}>
						<div>Adobe认证设计师</div>
						<div>创意设计</div>
						<div>影视后期</div>
					</div>
				</div>
			</div>
		</div>
	</div>
}

export default Certificate
