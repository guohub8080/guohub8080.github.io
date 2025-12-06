import React from "react";
import law from "../icons/law.svg";
import psLogo from "../icons/Adobe.svg";

const Certificate: React.FC = () => {
  return (
    <div>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-border/60"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-6 py-2 text-foreground rounded-full shadow-sm border border-border/50 text-sm">教育 / 资格证书</span>
        </div>
      </div>
      
      <div className="flex justify-center px-5">
        <div className="w-fit p-1.5 gap-4 flex flex-wrap justify-center items-center">
          <div className="border border-border bg-card rounded-lg p-4 pt-5 pb-5 w-[230px] text-center">
            <img src={law} className="w-10 mx-auto" alt="" />
            <div className="text-sm mb-2.5 mt-3 text-card-foreground">法律</div>
            <div className="text-muted-foreground text-xs">
              <div>法学本科 / 国际法学硕士</div>
              <div>法律职业资格证书</div>
              <div>（法考A证）</div>
            </div>
          </div>
          
          <div className="border border-border bg-card rounded-lg p-4 pt-5 pb-5 w-[230px] text-center">
            <img src={psLogo} className="w-10 mx-auto" alt="" />
            <div className="text-sm mb-2.5 mt-3 text-card-foreground">设计</div>
            <div className="text-muted-foreground text-xs">
              <div>Adobe认证设计师</div>
              <div>创意设计</div>
              <div>影视后期</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;

