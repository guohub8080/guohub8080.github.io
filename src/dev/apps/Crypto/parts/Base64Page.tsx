/* eslint-disable no-mixed-spaces-and-tabs */
import useGlobalSettings from "../../../store/useGlobalSettings";
import { Button } from "../../../shadcn/components/ui/button.tsx";
import { Badge } from "../../../shadcn/components/ui/badge.tsx";
import {Base64} from "js-base64";
import {isEmpty, reverse} from "lodash";
import {useMemo, useState} from "react";
import toast from "react-hot-toast";
import {useList} from "react-use";
import {useCopyToClipboard} from "usehooks-ts";

const Base64Page = (props: {}) => {
    const { bookContentWidth } = useGlobalSettings()
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
            // 基础合法性校验：长度与字符集
            const cleaned = origin_text.replace(/\s+/g, "")
            const base64Pattern = /^[A-Za-z0-9+/]+={0,2}$/
            if (cleaned.length % 4 !== 0 || !base64Pattern.test(cleaned)) {
                toast.error("格式不正确，可能不是 Base64 编码")
                return
            }

            const result = Base64.decode(cleaned)
            if (isEmpty(result)) {
                toast.error("解码结果为空，可能不是 Base64 编码")
                return
            }
            // 文本可读性校验：存在不可识别字符则提示
            const hasReplacement = /\uFFFD/.test(result)
            const hasControlChars = /[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(result)
            if (hasReplacement || hasControlChars) {
                toast.error("解码结果包含不可识别字符，可能不是 Base64 文本")
                return
            }

            listActions.push({
                from_text: origin_text,
                from_text_length: origin_text_length,
                to_text: result,
                to_text_length: result.length,
                isEncode: false,
                isDecode: true
            })
		} catch (e) {
            toast.error("解码错误，可能不是Base64编码")
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
            toast.error("无法获取剪贴板权限")
        })
	}
	const showResults = useMemo(() => reverse([...resultList]), [resultList])
    return <>
        <div className="w-full flex justify-center px-4">
            <div className="w-full border border-border rounded-2xl p-5 shadow-sm bg-white/70 dark:bg-neutral-900/60 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md" style={{maxWidth: 600}}>
                <h1 className="text-2xl font-semibold tracking-tight mb-4">Base64编码与解码</h1>
                <div className="w-full flex items-center mb-2">
                    <Badge variant="secondary">已输入：{textInput.length}</Badge>
                    <Button variant="outline" className="ml-auto" onClick={() => setTextInput("")}>清除</Button>
                </div>
                <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="请输入要编码或解码的内容"
                    className="w-full text-justify break-all text-[16px] rounded-md border border-input bg-background px-3 py-2 focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none min-h-20"
                    rows={4}
                />
                <div className="flex flex-wrap items-center justify-center mt-2 mb-2 gap-2">
                    <Button className="min-w-[220px]" onClick={encode}>文本 → Base64编码</Button>
                    <Button className="min-w-[220px]" onClick={decode}>Base64编码 → 文本</Button>
                </div>
            </div>
        </div>
        {/* 结果列表 - 独立于上方输入卡片之外 */}
        <div className="w-full flex justify-center px-4">
            <div className="w-full" style={{maxWidth: 600}}>
                <div className="pb-6 mt-4 space-y-4">
                    {showResults.map((item, index) => (
                        <div key={index} className="border border-border rounded-xl overflow-hidden bg-background/80">
                            {/* 卡片头 */}
                            <div className="flex items-center gap-2 px-3 py-2 border-b">
                                <Badge variant="outline" className="rounded-full size-5 p-0 text-[11px] flex items-center justify-center">{index + 1}</Badge>
                                <Badge variant={item.isEncode ? "default" : "secondary"}>{item.isEncode ? "Encode" : "Decode"}</Badge>
                                <div className="ml-auto text-xs text-muted-foreground">原文 {item.from_text_length} / 结果 {item.to_text_length}</div>
                                <Button variant="destructive" className="ml-2 h-7 px-3" onClick={() => del(index)}>删除</Button>
                            </div>
                            {/* 原文区域 */}
                            <div
                                className="px-3 py-2 cursor-pointer break-words"
                                style={{fontFamily: "var(--guohub-code-font-family)"}}
                                onClick={() => copy_text(item.from_text)}
                            >{item.from_text}</div>
                            {/* 结果区域 */}
                            <div
                                className="px-3 py-2 cursor-pointer break-words bg-muted/50"
                                style={{fontFamily: "var(--guohub-code-font-family)"}}
                                onClick={() => copy_text(item.to_text)}
                            >{item.to_text}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </>
}

export default Base64Page
 
