import React, { useState } from "react";
import { DocumentExport } from "../data/svgDocumentLoader.tsx";
import SectionEx from "../../../dev/pubComponents/PureHTML/basicEx/SectionEx.tsx";
import { genAnimateRotate, getCenterRotateStyle } from "../../../dev/pubComponents/PubUtils/genSvgAnimateTransform/genAnimateRotate";
import { 
  getEaseBezier,
  getLinearBezier,
  getPowerBezier,
  getCircleBezier,
  getExpoBezier,
  getSineBezier
} from "../../../dev/pubComponents/PubUtils/getBezier";
import {
    CodeBlock,
    PresetPreviewDisplayBlock,
    ControlPanel,
    ControlRow,
    InfoBox,
    Section,
    H1,
    H2,
    P,
    Description
} from "../data/components";
import pic1 from "../data/assets/1.png";
import { Slider, Select, Switch, Radio, InputNumber } from "antd";

const Article = () => {
  const viewBoxW = 375;
  const imgSize = Math.floor(viewBoxW / 4);
  const basePadding = 20;
  const viewBoxHCenter = Math.ceil(imgSize * Math.SQRT2 + basePadding * 2);
  const imgX = (viewBoxW - imgSize) / 2;
  const imgYCenter = (viewBoxHCenter - imgSize) / 2;
  // 摆动预览的画布和定位
  const viewBoxHSwing = Math.ceil(imgSize * Math.SQRT2 + basePadding * 2);
  const imgYSwing = (viewBoxHSwing - imgSize) / 2;

  // 示例1：中心旋转（交互式）
  const [dur1, setDur1] = useState(2);
  const [easing1, setEasing1] = useState<'linear' | 'ease' | 'power' | 'circle' | 'expo' | 'sine'>('ease');
  const [easeIn1, setEaseIn1] = useState(true);
  const [easeOut1, setEaseOut1] = useState(true);
  const [power1, setPower1] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [angle1, setAngle1] = useState(360);

  // 示例2：自定义原点（摆动）
  const [dur2, setDur2] = useState(1.5);
  const [easing2, setEasing2] = useState<'linear' | 'ease' | 'power' | 'circle' | 'expo' | 'sine'>('ease');
  const [easeIn2, setEaseIn2] = useState(true);
  const [easeOut2, setEaseOut2] = useState(true);
  const [power2, setPower2] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [swing, setSwing] = useState(30); // 摆动角度
  const [origin2, setOrigin2] = useState<'center' | 'origin' | 'topLeft' | 'topCenter' | 'topRight' | 'centerLeft' | 'centerRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight' | 'custom'>('topCenter');
  const [customX, setCustomX] = useState(imgX + imgSize / 2);
  const [customY, setCustomY] = useState(imgYSwing);

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
      <H1>旋转动画 Rotate</H1>
      <Section>
        <Description style={{ marginTop: '8px' }}>
          围绕中心或自定义原点旋转，支持往返和连续旋转
        </Description>
      </Section>

      {/* isRelativeRotate 参数说明 */}
      <H2 style={{ marginTop: '20px' }}>参数说明：isRelativeRotate（增量模式）</H2>
      
      <Section>
        <InfoBox type="info" style={{ marginTop: '12px' }}>
          <strong>默认值：true（增量模式，推荐）</strong>
          <p style={{ marginTop: '8px', marginBottom: 0 }}>
            timeline 中的 <code>toValue</code> 表示相对于<strong>上一阶段</strong>的增量角度
          </p>
        </InfoBox>

        <CodeBlock language="typescript" style={{ marginTop: '16px' }}>{`// 增量模式（isRelativeRotate: true，默认）
genAnimateRotate({
    initAngle: 0,
    timeline: [
        { toValue: 90, timeSpanSec: 1 },   // 旋转90度
        { toValue: 0, timeSpanSec: 1 },    // 保持不动（增量为0）
        { toValue: 45, timeSpanSec: 1 }    // 再旋转45度（总共135度）
    ],
    isRelativeRotate: true  // 默认值，可省略
});

// 绝对模式（isRelativeRotate: false）
genAnimateRotate({
    initAngle: 0,
    timeline: [
        { toValue: 90, timeSpanSec: 1 },   // 旋转到90度
        { toValue: 90, timeSpanSec: 1 },   // 保持在90度
        { toValue: 135, timeSpanSec: 1 }   // 旋转到135度
    ],
    isRelativeRotate: false
});`}</CodeBlock>

        <InfoBox type="info" style={{ marginTop: '12px' }}>
          <p><strong>两种模式对比：</strong></p>
          <p>• <strong>增量模式（true）</strong>：每个阶段的 toValue 是相对角度，更直观易用</p>
          <p>• <strong>绝对模式（false）</strong>：每个阶段的 toValue 是绝对角度，需要手动累加</p>
          <p><strong>💡 推荐使用默认的增量模式</strong>，代码更清晰，维护更容易</p>
        </InfoBox>
      </Section>

      {/* 示例1：中心旋转（交互式） */}
      <H2 style={{ marginTop: '20px' }}>1. 中心旋转（交互式）</H2>
      <Section style={{ marginTop: '16px' }}>
        <P style={{ marginBottom: '8px' }}>0° → {angle1}°</P>
        <ControlPanel>
          <ControlRow label={`时长: ${dur1.toFixed(1)}s`}>
            <Slider min={0.5} max={8} step={0.1} value={dur1} onChange={setDur1} style={{ flex: 1, minWidth: '120px' }} />
          </ControlRow>
          <ControlRow label="旋转角度:">
            <Slider min={-720} max={720} step={15} value={angle1} onChange={setAngle1} style={{ flex: 1, minWidth: '120px' }} />
          </ControlRow>
          <ControlRow label="缓动函数:">
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
          </ControlRow>
          {easing1 !== 'linear' && (
            <ControlRow>
              <div style={{ flex: 1, display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span>Ease In</span>
                <Switch size="small" checked={easeIn1} onChange={setEaseIn1} />
                <span>Ease Out</span>
                <Switch size="small" checked={easeOut1} onChange={setEaseOut1} />
              </div>
            </ControlRow>
          )}
          {easing1 === 'power' && (
            <ControlRow label="Power:">
              <Radio.Group size="small" value={power1} onChange={(e) => setPower1(e.target.value)} optionType="button" buttonStyle="solid">
                <Radio.Button value={1}>1</Radio.Button>
                <Radio.Button value={2}>2</Radio.Button>
                <Radio.Button value={3}>3</Radio.Button>
                <Radio.Button value={4}>4</Radio.Button>
                <Radio.Button value={5}>5</Radio.Button>
              </Radio.Group>
            </ControlRow>
          )}
        </ControlPanel>

        <PresetPreviewDisplayBlock viewBoxW={viewBoxW} viewBoxH={viewBoxHCenter} maxWidth={"none"}
          key={`rotate-center-${dur1}-${easing1}-${easeIn1}-${easeOut1}-${power1}-${angle1}`}>
          <image 
            href={pic1} 
            x={imgX} 
            y={imgYCenter} 
            width={imgSize} 
            height={imgSize}
            style={getCenterRotateStyle()}
          >
            {genAnimateRotate({
              initAngle: 0,
              timeline: [
                { timeSpanSec: dur1, toValue: angle1, keySplines: getSplines(easing1, easeIn1, easeOut1, power1) },
              ],
              loopCount: 0,
              isRelativeRotate: false  // 绝对角度模式
            })}
          </image>
        </PresetPreviewDisplayBlock>
        <CodeBlock code={`genAnimateRotate({
  initAngle: 0,
  timeline: [
    { timeSpanSec: ${dur1.toFixed(1)}, toValue: ${angle1}, keySplines: ${getSplinesCode(easing1, easeIn1, easeOut1, power1)} }
  ],
  loopCount: 0,
  isRelativeRotate: false  // 绝对角度模式
})`} />
      </Section>

      {/* 示例2：自定义原点（摆动） */}
      <H2 style={{ marginTop: '24px' }}>2. 自定义原点（摆动）</H2>
      <Section style={{ marginTop: '16px', marginBottom: '20px' }}>
        <P style={{ marginBottom: '8px' }}>-θ ↔ +θ 往返</P>
        <ControlPanel>
          <ControlRow label={`半程时长: ${dur2.toFixed(1)}s`}>
            <Slider min={0.5} max={5} step={0.1} value={dur2} onChange={setDur2} style={{ flex: 1, minWidth: '120px' }} />
          </ControlRow>
          <ControlRow label="摆动角度:">
            <Slider min={5} max={90} step={1} value={swing} onChange={setSwing} style={{ flex: 1, minWidth: '120px' }} />
          </ControlRow>
          <ControlRow label="缓动函数:">
            <Select value={easing2} onChange={setEasing2} style={{ flex: 1 }}
              options={[
                { value: 'linear', label: 'Linear（线性）' },
                { value: 'ease', label: 'Ease（基础缓动）' },
                { value: 'power', label: 'Power（强力缓动）' },
                { value: 'circle', label: 'Circle（圆形缓动）' },
                { value: 'expo', label: 'Expo（指数缓动）' },
                { value: 'sine', label: 'Sine（正弦缓动）' }
              ]}
            />
          </ControlRow>
          {easing2 !== 'linear' && (
            <ControlRow>
              <div style={{ flex: 1, display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span>Ease In</span>
                <Switch size="small" checked={easeIn2} onChange={setEaseIn2} />
                <span>Ease Out</span>
                <Switch size="small" checked={easeOut2} onChange={setEaseOut2} />
              </div>
            </ControlRow>
          )}
          {easing2 === 'power' && (
            <ControlRow label="Power:">
              <Radio.Group size="small" value={power2} onChange={(e) => setPower2(e.target.value)} optionType="button" buttonStyle="solid">
                <Radio.Button value={1}>1</Radio.Button>
                <Radio.Button value={2}>2</Radio.Button>
                <Radio.Button value={3}>3</Radio.Button>
                <Radio.Button value={4}>4</Radio.Button>
                <Radio.Button value={5}>5</Radio.Button>
              </Radio.Group>
            </ControlRow>
          )}
          
          {/* Origin 选择器 */}
          <ControlRow label="旋转原点:">
            <Select value={origin2} onChange={setOrigin2} style={{ flex: 1 }}
              options={[
                { value: 'center', label: 'Center（中心，需配合样式）' },
                { value: 'origin', label: 'Origin（坐标原点 0,0）' },
                { value: 'topLeft', label: 'Top Left（左上角）' },
                { value: 'topCenter', label: 'Top Center（顶部中心）' },
                { value: 'topRight', label: 'Top Right（右上角）' },
                { value: 'centerLeft', label: 'Center Left（左侧中心）' },
                { value: 'centerRight', label: 'Center Right（右侧中心）' },
                { value: 'bottomLeft', label: 'Bottom Left（左下角）' },
                { value: 'bottomCenter', label: 'Bottom Center（底部中心）' },
                { value: 'bottomRight', label: 'Bottom Right（右下角）' },
                { value: 'custom', label: 'Custom（自定义坐标）' },
              ]}
            />
          </ControlRow>
          
          {/* 自定义坐标输入框 */}
          {origin2 === 'custom' && (
            <ControlRow>
              <div style={{ flex: 1, display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ minWidth: '30px' }}>X:</span>
                <InputNumber
                  value={customX}
                  onChange={(v) => setCustomX(v || 0)}
                  style={{ width: '100px' }}
                  step={1}
                />
                <span style={{ minWidth: '30px' }}>Y:</span>
                <InputNumber
                  value={customY}
                  onChange={(v) => setCustomY(v || 0)}
                  style={{ width: '100px' }}
                  step={1}
                />
              </div>
            </ControlRow>
          )}
        </ControlPanel>

        <PresetPreviewDisplayBlock viewBoxW={viewBoxW} viewBoxH={viewBoxHSwing} maxWidth={"none"}
          key={`rotate-swing-${dur2}-${easing2}-${easeIn2}-${easeOut2}-${power2}-${swing}-${origin2}-${customX}-${customY}`}>
          <image 
            href={pic1} 
            x={imgX} 
            y={imgYSwing} 
            width={imgSize} 
            height={imgSize}
          >
            {genAnimateRotate({
              initAngle: 0,
              origin: origin2 === 'custom' ? [customX, customY] : origin2,
              elementBounds: origin2 !== 'custom' && origin2 !== 'origin' 
                ? { x: imgX, y: imgYSwing, w: imgSize, h: imgSize }
                : undefined,
              timeline: [
                { timeSpanSec: dur2, toValue: -swing, keySplines: getSplines(easing2, easeIn2, easeOut2, power2) },
                { timeSpanSec: dur2, toValue: swing, keySplines: getSplines(easing2, easeIn2, easeOut2, power2) },
                { timeSpanSec: dur2, toValue: 0, keySplines: getSplines(easing2, easeIn2, easeOut2, power2) },
              ],
              loopCount: 0,
              isRelativeRotate: false  // 绝对角度模式
            })}
          </image>
        </PresetPreviewDisplayBlock>
        <CodeBlock code={`genAnimateRotate({
  initAngle: 0,
  origin: ${origin2 === 'custom' ? `[${customX}, ${customY}]` : `"${origin2}"`},${origin2 !== 'custom' && origin2 !== 'origin' ? `
  elementBounds: { x: ${imgX}, y: ${imgYSwing}, w: ${imgSize}, h: ${imgSize} },` : ''}
  timeline: [
    { timeSpanSec: ${dur2.toFixed(1)}, toValue: ${-swing}, keySplines: ${getSplinesCode(easing2, easeIn2, easeOut2, power2)} },
    { timeSpanSec: ${dur2.toFixed(1)}, toValue: ${swing}, keySplines: ${getSplinesCode(easing2, easeIn2, easeOut2, power2)} },
    { timeSpanSec: ${dur2.toFixed(1)}, toValue: 0, keySplines: ${getSplinesCode(easing2, easeIn2, easeOut2, power2)} },
  ],
  loopCount: 0,
  isRelativeRotate: false  // 绝对角度模式
})`} />
      </Section>

      {/* elementBounds 参数说明 */}
      <H2 style={{ marginTop: '24px' }}>关于 elementBounds 参数</H2>
      <Section style={{ fontSize: '14px', color: '#333', lineHeight: '1.8' }}>
        <p style={{ marginBottom: '12px' }}>
          <code>elementBounds</code> 是一个对象，用于描述元素在 SVG 画布中的位置和尺寸：
        </p>
        <CodeBlock code={`elementBounds: {
  x: 100,    // 元素左上角的 X 坐标
  y: 50,     // 元素左上角的 Y 坐标
  w: 200,    // 元素的宽度
  h: 150     // 元素的高度
}`} />
        
        <p style={{ marginTop: '16px', marginBottom: '8px' }}>
          <strong>为什么需要这个参数？</strong>
        </p>
        <p style={{ marginBottom: '12px' }}>
          当你使用快捷位置（如 <code>topCenter</code>、<code>bottomLeft</code> 等）或 <code>center</code> 时，函数需要知道元素的位置和大小才能自动计算出旋转原点的具体坐标。
        </p>

        <p style={{ marginTop: '16px', marginBottom: '8px' }}>
          <strong>计算示例：</strong>
        </p>
        <p style={{ marginBottom: '12px' }}>
          假设图片位于 <code>(100, 50)</code>，尺寸为 <code>200×150</code>：
        </p>
        <ul style={{ marginLeft: '20px', marginBottom: '12px' }}>
          <li><code>origin: "center"</code> → 计算为 <code>[200, 125]</code>（中心点）</li>
          <li><code>origin: "topCenter"</code> → 计算为 <code>[200, 50]</code>（顶部中心）</li>
          <li><code>origin: "bottomRight"</code> → 计算为 <code>[300, 200]</code>（右下角）</li>
        </ul>

        <p style={{ marginTop: '16px', marginBottom: '8px' }}>
          <strong>何时必须提供：</strong>
        </p>
        <ul style={{ marginLeft: '20px', marginBottom: '12px' }}>
          <li>使用快捷位置时（<code>topCenter</code>、<code>bottomLeft</code> 等）</li>
        </ul>

        <p style={{ marginTop: '12px', marginBottom: '8px' }}>
          <strong>何时推荐提供：</strong>
        </p>
        <ul style={{ marginLeft: '20px', marginBottom: '12px' }}>
          <li><code>origin: "center"</code> 时（纯 SVG 实现，无需额外的 CSS 样式）</li>
        </ul>

        <p style={{ marginTop: '12px', marginBottom: '8px' }}>
          <strong>何时可以省略：</strong>
        </p>
        <ul style={{ marginLeft: '20px', marginBottom: '12px' }}>
          <li><code>origin: "origin"</code> 时（固定绕坐标原点 [0, 0] 旋转）</li>
          <li><code>origin: [x, y]</code> 数组时（已手动指定旋转中心坐标）</li>
          <li><code>origin: "center"</code> 且配合 <code>getCenterRotateStyle()</code> 使用 CSS 时</li>
        </ul>
      </Section>

      {/* getCenterRotateStyle 说明 */}
      <H2 style={{ marginTop: '24px' }}>关于 getCenterRotateStyle() 函数</H2>
      <Section style={{ fontSize: '14px', color: '#333', lineHeight: '1.8' }}>
        <p style={{ marginBottom: '12px' }}>
          <code>getCenterRotateStyle()</code> 是一个辅助函数，返回让元素绕自身中心旋转的 CSS 样式对象。
        </p>

        <p style={{ marginTop: '16px', marginBottom: '8px' }}>
          <strong>为什么需要这个函数？</strong>
        </p>
        <p style={{ marginBottom: '12px' }}>
          SVG 的 <code>animateTransform rotate</code> 默认绕坐标原点 (0, 0) 旋转。如果想让元素绕自身中心旋转，有两种方法：
        </p>
        <ul style={{ marginLeft: '20px', marginBottom: '12px' }}>
          <li><strong>方法1（CSS）：</strong>使用 <code>getCenterRotateStyle()</code> 设置 CSS 样式（简单，推荐用于示例1）</li>
          <li><strong>方法2（SVG）：</strong>提供 <code>elementBounds</code> 自动计算中心坐标（灵活，推荐用于示例2）</li>
        </ul>

        <p style={{ marginTop: '16px', marginBottom: '8px' }}>
          <strong>函数返回的样式：</strong>
        </p>
        <CodeBlock code={`{
  transformOrigin: 'center',  // 设置变换原点为元素中心
  transformBox: 'fill-box'    // 基于元素的填充区域计算（而非 SVG 画布）
}`} />

        <p style={{ marginTop: '16px', marginBottom: '8px' }}>
          <strong>使用对比：</strong>
        </p>
        <CodeBlock code={`// 方法1：使用 CSS（适合简单场景）
<image 
  style={getCenterRotateStyle()}  // 添加样式
  x="0" y="0" width="100" height="100"
>
  {genAnimateRotate({
    origin: 'center',  // 不需要 elementBounds
    timeline: [{ timeSpanSec: 2, toValue: 360 }]
  })}
</image>

// 方法2：使用 elementBounds（适合复杂场景，纯 SVG）
<image 
  x="0" y="0" width="100" height="100"
>
  {genAnimateRotate({
    origin: 'center',  // 或其他快捷位置
    elementBounds: { x: 0, y: 0, w: 100, h: 100 },  // 提供尺寸信息
    timeline: [{ timeSpanSec: 2, toValue: 360 }]
  })}
</image>`} />

        <p style={{ marginTop: '16px', marginBottom: '12px' }}>
          <strong>两种方法的区别：</strong>
        </p>
        
        <div style={{ marginLeft: '20px', marginBottom: '12px' }}>
          <p style={{ marginBottom: '8px' }}><strong>方法1：CSS 方式（getCenterRotateStyle）</strong></p>
          <ul style={{ marginLeft: '20px', marginBottom: '12px' }}>
            <li>✅ 代码简洁，只需添加 <code>style</code> 属性</li>
            <li>❌ 只能实现中心旋转，不支持其他位置</li>
            <li>⚠️ 依赖 CSS <code>transform-origin</code> 支持</li>
            <li>📌 推荐场景：简单的中心旋转动画</li>
          </ul>

          <p style={{ marginBottom: '8px' }}><strong>方法2：SVG 方式（elementBounds）</strong></p>
          <ul style={{ marginLeft: '20px', marginBottom: '12px' }}>
            <li>✅ 支持任意旋转位置（topCenter、bottomLeft 等）</li>
            <li>✅ 纯 SVG 实现，兼容性好</li>
            <li>❌ 需要手动提供元素位置和尺寸信息</li>
            <li>📌 推荐场景：复杂动画、需要指定旋转原点位置</li>
          </ul>
        </div>

        <InfoBox type="info" style={{ marginTop: '12px' }}>
          💡 <strong>建议：</strong>如果只是简单的中心旋转，用 <code>getCenterRotateStyle()</code>；如果需要绕其他位置旋转（如顶部中心摆动），用 <code>elementBounds</code>。
        </InfoBox>
      </Section>
    </SectionEx>
  );
};

const preset: DocumentExport = {
  title: "旋转动画 Rotate",
  jsx: <Article />
};

export default preset;


