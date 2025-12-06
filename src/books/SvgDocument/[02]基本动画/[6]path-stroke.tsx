import React, { useState } from "react";
import { DocumentExport } from "../data/svgDocumentLoader.tsx";
import SectionEx from "../../../dev/pubComponents/PureHTML/basicEx/SectionEx.tsx";
import { genAnimatePathStroke } from "../../../dev/pubComponents/PubUtils/genSvgAnimateTransform/genAnimatePathStroke";
import {
  getEaseBezier,
  getLinearBezier,
  getPowerBezier,
  getCircleBezier,
  getExpoBezier,
  getSineBezier
} from "../../../dev/pubComponents/PubUtils/getBezier";
import CodeBlock from "../data/components/CodeBlock.tsx";
import PresetPreviewDisplayBlock from "../data/components/PresetPreviewDisplayBlock.tsx";
import { Section } from "../data/components";
import { H1, H2, H3, P, Description } from "../data/components/Headings.tsx";
import { Slider, Select, Switch, Radio } from "antd";

const Article = () => {
  const viewBoxW = 567;
  const viewBoxH = 567;
  const padding = 30; // 画布内边距

  // 示例1：基础路径绘制（交互式）
  const [dur1, setDur1] = useState(2);
  const [pathLen1, setPathLen1] = useState(2500);
  const [easing1, setEasing1] = useState<'linear' | 'ease' | 'power' | 'circle' | 'expo' | 'sine'>('linear');
  const [easeIn1, setEaseIn1] = useState(true);
  const [easeOut1, setEaseOut1] = useState(true);
  const [power1, setPower1] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [loopCount1, setLoopCount1] = useState(0);
  const [isBeginWithClick1, setIsBeginWithClick1] = useState(false);
  const [restart1, setRestart1] = useState<'always' | 'whenNotActive' | 'never'>('always');


  const getSplines = (
    type: 'linear' | 'ease' | 'power' | 'circle' | 'expo' | 'sine',
    isIn: boolean,
    isOut: boolean,
    power: 1 | 2 | 3 | 4 | 5
  ) => {
    switch (type) {
      case 'linear':
        return getLinearBezier();
      case 'ease':
        return getEaseBezier({ isIn, isOut });
      case 'power':
        return getPowerBezier({ power, isIn, isOut });
      case 'circle':
        return getCircleBezier({ isIn, isOut });
      case 'expo':
        return getExpoBezier({ isIn, isOut });
      case 'sine':
        return getSineBezier({ isIn, isOut });
      default:
        return getLinearBezier();
    }
  };

  const getSplinesCode = (
    type: 'linear' | 'ease' | 'power' | 'circle' | 'expo' | 'sine',
    isIn: boolean,
    isOut: boolean,
    power: 1 | 2 | 3 | 4 | 5
  ) => {
    switch (type) {
      case 'linear':
        return 'getLinearBezier()';
      case 'ease':
        return `getEaseBezier({ isIn: ${isIn}, isOut: ${isOut} })`;
      case 'power':
        return `getPowerBezier({ power: ${power}, isIn: ${isIn}, isOut: ${isOut} })`;
      case 'circle':
        return `getCircleBezier({ isIn: ${isIn}, isOut: ${isOut} })`;
      case 'expo':
        return `getExpoBezier({ isIn: ${isIn}, isOut: ${isOut} })`;
      case 'sine':
        return `getSineBezier({ isIn: ${isIn}, isOut: ${isOut} })`;
      default:
        return 'getLinearBezier()';
    }
  };

  return (
    <SectionEx>
      <H1>路径描边动画 Path Stroke</H1>
      <Section>
        <Description style={{ marginTop: '8px' }}>
          通过 stroke-dashoffset 动画实现路径绘制效果，支持任意 SVG 路径元素
        </Description>
      </Section>

      <div style={{ padding: '0 16px', marginTop: '16px' }}>
        <div style={{ marginBottom: '12px', background: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', fontSize: '14px' }}>
            <span style={{ minWidth: '100px' }}>时长: {dur1.toFixed(1)}s</span>
            <Slider min={0.5} max={8} step={0.1} value={dur1} onChange={setDur1} style={{ flex: 1, minWidth: '120px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', fontSize: '14px' }}>
            <span style={{ minWidth: '100px' }}>路径长度:</span>
            <Slider min={1000} max={4000} step={50} value={pathLen1} onChange={setPathLen1} style={{ flex: 1, minWidth: '120px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', fontSize: '14px' }}>
            <span style={{ minWidth: '100px' }}>缓动函数:</span>
            <Select value={easing1} onChange={setEasing1} style={{ flex: 1 }}
              options={[
                { value: 'linear', label: 'Linear（线性）' },
                { value: 'ease', label: 'Ease（基础缓动）' },
                { value: 'power', label: 'Power（强力缓动）' },
                { value: 'circle', label: 'Circle（圆形缓动）' },
                { value: 'expo', label: 'Expo（指数缓动）' },
                { value: 'sine', label: 'Sine（正弦缓动）' }
              ]}
            />
          </div>
          {easing1 !== 'linear' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px' }}>
              <span style={{ minWidth: '100px' }}></span>
              <div style={{ flex: 1, display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span>Ease In</span>
                <Switch size="small" checked={easeIn1} onChange={setEaseIn1} />
                <span>Ease Out</span>
                <Switch size="small" checked={easeOut1} onChange={setEaseOut1} />
              </div>
            </div>
          )}
          {easing1 === 'power' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', marginTop: '8px' }}>
              <span style={{ minWidth: '100px' }}>Power:</span>
              <Radio.Group size="small" value={power1} onChange={(e) => setPower1(e.target.value)} optionType="button" buttonStyle="solid">
                <Radio.Button value={1}>1</Radio.Button>
                <Radio.Button value={2}>2</Radio.Button>
                <Radio.Button value={3}>3</Radio.Button>
                <Radio.Button value={4}>4</Radio.Button>
                <Radio.Button value={5}>5</Radio.Button>
              </Radio.Group>
            </div>
          )}

          {/* 播放控制 */}
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e0e0e0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', fontSize: '14px' }}>
              <span style={{ minWidth: '100px' }}>触发方式:</span>
              <Radio.Group value={isBeginWithClick1} onChange={(e) => setIsBeginWithClick1(e.target.value)} optionType="button" buttonStyle="solid">
                <Radio.Button value={false}>自动播放</Radio.Button>
                <Radio.Button value={true}>点击触发</Radio.Button>
              </Radio.Group>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', fontSize: '14px' }}>
              <span style={{ minWidth: '100px' }}>循环次数:</span>
              <Radio.Group value={loopCount1} onChange={(e) => setLoopCount1(e.target.value)} optionType="button" buttonStyle="solid">
                <Radio.Button value={1}>播放1次</Radio.Button>
                <Radio.Button value={3}>播放3次</Radio.Button>
                <Radio.Button value={0}>无限循环</Radio.Button>
              </Radio.Group>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
              <span style={{ minWidth: '100px' }}>重启控制:</span>
              <Select value={restart1} onChange={setRestart1} style={{ flex: 1 }}
                options={[
                  { value: 'always', label: 'Always - 可随时重启（默认）' },
                  { value: 'whenNotActive', label: 'WhenNotActive - 仅结束后可重启' },
                  { value: 'never', label: 'Never - 永不重启（点击触发时推荐）' }
                ]}
              />
            </div>
          </div>
        </div>

        <PresetPreviewDisplayBlock viewBoxW={viewBoxW + padding * 2} viewBoxH={viewBoxH + padding * 2} maxWidth={400}
          key={`path-draw-${dur1}-${pathLen1}-${easing1}-${easeIn1}-${easeOut1}-${power1}-${loopCount1}-${isBeginWithClick1}-${restart1}`}>
          {genAnimatePathStroke(
            {
              pathLength: pathLen1,
              timeline: [
                { timeSpanSec: dur1, toValue: 0, keySplines: getSplines(easing1, easeIn1, easeOut1, power1) }
              ],
              loopCount: loopCount1,
              isBeginWithClick: isBeginWithClick1,
              restart: restart1
            },
            <path d="M283.47,2.85l-243.03,140.31l-0,280.61l243.03,140.31l243.02,-140.31l0,-280.61l-243.02,-140.31 M229.46,34.03l54.02,-31.18l243.02,140.31l0,31.18l-216.04,124.73l0.01,187.07l162,-93.55l-0,-62.36l-108,62.36l-0,-62.36l162,-93.53l0.01,187.07l-243.01,140.31l-243.03,-140.31l-0,-280.6l27.02,-15.6l216.02,124.73l162,-93.53l-216.02,-124.74Zm-135.02,171.49l0,187.07l162.02,93.53l0,-187.05l-162.02,-93.55Z"
              stroke="#0067b4"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform={`translate(${padding}, ${padding})`} />,
            { width: viewBoxW + padding * 2, height: viewBoxH + padding * 2 }
          )}
        </PresetPreviewDisplayBlock>
        <CodeBlock code={`{genAnimatePathStroke(
  {
    pathLength: ${pathLen1},
    timeline: [
      { timeSpanSec: ${dur1.toFixed(1)}, toValue: 0, keySplines: ${getSplinesCode(easing1, easeIn1, easeOut1, power1)} }
    ],
    loopCount: ${loopCount1},           // 0=无限循环, 1=播放1次, n=播放n次
    isBeginWithClick: ${isBeginWithClick1},  // 是否点击触发
    restart: '${restart1}'              // always=可随时重启, whenNotActive=仅结束后可重启, never=永不重启
  },
  <path d="M283.47,2.85l-243.03,140.31l-0,280.61l243.03,140.31l243.02,-140.31l0,-280.61l-243.02,-140.31 M229.46,34.03l54.02,-31.18l243.02,140.31l0,31.18l-216.04,124.73l0.01,187.07l162,-93.55l-0,-62.36l-108,62.36l-0,-62.36l162,-93.53l0.01,187.07l-243.01,140.31l-243.03,-140.31l-0,-280.6l27.02,-15.6l216.02,124.73l162,-93.53l-216.02,-124.74Zm-135.02,171.49l0,187.07l162.02,93.53l0,-187.05l-162.02,-93.55Z" stroke="#0067b4" strokeWidth="3" fill="none" />
)}`} />

        <H3 style={{ marginTop: '16px' }}>生成的 SVG 源码：</H3>
        <CodeBlock code={(() => {
          const splines = getSplines(easing1, easeIn1, easeOut1, power1);
          const hasSplines = splines !== '0 0 1 1';

          return `<svg viewBox="0 0 ${viewBoxW + padding * 2} ${viewBoxH + padding * 2}" xmlns="http://www.w3.org/2000/svg">
  <g stroke-dasharray="${pathLen1},${pathLen1}" stroke-dashoffset="${pathLen1}"${isBeginWithClick1 ? ' style="cursor: pointer"' : ''}>
    <animate
      attributeType="CSS"
      attributeName="stroke-dashoffset"
      values="${pathLen1};0"
      keyTimes="0;1"${hasSplines ? `
      keySplines="${splines}"` : ''}
      dur="${dur1.toFixed(3)}s"
      calcMode="${hasSplines ? 'spline' : 'linear'}"${isBeginWithClick1 ? `
      begin="click"` : ''}
      fill="freeze"
      repeatCount="${loopCount1 === 0 ? 'indefinite' : loopCount1}"
      restart="${restart1}"
    />${isBeginWithClick1 ? `
    <rect x="0" y="0" width="${viewBoxW + padding * 2}" height="${viewBoxH + padding * 2}" fill="transparent" />` : ''}
    <path 
      d="M283.47,2.85l-243.03,140.31l-0,280.61l243.03,140.31l243.02,-140.31l0,-280.61l-243.02,-140.31 M229.46,34.03l54.02,-31.18l243.02,140.31l0,31.18l-216.04,124.73l0.01,187.07l162,-93.55l-0,-62.36l-108,62.36l-0,-62.36l162,-93.53l0.01,187.07l-243.01,140.31l-243.03,-140.31l-0,-280.6l27.02,-15.6l216.02,124.73l162,-93.53l-216.02,-124.74Zm-135.02,171.49l0,187.07l162.02,93.53l0,-187.05l-162.02,-93.55Z"
      stroke="#0067b4"
      stroke-width="3"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      transform="translate(${padding}, ${padding})"
    />
  </g>
</svg>`;
        })()} />
      </div>

      {/* 重要属性说明 */}
      <H2 style={{ padding: '0 16px', marginTop: '24px' }}>重要属性说明</H2>
      <div style={{ padding: '0 16px', marginTop: '16px', marginBottom: '16px' }}>
        <div style={{ background: '#fff3cd', padding: '16px', borderRadius: '4px', border: '1px solid #ffc107' }}>
          <p style={{ fontSize: '14px', color: '#856404', marginBottom: '12px', fontWeight: 600 }}>
            restart 和 fill 属性的区别：
          </p>
          <div style={{ fontSize: '14px', color: '#856404', lineHeight: '1.8' }}>
            <p style={{ marginBottom: '8px' }}>
              <strong>restart</strong> - 控制动画是否能重新开始
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '12px' }}>
              <li><code>restart="always"</code> - 默认值，允许动画随时重启（多次点击会重复播放）</li>
              <li><code>restart="never"</code> - 动画只播放一次，不能重启（点击触发时常用，防止重复点击）</li>
              <li><code>restart="whenNotActive"</code> - 仅当动画未激活时才能重启</li>
            </ul>

            <p style={{ marginBottom: '8px' }}>
              <strong>fill</strong> - 控制动画结束后的状态
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '12px' }}>
              <li><code>fill="freeze"</code> - 动画结束后保持最终状态（路径保持绘制完成）</li>
              <li><code>fill="remove"</code> - 动画结束后回到初始状态（路径消失，适合循环）</li>
            </ul>

            <p style={{ marginBottom: '8px' }}>
              <strong>点击触发区域原理</strong>
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '12px' }}>
              <li>路径描边线条通常很细，不易点击</li>
              <li>解决方案：在 <code>&lt;g&gt;</code> 内添加一个透明 <code>&lt;rect&gt;</code> 覆盖整个画布</li>
              <li><code>&lt;animate begin="click"&gt;</code> 会监听父元素 <code>&lt;g&gt;</code> 内任意子元素的点击</li>
              <li>点击覆盖层矩形 → 触发动画 → 实现"点击任何地方都能触发"的效果</li>
              <li>矩形使用 <code>fill="transparent"</code>，完全不可见，不影响视觉效果</li>
            </ul>

            <p style={{ marginTop: '12px', padding: '8px', background: '#fff', borderRadius: '4px' }}>
              <strong>典型组合：</strong><br />
              • 点击触发单次绘制：<code>isBeginWithClick=true + restart="never" + fill="freeze"</code><br />
              • 自动循环绘制/擦除：<code>fill="remove" + loopCount=0</code>
            </p>
          </div>
        </div>
      </div>

    </SectionEx>
  );
};

const preset: DocumentExport = {
  title: "路径描边动画 Path Stroke",
  jsx: <Article />
};

export default preset;

