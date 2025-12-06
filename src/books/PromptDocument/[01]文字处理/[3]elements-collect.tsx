/** @jsxImportSource react */
import React, { useState, useEffect } from 'react';
import { Textarea } from '../../../dev/shadcn/components/ui/textarea.tsx';
import { Badge } from '../../../dev/shadcn/components/ui/badge.tsx';
import PromptWindow from '../data/components/PromptWindow.tsx';
import H1 from '../../../dev/components/mdx/components/headings/H1.tsx';

const title="要素式写作"

const ProcessText4: React.FC = () => {
  const [elements, setElements] = useState({
    position: '',
    angle: '',
    documentType: '',
    targetAudience: '',
    purpose: '',
    mainMatters: '',
    constraints: '',
    timeline: '',
    support: '',
    attachments: '',
    style: '',
    outputFormat: ''
  });
  const [processedText, setProcessedText] = useState('');

  // 当输入文本变化时自动更新处理结果
  useEffect(() => {
    const filledElements = [];

    if (elements.position.trim()) {
      filledElements.push(`[立场] ${elements.position}`);
    }
    if (elements.angle.trim()) {
      filledElements.push(`[角度] ${elements.angle}`);
    }
    if (elements.documentType.trim()) {
      filledElements.push(`[文种类型] ${elements.documentType}`);
    }
    if (elements.targetAudience.trim()) {
      filledElements.push(`[目标对象与行文方向] ${elements.targetAudience}`);
    }
    if (elements.purpose.trim()) {
      filledElements.push(`[目的与背景] ${elements.purpose}`);
    }
    if (elements.mainMatters.trim()) {
      filledElements.push(`[主要事项] ${elements.mainMatters}`);
    }
    if (elements.constraints.trim()) {
      filledElements.push(`[约束与合规] ${elements.constraints}`);
    }
    if (elements.timeline.trim()) {
      filledElements.push(`[时间与节点] ${elements.timeline}`);
    }
    if (elements.support.trim()) {
      filledElements.push(`[配套与保障] ${elements.support}`);
    }
    if (elements.attachments.trim()) {
      filledElements.push(`[附件与表格] ${elements.attachments}`);
    }
    if (elements.style.trim()) {
      filledElements.push(`[文风与字数] ${elements.style}`);
    }
    if (elements.outputFormat.trim()) {
      filledElements.push(`[输出格式偏好] ${elements.outputFormat}`);
    }

    // 要素文字作为独立变量
    const elementsText = filledElements.join('\n');

    const promptText = filledElements.length > 0 
      ? `你是一位精通中国公文写作的专家级AI助手。请根据以下收集的要素信息和要求，生成一份完整的公文写作任务。

一、文章要素
${elementsText}

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
- 禁止编造数据、事实、情况等，所有内容必须基于原始内容。

四、生成要求
结构：按所选文种的通用结构生成。例如：
  - 通知/通报/意见：标题—主送机关—正文（背景+事项/要求）—结语—联系人—附件—落款—成文日期
  - 请示：标题—主送机关—正文（请示事项+理由依据）—结语用语—附件—落款—成文日期
  - 报告：标题—主送机关—正文（基本情况—做法成效—问题困难—下一步）—附件—落款—成文日期
  - 方案：标题—背景依据—总体思路—工作目标—重点任务—时间安排—组织保障—附件
语气：客观严谨、逻辑清晰、用词规范，避免口语化与主观渲染。
合规：严格区分上行文与下行文用语（如"请批示/审示""请予支持""特此通知/报告"）。
版式：自动生成规范要素（标题居中、主送机关、联系人与电话、附件栏、落款与成文日期），如用户不需要可关闭。`
      : `你是一位精通中国公文写作的专家级AI助手。请等待用户填写要素信息后，再生成公文写作指导。`;
    
    setProcessedText(promptText);
  }, [elements]);


  const updateElement = (key: string, value: string) => {
    setElements(prev => ({ ...prev, [key]: value }));
  };

  const elementConfigs = [
    {
      key: 'position',
      title: '立场',
      description: '站在什么立场（如：上级机关、基层单位、行业协会、企业、学校、社区等）',
      placeholder: '请描述写作立场...'
    },
    {
      key: 'angle',
      title: '角度',
      description: '以谁的角度（如：单位负责人、办公室、分管领导、科员/承办人、专项工作专班）',
      placeholder: '请描述写作角度...'
    },
    {
      key: 'documentType',
      title: '文种类型',
      description: '如：通知、请示、报告、函、意见、方案、通报、纪要、说明、倡议书、工作要点',
      placeholder: '请选择或描述文种类型...'
    },
    {
      key: 'targetAudience',
      title: '目标对象与行文方向',
      description: '上行/下行/平行；具体接收单位或对象',
      placeholder: '请描述目标对象和行文方向...'
    },
    {
      key: 'purpose',
      title: '目的与背景',
      description: '缘由、政策依据、现实问题、紧迫性',
      placeholder: '请描述写作目的和背景...'
    },
    {
      key: 'mainMatters',
      title: '主要事项',
      description: '要做什么、要求是什么、拟解决哪些问题',
      placeholder: '请描述主要事项和要求...'
    },
    {
      key: 'constraints',
      title: '约束与合规',
      description: '口径、保密与敏感点、必须引用的文件或条款、红线',
      placeholder: '请描述约束条件和合规要求...'
    },
    {
      key: 'timeline',
      title: '时间与节点',
      description: '起止时间、里程碑、报送时限',
      placeholder: '请描述时间安排和关键节点...'
    },
    {
      key: 'support',
      title: '配套与保障',
      description: '组织架构、责任分工、经费与资源、监督与考核',
      placeholder: '请描述配套措施和保障条件...'
    },
    {
      key: 'attachments',
      title: '附件与表格',
      description: '是否需附清单、联系表、进度表、名额分配等',
      placeholder: '请描述需要的附件和表格...'
    },
    {
      key: 'style',
      title: '文风与字数',
      description: '庄重/务实/简洁；字数上限；是否需公文格式要素如发文字号、主送机关、落款、印章占位',
      placeholder: '请描述文风要求和字数限制...'
    },
    {
      key: 'outputFormat',
      title: '输出格式偏好',
      description: '是否需要多稿备选、重点加粗、要点列表、可直接下发版与领导审签版等',
      placeholder: '请描述输出格式要求...'
    }
  ];

  return (
    <div className="w-full h-full space-y-6">
      <H1>{title}</H1>
      
      <div className="space-y-6">
        {elementConfigs.map((config, index) => (
          <div key={config.key} className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {index + 1}
              </Badge>
              <h3 className="text-base font-medium text-slate-700 dark:text-slate-300">
                {config.title}
              </h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {config.description}
            </p>
            <Textarea
              placeholder={config.placeholder}
              value={elements[config.key as keyof typeof elements]}
              onChange={(e) => updateElement(config.key, e.target.value)}
              className="min-h-[80px] resize-none text-sm"
            />
          </div>
        ))}
      </div>

      <PromptWindow content={processedText} isFootCopy={true} isHeadCopy={true} />
    </div>
  );
};

// 统一使用 default 导出，包含所有需要的信息
const ProcessText4Page = {
  title: title,
  jsx: React.createElement(ProcessText4)
};

export default ProcessText4Page;
