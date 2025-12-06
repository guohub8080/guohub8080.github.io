import React from "react";
import psLogo from "../icons/ps.svg";
import vueLogo from "../icons/vue.svg";
import cubaseLogo from "../icons/cubase.svg";
import reactLogo from "../icons/react.svg";
import pythonIcon from "../icons/pythonIcon.svg";
import mtkit_logo from "../../../assets/svgs/logoSvg/mtkitLogo.svg";

const Skill: React.FC = () => {
  const iconSize = 40;

  return (
    <div>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-border/60"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-6 py-2 text-foreground rounded-full shadow-sm border border-border/50 text-sm">技能</span>
        </div>
      </div>
      
      <div className="flex justify-center px-5">
        <div className="w-fit p-1.5 gap-4 flex flex-wrap justify-center items-center">
          <div className="border border-border bg-card rounded-lg p-2.5 pt-3 pb-3 w-[120px] text-center">
            <img src={psLogo} style={{ width: iconSize }} alt="" className="mx-auto" />
            <div className="mb-1.5 mt-3 text-card-foreground text-sm">
              Photoshop
            </div>
            <div className="text-muted-foreground text-xs">
              <div>熟练</div>
            </div>
          </div>
          
          <div className="border border-border bg-card rounded-lg p-2.5 pt-3 pb-3 w-[120px] text-center">
            <img src={pythonIcon} style={{ width: iconSize }} alt="" className="mx-auto" />
            <div className="mb-1.5 mt-3 text-card-foreground text-sm">
              Python
            </div>
            <div className="text-muted-foreground text-xs">
              <div>熟练</div>
            </div>
          </div>
          
          <div className="border border-border bg-card rounded-lg p-2.5 pt-3 pb-3 w-[120px] text-center">
            <img src={vueLogo} style={{ width: iconSize }} alt="" className="mx-auto" />
            <div className="mb-1.5 mt-3 text-card-foreground text-sm">
              Vue.js
            </div>
            <div className="text-muted-foreground text-xs">
              <div>掌握</div>
            </div>
          </div>
          
          <div className="border border-border bg-card rounded-lg p-2.5 pt-3 pb-3 w-[120px] text-center">
            <img src={reactLogo} style={{ width: iconSize }} alt="" className="mx-auto" />
            <div className="mb-1.5 mt-3 text-card-foreground text-sm">
              React.js
            </div>
            <div className="text-muted-foreground text-xs">
              <div>熟练</div>
            </div>
          </div>
          
          <div className="border border-border bg-card rounded-lg p-2.5 pt-3 pb-3 w-[120px] text-center">
            <img src={mtkit_logo} style={{ width: iconSize }} alt="" className="mx-auto" />
            <div className="mb-1.5 mt-3 text-card-foreground text-sm">
              乐理
            </div>
            <div className="text-muted-foreground text-xs">
              <div>熟悉</div>
            </div>
          </div>
          
          <div className="border border-border bg-card rounded-lg p-2.5 pt-3 pb-3 w-[120px] text-center">
            <img src={cubaseLogo} style={{ width: iconSize }} alt="" className="mx-auto" />
            <div className="mb-1.5 mt-3 text-card-foreground text-sm">
              音乐宿主
            </div>
            <div className="text-muted-foreground text-xs">
              <div>入门</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skill;

