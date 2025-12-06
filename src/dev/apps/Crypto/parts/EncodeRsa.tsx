/* eslint-disable no-mixed-spaces-and-tabs */
import useTranscodeConfig from "../store/useTranscodeConfig.ts";
import {isEmpty} from "lodash";
import {useState} from "react";
import toast, {Toaster} from "react-hot-toast";
import {useCopyToClipboard} from "usehooks-ts";
import doCrypt from "../utils/doCrypt.ts"
import { Button } from "../../../shadcn/components/ui/button.tsx";
import { Badge } from "../../../shadcn/components/ui/badge.tsx";

const EncodeRsa = (props: {}) => {
    const {readyEncryptText, setReadyEncryptText, isBase64, setIsBase64} = useTranscodeConfig()
	const [rsaPubKey, setRsaPubKey] = useState("")
	const [encryptResult, setEncryptResult] = useState("")
    const [copiedText, copy] = useCopyToClipboard()
    const [history, setHistory] = useState<Array<{ id: string; isBase64: boolean; from: string; pub: string; result: string; createdAt: number;}>>([])
	const encrypt = () => {
		if (isEmpty(readyEncryptText)) {
            return toast.error("加密文字为空")
		}
		if (isEmpty(rsaPubKey)) {
            return toast.error("公钥为空")
		}
		try {
            if (isBase64) {
				const result = doCrypt.encrypt_string_by_b64_public_key(readyEncryptText, rsaPubKey)
				if (!result) throw Error()
                setEncryptResult(result)
                setHistory(prev => [...prev, { id: String(Date.now())+Math.random().toString(36).slice(2), isBase64: true, from: readyEncryptText, pub: rsaPubKey, result, createdAt: Date.now() }])
                return
			}
			const result = doCrypt.encrypt_string_by_text_public_key(readyEncryptText, rsaPubKey)
			if (!result) throw Error()
            setEncryptResult(result)
            setHistory(prev => [...prev, { id: String(Date.now())+Math.random().toString(36).slice(2), isBase64: false, from: readyEncryptText, pub: rsaPubKey, result, createdAt: Date.now() }])
            return
		} catch (e) {
			console.log(e)
            toast.error("加密出错，请检查公钥")
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
		setReadyEncryptText("")
		setRsaPubKey("")
	}

    const detectKeyType = (keyRaw: string) => {
        const key = keyRaw.trim()
        if (/-----BEGIN [^-]+-----/.test(key)) return 'pem' as const
        const cleaned = key.replace(/\s+/g, "")
        const base64Pattern = /^[A-Za-z0-9+/]+={0,2}$/
        if (cleaned.length > 0 && cleaned.length % 4 === 0 && base64Pattern.test(cleaned)) return 'base64' as const
        return 'unknown' as const
    }

    const detectedKind = rsaPubKey.trim() === "" ? 'empty' : detectKeyType(rsaPubKey)

    const encryptAuto = () => {
        if (isEmpty(readyEncryptText)) return toast.error("加密文字为空")
        if (isEmpty(rsaPubKey)) return toast.error("公钥为空")
        const key = rsaPubKey.trim()
        const kind = detectKeyType(key)

        try {
            if (kind === 'pem') {
                const result = doCrypt.encrypt_string_by_text_public_key(readyEncryptText, key)
                if (!result) throw Error()
                setIsBase64(false)
                setEncryptResult(result)
                setHistory(prev => [...prev, { id: String(Date.now())+Math.random().toString(36).slice(2), isBase64: false, from: readyEncryptText, pub: rsaPubKey, result, createdAt: Date.now() }])
                return
            }
            if (kind === 'base64') {
                const result = doCrypt.encrypt_string_by_b64_public_key(readyEncryptText, key)
                if (!result) throw Error()
                setIsBase64(true)
                setEncryptResult(result)
                setHistory(prev => [...prev, { id: String(Date.now())+Math.random().toString(36).slice(2), isBase64: true, from: readyEncryptText, pub: rsaPubKey, result, createdAt: Date.now() }])
                return
            }
            // 不明显时，尝试文本->失败再尝试Base64
            try {
                const result = doCrypt.encrypt_string_by_text_public_key(readyEncryptText, key)
                if (!result) throw Error()
                setIsBase64(false)
                setEncryptResult(result)
                setHistory(prev => [...prev, { id: String(Date.now())+Math.random().toString(36).slice(2), isBase64: false, from: readyEncryptText, pub: rsaPubKey, result, createdAt: Date.now() }])
                return
            } catch {}
            const result = doCrypt.encrypt_string_by_b64_public_key(readyEncryptText, key)
            if (!result) throw Error()
            setIsBase64(true)
            setEncryptResult(result)
            setHistory(prev => [...prev, { id: String(Date.now())+Math.random().toString(36).slice(2), isBase64: true, from: readyEncryptText, pub: rsaPubKey, result, createdAt: Date.now() }])
        } catch (e) {
            toast.error("无法识别公钥格式或加密失败，请检查公钥内容")
            setEncryptResult("")
        }
    }
    return <>
        <Toaster/>
		<div className="w-full flex justify-center px-4">
			<div className="w-full mx-auto border border-border rounded-2xl p-5 shadow-sm bg-white/70 dark:bg-neutral-900/60 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md" style={{maxWidth: 700}}>
                <h1 className="text-2xl font-semibold tracking-tight mb-4">RSA公钥加密</h1>
                <div className="my-5">
                    <div className="text-xs text-muted-foreground mb-1">原文</div>
                    <textarea
                        value={readyEncryptText}
                        onChange={(e) => setReadyEncryptText(e.target.value)}
                        placeholder="请输入要加密的明文"
                        className="w-full text-justify break-all text-[16px] rounded-md border border-input bg-background px-3 py-2 focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none min-h-20"
                        rows={4}
                    />
                </div>

                <div className="my-3">
                    <div className="text-xs text-muted-foreground mb-1">
                        <Badge variant={detectedKind === 'base64' ? 'default' : 'secondary'}>
                            {rsaPubKey.trim() === '' ? '公钥' : (detectedKind === 'base64' ? 'Base64编码密钥' : '普通文本公钥')}
                        </Badge>
                    </div>
                    <textarea
                        value={rsaPubKey}
                        onChange={(e) => {
                            const v = e.target.value
                            setRsaPubKey(v)
                        }}
                        placeholder="公钥"
                        className="w-full text-justify break-all text-[16px] rounded-md border-2 border-primary bg-background px-3 py-2 focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none min-h-20 code-font-family"
                        rows={4}
                    />
                </div>
                <div className="flex items-center justify-center mt-3">
                    <Button className="min-w-[220px]" onClick={encryptAuto}>加密</Button>
                </div>
            </div>
        </div>

		{history.length > 0 && (
			<div className="w-full flex justify-center px-4">
				<div className="w-full mx-auto" style={{maxWidth: 700}}>
                    <div className="mt-4 space-y-4">
                        {history.map((h, i) => (
                            <div key={h.id} className="border border-border rounded-xl overflow-hidden bg-background/80">
                                <div className="flex items-center gap-2 px-3 py-2 border-b">
                                    <Badge variant="outline" className="rounded-full size-5 p-0 text-[11px] flex items-center justify-center">{i+1}</Badge>
                                    <Badge variant={h.isBase64 ? "default" : "secondary"}>{h.isBase64 ? "Base64公钥" : "Text公钥"}</Badge>
                                    <div className="ml-auto text-xs text-muted-foreground">{new Date(h.createdAt).toLocaleString()}</div>
                                    <Button variant="destructive" className="ml-2 h-7 px-3" onClick={() => setHistory(prev => prev.filter(x => x.id !== h.id))}>删除</Button>
                                </div>
                                <div className="px-3 py-2 text-[12px] text-muted-foreground">原文</div>
                                <div className="px-3 py-2 break-words cursor-pointer" style={{fontFamily: "var(--guohub-code-font-family)"}} onClick={() => copy_text(h.from)}>{h.from}</div>
                                <div className="px-3 py-2 text-[12px] text-muted-foreground">加密结果</div>
                                <div className="px-3 py-2 break-words bg-muted/50 cursor-pointer" style={{fontFamily: "var(--guohub-code-font-family)"}} onClick={() => copy_text(h.result)}>{h.result}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
    </>
}

export default EncodeRsa
 
