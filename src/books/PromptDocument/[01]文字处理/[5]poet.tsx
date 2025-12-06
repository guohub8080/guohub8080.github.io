/** @jsxImportSource react */
import React, { useState, useEffect } from 'react';
import { Textarea } from '../../../dev/shadcn/components/ui/textarea.tsx';
import { Badge } from '../../../dev/shadcn/components/ui/badge.tsx';
import PromptWindow from '../data/components/PromptWindow.tsx';
import H1 from '../../../dev/components/mdx/components/headings/H1.tsx';

const title="诗歌创作要素收集"

const ProcessText5: React.FC = () => {
  const [elements, setElements] = useState({
    theme: '',
    genre: '',
    emotion: '',
    spacetime: '',
    keywords: '',
    restrictions: '',
    audience: '',
    length: '',
    language: '',
    reference: '',
    annotation: ''
  });
  const [processedText, setProcessedText] = useState('');

  // 当输入文本变化时自动更新处理结果
  useEffect(() => {
    const filledElements = [];

    if (elements.theme.trim()) {
      filledElements.push(`[主题/意象] ${elements.theme}`);
    }
    if (elements.genre.trim()) {
      filledElements.push(`[体裁体式] ${elements.genre}`);
    }
    if (elements.emotion.trim()) {
      filledElements.push(`[情感基调] ${elements.emotion}`);
    }
    if (elements.spacetime.trim()) {
      filledElements.push(`[时空与场景] ${elements.spacetime}`);
    }
    if (elements.keywords.trim()) {
      filledElements.push(`[关键词与意象库] ${elements.keywords}`);
    }
    if (elements.restrictions.trim()) {
      filledElements.push(`[限定与禁忌] ${elements.restrictions}`);
    }
    if (elements.audience.trim()) {
      filledElements.push(`[读者对象与用途] ${elements.audience}`);
    }
    if (elements.length.trim()) {
      filledElements.push(`[篇幅与数量] ${elements.length}`);
    }
    if (elements.language.trim()) {
      filledElements.push(`[语言与声调] ${elements.language}`);
    }
    if (elements.reference.trim()) {
      filledElements.push(`[参考风格与典故边界] ${elements.reference}`);
    }
    if (elements.annotation.trim()) {
      filledElements.push(`[是否需要注解/尾注/意象说明] ${elements.annotation}`);
    }

    // 要素文字作为独立变量
    const elementsText = filledElements.join('\n');

    const promptText = filledElements.length > 0 
      ? `你是一位精通古典与现代诗歌创作的专家级AI助手。请根据以下收集的要素信息，先做必要澄清（如果信息不够清楚），再按"理解→创作→润色"三段式输出。

一、要素信息
${elementsText}

二、生成要求：
澄清优先：若关键信息缺失，先用不超过3问的简短澄清补齐；若仍不足或用户不便回答，则按默认参数输出"最小可用版"（默认体裁：七绝；基调：清丽；语言：雅致白话），并在文末列出"待补信息清单"。
理解层：深度解析主题意象与情感内核，确定创作方向与风格定位。
创作层：根据体裁要求进行诗歌创作，确保格律、押韵、意象运用符合规范。
润色层：调整字词选择、句式节奏、意境营造，确保整体和谐统一。

三、创作流程与规则
立意与意象网络：用1–2句确立中心意旨；从关键词中选3–5个主意象，形成"情—景—事—理"链条。

体式与格律：
古典体裁：
- 五绝/七绝：4句；律诗：8句（首联/颔联/颈联/尾联）；对仗至少出现在颔联与颈联（律诗）。
- 平仄与押韵：遵循所选韵书与常见格式，至少保证押韵统一、节奏自然；不生硬为了格律牺牲语意。
- 用典适度，避免堆砌；炼字重在简洁准确。
- 词：指定词牌并遵守字数、平仄、韵位。可提供"宽平仄"版本，保证读感顺滑。
- 现代诗/散文诗：节奏与意象推进清晰；避免口号与堆砌形容词；控制比喻新鲜度与可感度。

语言与审美：
- 语言求凝练、比兴自然、收放有度；标志性动词与名词优先，形容词适度。
- 意象递进：起—承—转—合（或开端—铺陈—转折—收束）清晰。

自检与修订：
- 格律检查：押韵统一、对仗是否工稳（若选律诗/词），生硬处标记再修。
- 审美检查：是否有"承上启下"的转折句；是否有"点睛句/意外之笔"。
- 可读性：朗读顺口，无现代口水化表达；避免堆砌冷僻字。
- 输出两稿时，说明两稿在立意或技法上的差异点。

输出格式控制：默认输出Markdown格式；如用户指明，可同时输出纯文本版本或带注解版本。

四、输出结构（统一为Markdown）
1. 关键信息确认：使用项目符号列出：主题、体裁、基调、场景、意象、用途、篇幅、语言风格
2. 理解层（创作分析）
   - 主题解析与情感定位
   - 体裁特点与格律要求
   - 意象选择与意境营造
3. 创作层（诗歌作品）
   - 按指定体裁创作诗歌
   - 需要有一个明确的诗歌题目
   - 标注格律、押韵、对仗等技法
   - 使用代码块（\`\`\`）来包裹内容（题目+一个空行+诗歌内容）
4. 润色层（优化建议）
   - 字词调整建议
   - 意境提升方向
   - 整体评价与建议
5. 可继续展开的问题清单：按创作要素逐一列出2–3条深化问题

五、可选体裁库（按需选用，避免生搬硬套）
古体诗、五绝、七绝、五律、七律、词牌（水调歌头、蝶恋花、满江红、念奴娇、声声慢、如梦令、江城子、定风波、临江仙、渔家傲）、现代诗、散文诗

六、起草前澄清问题（示例，如已提供清楚则不输出）
请确认：主题意象为【】，体裁为【】，情感基调为【】。
时空场景与关键词意象库是否明确？
是否有禁用词/意象或敏感内容限制？
读者对象与用途为何？篇幅要求如何？
语言风格偏好（文言/白话/雅致/当代口语）？
是否需要注解说明或典故解释？`
      : `你是一位精通古典与现代诗歌创作的专家级AI助手。请等待用户填写要素信息后，再生成诗歌创作指导。`;
    
    setProcessedText(promptText);
  }, [elements]);


  const updateElement = (key: string, value: string) => {
    setElements(prev => ({ ...prev, [key]: value }));
  };

  const elementConfigs = [
    {
      key: 'theme',
      title: '主题/意象',
      description: '一句话概括',
      placeholder: '请用一句话概括主题意象...'
    },
    {
      key: 'genre',
      title: '体裁体式',
      description: '古体诗/五绝/七绝/五律/七律/词牌（如水调歌头、蝶恋花）/现代诗/散文诗',
      placeholder: '请选择或描述体裁体式...'
    },
    {
      key: 'emotion',
      title: '情感基调',
      description: '清丽/豪放/婉约/苍凉/壮阔/温柔/疏淡/讽喻',
      placeholder: '请选择或描述情感基调...'
    },
    {
      key: 'spacetime',
      title: '时空与场景',
      description: '季节/地点/时间段/历史语境',
      placeholder: '请描述时空与场景...'
    },
    {
      key: 'keywords',
      title: '关键词与意象库',
      description: '梅、月、江、风、星、旅途…',
      placeholder: '请列出关键词与意象...'
    },
    {
      key: 'restrictions',
      title: '限定与禁忌',
      description: '禁用词/意象/敏感内容；避免口水化与网络化表达',
      placeholder: '请描述限定与禁忌...'
    },
    {
      key: 'audience',
      title: '读者对象与用途',
      description: '投稿/朗诵/社媒/学术练习/私享',
      placeholder: '请描述读者对象与用途...'
    },
    {
      key: 'length',
      title: '篇幅与数量',
      description: '字数或句数；1–3稿备选；是否要题目/小序',
      placeholder: '请描述篇幅与数量要求...'
    },
    {
      key: 'language',
      title: '语言与声调',
      description: '文言/白话/雅致/当代口语；押韵部（平水/中华新韵/现代自由）',
      placeholder: '请描述语言与声调要求...'
    },
    {
      key: 'reference',
      title: '参考风格与典故边界',
      description: '苏辛豪放/温李婉约/唐风/宋骨；典故密度上限',
      placeholder: '请描述参考风格与典故边界...'
    },
    {
      key: 'annotation',
      title: '是否需要注解/尾注/意象说明',
      description: '要/不要',
      placeholder: '请选择是否需要注解说明...'
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
const ProcessText5Page = {
  title: title,
  jsx: React.createElement(ProcessText5)
};

export default ProcessText5Page;
