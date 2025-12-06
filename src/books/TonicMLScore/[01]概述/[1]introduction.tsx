/** @jsxImportSource react */
import React from 'react';
import H1 from '../../../dev/components/mdx/components/headings/H1.tsx';

const title = "TonicML Score 简介";

const ProcessText1: React.FC = () => {
  return (
    <div className="space-y-6">
      <H1>{title}</H1>
      
      <div className="space-y-4">
        <p className="text-lg text-muted-foreground">
          TonicML Score 是基于 TonicML 语言的乐谱生成系统，
          可以将你的音乐想法转换为美观的乐谱展示。
        </p>
        
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-3">主要特性</h2>
          <ul className="space-y-2 list-disc list-inside text-muted-foreground">
            <li>支持五线谱和简谱</li>
            <li>支持多种音符和符号</li>
            <li>可导出为多种格式</li>
            <li>实时预览和编辑</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProcessText1;

