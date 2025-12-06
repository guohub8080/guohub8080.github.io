/* eslint-disable no-mixed-spaces-and-tabs */
import useTranscodeConfig from "../store/useTranscodeConfig.ts";
import {isNull, isUndefined} from "lodash";
import {useEffect, useMemo, useRef, useState} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import toast from "react-hot-toast";
import {IoKey} from "react-icons/io5";
import {useCopyToClipboard} from "usehooks-ts";
import { Button } from "../../../shadcn/components/ui/button.tsx";
import { Badge } from "../../../shadcn/components/ui/badge.tsx";

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
    const workerRef = useRef<Worker | null>(null);
    const lastGenLengthRef = useRef<number>(genRsaLength);
    const [lastGenLength, setLastGenLength] = useState<number | null>(null);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmMode, setConfirmMode] = useState<"destroy" | "regenerate" | null>(null);
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
				// toast.success("Worker 加载成功！");
				console.log("Worker 加载成功！");
                setLastGenLength(lastGenLengthRef.current);
                setIsRegenerating(false);
			};
			workerRef.current.onerror = (error) => {
				console.error("Worker 加载失败:", error.message);
                toast.error("Worker 加载失败，请刷新页面");
			};
			setIsWorkerReady(true)
		}
	}, []);


	const copyKey = (kind: 'public' | 'private') => {
		const content = isBase64
			? (kind === 'public' ? public_key_b64 : private_key_b64)
			: (kind === 'public' ? public_key : private_key);
		const label = kind === 'public' ? '公钥' : '私钥';
		const tid = toast.loading(`复制${label}中...`)
		Promise.resolve()
			.then(() => copy(content))
			.then(() => {
				toast.success(`已复制${label}`, { id: tid })
			})
			.catch(() => {
				toast.error("无法获取剪贴板权限", { id: tid })
			})
	}


	const runWorker = async () => {
		if (isLoading) return;
		setIsLoading(true)
		clearKeys()
		lastGenLengthRef.current = genRsaLength
		workerRef?.current?.postMessage(genRsaLength)
	}

    const handleDestroy = () => {
        if (isLoading) return;
        setConfirmMode("destroy");
        setIsConfirmOpen(true);
    };

    const handleRegenerate = () => {
        if (isLoading) return;
        setConfirmMode("regenerate");
        setIsConfirmOpen(true);
    };
    return <>
        <div className="w-full flex justify-center px-4">
            <div className="w-full border border-border rounded-2xl p-5 shadow-sm bg-white/70 dark:bg-neutral-900/60 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md mx-auto" style={{maxWidth: 600}}>
                <h1 className="text-2xl font-semibold tracking-tight mb-4">RSA生成</h1>
				<div className="space-y-3">
                    {/* 生成位数（仅未生成或正在重新生成时显示） */}
                    {(!private_key || private_key.length === 0 || isRegenerating) && (
                        <div className="flex items-center justify-between gap-3">
                            <div className="text-sm text-muted-foreground w-[80px] shrink-0">生成位数</div>
                            <div className="flex-1">
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
								{[512,1024,2048,4096].map(v => {
									const active = genRsaLength===v;
									return (
										<div
											key={v}
											onClick={() => { if (isLoading) return; setGenRsaLength(v as any); }}
											className={
												"h-9 w-full rounded-md text-sm select-none cursor-pointer transition-all duration-150 flex items-center justify-center " +
												(active
													? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md ring-1 ring-primary/50"
													: "bg-background border border-input hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm") +
												(isLoading ? " opacity-50 pointer-events-none" : "")
											}
										>
											{v}
										</div>
									);
								})}
							</div>
                            </div>
                        </div>
                    )}

					{/* 编码格式（仅生成后显示）*/}
                    {(private_key && private_key.length > 0 && !isRegenerating) && (
						<div className="flex items-center justify-between gap-3">
							<div className="text-sm text-muted-foreground w-[80px] shrink-0">编码格式</div>
							<div className="flex-1">
                                <div className="grid grid-cols-2 gap-2">
                                    <div
                                        onClick={() => { if (isLoading) return; setIsBase64(false); }}
                                        className={
                                            "h-9 w-full rounded-md text-sm select-none cursor-pointer transition-all duration-150 flex items-center justify-center " +
                                            (!isBase64
                                                ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md ring-1 ring-primary/50"
                                                : "bg-background border border-input hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm") +
                                            (isLoading ? " opacity-50 pointer-events-none" : "")
                                        }
                                    >
                                        普通Text
                                    </div>
                                    <div
                                        onClick={() => { if (isLoading) return; setIsBase64(true); }}
                                        className={
                                            "h-9 w-full rounded-md text-sm select-none cursor-pointer transition-all duration-150 flex items-center justify-center " +
                                            (isBase64
                                                ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md ring-1 ring-primary/50"
                                                : "bg-background border border-input hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm") +
                                            (isLoading ? " opacity-50 pointer-events-none" : "")
                                        }
                                    >
                                        Base64
                                    </div>
                                </div>
							</div>
						</div>
					)}

                    {/* 操作 */}
                    {!private_key || private_key.length === 0 ? (
                        <div className="flex justify-end pt-3">
                            <Button onClick={runWorker} disabled={!isWorkerReady} className="w-[150px]">{isWorkerReady? (isLoading?"生成中...":"生成") : "加载中"}</Button>
                        </div>
                    ) : null}
				</div>
                {isLoading && <div className="py-6 flex items-center justify-center flex-col gap-4">
                    <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent"/>
                    <div className="text-muted-foreground">正在本地生成，速度取决于当前设备算力...</div>
                </div>}
                {!isLoading && private_key.length > 0 && <div className="mt-6 grid grid-cols-1 gap-4">
                    {/* 公钥卡片 */}
						<div
							className="rounded-xl p-5 bg-primary text-primary-foreground shadow-md hover:shadow-lg transition cursor-pointer active:scale-[0.99]"
							onClick={() => { copyKey('public'); }}
						>
                        <div className="flex items-center justify-center">
                            <IoKey size={35} color="currentColor"/>
                            <div className="ml-2 flex items-center">
                                <div className="text-[20px]">公钥</div>
                                {lastGenLength && <Badge variant="secondary" className="ml-2">{lastGenLength} bit</Badge>}
                                {isBase64 && <div className="ml-2 text-[12px] px-2 h-5 flex items-center rounded-full bg-primary-foreground/20 text-primary-foreground">Base64</div>}
                            </div>
                        </div>
                        <div className="text-[14px] mt-2 opacity-90 text-center">公开传输，用于加密</div>
                    </div>

                    {/* 私钥卡片（实色背景）*/}
						<div
							className="rounded-xl p-5 bg-neutral-900 text-neutral-50 shadow-md hover:shadow-lg transition cursor-pointer active:scale-[0.99]"
							onClick={() => { copyKey('private'); }}
						>
                        <div className="flex items-center justify-center">
                            <IoKey size={35} color="currentColor"/>
                            <div className="ml-2 flex items-center">
                                <div className="text-[20px]">私钥</div>
                                {lastGenLength && <Badge variant="outline" className="ml-2 border-white/30 text-white/90">{lastGenLength} bit</Badge>}
                                {isBase64 && <div className="ml-2 text-[12px] px-2 h-5 flex items-center rounded-full bg-white/15 text-white">Base64</div>}
                            </div>
                        </div>
                        <div className="text-[14px] mt-2 text-center opacity-90">绝对保密，用于解密</div>
                    </div>
                </div>}
                {!isLoading && private_key.length > 0 && (
                    <>
                        <div className="flex items-center justify-center gap-3 mt-4">
                            <Button onClick={handleRegenerate} disabled={isLoading || !isWorkerReady} variant="secondary" className="w-[150px]">重新生成</Button>
                            <Button variant="destructive" className="w-[150px]" onClick={handleDestroy}>销毁密钥</Button>
                        </div>
                        <div className="text-xs text-muted-foreground text-center mt-2">密钥仅存于当前页面内存，刷新或关闭页面将丢失，请及时复制或导出。</div>
                    </>
                )}

                {/* 销毁确认 - shadcn 风格对话框（Radix Dialog）*/}
                <Dialog.Root open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                    <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
                        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background p-6 shadow-lg focus:outline-hidden">
                            <Dialog.Title className="text-lg font-semibold">
                                {confirmMode === "regenerate" ? "重新生成" : "销毁密钥"}
                            </Dialog.Title>
                            <Dialog.Description className="mt-2 text-sm text-muted-foreground">
                                {confirmMode === "regenerate"
                                    ? "此操作将清除当前密钥并返回到生成配置。您可调整参数后再点击生成。"
                                    : "此操作不可恢复，将从内存中移除当前生成的公钥与私钥。确认继续？"}
                            </Dialog.Description>
                            <div className="mt-6 flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>取消</Button>
                                {confirmMode === "regenerate" ? (
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            clearKeys();
                                            setLastGenLength(null);
                                            setIsRegenerating(false);
                                            setIsConfirmOpen(false);
                                        }}
                                    >
                                        清除并返回配置
                                    </Button>
                                ) : (
                                    <Button
                                        variant="destructive"
                                        onClick={() => { clearKeys(); setLastGenLength(null); setIsConfirmOpen(false); }}
                                    >
                                        确认销毁
                                    </Button>
                                )}
                            </div>
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>
            </div>
        </div>
    </>
}

export default GenRsa
 
