/* eslint-disable no-mixed-spaces-and-tabs */
import googleColors from "@/assets/colors/googleColors.ts";
import useGlobalSettings from "@/assets/stores/useGlobalSettings.ts";
import cssFunctions from "@/assets/styles/cssFunctions.ts";
import cssPresets from "@/assets/styles/cssPresets.ts";
import BiLayerDiv from "@/components/reFrame/BiLayerDiv/BiLayerDiv.tsx";
import warningToast from "@/utils/warningToast.tsx";
import {css} from "@emotion/react";
import {ConfigProvider,} from "antd";
import {Input,} from "antd";
import {Button, TextArea} from "antd-mobile";
import {Base64} from "js-base64";
import {isEmpty, reverse} from "lodash";
import {useMemo, useState} from "react";
import toast from "react-hot-toast";
import {useList} from "react-use";
import {useCopyToClipboard} from "usehooks-ts";

const Base64Page = (props: {}) => {
	const {phoneWidth, pageMargin} = useGlobalSettings()
	const [textInput, setTextInput] = useState("")
	const [copiedText, copy] = useCopyToClipboard()
	const [resultList, listActions] = useList([])
	const encode = () => {
		if (isEmpty(textInput)) return;
		const origin_text = textInput.trim()
		const origin_text_length = origin_text.length
		const result = Base64.encode(origin_text)
		listActions.push({
			from_text: origin_text,
			from_text_length: origin_text_length,
			to_text: result,
			to_text_length: result.length,
			isEncode: true,
			isDecode: false
		})
		setTextInput("")
	}
	const decode = () => {
		if (isEmpty(textInput)) return;
		const origin_text = textInput.trim()
		const origin_text_length = origin_text.length
		try {
			const result = Base64.decode(textInput.trim())
			if (isEmpty(result)) throw Error("")
			console.log(result)
			listActions.push({
				from_text: origin_text,
				from_text_length: origin_text_length,
				to_text: result,
				to_text_length: result.length,
				isEncode: false,
				isDecode: true
			})
		} catch (e) {
			warningToast("解码错误，可能不是Base64编码")
		}
		setTextInput("")
	}

	const del = (index: number) => {
		const realIndex = resultList.length - index - 1
		listActions.removeAt(realIndex)
	}

	const copy_text = (i: string) => {
		copy(i).then(() => {
			toast.success("已复制")
		}).catch((e) => {
			console.log(e)
			warningToast("无法获取剪贴板权限")
		})
	}
	const showResults = useMemo(() => reverse([...resultList]), [resultList])
	return <>
		<ConfigProvider theme={{
			token: {}
		}}>
			<BiLayerDiv innerMaxWidth={600} px={pageMargin}>
				<div css={Base64_css}>
					<h1>Base64编码与解码</h1>
					<div className="info">
						<div className="tj">已输入字符数：{textInput.length}</div>
						<div className="del" onClick={() => setTextInput("")}>清除</div>
					</div>
					<Input.TextArea
						value={textInput}
						onChange={(e) => setTextInput(e.target.value)}
						style={{
							width: "100%",
							textAlign: "justify",
							wordBreak: "break-all",
							fontSize: 16,
							color: googleColors.gray800
						}}
						autoSize={{minRows: 2, maxRows: 6}}
						placeholder="请输入要编码或解码的内容"/>
					<div className="do_btn">
						<Button shape={"rounded"} onClick={encode}
						        style={{"--background-color": googleColors.blue800, minWidth: 220,}}
						        color={"primary"}>文本 → Base64编码</Button>
						<Button shape={"rounded"} onClick={decode}
						        style={{"--background-color": googleColors.blue800, minWidth: 220,}}
						        color={"primary"}>Base64编码 → 文本</Button>
					</div>
					<div className="result_f">
						{showResults.map((item, index) => <div key={index} className="each_item">
							<div className={item.isEncode ? "e title" : "d title"}>
								<div className="i">{index + 1}</div>
								<div className="c">{item.isEncode ? "Encode" : "Decode"}</div>
								<div className="del" onClick={() => del(index)}>删除</div>
							</div>
							<div className={item.isEncode ? "t1 t from_t" : "t1 t to_t"} style={{fontFamily: "consolas!important"}}
							     onClick={() => copy_text(item.from_text)}>{item.from_text}</div>
							<div className={!item.isEncode ? "t2 t from_t" : "t2 t to_t"} style={{fontFamily: "consolas!important"}}
							     onClick={() => copy_text(item.to_text)}>{item.to_text}</div>
						</div>)}
					</div>
				</div>

			</BiLayerDiv></ConfigProvider>
	</>
}

