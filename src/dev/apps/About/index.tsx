import React, { useEffect, useState } from "react";
import { useWindowScroll } from "react-use";
import TypeWriter from "./components/TypeWriter";
import FollowMe from "./components/FollowMe.tsx";
import IntroduceTags from "./components/IntroduceTags.tsx";
import Certificate from "./components/Certificate.tsx";
import Skill from "./components/Skill.tsx";
import Intresting from "./components/Intresting.tsx";
import PublicAnn from "./components/PublicAnn.tsx";
import { GradientText } from "../../shadcn/components/text/GradientText";

const About: React.FC = () => {
  const [maskTransparency, setMaskTransparency] = useState(0.5);
  const windowScroll = useWindowScroll();

  useEffect(() => {
    if (windowScroll.y >= 250) {
      setMaskTransparency(0.6);
    } else {
      setMaskTransparency(0);
    }
  }, [windowScroll]);

  return (
    <div className="w-full min-h-screen">


      {/* Main Content */}
      <div className="max-w-[650px] mx-auto px-4 mb-12">
        <div className="w-full rounded-lg pb-6">
          {/* Introduction */}
          <div className="text-3xl text-card-foreground pt-0 flex items-center w-full justify-center mb-6 mt-6">
            <span className="block whitespace-nowrap">你好，我是</span>
            <GradientText
              className="block font-bold tracking-tight leading-tight ml-1"
              text="方块郭"
              gradient="linear-gradient(135deg, #3b82f6 0%, #8b5cf6 33%, #06b6d4 66%, #3b82f6 100%)"
            />
          </div>

          <div className="mb-4">
            <IntroduceTags />
          </div>

          <div className="mb-10">
            <FollowMe />
          </div>

          <div className="mb-10">
            <Certificate />
          </div>

          <div className="mb-10">
            <Skill />
          </div>

          <div className="mb-10">
            <Intresting />
          </div>

          <div className="mb-10">
            <PublicAnn />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
