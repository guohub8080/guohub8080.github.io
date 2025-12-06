import React from "react";
import elecLogo from "../icons/electronic.svg";
import internetLogo from "../icons/Internet.svg";
import musicLogo from "../icons/music.svg";
import artLogo from "../icons/art.svg";
import game from "../icons/game.svg";
import manual from "../icons/manual.svg";

const Intresting: React.FC = () => {
  const iconSize = 40;

  return (
    <div>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-border/60"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-6 py-2 text-foreground rounded-full shadow-sm border border-border/50 text-sm">兴趣领域</span>
        </div>
      </div>
      
      <div className="flex justify-center px-5">
        <div className="w-fit p-1.5 gap-4 flex flex-wrap justify-center items-center">
          <div className="border border-border bg-card rounded-lg p-2.5 pt-3 pb-3 w-[120px] text-center">
            <div className="w-10 h-10 flex justify-center items-center mx-auto">
              <img src={elecLogo} className="w-[33px]" alt="" />
            </div>
            <div className="mb-1.5 mt-3 text-card-foreground text-sm">
              电子科技
            </div>
            <div className="text-muted-foreground text-xs">
              <div>硬件新闻</div>
            </div>
          </div>
          
          <div className="border border-border bg-card rounded-lg p-2.5 pt-3 pb-3 w-[120px] text-center">
            <img src={internetLogo} style={{ width: iconSize }} alt="" className="mx-auto" />
            <div className="mb-1.5 mt-3 text-card-foreground text-sm">
              互联网
            </div>
            <div className="text-muted-foreground text-xs">
              <div>软件与体验</div>
            </div>
          </div>
          
          <div className="border border-border bg-card rounded-lg p-2.5 pt-3 pb-3 w-[120px] text-center">
            <img src={musicLogo} style={{ width: iconSize }} alt="" className="mx-auto" />
            <div className="mb-1.5 mt-3 text-card-foreground text-sm">
              音乐
            </div>
            <div className="text-muted-foreground text-xs">
              <div>流行/爵士</div>
            </div>
          </div>
          
          <div className="border border-border bg-card rounded-lg p-2.5 pt-3 pb-3 w-[120px] text-center">
            <img src={artLogo} style={{ width: iconSize }} alt="" className="mx-auto" />
            <div className="mb-1.5 mt-3 text-card-foreground text-sm">
              书法/绘画
            </div>
            <div className="text-muted-foreground text-xs">
              <div>欣赏他人</div>
            </div>
          </div>
          
          <div className="border border-border bg-card rounded-lg p-2.5 pt-3 pb-3 w-[120px] text-center">
            <img src={game} style={{ width: iconSize }} alt="" className="mx-auto" />
            <div className="mb-1.5 mt-3 text-card-foreground text-sm">
              游戏
            </div>
            <div className="text-muted-foreground text-xs">
              <div>休闲/桌游</div>
            </div>
          </div>
          
          <div className="border border-border bg-card rounded-lg p-2.5 pt-3 pb-3 w-[120px] text-center">
            <img src={manual} style={{ width: iconSize }} alt="" className="mx-auto" />
            <div className="mb-1.5 mt-3 text-card-foreground text-sm">
              手工
            </div>
            <div className="text-muted-foreground text-xs">
              <div>偏爱DIY</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intresting;

