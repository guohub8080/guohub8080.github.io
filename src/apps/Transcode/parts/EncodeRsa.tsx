/* eslint-disable no-mixed-spaces-and-tabs */
import googleColors from "@/assets/colors/googleColors.ts";
import useGlobalSettings from "@/assets/stores/useGlobalSettings.ts";
import useTranscodeConfig from "@/assets/stores/useTranscodeConfig.ts";
import cssFunctions from "@/assets/styles/cssFunctions.ts";
import cssPresets from "@/assets/styles/cssPresets.ts";
import BiLayerDiv from "@/components/reFrame/BiLayerDiv/BiLayerDiv.tsx";
import warningToast from "@/utils/warningToast.tsx";
import {css} from "@emotion/react";
import {Input, Switch} from "antd";
import {Button} from "antd";
import {isEmpty} from "lodash";
import {useState} from "react";
import toast, {Toaster} from "react-hot-toast";
import {useCopyToClipboard} from "usehooks-ts";
import doCrypt from "../utils/doCrypt.ts"

const EncodeRsa = (props: {}) => {
	const {readyEncryptText, setReadyEncryptText, isBase64, setIsBase64} = useTranscodeConfig()
	const {pageMargin} = useGlobalSettings()
	const [rsaPubKey, setRsaPubKey] = useState("")
	const [encryptResult, setEncryptResult] = useState("")
	const [copiedText, copy] = useCopyToClipboard()
	const encrypt = () => {
		if (isEmpty(readyEncryptText)) {
			return warningToast("加密文字为空")
		}
		if (isEmpty(rsaPubKey)) {
			return warningToast("公钥为空")
		}
		try {
			if (isBase64) {
				const result = doCrypt.encrypt_string_by_b64_public_key(readyEncryptText, rsaPubKey)
				if (!result) throw Error()
				return setEncryptResult(result)
			}
			const result = doCrypt.encrypt_string_by_text_public_key(readyEncryptText, rsaPubKey)
			if (!result) throw Error()
			return setEncryptResult(result)
		} catch (e) {
			console.log(e)
			warningToast("加密出错，请检查公钥")
			setEncryptResult("")
		}
	}

	const copy_text = (i: string) => {
		if (isEmpty(i)) return;
		copy(i).then(() => {
			toast.success("已复制")
		}).catch((e) => {
			warningToast("无法获取剪贴板权限")
		})
	}
	const clear = () => {
		setEncryptResult("")
		setReadyEncryptText("")
		setRsaPubKey("")
	}
	return <>
		<Toaster/>
		<BiLayerDiv innerMaxWidth={700} px={pageMargin}>
			<div css={EncodeRsa_css}>
				<h1>RSA公钥加密</h1>
				<div className="ipt">
					<Input.TextArea
						value={readyEncryptText}
						onChange={(e) => setReadyEncryptText(e.target.value)}
						style={{
							width: "100%",
							textAlign: "justify",
							wordBreak: "break-all",
							fontSize: 16,
							color: googleColors.gray800
						}}
						autoSize={{minRows: 2, maxRows: 6}}
						placeholder="请输入要加密的明文"/>
				</div>

				<div className="ipt">
					<Input.TextArea
						value={rsaPubKey}
						onChange={(e) => setRsaPubKey(e.target.value)}
						style={{
							width: "100%",
							textAlign: "justify",
							wordBreak: "break-all",
							fontSize: 16,
							color: googleColors.blue800,
							border: `2px solid ${googleColors.blue800}`,
							fontFamily: "consolas"
						}}
						autoSize={{minRows: 2, maxRows: 6}}
						placeholder="请输入公钥。请注意，应填入加密信息接受者的公钥，不是你的公钥。"/>
				</div>
				<div className="config">
					<div className="t1">{isBase64 ? "公钥是Base64编码" : "公钥是普通Text"}</div>
					<Switch value={isBase64} onChange={(x) => setIsBase64(x)}/>
					<Button
						onClick={encrypt}
						autoInsertSpace={false} style={{width: 120, marginLeft: "auto"}} type={"primary"}>加密</Button>
				</div>
				<div className="result" onClick={() => copy_text(encryptResult)}>
					<div className="t3">加密结果</div>
					<div className="t4">
						{encryptResult || "..."}
					</div>
					{encryptResult.length > 0 && <div className="t5">请点击卡片复制</div>}
				</div>
				{encryptResult.length > 0 && <div className="xh" onClick={clear}>清空</div>}
			</div>
		</BiLayerDiv>
	</>
}

export default EncodeRsa

const EncodeRsa_css = css({
	width: "100%",
	display: "block",
	paddingBottom:40,
	"h1": {
		fontSize: 20,
		fontWeight: 300,
		marginTop: 25,
		marginBottom: 25,
	},
	"& .ipt:first-of-type": {
		...cssFunctions.my(20)
	},
	".xh": {
		width: 120,
		backgroundColor: googleColors.red300,
		borderRadius: 999,
		...cssPresets.flexCenter,
		color: googleColors.red50,
		height: 30,
		...cssPresets.mxAuto,
		marginTop: 15,
		cursor: "pointer",
		...cssPresets.transition,
		"&:active": {
			backgroundColor: googleColors.red500
		}
	},
	".config": {
		...cssPresets.flexCenter,
		marginTop: 10,
		".t1": {
			marginRight: 5,
			width: 140,
			textAlign: "right",
		}
	},
	".result": {
		width: "100%",
		wordBreak: "break-all",
		...cssFunctions.px(15),
		...cssFunctions.py(15),
		borderRadius: 8,
		marginTop: 12,
		backgroundColor: googleColors.blueGray300,
		cursor: "pointer",
		...cssPresets.transition,
		"&:active": {
			backgroundColor: googleColors.blueGray400
		},
		".t3": {
			fontSize: 16,
			...cssFunctions.py(5),
			color: googleColors.blueGray50
		}, ".t4": {
			fontFamily: "consolas!important",
			fontSize: 14,
		},
		".t5": {
			fontSize: 14,
			marginTop: 10,
			color: googleColors.amber200
		}
	}
})
