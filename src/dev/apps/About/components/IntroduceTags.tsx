import React from "react";

interface TagsProps {
  content: string;
}

const Tags: React.FC<TagsProps> = ({ content }) => {
  return (
    <div className="text-xs bg-card text-card-foreground px-4 py-1.5 mx-1.5 my-1 rounded-full border border-border">
      {content}
    </div>
  );
};

const IntroduceTags: React.FC = () => {
  return (
    <div className="mt-2.5 flex justify-center flex-wrap">
      <Tags content="INTP" />
      <Tags content="1996" />
      <Tags content="水瓶座" />
      <Tags content="上班族" />
      <Tags content="宅男" />
      <Tags content="法学专业" />
      <Tags content="音乐爱好者" />
      <Tags content="设计爱好者" />
      <Tags content="编程爱好者" />
      <Tags content="DIY爱好者" />
    </div>
  );
};

export default IntroduceTags;

