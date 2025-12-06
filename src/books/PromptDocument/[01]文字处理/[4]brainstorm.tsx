/** @jsxImportSource react */
import React, { useState, useEffect } from 'react';
import { Textarea } from '../../../dev/shadcn/components/ui/textarea.tsx';
import { Badge } from '../../../dev/shadcn/components/ui/badge.tsx';
import PromptWindow from '../data/components/PromptWindow.tsx';
import H1 from '../../../dev/components/mdx/components/headings/H1.tsx';

const title="头脑风暴要素收集"

const ProcessText4: React.FC = () => {
  const [elements, setElements] = useState({
    coreTheme: '',
    targetUsage: '',
    audience: '',
    scope: '',
    boundary: '',
    timeDepth: '',
    priorityPerspective: '',
    dataEvidence: '',
    restrictions: '',
    outputFormat: ''
  });
  const [processedText, setProcessedText] = useState('');

  // 当输入文本变化时自动更新处理结果
  useEffect(() => {
    const filledElements = [];

    if (elements.coreTheme.trim()) {
      filledElements.push(`[核心主题] ${elements.coreTheme}`);
    }
    if (elements.targetUsage.trim()) {
      filledElements.push(`[目标用途] ${elements.targetUsage}`);
    }
    if (elements.audience.trim()) {
      filledElements.push(`[受众与语境] ${elements.audience}`);
    }
    if (elements.scope.trim()) {
      filledElements.push(`[范围] ${elements.scope}`);
    }
    if (elements.boundary.trim()) {
      filledElements.push(`[边界] ${elements.boundary}`);
    }
    if (elements.timeDepth.trim()) {
      filledElements.push(`[时间与深度] ${elements.timeDepth}`);
    }
    if (elements.priorityPerspective.trim()) {
      filledElements.push(`[优先视角] ${elements.priorityPerspective}`);
    }
    if (elements.dataEvidence.trim()) {
      filledElements.push(`[数据与证据] ${elements.dataEvidence}`);
    }
    if (elements.restrictions.trim()) {
      filledElements.push(`[限制与禁忌] ${elements.restrictions}`);
    }
    if (elements.outputFormat.trim()) {
      filledElements.push(`[输出格式偏好] ${elements.outputFormat}`);
    }

    // 要素文字作为独立变量
    const elementsText = filledElements.join('\n');

    const promptText = filledElements.length > 0 
      ? `你是一位精通结构化思维和头脑风暴的专家级AI助手。请根据以下收集的要素信息，先做必要澄清（如果信息不够清楚），再按“发散→收敛→行动”三段式输出，统一使用Markdown结构呈现，可选附Mermaid/OPML/Markmap代码。

一、要素信息
${elementsText}

二、生成要求：
澄清优先：若关键信息缺失，先用不超过3问的简短澄清补齐；若仍不足或用户不便回答，则按默认参数输出“最小可用版”（默认视角：5W1H；深度：最多3级；一级节点数：6），并在文末列出“待补信息清单”。
发散层：围绕核心主题，从≥6个互不重叠的视角列出一级节点；每个一级节点下延展2–4个二级节点；必要时补充1层三级节点用于举例或方法拆解。
收敛层：将发散结果整合为1套结构化大纲（优先MECE，备选金字塔原理或5W1H），为每一章标注优先级（高/中/低）与依赖（前置/并行/依赖X）。
可执行层：输出3–7条行动清单；每条至少包含目标、负责人角色、里程碑（时间点/范围）、衡量指标（可量化KPI占位）。
语言与长度：用语简洁明确，避免术语堆砌；节点标题≤12字；单段不超过8行。
去重与边界：合并同义或重复节点；对不在本次范围的内容标记“排除项”，保持边界清晰。
可拓展性：为每个一级节点附1–3条“可继续展开的问题引导”，便于后续迭代。
输出格式控制：默认输出Markdown大纲；如用户指明，可同时输出Mermaid mindmap、OPML 2.0或Markmap大纲。

三、输出结构（统一为Markdown）
1. 关键信息确认：使用项目符号列出：主题、用途、受众、范围/边界、深度/长度、视角/框架、输出格式、语言/文风
2. 发散层（思维导图式大纲）
 - 以缩进的Markdown大纲呈现
 - 至少6个一级节点，每个下设2–4个二级节点；必要时补充1层三级举例/方法
3. 收敛层（结构化大纲，含优先级与依赖）
 - 按“一、二、三…”分级标题输出
 - 为每章标注优先级（高/中/低）与依赖（前置/并行/依赖X）
4. 可执行层（行动清单）：3–7条行动项；每条含“目标｜负责人角色｜里程碑（时间）｜衡量指标（KPI）”
5. 可继续展开的问题清单：按发散层的一级节点逐一列出2–3条问题引导

四、可选框架库（按需选用，避免生搬硬套）：
5W1H、SWOT、PEST、波特五力、AARRR、用户旅程图、价值主张画布、OKR、SMART、RACI、项目三约束、金字塔原理、MECE、根因分析（5 Whys）、KANO、增长飞轮

五、起草前澄清问题（示例，如已提供清楚则不输出）
请确认：核心主题为【】，目标用途为【】，受众为【】。
深度与长度要求？是否限制到最多3级节点？
偏好视角/框架为何？是否禁用某些框架？
是否需要加入案例/关键数据/来源占位？
是否需要中英双语输出或特定术语口径？
是否指定输出格式（纯文本导图/Mermaid/OPML/Markmap）？`
      : `你是一位精通结构化思维和头脑风暴的专家级AI助手。请等待用户填写要素信息后，再生成头脑风暴指导。`;
    
    setProcessedText(promptText);
  }, [elements]);


  const updateElement = (key: string, value: string) => {
    setElements(prev => ({ ...prev, [key]: value }));
  };

  const elementConfigs = [
    {
      key: 'coreTheme',
      title: '核心主题',
      description: '一句话概括',
      placeholder: '请用一句话概括核心主题...'
    },
    {
      key: 'targetUsage',
      title: '目标用途',
      description: '写作/汇报/课程设计/产品策划/复盘/考试复习/问题拆解等',
      placeholder: '请描述目标用途...'
    },
    {
      key: 'audience',
      title: '受众与语境',
      description: '对象、背景知识水平、场景',
      placeholder: '请描述受众和语境...'
    },
    {
      key: 'scope',
      title: '范围',
      description: '必须覆盖的内容、对象、时间段、地域、深度层级等',
      placeholder: '请描述必须覆盖的范围...'
    },
    {
      key: 'boundary',
      title: '边界',
      description: '明确不纳入的内容、不负责的部分、处理的下限/上限、敏感与禁区',
      placeholder: '请描述明确的边界和禁区...'
    },
    {
      key: 'timeDepth',
      title: '时间与深度',
      description: '层级深度：2–4级；总要点上限',
      placeholder: '请描述时间和深度要求...'
    },
    {
      key: 'priorityPerspective',
      title: '优先视角',
      description: '如：用户价值、业务流程、技术架构、政策合规、风险与对策、里程碑、成本收益、竞品对比、SWOT、5W1H、MECE、金字塔原理',
      placeholder: '请选择或描述优先视角...'
    },
    {
      key: 'dataEvidence',
      title: '数据与证据',
      description: '是否需要列示关键数据、案例、来源',
      placeholder: '请描述数据和证据要求...'
    },
    {
      key: 'restrictions',
      title: '限制与禁忌',
      description: '敏感点、合规、术语口径、不能使用的框架',
      placeholder: '请描述限制和禁忌...'
    },
    {
      key: 'outputFormat',
      title: '输出格式偏好',
      description: '思维导图节点式/编号大纲式/二者皆要；是否需要摘要与行动清单；是否需要中英双语',
      placeholder: '请描述输出格式偏好...'
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
