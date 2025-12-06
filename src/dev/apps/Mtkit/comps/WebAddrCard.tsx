import byDefault from "../../../utils/common/byDefault.ts";
import {isUndefined} from "lodash";
import {QRCodeSVG} from 'qrcode.react';
import toast from "react-hot-toast";
import {useCopyToClipboard} from "usehooks-ts"
import { Button } from "../../../shadcn/components/ui/button.tsx"
import { Card, CardContent } from "../../../shadcn/components/ui/card.tsx"

const WebAddrCard = (props: {
	url: string
	title: string
	w?: string
	showText?: string
	copyContent?: string
	copyInfo?: string
	img?: string
}) => {
	const w = byDefault(props.w, "320px")
	const [copiedText, copy] = useCopyToClipboard()
	const handClick = () => {
		const copyContent = byDefault(props.copyContent, props.url)
		copy(copyContent)
			.then(() => {
				console.log('复制成功')
				toast.success(byDefault(props.copyInfo, "复制成功"))
			})
			.catch(error => {
				console.error('无法复制，请检查浏览权限', error)
				toast.error('无法复制，请检查浏览权限', error)
			})
	}
	return <Card 
		className="cursor-pointer transition-all duration-300 hover:shadow-md"
		style={{width: w, maxWidth: 350}}
		onClick={handClick}
	>
		<CardContent className="flex flex-col items-center pt-4 pb-3">
			<QRCodeSVG
				value={props.url}
				size={128}
				bgColor={"#ffffff"}
				fgColor={"#000000"}
				level={"H"}
				imageSettings={isUndefined(props.img) ? void 0 as any : {
					src: props.img as string,
					height: 30,
					width: 30,
					excavate: true
				}}
			/>
			<div className="flex flex-col items-center">
				<div className="text-sm px-4 py-1 rounded-full mb-2 mt-4 text-blue-800 bg-blue-50">{props.title}</div>
				<div className="text-gray-800 px-2.5 py-1 rounded text-xs bg-gray-50 border border-gray-300 max-w-[280px] h-10 flex items-center justify-center text-center leading-tight overflow-hidden" style={{wordBreak: 'break-all', lineHeight: '1.2'}}>{byDefault(props.showText, props.url)}</div>
				<div className="flex items-center justify-center mt-3 w-full gap-2.5">
					<Button 
						variant="default" 
						size="sm" 
						className="px-6 py-1.5 text-sm"
						onClick={e => {
							e.stopPropagation()
							handClick()
						}}
					>
						复制
					</Button>
					<Button 
						variant="default" 
						size="sm" 
						className="px-6 py-1.5 text-sm"
						onClick={e => {
							e.stopPropagation()
							window.open(props.url, "_blank")
						}}
					>
						访问
					</Button>
				</div>
			</div>
		</CardContent>
	</Card>
}

export default WebAddrCard