export default Base64Page

const Base64_css = css({
	width: "100%",
	display: "block",
	"h1": {
		fontSize: 20,
		fontWeight: 300,
		marginTop: 25,
		marginBottom: 25,
	},
	"& .result_f": {
		paddingBottom:40,
		".each_item": {
			marginTop: 20,
		},

		"& .from_t": {
			backgroundColor: googleColors.gray50,
			transition: "all ease 0.4s",
			"&:active": {
				backgroundColor: googleColors.gray300,
				color: googleColors.gray600
			}
		},
		"& .to_t": {
			transition: "all ease 0.4s",
			backgroundColor: googleColors.blueGray100,
			"&:active": {
				backgroundColor: googleColors.blueGray200,
				color: googleColors.gray600
			}
		},
		"& .c": {
			...cssFunctions.px(5),
			marginLeft: 2,
			borderRadius: 4,
			fontSize: 12,
			height: 20,
			...cssPresets.flexCenter
		},
		"& .e": {
			// backgroundColor: googleColors.blueGray100,
			".c": {
				backgroundColor: googleColors.blue200,
				color: googleColors.blue800
			}
		},
		"& .d": {
			// backgroundColor: googleColors.blue100,
			".c": {
				backgroundColor: googleColors.amber200,
				color: googleColors.amber800
			}
		},
		"& .title": {
			...cssPresets.flexCenter,
			marginBottom: 5,
			".del": {
				marginLeft: "auto",
				fontSize: 12,
				color: googleColors.red100,
				...cssFunctions.px(10),
				borderRadius: 4,
				cursor: "pointer",
				...cssPresets.flexCenter,
				height: 20, backgroundColor: googleColors.red300,
			},
			".i": {
				backgroundColor: googleColors.blueGray300,
				fontSize: 12,
				height: 20,
				width: 20,
				...cssPresets.flexCenter,
				color: googleColors.red50,
				borderRadius: 999
			}
		},
		"& .each_item": {
			"& .t": {
				fontFamily: "consolas!important",
				fontWeight: 400,
				...cssFunctions.py(6),
				cursor: "pointer",
				wordBreak: "break-all",
				wordWrap: "break-word",
				...cssFunctions.px(10),
			},
			"& .t2": {
				borderRadius: "0  0 8px 8px",
			}, "& .t1": {
				borderRadius: "8px 8px 0 0",
			},
		}
	},
	"& .do_btn": {
		...cssPresets.flexCenter,
		flexWrap: "wrap",
		marginTop: 10,
		marginBottom: 10,
		gap: 10
	},
	"& .info": {
		width: "100%",
		...cssPresets.flexCenter,
		marginBottom: 4,
		"& .tj": {
			marginLeft: 2,
			...cssFunctions.px(10),
			backgroundColor: googleColors.gray400,
			color: googleColors.gray200,
			borderRadius: 999,
			...cssFunctions.py(3),
			...cssFunctions.px(15),
			fontSize: 14,
		},
		"& .del": {
			marginLeft: "auto",
			marginRight: 2,
			...cssFunctions.px(10),
			backgroundColor: googleColors.red300,
			borderRadius: 999,
			...cssFunctions.py(3),
			...cssFunctions.px(15),
			...cssPresets.transition,
			fontSize: 14,
			color: googleColors.red50,
			cursor: "pointer",
			"&:active": {
				backgroundColor: googleColors.red200
			}
		}
	}
})
