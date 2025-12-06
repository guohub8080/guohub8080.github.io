/* eslint-disable no-mixed-spaces-and-tabs */
import useTranscodeConfig from "../store/useTranscodeConfig.ts";
import {isEmpty} from "lodash";
import {useState} from "react";
import toast, {Toaster} from "react-hot-toast";
import {useCopyToClipboard} from "usehooks-ts";
import doCrypt from "../utils/doCrypt.ts"
import { Button } from "../../../shadcn/components/ui/button.tsx";
import { Badge } from "../../../shadcn/components/ui/badge.tsx";

const DecodeRsa = (props: {}) => {
	const {readyDecryptText, setReadyDecryptText, isBase64, setIsBase64} = useTranscodeConfig()
	const [rsaPrivateKey, setRsaPrivateKey] = useState("")
	const [encryptResult, setEncryptResult] = useState("")
	const [copiedText, copy] = useCopyToClipboard()
	const decrypt = () => {
		if (isEmpty(readyDecryptText)) {
            return toast.error("解密文字为空")
		}
		if (isEmpty(rsaPrivateKey)) {
            return toast.error("私钥为空")
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
            toast.error("解密出错，请检查私钥或信息")
			setEncryptResult("")
		}
	}

	const copy_text = (i: string) => {
		if (isEmpty(i)) return;
		const tid = toast.loading("复制中...")
		Promise.resolve()
			.then(() => copy(i))
			.then(() => toast.success("已复制", { id: tid }))
			.catch(() => toast.error("无法获取剪贴板权限", { id: tid }))
	}
	const clear = () => {
		setEncryptResult("")
		setReadyDecryptText("")
		setRsaPrivateKey("")
	}
    return <>
        <Toaster/>
        <div className="w-full flex justify-center px-4">
            <div className="w-full mx-auto border border-border rounded-2xl p-5 shadow-sm bg-white/70 dark:bg-neutral-900/60 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md" style={{maxWidth: 700}}>
                <h1 className="text-2xl font-semibold tracking-tight mb-4">RSA私钥解密</h1>
                <div className="my-5">
                    <div className="text-xs text-muted-foreground mb-1">密文</div>
                    <textarea
                        value={readyDecryptText}
                        onChange={(e) => setReadyDecryptText(e.target.value)}
                        placeholder="请输入要解密的密文"
                        className="w-full text-justify break-all text-[16px] rounded-md border border-input bg-background px-3 py-2 focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none min-h-20 code-font-family"
                        rows={4}
                    />
                </div>

                <div className="my-3">
                    <div className="text-xs text-muted-foreground mb-1">
                        <Badge variant={isBase64 ? 'default' : 'secondary'}>{isBase64 ? 'Base64编码密钥' : '普通文本私钥'}</Badge>
                    </div>
                    <textarea
                        value={rsaPrivateKey}
                        onChange={(e) => setRsaPrivateKey(e.target.value)}
                        placeholder="请输入私钥。请注意，私钥非常敏感，切勿泄露。本页面不保管私钥。"
                        className="w-full text-justify break-all text-[16px] rounded-md border-2 border-destructive bg-background px-3 py-2 focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none min-h-20 code-font-family"
                        rows={4}
                    />
                </div>
                <div className="flex items-center justify-end mt-2">
                    <Button onClick={decrypt} className="w-[150px]">解密</Button>
                </div>
                <div className="mt-3 border border-border rounded-xl overflow-hidden bg-background/80">
                    <div className="flex items-center justify-between px-3 py-2 border-b">
                        <div className="text-sm font-medium">解密结果</div>
                        {encryptResult.length > 0 && (
                            <Button variant="outline" size="sm" onClick={() => copy_text(encryptResult)}>复制</Button>
                        )}
                    </div>
                    <div
                        className="px-3 py-3 cursor-pointer break-words bg-muted/50"
                        style={{fontFamily: "var(--guohub-code-font-family)"}}
                        onClick={() => copy_text(encryptResult)}
                    >
                        {encryptResult || "..."}
                    </div>
                </div>
                {encryptResult.length > 0 && (
                    <div className="flex justify-center mt-4">
                        <Button variant="destructive" className="w-[150px]" onClick={clear}>清空</Button>
                    </div>
                )}
            </div>
        </div>
    </>
}

export default DecodeRsa
 
