/* eslint-disable no-mixed-spaces-and-tabs */
import {useMemo} from "react";
import { Code, Key, Lock, Unlock, type LucideIcon } from "lucide-react";
import useTranscodeConfig from "../store/useTranscodeConfig.ts";

const tabs: { key: "base64" | "gen_rsa" | "encode_rsa" | "decode_rsa"; label: string; Icon: LucideIcon }[] = [
	{ key: "base64", label: "Base64", Icon: Code },
	{ key: "gen_rsa", label: "RSA生成", Icon: Key },
	{ key: "encode_rsa", label: "公钥加密", Icon: Lock },
	{ key: "decode_rsa", label: "私钥解密", Icon: Unlock },
]

const TranscodeNaviBar = (props: {}) => {
	const { transcodeMode, setTranscodeMode } = useTranscodeConfig();

	const activeKey = useMemo(() => {
		if (["", undefined, null, "base64"].includes(transcodeMode as any)) return "base64";
		return transcodeMode;
	}, [transcodeMode]);

	return <>
		<div className="w-full flex items-center justify-center py-3">
			<div
				className={
					"flex items-end gap-2 px-3 py-2 rounded-2xl border border-black/10 dark:border-white/10 " +
					"bg-white/70 dark:bg-neutral-900/60 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md " +
					"shadow-lg shadow-black/5 dark:shadow-black/30"
				}
			>
				{tabs.map((t) => {
					const isActive = activeKey === t.key;
					return (
						<button
							key={t.key}
							aria-pressed={isActive}
							onClick={() => setTranscodeMode(t.key)}
							className={
								"group select-none rounded-xl px-2 py-1 flex flex-col items-center justify-end gap-1 " +
								"transition-[background] " +
								(isActive ? "bg-primary/10" : "bg-transparent")
							}
						>
							{/* 图标圆形底座 */}
							<div
								className={
								"rounded-2xl w-[44px] h-[44px] flex items-center justify-center transition-transform duration-150 ease-out will-change-transform hover:scale-110 hover:-translate-y-1.5 " +
								(isActive
									? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
									: "bg-neutral-200/70 dark:bg-neutral-800/70 text-neutral-700 dark:text-neutral-200")
								}
							>
								<t.Icon size={20} />
							</div>
							{/* 文字标签（不放大） */}
							<div
								className={
									"text-[12px] leading-none mt-1 " +
									(isActive ? "text-primary" : "text-neutral-700 dark:text-neutral-300")
								}
							>
								{t.label}
							</div>
						</button>
					);
				})}
			</div>
		</div>
	</>
}

export default TranscodeNaviBar
