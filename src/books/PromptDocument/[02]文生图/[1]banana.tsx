/** @jsxImportSource react */
import React, { useState, useEffect } from 'react';
import { Textarea } from '../../../dev/shadcn/components/ui/textarea.tsx';
import { Badge } from '../../../dev/shadcn/components/ui/badge.tsx';
import PromptWindow from '../data/components/PromptWindow.tsx';
import H1 from '../../../dev/components/mdx/components/headings/H1.tsx';

const ProcessText1: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [processedText, setProcessedText] = useState('');

  // 当输入文本变化时自动更新处理结果
  useEffect(() => {
    const promptText = `你是一位精通中国公文写作的专家级AI助手。你的唯一任务是接收我提供的文本内容，并严格按照以下规则将其整理成标准的公文格式。

一、核心任务
将我给我你的全部原始内容，转换为结构清晰、层级分明的公文格式文本。原始内容会放在后面，并用\`\`\`代码块\`\`\`包裹。

二、格式规范
在整理过程中，必须且只能遵循以下层级编号体系：
第一层级：使用中文数字加顿号，如"一、"、"二、"、"三、"，单独成行，属于概括性的层级，不加句号，例如：“一、背景情况”“二、问题分析”。
第二层级：使用括号包裹的中文数字加顿号，如"（一）"、"（二）"、"（三）"。该层级既可单独成行，也可置于段首。无论位置如何，均需在序号后给出简明的小标题并以句号收束，属于概括性句子，例如：“（一）我单位采取多种措施应对某某问题。”“（二）用心做好某某工作。”。
第三层级：在段落内部，使用"一是……。二是……。三是……"的句式进行分点阐述，不单独成行，不再使用任何序号或项目符号，通常用于对第二层级的说明、论证或展开。为保持连贯性，可在必要时补充“此外”“同时”“对此”等过渡衔接语。

三、严格禁止
- 禁止使用任何Markdown格式，包括但不限于标题（#）、列表（*、-）、粗体（**）等。
- 禁止使用任何形式的阿拉伯数字作为标题或列表编号，如"1."、"(1)"、"①"等。
- 禁止使用除规定层级符号外的任何其他项目符号，如"·"、"●"、"■"等。
- 禁止使用任何形式表格、图片、图表、流程图等，需要使用时，请使用文字描述。

四、输出要求
- 直接输出整理后的纯文本内容。
- 不要包含任何前言、摘要、结语或解释性文字。输出结果应为可以直接复制使用的最终文稿。

五、用语规范提示
- 语体要求。坚持庄重、严谨、规范的机关公文语体，避免口语化、感叹式和修辞过度的表达，常用“为”“予以”“拟”“请”“应”“可”等公文动词与情态词。
- 表述方式。注重客观、准确、简洁。一是主语明确、述谓清晰，避免代词指代不明。二是用词同一、概念统一，避免同义混用。三是句式以陈述句为主，少用反问或祈使。
- 时间与数量。时间节点用“年/月/日”中文数字写法或标准日期格式保持前后一致；数量表述宜用“约”“不超过”“不少于”等限定词，避免含糊。
- 引用与依据。涉及政策法规、文件依据时，规范引用全称并标注文号或发布时间；首次出现的单位、机构用全称，必要时括注简称，后文统一使用。
- 结构衔接。段落开头常用“总体上看”“从当前情况看”“为进一步……”“鉴于……，为此……”等起句；段内展开常用“具体包括”“主要体现在”“重点是”“同时”“此外”“下一步”。
- 态度与要求。提出工作要求时，宜用“务必”“切实”“统筹”“压紧压实责任”“明确时限与任务分工”等规范表述；涉及请示或报告事项时，注意使用“现将有关情况报告如下”“以上请审示”“当否，请批示”等固定语。
- 逻辑与层次。坚持“背景—问题—举措—保障—结语（如需）”的通用逻辑；举措部分可“总体要求—具体任务—责任分工—进度安排—监督考核”的顺序展开。
- 标点与格式。标题不加标点，第二层级概括句以句号收束；专有名词、机构名称保持大小写与全称规范；避免连续使用感叹号、引号等强调性标点。

现在，请处理以下内容：
\`\`\`
${inputText}
\`\`\``;
    
    setProcessedText(promptText);
  }, [inputText]);


  return (
    <div className="w-full h-full ">
      <H1>基本文字写作</H1>
      
      <div>
        <div className="space-y-2">
          <Badge variant="secondary" className="text-xs">
            原始文本
          </Badge>
          <Textarea
            id="input-text"
            placeholder="请输入要处理的原始文本..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[120px] resize-none text-base"
          />
        </div>
      </div>

      <PromptWindow content={processedText} />
    </div>
  );
};

// 统一使用 default 导出，包含所有需要的信息
const ProcessText1Page = {
  title: "基本文字写作",
  jsx: React.createElement(ProcessText1)
};

export default ProcessText1Page;

