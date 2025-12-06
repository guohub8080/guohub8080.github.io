/** @jsxImportSource react */
import React from "react"
import { GradientText } from "../../../shadcn/components/text/GradientText"
import RotateCube from "../RotateCube"
import URLTextSvg from "../../../assets/svgs/logoSvg/URLText.svg"

export default function Hero() {
  return (
    <div className="text-center max-w-[1152px] mx-auto px-6 pb-4">
      {/* 3D立方体 */}
      <RotateCube />
      
      {/* 主标题 */}
      <h1 className="text-4xl font-bold tracking-tight leading-tight mb-2">
        <GradientText
          text="方块郭的想象工厂"
          gradient="linear-gradient(135deg, #3b82f6 0%, #8b5cf6 33%, #06b6d4 66%, #3b82f6 100%)"
        />
      </h1>

      {/* URL标识 */}
      <div className="flex justify-center mb-4">
        <img src={URLTextSvg} alt="guohub.top" className="w-40 h-auto" />
      </div>

      {/* 副标题 */}
      <p className="text-base text-muted-foreground/90 max-w-[600px] mx-auto mb-0 leading-relaxed">
        个人站点·分享生活·记录灵感
      </p>
    </div>
  )
}
