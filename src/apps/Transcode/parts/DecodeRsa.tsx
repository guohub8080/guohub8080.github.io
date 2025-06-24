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

const DecodeRsa = (props: {}) => {
	const {readyDecryptText, setReadyDecryptText, isBase64, setIsBase64} = useTranscodeConfig()
	const {pageMargin} = useGlobalSettings()
	const [rsaPrivateKey, setRsaPrivateKey] = useState("")
	const [encryptResult, setEncryptResult] = useState("")
	const [copiedText, copy] = useCopyToClipboard()
	const decrypt = () => {
		if (isEmpty(readyDecryptText)) {
			return warningToast("解密文字为空")
		}
		if (isEmpty(rsaPrivateKey)) {
			return warningToast("私钥为空")
		}
		try {
			if (isBase64) {
				const result = doCrypt.decrypt_string_by_b64_private_key(readyDecryptText, rsaPrivateKey)
				if (!result) throw Error()
				return setEncryptResult(result)
			}
			const result = doCrypt.decrypt_string_by_text_private_key(readyDecryptText.trim(), rsaPrivateKey)
			if (!result) throw Error()
			return setEncryptResult(result)
		} catch (e) {
			console.log(e)
			warningToast("解密出错，请检查私钥或信息")
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
		setReadyDecryptText("")
		setRsaPrivateKey("")
	}
	return <>
		<Toaster/>
		<BiLayerDiv innerMaxWidth={700} px={pageMargin}>
			<div css={DecodeRsa_css}>
				<h1>RSA私钥解密</h1>
				<div className="ipt">
					<Input.TextArea
						value={readyDecryptText}
						onChange={(e) => setReadyDecryptText(e.target.value)}
						style={{
							width: "100%",
							textAlign: "justify",
							wordBreak: "break-all",
							fontFamily: "consolas",
							fontSize: 16,
							color: googleColors.gray800
						}}
						autoSize={{minRows: 2, maxRows: 6}}
						placeholder="请输入要解密的密文"/>
				</div>

				<div className="ipt">
					<Input.TextArea
						value={rsaPrivateKey}
						onChange={(e) => setRsaPrivateKey(e.target.value)}
						style={{
							width: "100%",
							textAlign: "justify",
							wordBreak: "break-all",
							fontSize: 16,
							color: googleColors.gray400,
							fontFamily: "consolas,  misans-m-fh, misans-m-2500, misans-m-ex1000",
							border: `2px solid ${googleColors.red900}`,
						}}
						autoSize={{minRows: 2, maxRows: 6}}
						placeholder="请输入私钥。请注意，私钥非常敏感，切勿泄露。本页面不保管私钥。"/>
				</div>
				<div className="config">
					<div className="t1">{isBase64 ? "私钥是Base64编码" : "私钥是普通Text"}</div>
					<Switch value={isBase64} onChange={(x) => setIsBase64(x)}/>
					<Button
						onClick={decrypt}
						autoInsertSpace={false} style={{width: 120, marginLeft: "auto"}} type={"primary"}>解密</Button>
				</div>
				<div className="result" onClick={() => copy_text(encryptResult)}>
					<div className="t3">解密</div>
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

export default DecodeRsa

const DecodeRsa_css = css({
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
			fontFamily: "misans-m-fh, misans-m-2500, misans-m-ex1000",
			fontSize: 14,
		},
		".t5": {
			fontSize: 14,
			marginTop: 10,
			color: googleColors.amber200
		}
	}
})
