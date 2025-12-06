import React from "react";
import beian from "../icons/beian.svg";
import zone from "../icons/zone.svg";
import webName from "../icons/webName.svg";
import lineRoad from "../icons/lineRoad.svg";

const PublicAnn: React.FC = () => {
  const iconSize = 40;

  return (
    <div>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-border/60"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-6 py-2 text-foreground rounded-full shadow-sm border border-border/50 text-sm">网站备案公示</span>
        </div>
      </div>
      
      <div className="flex justify-center px-5">
        <div className="w-fit p-1.5 gap-4 flex flex-wrap justify-center items-center">
          <div className="border border-border bg-card rounded-lg p-2.5 pt-3 pb-3 w-[240px] text-center">
            <img src={beian} style={{ width: iconSize }} alt="" className="mx-auto" />
            <div className="mb-1.5 mt-3 text-card-foreground text-sm">
              备案号
            </div>
            <div className="text-muted-foreground text-xs">
              <div>京ICP备2023017358号-1</div>
            </div>
          </div>
          
          <div className="border border-border bg-card rounded-lg p-2.5 pt-3 pb-3 w-[240px] text-center">
            <img src={zone} style={{ width: iconSize }} alt="" className="mx-auto" />
            <div className="mb-1.5 mt-3 text-card-foreground text-sm">
              网站内容
            </div>
            <div className="text-muted-foreground text-xs">
              <div>博客/个人空间</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center px-5">
        <div className="w-fit p-1.5 gap-4 flex flex-wrap justify-center items-center">
          <div className="border border-border bg-card rounded-lg p-2.5 pt-3 pb-3 w-[240px] text-center">
            <img src={webName} style={{ width: iconSize }} alt="" className="mx-auto" />
            <div className="mb-1.5 mt-3 text-card-foreground text-sm">
              域名
            </div>
            <div className="text-muted-foreground text-xs">
              <div>guohub.top</div>
            </div>
          </div>
          
          <div className="border border-border bg-card rounded-lg p-2.5 pt-3 pb-3 w-[240px] text-center">
            <div className="w-10 h-10 flex justify-center items-center mx-auto">
              <img src={lineRoad} className="w-[33px]" alt="" />
            </div>
            <div className="mb-1.5 mt-3 text-card-foreground text-sm">
              服务类型
            </div>
            <div className="text-muted-foreground text-xs">
              <div>网站应用服务</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicAnn;

