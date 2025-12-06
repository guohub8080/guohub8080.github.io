import React from "react";
import { useColorState } from "./state/useColorState.ts";
import { PreviewPanel } from "./components/PreviewPanel.tsx";
import { ModesPanel } from "./components/ModesPanel.tsx";

const Color: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<"info" | "google" | "tailwind">("info");
  const {
    hex,
    setHex,
    rgba,
    hsla,
    displayOklch,
    invalid,
    displayHex,
    displayRgba,
    displayHsla,
    handlePickWithEyedropper,
    handlePickWithInput,
    colorInputRef,
    copyValue,
    universalInput,
    setUniversalInput,
    detectedKind,
    recognizeUniversalInput,
  } = useColorState();

  console.log('Color component mounted, current hex:', hex);

  return (
    <div className="px-6 py-6 max-w-6xl mx-auto">
      {/* 顶部 Tabs */}
      <div className="mb-4">
        <div className="inline-flex items-center gap-2 rounded-xl border bg-background p-1">
          <button
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${activeTab === "info" ? "bg-foreground text-background" : "text-foreground hover:bg-muted"}`}
            onClick={() => setActiveTab("info")}
            aria-pressed={activeTab === "info"}
          >
            <span className="inline-block h-4 w-4 rounded-sm bg-gradient-to-br from-pink-500 to-violet-500" aria-hidden />
            <span>颜色信息</span>
          </button>
          <button
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${activeTab === "google" ? "bg-foreground text-background" : "text-foreground hover:bg-muted"}`}
            onClick={() => setActiveTab("google")}
            aria-pressed={activeTab === "google"}
          >
            <span className="inline-block h-4 w-4 rounded-sm bg-[#1a73e8]" aria-hidden />
            <span>Google color</span>
          </button>
          <button
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${activeTab === "tailwind" ? "bg-foreground text-background" : "text-foreground hover:bg-muted"}`}
            onClick={() => setActiveTab("tailwind")}
            aria-pressed={activeTab === "tailwind"}
          >
            <span className="inline-block h-4 w-4 rounded-sm bg-teal-500" aria-hidden />
            <span>tailwind color</span>
          </button>
        </div>
      </div>

      {activeTab === "info" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* 左侧：大色块 + 两个按钮 */}
          <div className="lg:col-span-1">
            <PreviewPanel
              hex={hex}
              setHex={setHex}
              rgba={rgba}
              hsla={hsla}
              invalid={invalid}
              onPickWithInput={handlePickWithInput}
              onPickWithEyedropper={handlePickWithEyedropper}
              colorInputRef={colorInputRef}
              displayHex={displayHex}
              displayRgba={displayRgba}
              displayHsla={displayHsla}
              displayOklch={displayOklch}
              simple
            />
          </div>

          {/* 右侧：万能识别框 + 多模式色值（可复制） */}
          <div className="lg:col-span-2 space-y-6">
            {/* 万能识别框（移到右侧） */}
            <div className="rounded-2xl border bg-card p-5">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  万能识别框
                </label>
                {detectedKind ? (
                  <span className="rounded-full border border-muted-foreground/30 bg-muted px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {detectedKind}
                  </span>
                ) : null}
              </div>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  value={universalInput}
                  onChange={(e) => setUniversalInput(e.target.value)}
                  placeholder="支持 HEX / RGB(A) / HSL(A) / OKLCH 等多种格式"
                />
                <button
                  className="rounded-lg border bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-accent hover:text-accent-foreground"
                  onClick={recognizeUniversalInput}
                >
                  识别
                </button>
              </div>
              <div className="mt-2 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
                <span>当前 HEX：{displayHex || "--"}</span>
                <span className="hidden sm:block">HSL：{displayHsla || "--"}</span>
                <span>RGBA：{displayRgba || "--"}</span>
                {displayOklch ? <span>OKLCH：{displayOklch}</span> : null}
              </div>
            </div>

            <ModesPanel
              displayHex={displayHex}
              displayRgba={displayRgba}
              displayHsla={displayHsla}
              displayOklch={displayOklch}
              onCopy={copyValue}
            />
          </div>
        </div>
      )}

      {activeTab === "google" && (
        <div className="rounded-xl border p-6 text-muted-foreground">
          Google color（预留）
        </div>
      )}

      {activeTab === "tailwind" && (
        <div className="rounded-xl border p-6 text-muted-foreground">
          tailwind color（预留）
        </div>
      )}
    </div>
  );
};

export default Color;


