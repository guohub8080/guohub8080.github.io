import React, { useState } from "react";
import { DocumentExport } from "../data/svgDocumentLoader.tsx";
import SectionEx from "../../../dev/pubComponents/PureHTML/basicEx/SectionEx.tsx";
import { genAnimateOpacity } from "../../../dev/pubComponents/PubUtils/genSvgAnimateTransform/genAnimateOpacity";
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
    Section,
    H1,
    H2,
    P,
    Description
} from "../data/components";
import pic1 from "../data/assets/1.png";
import { Slider, Select, Switch, Radio } from "antd";

const Article = () => {
  const viewBoxW = 375;
  const imgSize = Math.floor(viewBoxW / 4);
  const viewBoxH = imgSize + 20;
  const imgX = (viewBoxW - imgSize) / 2;
  const imgY = (viewBoxH - imgSize) / 2;

  // 示例1：淡入淡出（交互式）
  const [dur1, setDur1] = useState(1.5);
  const [easing1, setEasing1] = useState<'linear' | 'ease' | 'power' | 'circle' | 'expo' | 'sine'>('ease');
  const [easeIn1, setEaseIn1] = useState(true);
  const [easeOut1, setEaseOut1] = useState(true);
  const [power1, setPower1] = useState<1 | 2 | 3 | 4 | 5>(3);

  // 示例2：闪烁（循环）
  const [dur2, setDur2] = useState(0.6); // 半程
  const [easing2, setEasing2] = useState<'linear' | 'ease' | 'power' | 'circle' | 'expo' | 'sine'>('linear');
  const [easeIn2, setEaseIn2] = useState(true);
  const [easeOut2, setEaseOut2] = useState(true);
  const [power2, setPower2] = useState<1 | 2 | 3 | 4 | 5>(2);

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
      <H1>透明度动画 Opacity</H1>
      <Section>
        <Description style={{ marginTop: '8px' }}>
          通过改变元素的不透明度来实现淡入/淡出、闪烁等效果
        </Description>
      </Section>

      {/* 示例1：淡入淡出（交互式） */}
      <H2 style={{ marginTop: '20px' }}>1. 淡入淡出（交互式）</H2>
      <div style={{ padding: '0 16px', marginTop: '16px' }}>
        <P style={{ marginBottom: '8px' }}>1 → 0 → 1</P>
        <div style={{ marginBottom: '12px', background: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', fontSize: '14px' }}>
            <span style={{ minWidth: '100px' }}>半程时长: {dur1.toFixed(1)}s</span>
            <Slider min={0.2} max={5} step={0.1} value={dur1} onChange={setDur1} style={{ flex: 1, minWidth: '120px' }} />
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
        </div>

        <PresetPreviewDisplayBlock viewBoxW={viewBoxW} viewBoxH={viewBoxH} maxWidth={"none"}
          key={`opacity-fade-${dur1}-${easing1}-${easeIn1}-${easeOut1}-${power1}`}>
          <image href={pic1} x={imgX} y={imgY} width={imgSize} height={imgSize}>
            {genAnimateOpacity({
              timeline: [
                { timeSpanSec: dur1, toValue: 0, keySplines: getSplines(easing1, easeIn1, easeOut1, power1) },
                { timeSpanSec: dur1, toValue: 1, keySplines: getSplines(easing1, easeIn1, easeOut1, power1) },
              ],
              loopCount: 0,
            })}
          </image>
        </PresetPreviewDisplayBlock>

        <CodeBlock code={`genAnimateOpacity({
  timeline: [
    { timeSpanSec: ${dur1.toFixed(1)}, toValue: 0, keySplines: ${getSplinesCode(easing1, easeIn1, easeOut1, power1)} },
    { timeSpanSec: ${dur1.toFixed(1)}, toValue: 1, keySplines: ${getSplinesCode(easing1, easeIn1, easeOut1, power1)} }
  ],
  loopCount: 0
})`} />
      </div>

      {/* 示例2：闪烁（循环） */}
      <H2 style={{ marginTop: '24px' }}>2. 闪烁（循环）</H2>
      <div style={{ padding: '0 16px', marginTop: '16px', marginBottom: '20px' }}>
        <P style={{ marginBottom: '8px' }}>1 ↔ 0.3 往返</P>
        <div style={{ marginBottom: '12px', background: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', fontSize: '14px' }}>
            <span style={{ minWidth: '100px' }}>半程时长: {dur2.toFixed(1)}s</span>
            <Slider min={0.1} max={2} step={0.1} value={dur2} onChange={setDur2} style={{ flex: 1, minWidth: '120px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', fontSize: '14px' }}>
            <span style={{ minWidth: '100px' }}>缓动函数:</span>
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
          </div>
          {easing2 !== 'linear' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px' }}>
              <span style={{ minWidth: '100px' }}></span>
              <div style={{ flex: 1, display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span>Ease In</span>
                <Switch size="small" checked={easeIn2} onChange={setEaseIn2} />
                <span>Ease Out</span>
                <Switch size="small" checked={easeOut2} onChange={setEaseOut2} />
              </div>
            </div>
          )}
          {easing2 === 'power' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', marginTop: '8px' }}>
              <span style={{ minWidth: '100px' }}>Power:</span>
              <Radio.Group size="small" value={power2} onChange={(e) => setPower2(e.target.value)} optionType="button" buttonStyle="solid">
                <Radio.Button value={1}>1</Radio.Button>
                <Radio.Button value={2}>2</Radio.Button>
                <Radio.Button value={3}>3</Radio.Button>
                <Radio.Button value={4}>4</Radio.Button>
                <Radio.Button value={5}>5</Radio.Button>
              </Radio.Group>
            </div>
          )}
        </div>

        <PresetPreviewDisplayBlock viewBoxW={viewBoxW} viewBoxH={viewBoxH} maxWidth={"none"}
          key={`opacity-blink-${dur2}-${easing2}-${easeIn2}-${easeOut2}-${power2}`}>
          <image href={pic1} x={imgX} y={imgY} width={imgSize} height={imgSize}>
            {genAnimateOpacity({
              timeline: [
                { timeSpanSec: dur2, toValue: 0.3, keySplines: getSplines(easing2, easeIn2, easeOut2, power2) },
                { timeSpanSec: dur2, toValue: 1, keySplines: getSplines(easing2, easeIn2, easeOut2, power2) },
              ],
              loopCount: 0,
            })}
          </image>
        </PresetPreviewDisplayBlock>

        <CodeBlock code={`genAnimateOpacity({
  timeline: [
    { timeSpanSec: ${dur2.toFixed(1)}, toValue: 0.3, keySplines: ${getSplinesCode(easing2, easeIn2, easeOut2, power2)} },
    { timeSpanSec: ${dur2.toFixed(1)}, toValue: 1, keySplines: ${getSplinesCode(easing2, easeIn2, easeOut2, power2)} }
  ],
  loopCount: 0
})`} />
      </div>
    </SectionEx>
  );
};

const preset: DocumentExport = {
  title: "透明度动画 Opacity",
  jsx: <Article />
};

export default preset;


