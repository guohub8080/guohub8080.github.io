import React, { useState } from "react";
import { DocumentExport } from "../data/svgDocumentLoader.tsx";
import SectionEx from "../../../dev/pubComponents/PureHTML/basicEx/SectionEx.tsx";
import { genAnimateSkewX } from "../../../dev/pubComponents/PubUtils/genSvgAnimateTransform/genAnimateSkewX";
import { genAnimateSkewY } from "../../../dev/pubComponents/PubUtils/genSvgAnimateTransform/genAnimateSkewY";
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
    const maxWidth = 500;
    const viewBoxW = 375;
    const viewBoxH = 200; // SkewX 画布高度
    const viewBoxHY = 250; // SkewY 画布高度（更高）
    const imgSize = 160; // 图片尺寸（放大以增强视觉）
    const imgX = (viewBoxW - imgSize) / 2; // 居中X坐标
    const imgY = (viewBoxH - imgSize) / 2; // 居中Y坐标 (for SkewX)
    const imgYForSkewY = (viewBoxHY - imgSize) / 2; // 居中Y坐标 (for SkewY)

    // 交互式参数控制
    const [skewXAngle, setSkewXAngle] = useState(30);
    const [skewXDuration, setSkewXDuration] = useState(2);
    const [skewYAngle, setSkewYAngle] = useState(25);
    const [skewYDuration, setSkewYDuration] = useState(2);
    const [easingType, setEasingType] = useState<'linear' | 'ease' | 'power' | 'circle' | 'expo' | 'sine'>('ease');
    const [easeIn, setEaseIn] = useState(true);
    const [easeOut, setEaseOut] = useState(true);
    const [powerValue, setPowerValue] = useState<1 | 2 | 3 | 4 | 5>(3);
    
    // 根据缓动类型获取 keySplines
    const getKeySplines = () => {
        switch (easingType) {
            case 'linear':
                return getLinearBezier();
            case 'ease':
                return getEaseBezier({ isIn: easeIn, isOut: easeOut });
            case 'power':
                return getPowerBezier({ power: powerValue, isIn: easeIn, isOut: easeOut });
            case 'circle':
                return getCircleBezier({ isIn: easeIn, isOut: easeOut });
            case 'expo':
                return getExpoBezier({ isIn: easeIn, isOut: easeOut });
            case 'sine':
                return getSineBezier({ isIn: easeIn, isOut: easeOut });
            default:
                return getLinearBezier();
        }
    };
    
    // 生成代码字符串
    const generateKeySplineCode = () => {
        switch (easingType) {
            case 'linear':
                return 'getLinearBezier()';
            case 'ease':
                return `getEaseBezier({ isIn: ${easeIn}, isOut: ${easeOut} })`;
            case 'power':
                return `getPowerBezier({ power: ${powerValue}, isIn: ${easeIn}, isOut: ${easeOut} })`;
            case 'circle':
                return `getCircleBezier({ isIn: ${easeIn}, isOut: ${easeOut} })`;
            case 'expo':
                return `getExpoBezier({ isIn: ${easeIn}, isOut: ${easeOut} })`;
            case 'sine':
                return `getSineBezier({ isIn: ${easeIn}, isOut: ${easeOut} })`;
            default:
                return 'getLinearBezier()';
        }
    };

    return (
        <SectionEx>
            <H1>斜切动画 Skew</H1>
            <Section>
                <Description style={{ marginTop: '8px' }}>
                    建议角度范围：-45° ~ 45°（极限：-89° ~ 89°），超过 ±45° 会导致图像严重变形
                </Description>
            </Section>
            <div style={{ 
                padding: '12px 16px', 
                margin: '12px 16px', 
                background: '#fff3cd', 
                border: '1px solid #ffc107', 
                borderRadius: '4px',
                fontSize: '14px',
                lineHeight: '1.6'
            }}>
                <strong>⚠️ 重要提示：变换原点设置</strong>
                <p style={{ marginTop: '8px', marginBottom: '0' }}>
                    <code>animateTransform</code> 元素本身<strong>不支持</strong>设置 <code>transform-origin</code>。
                    必须在<strong>父元素</strong>（如 <code>&lt;image&gt;</code> 或 <code>&lt;g&gt;</code>）上通过 CSS 
                    <code>style</code> 属性设置：
                </p>
                <pre style={{ 
                    background: '#f5f5f5', 
                    padding: '8px', 
                    borderRadius: '4px', 
                    marginTop: '8px',
                    marginBottom: '0',
                    overflow: 'auto'
                }}>{`style={{ transformOrigin: 'center', transformBox: 'fill-box' }}`}</pre>
            </div>

            {/* SkewX 示例 */}
            <H2 style={{ marginTop: '20px' }}>1. 水平斜切 (SkewX)</H2>

            {/* 示例1: 基础 SkewX - 交互式 */}
            <div style={{ padding: '0 16px', marginTop: '16px' }}>
                <P style={{ marginBottom: '8px' }}>水平斜切往返（左 → 右 → 中）</P>
                
                {/* 参数控制器 */}
                <div style={{ marginBottom: '12px', background: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '8px',
                        fontSize: '14px'
                    }}>
                        <span style={{ minWidth: '100px' }}>角度: {skewXAngle}°</span>
                        <Slider
                            min={-45}
                            max={45}
                            step={1}
                            value={skewXAngle}
                            onChange={setSkewXAngle}
                            style={{ flex: 1, minWidth: '120px' }}
                        />
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '8px',
                        fontSize: '14px'
                    }}>
                        <span style={{ minWidth: '100px' }}>时长: {skewXDuration.toFixed(1)}s</span>
                        <Slider
                            min={0.5}
                            max={5}
                            step={0.1}
                            value={skewXDuration}
                            onChange={setSkewXDuration}
                            style={{ flex: 1, minWidth: '120px' }}
                        />
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '8px',
                        fontSize: '14px'
                    }}>
                        <span style={{ minWidth: '100px' }}>缓动函数:</span>
                        <Select
                            value={easingType}
                            onChange={setEasingType}
                            style={{ flex: 1 }}
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
                    {easingType !== 'linear' && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontSize: '14px',
                            marginBottom: easingType === 'power' ? '8px' : '0'
                        }}>
                            <span style={{ minWidth: '100px' }}></span>
                            <div style={{ flex: 1, display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <span>Ease In</span>
                                <Switch size="small" checked={easeIn} onChange={setEaseIn} />
                                <span>Ease Out</span>
                                <Switch size="small" checked={easeOut} onChange={setEaseOut} />
                            </div>
                        </div>
                    )}
                    {easingType === 'power' && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontSize: '14px'
                        }}>
                            <span style={{ minWidth: '100px' }}>Power:</span>
                            <Radio.Group
                                size="small"
                                value={powerValue}
                                onChange={(e) => setPowerValue(e.target.value)}
                                optionType="button"
                                buttonStyle="solid"
                            >
                                <Radio.Button value={1}>1</Radio.Button>
                                <Radio.Button value={2}>2</Radio.Button>
                                <Radio.Button value={3}>3</Radio.Button>
                                <Radio.Button value={4}>4</Radio.Button>
                                <Radio.Button value={5}>5</Radio.Button>
                            </Radio.Group>
                        </div>
                    )}
                </div>

                <PresetPreviewDisplayBlock 
                    viewBoxW={viewBoxW} 
                    viewBoxH={viewBoxH}
                    maxWidth={maxWidth}
                    key={`skewx-${skewXAngle}-${skewXDuration}-${easingType}-${easeIn}-${easeOut}-${powerValue}`}
                >
                    <image 
                        href={pic1} 
                        x={imgX} 
                        y={imgY} 
                        width={imgSize} 
                        height={imgSize}
                        style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
                    >
                        {genAnimateSkewX({
                            initAngle: 0,
                            timeline: [
                                { 
                                    timeSpanSec: skewXDuration, 
                                    toValue: -skewXAngle, 
                                    keySplines: getKeySplines()
                                },
                                { 
                                    timeSpanSec: skewXDuration, 
                                    toValue: skewXAngle, 
                                    keySplines: getKeySplines()
                                },
                                { 
                                    timeSpanSec: skewXDuration, 
                                    toValue: 0, 
                                    keySplines: getKeySplines()
                                }
                            ],
                            loopCount: 0
                        })}
                    </image>
                </PresetPreviewDisplayBlock>
                <CodeBlock code={`genAnimateSkewX({
    initAngle: 0,
    timeline: [
        { 
            timeSpanSec: ${skewXDuration.toFixed(1)}, 
            toValue: ${-skewXAngle}, 
            keySplines: ${generateKeySplineCode()}
        },
        { 
            timeSpanSec: ${skewXDuration.toFixed(1)}, 
            toValue: ${skewXAngle}, 
            keySplines: ${generateKeySplineCode()}
        },
        { 
            timeSpanSec: ${skewXDuration.toFixed(1)}, 
            toValue: 0, 
            keySplines: ${generateKeySplineCode()}
        }
    ],
    loopCount: 0
})`} />
            </div>

            {/* SkewY 示例 */}
            <H2 style={{ marginTop: '24px' }}>2. 垂直斜切 (SkewY)</H2>

            {/* 示例4: 基础 SkewY - 交互式 */}
            <div style={{ padding: '0 16px', marginTop: '16px' }}>
                <P style={{ marginBottom: '8px' }}>垂直斜切往返</P>
                
                {/* 参数控制器 */}
                <div style={{ marginBottom: '12px', background: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '8px',
                        fontSize: '14px'
                    }}>
                        <span style={{ minWidth: '100px' }}>角度: {skewYAngle}°</span>
                        <Slider
                            min={-45}
                            max={45}
                            step={1}
                            value={skewYAngle}
                            onChange={setSkewYAngle}
                            style={{ flex: 1, minWidth: '120px' }}
                        />
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '8px',
                        fontSize: '14px'
                    }}>
                        <span style={{ minWidth: '100px' }}>时长: {skewYDuration.toFixed(1)}s</span>
                        <Slider
                            min={0.5}
                            max={5}
                            step={0.1}
                            value={skewYDuration}
                            onChange={setSkewYDuration}
                            style={{ flex: 1, minWidth: '120px' }}
                        />
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '8px',
                        fontSize: '14px'
                    }}>
                        <span style={{ minWidth: '100px' }}>缓动函数:</span>
                        <Select
                            value={easingType}
                            onChange={setEasingType}
                            style={{ flex: 1 }}
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
                    {easingType !== 'linear' && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontSize: '14px',
                            marginBottom: easingType === 'power' ? '8px' : '0'
                        }}>
                            <span style={{ minWidth: '100px' }}></span>
                            <div style={{ flex: 1, display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <span>Ease In</span>
                                <Switch size="small" checked={easeIn} onChange={setEaseIn} />
                                <span>Ease Out</span>
                                <Switch size="small" checked={easeOut} onChange={setEaseOut} />
                            </div>
                        </div>
                    )}
                    {easingType === 'power' && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontSize: '14px'
                        }}>
                            <span style={{ minWidth: '100px' }}>Power:</span>
                            <Radio.Group
                                size="small"
                                value={powerValue}
                                onChange={(e) => setPowerValue(e.target.value)}
                                optionType="button"
                                buttonStyle="solid"
                            >
                                <Radio.Button value={1}>1</Radio.Button>
                                <Radio.Button value={2}>2</Radio.Button>
                                <Radio.Button value={3}>3</Radio.Button>
                                <Radio.Button value={4}>4</Radio.Button>
                                <Radio.Button value={5}>5</Radio.Button>
                            </Radio.Group>
                        </div>
                    )}
                </div>

                <PresetPreviewDisplayBlock 
                    viewBoxW={viewBoxW} 
                    viewBoxH={viewBoxHY}
                    maxWidth={maxWidth}
                    key={`skewy-${skewYAngle}-${skewYDuration}-${easingType}-${easeIn}-${easeOut}-${powerValue}`}
                >
                    <image 
                        href={pic1} 
                        x={imgX} 
                        y={imgYForSkewY} 
                        width={imgSize} 
                        height={imgSize}
                        style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
                    >
                        {genAnimateSkewY({
                            initAngle: 0,
                            timeline: [
                                { 
                                    timeSpanSec: skewYDuration, 
                                    toValue: -skewYAngle, 
                                    keySplines: getKeySplines()
                                },
                                { 
                                    timeSpanSec: skewYDuration, 
                                    toValue: skewYAngle, 
                                    keySplines: getKeySplines()
                                },
                                { 
                                    timeSpanSec: skewYDuration, 
                                    toValue: 0, 
                                    keySplines: getKeySplines()
                                }
                            ],
                            loopCount: 0
                        })}
                    </image>
                </PresetPreviewDisplayBlock>
                <CodeBlock code={`genAnimateSkewY({
    initAngle: 0,
    timeline: [
        { 
            timeSpanSec: ${skewYDuration.toFixed(1)}, 
            toValue: ${-skewYAngle}, 
            keySplines: ${generateKeySplineCode()}
        },
        { 
            timeSpanSec: ${skewYDuration.toFixed(1)}, 
            toValue: ${skewYAngle}, 
            keySplines: ${generateKeySplineCode()}
        },
        { 
            timeSpanSec: ${skewYDuration.toFixed(1)}, 
            toValue: 0, 
            keySplines: ${generateKeySplineCode()}
        }
    ],
    loopCount: 0
})`} />
            </div>

            {/* 组合示例 */}
            <H2 style={{ marginTop: '24px' }}>3. 组合斜切动画</H2>

            {/* 示例7: additive="sum" 测试 */}
            <div style={{ padding: '0 16px', marginTop: '16px', marginBottom: '20px' }}>
                <P style={{ marginBottom: '8px' }}>组合 skewX + skewY（使用 additive="sum"）</P>
                <Description style={{ marginBottom: '8px' }}>
                    SVG 支持在同一元素上放多个 animateTransform。默认行为 additive="replace" 会相互替换，只有最后一个生效。给每个动画加 additive="sum"，变换会按文档顺序依次相乘叠加。它们可以有不同的 begin、dur、repeatCount、缓动等，互不影响。
                </Description>
                    <PresetPreviewDisplayBlock viewBoxW={viewBoxW} viewBoxH={viewBoxHY} maxWidth={maxWidth}>
                    <image 
                        href={pic1} 
                        x={imgX} 
                        y={imgYForSkewY} 
                        width={imgSize} 
                        height={imgSize}
                        style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
                    >
                        <animateTransform
                            attributeName="transform"
                            type="skewX"
                            from="0"
                            to="20"
                            dur="3s"
                            repeatCount="indefinite"
                            additive="sum"
                        />
                        <animateTransform
                            attributeName="transform"
                            type="skewY"
                            from="0"
                            to="15"
                            dur="3s"
                            repeatCount="indefinite"
                            additive="sum"
                        />
                    </image>
                </PresetPreviewDisplayBlock>
                <CodeBlock code={`<image 
  href={pic1} 
  x={imgX} 
  y={imgY} 
  width={160} 
  height={160}
  style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
>
  <animateTransform
    type="skewX"
    from="0"
    to="20"
    dur="3s"
    repeatCount="indefinite"
    additive="sum" />
    
  <animateTransform
    type="skewY"
    from="0"
    to="15"
    dur="3s"
    repeatCount="indefinite"
    additive="sum" />
</image>

// 提示：
// 1. additive="sum" 让多个变换叠加生效
// 2. transformOrigin: 'center' 避免位移
// 3. 可以叠加不同类型的变换（translate + rotate + scale + skew）`} />
            </div>

            {/* 示例9: 变换原点对比 */}
            <H2 style={{ marginTop: '24px' }}>4. 变换原点对比</H2>
            <div style={{ padding: '0 16px', marginTop: '16px', marginBottom: '20px' }}>
                <Description style={{ marginBottom: '12px' }}>
                    <strong>变换原点必须在父元素上设置</strong>：<code>animateTransform</code> 自身无法设置原点，
                    需要在被动画化的元素（如 <code>&lt;image&gt;</code>）上通过 <code>style</code> 属性指定。
                    下面对比默认原点（左上角）和中心原点的视觉效果：
                </Description>
                
                {/* 默认原点 */}
                <div style={{ marginBottom: '12px' }}>
                    <Description style={{ marginBottom: '4px' }}>默认（左上角为原点）</Description>
                    <PresetPreviewDisplayBlock viewBoxW={viewBoxW} viewBoxH={viewBoxH} maxWidth={maxWidth}>
                        <image href={pic1} x={imgX} y={imgY} width={imgSize} height={imgSize}>
                            {genAnimateSkewX({
                                timeline: [
                                    { timeSpanSec: 1.5, toValue: 25 },
                                    { timeSpanSec: 1.5, toValue: 0 }
                                ],
                                loopCount: 0
                            })}
                        </image>
                    </PresetPreviewDisplayBlock>
                </div>
                
                {/* 中心原点 */}
                <div style={{ marginBottom: '8px' }}>
                    <Description style={{ marginBottom: '4px' }}>中心原点（推荐）</Description>
                    <PresetPreviewDisplayBlock viewBoxW={viewBoxW} viewBoxH={viewBoxH} maxWidth={maxWidth}>
                        <image 
                            href={pic1} 
                            x={imgX}
                            y={imgY}
                            width={imgSize} 
                            height={imgSize}
                            style={{
                                transformOrigin: 'center',
                                transformBox: 'fill-box'
                            }}
                        >
                            {genAnimateSkewX({
                                timeline: [
                                    { timeSpanSec: 1.5, toValue: 25 },
                                    { timeSpanSec: 1.5, toValue: 0 }
                                ],
                                loopCount: 0
                            })}
                        </image>
                    </PresetPreviewDisplayBlock>
                </div>
                
                <CodeBlock code={`// ⚠️ 重要：变换原点必须在父元素（<image>）上设置
// animateTransform 本身不支持 transform-origin 属性！
<image 
  href={pic1} 
  width={375} 
  height={300}
  style={{
    transformOrigin: 'center',  // 在这里设置原点
    transformBox: 'fill-box'
  }}
>
  {genAnimateSkewX({
    timeline: [
      { timeSpanSec: 1.5, toValue: 25 },
      { timeSpanSec: 1.5, toValue: 0 }
    ]
  })}
</image>`} />
            </div>

            {/* 示例10: 极限角度测试 */}
            <H2 style={{ marginTop: '24px' }}>5. 极限角度测试</H2>
            <div style={{ padding: '0 16px', marginTop: '16px', marginBottom: '20px' }}>
                <Description style={{ marginBottom: '8px' }}>
                    60° 已超出推荐范围，图像会严重变形
                </Description>
                <PresetPreviewDisplayBlock viewBoxW={viewBoxW} viewBoxH={viewBoxH} maxWidth={maxWidth}>
                    <image 
                        href={pic1} 
                        x={imgX} 
                        y={imgY} 
                        width={imgSize} 
                        height={imgSize}
                        style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
                    >
                        {genAnimateSkewX({
                            timeline: [
                                { timeSpanSec: 2, toValue: 60 },
                                { timeSpanSec: 2, toValue: 0 }
                            ],
                            loopCount: 0
                        })}
                    </image>
                </PresetPreviewDisplayBlock>
                <CodeBlock code={`genAnimateSkewX({
    timeline: [
        { timeSpanSec: 2, toValue: 60 }, // ⚠️ 超出推荐范围
        { timeSpanSec: 2, toValue: 0 }
    ],
    loopCount: 0
})`} />
            </div>
        </SectionEx>
    );
};

const preset: DocumentExport = {
  title: "斜切动画 Skew",
  jsx: <Article />
};

export default preset;

