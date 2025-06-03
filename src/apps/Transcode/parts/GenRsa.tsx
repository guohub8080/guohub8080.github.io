/* eslint-disable no-mixed-spaces-and-tabs */
import googleColors from "@/assets/colors/googleColors.ts";
import useGlobalSettings from "@/assets/stores/useGlobalSettings.ts";
import useTranscodeConfig from "@/assets/stores/useTranscodeConfig";
import cssFunctions from "@/assets/styles/cssFunctions.ts";
import cssPresets from "@/assets/styles/cssPresets.ts";
import BiLayerDiv from "@/components/reFrame/BiLayerDiv/BiLayerDiv.tsx";
import warningToast from "@/utils/warningToast.tsx";
import {css} from "@emotion/react";
import {Button, Radio, Spin, Switch} from "antd";
import {isEmpty, isNull, isUndefined} from "lodash";
import {useEffect, useMemo, useRef, useState} from "react";
import toast from "react-hot-toast";
import {IoKey} from "react-icons/io5";
import {useCopyToClipboard} from "usehooks-ts";

const GenRsa = (props: {}) => {
	const {
		genRsaLength,
		setGenRsaLength,
		private_key,
		public_key,
		public_key_b64,
		private_key_b64,
		setPrivateKey,
		setPrivateKeyB64,
		setPublicKey,
		setPublicKeyB64,
		clearKeys,
		isBase64, setIsBase64
	} = useTranscodeConfig()
	const [copiedText, copy] = useCopyToClipboard()
	const [isLoading, setIsLoading] = useState(false)
	const [isWorkerReady, setIsWorkerReady] = useState(false)
	const options = [
		512, 1024, 2048, 4096
	];
	const {pageMargin} = useGlobalSettings()
	const workerRef = useRef<Worker | null>(null);
	useEffect(() => {
		// 初始化 Worker 一次
		if (!workerRef.current) {
			setIsWorkerReady(false)
			workerRef.current = new Worker(new URL('../utils/genRsaWorker.js', import.meta.url), {type: "module"});
			workerRef.current.onmessage = (e) => {
				if (e.data['private_key']) setPrivateKey(e.data['private_key']);
				if (e.data['public_key']) setPublicKey(e.data['public_key']);
				if (e.data['private_key_b64']) setPrivateKeyB64(e.data['private_key_b64']);
				if (e.data['public_key_b64']) setPublicKeyB64(e.data['public_key_b64']);
				setIsLoading(false);
				toast.success("Worker 加载成功！");
			};
			workerRef.current.onerror = (error) => {
				console.error("Worker 加载失败:", error.message);
				warningToast("Worker 加载失败，请刷新页面");
			};
			setIsWorkerReady(true)
		}
	}, []);


	const copy_text = (i: string) => {
		copy(i).then(() => {
			toast.success("已复制")
		}).catch((e) => {
			warningToast("无法获取剪贴板权限")
		})
	}


	const runWorker = async () => {
		if (isLoading) return;
		setIsLoading(true)
		clearKeys()
		workerRef?.current?.postMessage(genRsaLength)
	}
	return <>
		<BiLayerDiv innerMaxWidth={600} px={pageMargin}>
			<div css={GenRsa_css}>
				<h1>RSA生成</h1>
				<div className="config">
					<div className="line">
						<div className="t1">生成位数</div>
						<Radio.Group disabled={isLoading} options={options} optionType="button" value={genRsaLength}
						             onChange={(e) => setGenRsaLength(e.target.value)}
						             buttonStyle="solid"/>
					</div>
					<div className="line">
						<Switch disabled={isLoading} value={isBase64} onChange={(x) => setIsBase64(x)}/>
						<div className="t2">{isBase64 ? "以Base64编码" : "普通Text编码"}</div>
						<Button autoInsertSpace={false} type={"primary"} loading={isLoading}
						        onClick={runWorker}
						        disabled={!isWorkerReady}
						        style={{width: 150, marginLeft: 15}}>{isWorkerReady ? "生成" : "加载中"}</Button>
					</div>
				</div>
				{isLoading && <div className="loading_text">
					<Spin/>
					<div style={{color: googleColors.blue800}}>正在本地生成，速度取决于当前设备算力...</div>
				</div>}
				{!isLoading && private_key.length > 0 && <div className="k">
					<div className="pub_k" onClick={() => {
						if (isBase64) {
							return copy_text(public_key_b64)
						}
						copy_text(public_key)
					}}>
						<IoKey size={35} color={googleColors.blue200}/>
						<div className="t">
							<div className="t1">公钥</div>
							{isBase64 && <div className="b64">Base64</div>}
						</div>
						<div className="t2">公开传输，用于加密</div>
					</div>
					<div className="pri_k" onClick={() => {
						if (isBase64) {
							return copy_text(private_key_b64)
						}
						copy_text(private_key)
					}}>
						<IoKey size={35} color={googleColors.gray50}/>
						<div className="t">
							<div className="t1">私钥</div>
							{isBase64 && <div className="b64">Base64</div>}
						</div>
						<div className="t2">绝对保密，用于解密</div>
					</div>
				</div>}
				{!isLoading && private_key.length > 0 && <div className="xh" onClick={clearKeys}>销毁密钥</div>}
			</div>
		</BiLayerDiv>
	</>
}

export default GenRsa

const GenRsa_css = css({
	width: "100%",
	display: "block",
	"h1": {
		fontSize: 20,
		fontWeight: 300,
		marginTop: 25,
		marginBottom: 25,
	},
	".config": {
		".line": {
			...cssPresets.flexCenter,
			...cssFunctions.py(5),
			".t1": {
				marginRight: 5
			},
			".t2": {
				width: 120
			}
		}
	},
	".loading_text": {
		...cssFunctions.py(25),
		...cssPresets.flexCenter,
		flexDirection: "column",
		gap: 15,
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
	".k": {
		width: "100%",
		maxWidth: 250,
		marginTop: 25,
		...cssPresets.mxAuto,
		borderRadius: 12,
		overflow: "hidden",
		"& .t": {
			...cssPresets.flexCenter,
			width: "100%",
		},
		"& .t .t1": {
			fontSize: 20,
		}, "& .t .b64": {
			fontSize: 12,
			...cssFunctions.px(10),
			marginLeft: 5,
			...cssPresets.flexCenter,
			height: 20,
			borderRadius: 999
		},
		"& .t2": {
			fontSize: 14,
			marginTop: 10,
		},
		".pub_k": {
			backgroundColor: googleColors.blue800,
			...cssFunctions.py(20),
			...cssPresets.transition,
			cursor: "pointer",
			"&:active": {
				backgroundColor: googleColors.blue600
			},
			".t1": {
				color: googleColors.blue200,
			},
			".b64": {
				backgroundColor: googleColors.blue50,
				color: googleColors.blue800
			},
			"& .t2": {
				color: googleColors.blue100
			}
		},
		".pri_k": {
			backgroundColor: googleColors.blueGray300,
			...cssFunctions.py(20),
			...cssPresets.transition,
			cursor: "pointer",
			"&:active": {
				backgroundColor: googleColors.blueGray200
			},
			".t1": {
				color: googleColors.gray200,
			},
			"& .t2": {
				color: googleColors.gray50
			},
			".b64": {
				backgroundColor: googleColors.gray50,
				color: googleColors.blueGray200
			}
		},
	}
})
